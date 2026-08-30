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

export type MagicRole = typeof MAGIC_ROLES[number];
export type ObRole = typeof OB_ROLES[number];
export type FinalRole = typeof ALL_FINAL_ROLES[number];
