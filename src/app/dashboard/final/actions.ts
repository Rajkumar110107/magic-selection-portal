"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const MAGIC_ROLES = [
  "Mastermind",
  "Advocate",
  "Guide",
  "Investigator",
  "Communicator",
] as const;

export const OB_ROLES = [
  "Co-Lead",
  "Office Bearer",
] as const;

export const ALL_FINAL_ROLES = [...MAGIC_ROLES, ...OB_ROLES] as const;

export async function saveFinalAllocations(
  allocations: { candidateProfileId: string; roleName: string }[]
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only administrators can lock final role allocations.");
  }

  // 1. Validate exactly 7 allocations provided
  if (allocations.length !== 7) {
    throw new Error(`Validation Error: Exactly 7 positions must be allocated. Received ${allocations.length}.`);
  }

  // 2. Validate all 7 roles are unique and valid
  const assignedRoles = allocations.map((a) => a.roleName);
  const uniqueRoles = new Set(assignedRoles);
  if (uniqueRoles.size !== 7) {
    throw new Error("Validation Error: Duplicate roles detected. Each role must be assigned to exactly one candidate.");
  }

  for (const requiredRole of ALL_FINAL_ROLES) {
    if (!uniqueRoles.has(requiredRole)) {
      throw new Error(`Validation Error: Required role '${requiredRole}' has not been assigned.`);
    }
  }

  // 3. Validate all 7 candidates are unique
  const assignedCandidateIds = allocations.map((a) => a.candidateProfileId);
  const uniqueCandidates = new Set(assignedCandidateIds);
  if (uniqueCandidates.size !== 7) {
    throw new Error("Validation Error: Duplicate candidates detected. Each candidate must be assigned to exactly one final role.");
  }

  // 4. Verify that all 7 candidates exist in database
  const existingCandidates = await prisma.candidateProfile.findMany({
    where: { id: { in: assignedCandidateIds } },
    include: { user: true }
  });

  if (existingCandidates.length !== 7) {
    throw new Error("Validation Error: One or more candidate IDs are invalid.");
  }

  const now = new Date();

  // 5. Execute atomic transaction to wipe prior final allocations and create the 7 new locked records
  await prisma.$transaction(async (tx) => {
    // Delete existing final allocations
    await tx.finalAllocation.deleteMany({});

    // Create 7 new allocations
    for (const item of allocations) {
      await tx.finalAllocation.create({
        data: {
          candidateProfileId: item.candidateProfileId,
          roleName: item.roleName,
          isLocked: true,
          allocatedAt: now,
        }
      });
    }

    // Record audit log
    const allocationSummary = allocations.map((item) => {
      const cand = existingCandidates.find((c) => c.id === item.candidateProfileId);
      return `${item.roleName}: ${cand?.user.name} (${cand?.secId})`;
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "FINAL_ALLOCATION_LOCKED",
        details: JSON.stringify({
          lockedBy: session.user.email,
          lockedAt: now.toISOString(),
          allocations: allocationSummary
        })
      }
    });
  });

  revalidatePath("/dashboard/final");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/exports");
  return { success: true };
}

export async function unlockFinalAllocations() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only administrators can unlock final role allocations.");
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.finalAllocation.updateMany({
      data: { isLocked: false }
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "FINAL_ALLOCATION_UNLOCKED",
        details: JSON.stringify({
          unlockedBy: session.user.email,
          unlockedAt: now.toISOString()
        })
      }
    });
  });

  revalidatePath("/dashboard/final");
  return { success: true };
}
