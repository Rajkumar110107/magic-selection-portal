"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Assigns or retrieves an existing assessment for a candidate in a locked capability area.
 * Implements fair, balanced distribution among the 3 available case studies in that area.
 * Guaranteed idempotent and persistent across page refreshes and session logouts.
 */
export async function startAssessment(assignmentId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    throw new Error("Unauthorized: Only authenticated candidates can start an assessment.");
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) {
    throw new Error("Profile not found for authenticated candidate.");
  }

  const assignment = await prisma.areaAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      area: {
        include: {
          caseStudies: {
            where: { isActive: true },
            include: {
              _count: {
                select: { assessments: true }
              }
            }
          }
        }
      }
    }
  });

  if (!assignment || assignment.candidateProfileId !== profile.id) {
    throw new Error("Invalid or unassigned capability area.");
  }

  if (!assignment.isLocked) {
    throw new Error("Cannot start assessment until the administrator locks this capability area assignment.");
  }

  // Check if an assessment already exists for this candidate in this capability area
  let assessment = await prisma.assessment.findFirst({
    where: {
      candidateProfileId: profile.id,
      caseStudy: { capabilityAreaId: assignment.capabilityAreaId }
    },
    include: { caseStudy: true }
  });

  if (!assessment) {
    const availableCases = assignment.area.caseStudies;
    if (!availableCases || availableCases.length === 0) {
      throw new Error("No active case studies found for this capability area.");
    }

    // Fair balanced random allocation:
    // 1. Find the minimum assignment count across the available case studies in this area
    const minAssignmentCount = Math.min(
      ...availableCases.map((c) => c._count.assessments)
    );

    // 2. Filter cases that have this minimum count
    const leastAssignedCases = availableCases.filter(
      (c) => c._count.assessments === minAssignmentCount
    );

    // 3. Pick randomly among the least-assigned cases to break ties fairly
    const selectedCase =
      leastAssignedCases[Math.floor(Math.random() * leastAssignedCases.length)];

    // 4. Create and permanently persist the assessment
    assessment = await prisma.assessment.create({
      data: {
        candidateProfileId: profile.id,
        caseStudyId: selectedCase.id,
        capabilityAreaId: assignment.capabilityAreaId,
        version: selectedCase.version,
        status: "IN_PROGRESS",
        assignedAt: new Date(),
        startedAt: new Date(),
      },
      include: { caseStudy: true }
    });

    // Log the assignment action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CASE_STUDY_ASSIGNED",
        details: JSON.stringify({
          candidateProfileId: profile.id,
          capabilityAreaId: assignment.capabilityAreaId,
          caseStudyId: selectedCase.id,
          caseCode: selectedCase.code,
          caseTitle: selectedCase.title,
          version: selectedCase.version,
        })
      }
    });
  }

  redirect(`/assessment/${assessment.id}`);
}
