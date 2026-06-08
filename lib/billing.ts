export type FlowCrewPlan = "free" | "pro" | "team";

export type PlanLimits = {
  maxLeads: number;
  label: string;
};

type PlanLookupInput =
  | string
  | {
      userId: string;
      email?: string | null;
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

function readList(value: string | undefined) {
  return (
    value
      ?.split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

function readEmailList(value: string | undefined) {
  return readList(value).map((item) => item.toLowerCase());
}

export function getPlanLimits(plan: FlowCrewPlan) {
  return planLimits[plan];
}

export function getUserPlan(input: PlanLookupInput): FlowCrewPlan {
  const userId = typeof input === "string" ? input : input.userId;
  const email =
    typeof input === "string" ? null : input.email?.trim().toLowerCase() ?? null;

  const proUserIds = readList(process.env.FLOWCREW_PRO_USER_IDS);
  const teamUserIds = readList(process.env.FLOWCREW_TEAM_USER_IDS);
  const proEmails = readEmailList(process.env.FLOWCREW_PRO_EMAILS);
  const teamEmails = readEmailList(process.env.FLOWCREW_TEAM_EMAILS);

  if (teamUserIds.includes(userId)) return "team";
  if (email && teamEmails.includes(email)) return "team";

  if (proUserIds.includes(userId)) return "pro";
  if (email && proEmails.includes(email)) return "pro";

  return "free";
}
