export type LeadInput = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
};

export type JackieResult = {
  score: number;
  label: string;
  analysis: string;
};

export type NoraResult = {
  proposalRange: string;
  proposal: string;
};

export type MiloResult = {
  followUp: string;
  message: string;
};

export type DexResult = {
  log: string;
  automation: string[];
};

export type CrewResult = {
  leadName: string;
  generatedAt: string;
  jackie: JackieResult;
  nora: NoraResult;
  milo: MiloResult;
  dex: DexResult;
};

const budgetRanges: Record<string, string> = {
  "Under 500 EUR": "350-500 EUR",
  "500-1000 EUR": "700-1200 EUR",
  "1000-2500 EUR": "1200-2500 EUR",
  "2500 EUR+": "2500-4200 EUR",
};

const projectMultipliers: Record<string, number> = {
  "Landing page": 8,
  "Brand website": 12,
  "Automation sprint": 10,
  "Launch funnel": 14,
  "Not sure yet": 3,
};

function cleanLeadName(input: LeadInput) {
  return input.name.trim() || "New lead";
}

function normalizeBudget(budget: string) {
  return budget
    .replaceAll("€", "EUR")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreBudget(budget: string) {
  const normalizedBudget = normalizeBudget(budget);

  if (normalizedBudget === "2500 EUR+") return 18;
  if (normalizedBudget === "1000-2500 EUR") return 15;
  if (normalizedBudget === "500-1000 EUR") return 10;
  if (normalizedBudget === "Under 500 EUR") return 5;
  return 8;
}

function getProposalRange(input: LeadInput) {
  const normalizedBudget = normalizeBudget(input.budget);
  return budgetRanges[normalizedBudget] ?? "700-1200 EUR";
}

export function runJackie(input: LeadInput): JackieResult {
  const message = input.message.toLowerCase();
  const urgencyBoost =
    Number(message.includes("urgent")) * 10 +
    Number(message.includes("launch")) * 7 +
    Number(message.includes("this month")) * 5;
  const detailBoost = Math.min(10, Math.floor(input.message.trim().length / 32));
  const projectBoost = projectMultipliers[input.projectType] ?? 6;
  const score = Math.min(
    96,
    Math.max(
      52,
      52 + scoreBudget(input.budget) + urgencyBoost + detailBoost + projectBoost,
    ),
  );
  const label = score >= 82 ? "Hot lead" : score >= 70 ? "Warm lead" : "Needs nurture";

  return {
    score,
    label,
    analysis: `${label}: ${score}/100. Jackie spotted project clarity, budget fit, urgency, and enough buying intent to decide the next move fast.`,
  };
}

export function runNora(input: LeadInput, jackie: JackieResult): NoraResult {
  const proposalRange = getProposalRange(input);
  const leadName = cleanLeadName(input);
  const proposal =
    jackie.score >= 82
      ? `Proposal range: ${proposalRange}. Nora would send ${leadName} a polished scope with a clear outcome, tight first milestone, and a confident kickoff call.`
      : `Proposal range: ${proposalRange}. Nora would ask one elegant clarifying question, then send a lean starter scope.`;

  return {
    proposalRange,
    proposal,
  };
}

export function runMilo(input: LeadInput, jackie: JackieResult): MiloResult {
  const followUp = jackie.score >= 82 ? "Follow-up in 48h" : "Follow-up in 72h";
  const leadName = cleanLeadName(input);

  return {
    followUp,
    message: `${followUp}. Milo will keep the thread reliable and low-pressure: "Hey ${leadName}, I mapped the first version of your ${input.projectType.toLowerCase()} scope. Want me to send the next steps?"`,
  };
}

export function runDex(input: LeadInput): DexResult {
  const leadName = cleanLeadName(input);

  return {
    log: "Flow saved to Dex memory",
    automation: [
      `Lead captured: ${leadName}`,
      "Jackie heat score attached to inbox card",
      "Nora proposal range staged for review",
      "Milo follow-up timer armed",
      "Trace: Lead -> Jackie -> Nora -> Milo -> Dex",
    ],
  };
}

export function sendLeadToCrew(input: LeadInput): CrewResult {
  const jackie = runJackie(input);
  const nora = runNora(input, jackie);
  const milo = runMilo(input, jackie);
  const dex = runDex(input);

  return {
    leadName: cleanLeadName(input),
    generatedAt: "Just now",
    jackie,
    nora,
    milo,
    dex,
  };
}
