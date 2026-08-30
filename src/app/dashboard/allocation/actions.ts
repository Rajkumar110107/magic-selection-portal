"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function assignArea(candidateProfileId: string, capabilityAreaId: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  // 1. Verify candidate profile exists
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateProfileId },
    include: { assignments: true, user: true }
  });
  if (!candidate) throw new Error("Candidate profile not found.");

  // 2. Verify candidate is not locked
  const isLocked = candidate.assignments.some(a => a.isLocked);
  if (isLocked) {
    throw new Error("Cannot modify assignments for a locked candidate. Unlock first.");
  }

  // 3. Verify candidate does not exceed max 2 areas
  if (candidate.assignments.length >= 2) {
    throw new Error("Candidate is already assigned to the maximum of 2 capability areas.");
  }

  // 4. Verify candidate does not already have this area (duplicate check)
  const hasArea = candidate.assignments.some(a => a.capabilityAreaId === capabilityAreaId);
  if (hasArea) {
    throw new Error("Candidate is already assigned to this capability area.");
  }

  // 5. Verify capability area capacity (max 2 candidates per area)
  const area = await prisma.capabilityArea.findUnique({
    where: { id: capabilityAreaId },
    include: { assignments: true }
  });
  if (!area) throw new Error("Capability area not found.");

  if (area.assignments.length >= 2) {
    throw new Error(`Capability area "${area.name}" is already at full capacity (2/2 candidates).`);
  }

  // 6. Create assignment
  await prisma.areaAssignment.create({
    data: {
      candidateProfileId,
      capabilityAreaId,
      isLocked: false
    }
  });

  // 7. Update candidate profile status
  await prisma.candidateProfile.update({
    where: { id: candidateProfileId },
    data: { status: "PENDING_LOCK" }
  });

  // 8. Create Audit Log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ROLE_ASSIGNMENT",
      details: JSON.stringify({
        candidateId: candidateProfileId,
        candidateName: candidate.user.name,
        areaId: capabilityAreaId,
        areaName: area.name,
        timestamp: new Date().toISOString()
      })
    }
  });

  revalidatePath("/dashboard/allocation");
  revalidatePath("/dashboard/candidates");
  revalidatePath(`/dashboard/candidates/${candidateProfileId}`);
  return { success: true };
}

export async function removeArea(assignmentId: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  const assignment = await prisma.areaAssignment.findUnique({
    where: { id: assignmentId },
    include: { candidate: { include: { user: true, assignments: true } }, area: true }
  });
  if (!assignment) throw new Error("Assignment not found.");
  if (assignment.isLocked) throw new Error("Cannot remove a locked assignment. Unlock first.");

  const candidateId = assignment.candidateProfileId;
  const areaName = assignment.area.name;
  const candidateName = assignment.candidate.user.name;

  await prisma.areaAssignment.delete({
    where: { id: assignmentId }
  });

  // Update status if no assignments left
  const remaining = await prisma.areaAssignment.count({
    where: { candidateProfileId: candidateId }
  });

  await prisma.candidateProfile.update({
    where: { id: candidateId },
    data: { status: remaining === 0 ? "UNASSIGNED" : "PENDING_LOCK" }
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ASSIGNMENT_REMOVED",
      details: JSON.stringify({
        candidateId,
        candidateName,
        areaName,
        remainingAssignments: remaining,
        timestamp: new Date().toISOString()
      })
    }
  });

  revalidatePath("/dashboard/allocation");
  revalidatePath("/dashboard/candidates");
  revalidatePath(`/dashboard/candidates/${candidateId}`);
  return { success: true };
}

