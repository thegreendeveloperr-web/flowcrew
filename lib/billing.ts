export type FlowCrewPlan = "free" | "pro" | "team";

export type PlanLimits = {
  maxLeads: number;
  label: string;
};

const planLimits: Record<FlowCrewPlan, PlanLimits> = {
  free: {
    maxLeads: 1,
    label: "Free",
  },
  pro: {
    maxLeads: 100,
    label: "Pro",
  },
  team: {
    maxLeads: 500,
    label: "Team",
  },
};

export function getPlanLimits(plan: FlowCrewPlan) {
  return planLimits[plan];
}

export function getUserPlan(userId: string): FlowCrewPlan {
  const proUserIds = process.env.FLOWCREW_PRO_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];

  const teamUserIds = process.env.FLOWCREW_TEAM_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];

  if (teamUserIds.includes(userId)) return "team";
  if (proUserIds.includes(userId)) return "pro";

  return "free";
}