export async function toggleLock(candidateProfileId: string, locked: boolean) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateProfileId },
    include: { assignments: { include: { area: true } }, user: true }
  });
  if (!candidate) throw new Error("Candidate profile not found.");

  if (locked) {
    // Validation before locking: Candidate must have 1 or 2 areas
    if (candidate.assignments.length < 1) {
      throw new Error("Cannot lock candidate with zero capability areas. Assign at least 1 area first.");
    }
    if (candidate.assignments.length > 2) {
      throw new Error("Cannot lock candidate with more than 2 capability areas.");
    }

    // Verify all assigned areas are within capacity
    for (const a of candidate.assignments) {
      const count = await prisma.areaAssignment.count({
        where: { capabilityAreaId: a.capabilityAreaId }
      });
      if (count > 2) {
        throw new Error(`Area "${a.area.name}" exceeds maximum capacity of 2.`);
      }
    }

    // Lock all candidate assignments
    await prisma.areaAssignment.updateMany({
      where: { candidateProfileId },
      data: {
        isLocked: true,
        lockedAt: new Date(),
        lockedBy: session.user.id
      }
    });

    await prisma.candidateProfile.update({
      where: { id: candidateProfileId },
      data: { status: "READY_FOR_ASSESSMENT" }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ROLE_LOCK",
        details: JSON.stringify({
          candidateId: candidateProfileId,
          candidateName: candidate.user.name,
          areas: candidate.assignments.map(a => a.area.name),
          lockedBy: session.user.id,
          timestamp: new Date().toISOString()
        })
      }
    });
  } else {
    // Unlock
    await prisma.areaAssignment.updateMany({
      where: { candidateProfileId },
      data: {
        isLocked: false,
        lockedAt: null,
        lockedBy: null
      }
    });

    await prisma.candidateProfile.update({
      where: { id: candidateProfileId },
      data: { status: "PENDING_LOCK" }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ROLE_UNLOCK",
        details: JSON.stringify({
          candidateId: candidateProfileId,
          candidateName: candidate.user.name,
          unlockedBy: session.user.id,
          timestamp: new Date().toISOString()
        })
      }
    });
  }

  revalidatePath("/dashboard/allocation");
  revalidatePath("/dashboard/candidates");
  revalidatePath(`/dashboard/candidates/${candidateProfileId}`);
  return { success: true };
}

export async function lockAllAssignments() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  const candidates = await prisma.candidateProfile.findMany({
    include: { assignments: { include: { area: true } }, user: true }
  });

  const candidatesToLock = candidates.filter(
    c => c.assignments.length >= 1 && c.assignments.length <= 2 && !c.assignments.every(a => a.isLocked)
  );

  if (candidatesToLock.length === 0) {
    throw new Error("No unlocked candidates with valid assignments (1-2 areas) available to lock.");
  }

  // Validate all area capacities
  const areas = await prisma.capabilityArea.findMany({
    include: { assignments: true }
  });
  for (const area of areas) {
    if (area.assignments.length > 2) {
      throw new Error(`Area "${area.name}" exceeds capacity limit of 2.`);
    }
  }

  for (const c of candidatesToLock) {
    await prisma.areaAssignment.updateMany({
      where: { candidateProfileId: c.id },
      data: {
        isLocked: true,
        lockedAt: new Date(),
        lockedBy: session.user.id
      }
    });

    await prisma.candidateProfile.update({
      where: { id: c.id },
      data: { status: "READY_FOR_ASSESSMENT" }
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "BULK_LOCK",
      details: JSON.stringify({
        lockedCandidateCount: candidatesToLock.length,
        candidateNames: candidatesToLock.map(c => c.user.name),
        lockedBy: session.user.id,
        timestamp: new Date().toISOString()
      })
    }
  });

  revalidatePath("/dashboard/allocation");
  revalidatePath("/dashboard/candidates");
  return { success: true, count: candidatesToLock.length };
}

export async function saveAdminNotes(candidateProfileId: string, notes: string) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  await prisma.candidateProfile.update({
    where: { id: candidateProfileId },
    data: { adminNotes: notes }
  });

  revalidatePath(`/dashboard/candidates/${candidateProfileId}`);
  return { success: true };
}

export async function saveTeamObservation(formData: {
  capabilityAreaId: string;
  candidateProfileIds: string[];
  overlapStatus: string;
  discussionNotes: string;
  outcome: string;
  overallNotes: string;
  ratings: {
    teamwork: number;
    communication: number;
    listening: number;
    negotiation: number;
    leadership: number;
    respect: number;
    adaptability: number;
    teamFirst: number;
  };
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("Unauthorized. Admin privileges required.");

  const {
    capabilityAreaId,
    candidateProfileIds,
    overlapStatus,
    discussionNotes,
    outcome,
    overallNotes,
    ratings
  } = formData;

  const observation = await prisma.teamObservation.create({
    data: {
      capabilityAreaId,
      adminId: session.user.id,
      overlapStatus,
      outcome,
      notes: discussionNotes,
      overallNotes,
      teamworkRating: ratings.teamwork,
      communicationRating: ratings.communication,
      listeningRating: ratings.listening,
      negotiationRating: ratings.negotiation,
      leadershipRating: ratings.leadership,
      respectRating: ratings.respect,
      adaptabilityRating: ratings.adaptability,
      teamFirstRating: ratings.teamFirst,
      participants: {
        create: candidateProfileIds.map(candidateProfileId => ({
          candidateProfileId
        }))
      }
    }
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "TEAM_OBSERVATION_RECORDED",
      details: JSON.stringify({
        observationId: observation.id,
        areaId: capabilityAreaId,
        overlapStatus,
        participantCount: candidateProfileIds.length,
        timestamp: new Date().toISOString()
      })
    }
  });

  revalidatePath("/dashboard/allocation");
  return { success: true };
}
