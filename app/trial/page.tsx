"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Lock,
  LoaderCircle,
  Radar,
  Tags,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import AgentAvatar from "@/components/AgentAvatar";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage, type Language } from "@/components/LanguageProvider";
import type { AgentId } from "@/lib/data";
import {
  type ConversationAnalysis,
  type ConversationInput,
  type ConversationSource,
} from "@/lib/flowcrew-types";

type ConversationForm = Omit<ConversationInput, "language">;
type OnboardingStep = 1 | 2 | 3 | 4;
type OperatorState = "idle" | "locked" | "working" | "done" | "needs-review";

type OperatorAgent = {
  id: AgentId;
  name: string;
  role: string;
  activityMessages: readonly string[];
  lockedMessage: string;
  idleMessage: string;
  checklist: readonly string[];
  reviewChecklist?: readonly string[];
};

const initialForm: ConversationForm = {
  clientName: "",
  sourceType: "whatsapp",
  messyMessage:
    "Hey, quick one. We may need a site or landing page for an event at the end of the month. Budget is not clear yet, but we want to sell more tickets, maybe post on Instagram, and send an email to old customers. Can this be done fast?",
  businessType: "",
  goal: "",
};

const sourceOptions: Record<Language, { label: string; value: ConversationSource }[]> = {
  en: [
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Gmail", value: "gmail" },
    { label: "Instagram", value: "instagram" },
    { label: "Email", value: "email" },
    { label: "Notes", value: "notes" },
    { label: "Other", value: "other" },
  ],
  it: [
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Gmail", value: "gmail" },
    { label: "Instagram", value: "instagram" },
    { label: "Email", value: "email" },
    { label: "Note", value: "notes" },
    { label: "Altro", value: "other" },
  ],
};

const replyKeys = ["professional", "friendly", "short"] as const;

const initialAgentStates: Record<AgentId, OperatorState> = {
  jackie: "idle",
  dex: "locked",
  nora: "locked",
  milo: "locked",
};

const agentOrder: AgentId[] = ["jackie", "dex", "nora", "milo"];

const accentStyles: Record<
  AgentId,
  { border: string; glow: string; surface: string; text: string; dot: string }
> = {
  jackie: {
    border: "border-cyan-200/35",
    glow: "shadow-cyan-500/20",
    surface: "bg-cyan-200/10",
    text: "text-cyan-100",
    dot: "bg-cyan-200",
  },
  dex: {
    border: "border-violet-200/35",
    glow: "shadow-violet-500/20",
    surface: "bg-violet-200/10",
    text: "text-violet-100",
    dot: "bg-violet-200",
  },
  nora: {
    border: "border-fuchsia-200/35",
    glow: "shadow-fuchsia-500/20",
    surface: "bg-fuchsia-200/10",
    text: "text-fuchsia-100",
    dot: "bg-fuchsia-200",
  },
  milo: {
    border: "border-emerald-200/35",
    glow: "shadow-emerald-500/20",
    surface: "bg-emerald-200/10",
    text: "text-emerald-100",
    dot: "bg-emerald-200",
  },
};

const onboardingCopy: Record<
  Language,
  {
    steps: readonly string[];
    inputTitle: string;
    inputSubtitle: string;
    sourceSelector: string;
    businessType: string;
    clientName: string;
    clientOptional: string;
    messyMessage: string;
    cta: string;
    running: string;
    prototypeBadge: string;
    processingTitle: string;
    processingSubtitle: string;
    processingCardTitle: string;
    processingCardBody: string;
    reviewTitle: string;
    reviewSubtitle: string;
    replyTitle: string;
    replySubtitle: string;
    cleanBrief: string;
    keyFacts: string;
    missingInfo: string;
    detectedIntent: string;
    tags: string;
    priority: string;
    riskClarity: string;
    nextBestAction: string;
    noMissingInfo: string;
    continueToReply: string;
    backToCase: string;
    tone: string;
    tones: readonly string[];
    approvalControls: string;
    approveReply: string;
    editReply: string;
    doNotSend: string;
    uiOnly: string;
    miloNeverSends: string;
    approved: string;
    editing: string;
    held: string;
    caseNumber: string;
    caseWaiting: string;
    errorHint: string;
    stateLabels: Record<OperatorState, string>;
    agents: readonly OperatorAgent[];
    completedLogs: Record<AgentId, string>;
  }
> = {
  en: {
    steps: ["Input", "Live Crew", "Case Review", "Reply Approval"],
    inputTitle: "Organize your first client message",
    inputSubtitle:
      "Paste the message. Your Crew will turn it into a clean client case.",
    sourceSelector: "Source selector",
    businessType: "Business type",
    clientName: "Client/source name",
    clientOptional: "Optional",
    messyMessage: "Messy message",
    cta: "Start with the Crew",
    running: "Crew is creating the case",
    prototypeBadge: "Manual paste · integrations later",
    processingTitle: "Live Crew Processing",
    processingSubtitle:
      "Your agents unlock one at a time and build the case.",
    processingCardTitle: "Creating Client Case #001",
    processingCardBody:
      "Building the brief, workflow signals, review notes, and reply draft.",
    reviewTitle: "Client Case Ready",
    reviewSubtitle:
      "Review the structured case before moving into Milo's reply approval.",
    replyTitle: "Milo Reply Approval",
    replySubtitle:
      "Milo prepares reply options. A human still decides what happens next.",
    cleanBrief: "Clean brief",
    keyFacts: "Key facts",
    missingInfo: "Missing information",
    detectedIntent: "Detected intent",
    tags: "Tags",
    priority: "Priority",
    riskClarity: "Risk / clarity",
    nextBestAction: "Next best action",
    noMissingInfo: "No missing information detected.",
    continueToReply: "Review Milo reply",
    backToCase: "Back to case review",
    tone: "Tone",
    tones: ["Professional", "Friendly", "Short"],
    approvalControls: "Human approval controls",
    approveReply: "Approve reply",
    editReply: "Edit reply",
    doNotSend: "Do not send",
    uiOnly: "UI only",
    miloNeverSends: "Milo never sends automatically in this prototype.",
    approved: "Reply approved locally. Nothing was sent.",
    editing: "Edit mode enabled. Milo is still waiting for approval.",
    held: "Reply held. Nothing was sent.",
    caseNumber: "Client Case #001",
    caseWaiting: "Ready for input",
    errorHint: "The Crew stopped before creating the case. Try again when the AI service is ready.",
    stateLabels: {
      idle: "Idle",
      locked: "Locked",
      working: "Working",
      done: "Done",
      "needs-review": "Needs review",
    },
    agents: [
      {
        id: "jackie",
        name: "Jackie",
        role: "Structure extraction",
        idleMessage: "Ready to read the first message.",
        lockedMessage: "Ready to start.",
        activityMessages: [
          "Reading messy input...",
          "Extracting client request...",
          "Finding missing info...",
        ],
        checklist: ["Intent detected", "Key facts extracted", "Missing info found"],
      },
      {
        id: "dex",
        name: "Dex",
        role: "Workflow organizer",
        idleMessage: "Waiting for Jackie.",
        lockedMessage: "Locked until Jackie finishes.",
        activityMessages: [
          "Creating tags...",
          "Setting priority...",
          "Preparing workflow note...",
        ],
        checklist: ["Tags created", "Priority assigned", "Workflow note ready"],
      },
      {
        id: "nora",
        name: "Nora",
        role: "Risk and action",
        idleMessage: "Waiting for Dex.",
        lockedMessage: "Locked until Dex finishes.",
        activityMessages: [
          "Checking clarity...",
          "Evaluating risk...",
          "Choosing next best action...",
        ],
        checklist: ["Risk checked", "Clarity scored", "Next action chosen"],
        reviewChecklist: ["Budget unclear", "Deadline vague", "Quote not ready yet"],
      },
      {
        id: "milo",
        name: "Milo",
        role: "Reply approval",
        idleMessage: "Waiting for Nora.",
        lockedMessage: "Locked until Nora finishes.",
        activityMessages: [
          "Drafting reply...",
          "Preparing tone options...",
          "Waiting for human approval...",
        ],
        checklist: ["Reply drafted", "Tone options ready", "Approval required"],
      },
    ],
    completedLogs: {
      jackie: "Jackie extracted structure",
      dex: "Dex prepared workflow signals",
      nora: "Nora flagged review items",
      milo: "Milo prepared the draft",
    },
  },
  it: {
    steps: ["Input", "Crew live", "Revisione caso", "Approvazione"],
    inputTitle: "Organizza il tuo primo messaggio cliente",
    inputSubtitle:
      "Incolla il messaggio. La Crew lo trasformera in un caso cliente pulito.",
    sourceSelector: "Fonte",
    businessType: "Tipo attivita",
    clientName: "Nome cliente/fonte",
    clientOptional: "Opzionale",
    messyMessage: "Messaggio confuso",
    cta: "Avvia la Crew",
    running: "La Crew sta creando il caso",
    prototypeBadge: "Manual paste · integrazioni dopo",
    processingTitle: "Crew live in azione",
    processingSubtitle:
      "Gli agenti si sbloccano uno alla volta e costruiscono il caso.",
    processingCardTitle: "Creazione Client Case #001",
    processingCardBody:
      "Creazione di brief, segnali workflow, note e bozza risposta.",
    reviewTitle: "Client Case pronto",
    reviewSubtitle:
      "Rivedi il caso strutturato prima di passare all'approvazione della risposta di Milo.",
    replyTitle: "Approvazione risposta Milo",
    replySubtitle:
      "Milo prepara le opzioni di risposta. Una persona decide sempre il passo successivo.",
    cleanBrief: "Brief pulito",
    keyFacts: "Fatti chiave",
    missingInfo: "Info mancanti",
    detectedIntent: "Intento rilevato",
    tags: "Tag",
    priority: "Priorita",
    riskClarity: "Rischio / chiarezza",
    nextBestAction: "Prossima azione migliore",
    noMissingInfo: "Nessuna informazione mancante rilevata.",
    continueToReply: "Rivedi risposta Milo",
    backToCase: "Torna al caso",
    tone: "Tono",
    tones: ["Professionale", "Amichevole", "Breve"],
    approvalControls: "Controlli approvazione umana",
    approveReply: "Approva risposta",
    editReply: "Modifica risposta",
    doNotSend: "Non inviare",
    uiOnly: "Solo UI",
    miloNeverSends: "Milo non invia mai automaticamente in questo prototipo.",
    approved: "Risposta approvata localmente. Nulla e stato inviato.",
    editing: "Modalita modifica attiva. Milo aspetta ancora approvazione.",
    held: "Risposta trattenuta. Nulla e stato inviato.",
    caseNumber: "Client Case #001",
    caseWaiting: "Pronto per l'input",
    errorHint: "La Crew si e fermata prima di creare il caso. Riprova quando il servizio AI e pronto.",
    stateLabels: {
      idle: "In attesa",
      locked: "Bloccato",
      working: "In lavoro",
      done: "Fatto",
      "needs-review": "Da rivedere",
    },
    agents: [
      {
        id: "jackie",
        name: "Jackie",
        role: "Estrazione struttura",
        idleMessage: "Pronta a leggere il primo messaggio.",
        lockedMessage: "Pronta per iniziare.",
        activityMessages: [
          "Lettura input confuso...",
          "Estrazione richiesta cliente...",
          "Ricerca informazioni mancanti...",
        ],
        checklist: ["Intento rilevato", "Fatti chiave estratti", "Info mancanti trovate"],
      },
      {
        id: "dex",
        name: "Dex",
        role: "Workflow organizer",
        idleMessage: "In attesa di Jackie.",
        lockedMessage: "Bloccato finche Jackie finisce.",
        activityMessages: [
          "Creazione tag...",
          "Impostazione priorita...",
          "Preparazione nota workflow...",
        ],
        checklist: ["Tag creati", "Priorita assegnata", "Nota workflow pronta"],
      },
      {
        id: "nora",
        name: "Nora",
        role: "Rischio e azione",
        idleMessage: "In attesa di Dex.",
        lockedMessage: "Bloccata finche Dex finisce.",
        activityMessages: [
          "Controllo chiarezza...",
          "Valutazione rischio...",
          "Scelta prossima azione...",
        ],
        checklist: ["Rischio controllato", "Chiarezza valutata", "Azione scelta"],
        reviewChecklist: ["Budget non chiaro", "Scadenza vaga", "Preventivo non pronto"],
      },
      {
        id: "milo",
        name: "Milo",
        role: "Approvazione risposta",
        idleMessage: "In attesa di Nora.",
        lockedMessage: "Bloccato finche Nora finisce.",
        activityMessages: [
          "Scrittura risposta...",
          "Preparazione opzioni tono...",
          "In attesa di approvazione umana...",
        ],
        checklist: ["Risposta preparata", "Opzioni tono pronte", "Approvazione richiesta"],
      },
    ],
    completedLogs: {
      jackie: "Jackie ha estratto la struttura",
      dex: "Dex ha preparato i segnali workflow",
      nora: "Nora ha segnalato elementi da rivedere",
      milo: "Milo ha preparato la bozza",
    },
  },
};

function formatLogTime(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TrialPage() {
  const { copy, language } = useLanguage();
  const ui = onboardingCopy[language];
  const [form, setForm] = useState<ConversationForm>(initialForm);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [result, setResult] = useState<ConversationAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [agentStates, setAgentStates] =
    useState<Record<AgentId, OperatorState>>(initialAgentStates);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [activityLog, setActivityLog] = useState<
    { agent: AgentId; message: string; time: string }[]
  >([]);
  const [selectedTone, setSelectedTone] = useState(0);
  const [replyDraft, setReplyDraft] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");
  const crewTimersRef = useRef<number[]>([]);

  const selectedReply = result?.milo.replies[replyKeys[selectedTone]] ?? "";
  const selectedSource =
    sourceOptions[language].find((item) => item.value === form.sourceType)?.label ??
    form.sourceType;
  const activeAgentName = activeAgent
    ? ui.agents.find((agent) => agent.id === activeAgent)?.name
    : null;

  useEffect(() => {
    return () => clearCrewTimers();
  }, []);

  useEffect(() => {
    if (!activeAgent || !isRunning) return;

    const agent = ui.agents.find((item) => item.id === activeAgent);
    const messageCount = agent?.activityMessages.length ?? 1;
    const interval = window.setInterval(() => {
      setActivityIndex((current) => (current + 1) % messageCount);
    }, 850);

    return () => window.clearInterval(interval);
  }, [activeAgent, isRunning, ui.agents]);

  function updateForm<K extends keyof ConversationForm>(key: K, value: ConversationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function clearCrewTimers() {
    crewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    crewTimersRef.current = [];
  }

  function queueCrewTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    crewTimersRef.current.push(timer);
  }

  function appendActivity(agent: AgentId, message: string) {
    setActivityLog((current) => [
      ...current,
      {
        agent,
        message,
        time: formatLogTime(),
      },
    ]);
  }

  function completeAgent(agent: AgentId, nextAgent: AgentId) {
    appendActivity(agent, ui.completedLogs[agent]);
    setAgentStates((current) => ({
      ...current,
      [agent]: "done",
      [nextAgent]: "working",
    }));
    setActiveAgent(nextAgent);
    setActivityIndex(0);
  }

  function startCrewSequence() {
    clearCrewTimers();
    setResult(null);
    setReplyDraft("");
    setReplyStatus("");
    setIsEditingReply(false);
    setActivityLog([]);
    setCurrentStep(2);
    setAgentStates({ ...initialAgentStates, jackie: "working" });
    setActiveAgent("jackie");
    setActivityIndex(0);

    return new Promise<void>((resolve) => {
      queueCrewTimer(() => completeAgent("jackie", "dex"), 1500);
      queueCrewTimer(() => completeAgent("dex", "nora"), 3200);
      queueCrewTimer(() => completeAgent("nora", "milo"), 5000);
      queueCrewTimer(() => {
        appendActivity("milo", ui.completedLogs.milo);
        resolve();
      }, 6800);
    });
  }

  function finishCrewRun(analysis: ConversationAnalysis) {
    clearCrewTimers();
    setActiveAgent(null);
    setActivityIndex(0);
    setAgentStates({
      jackie: "done",
      dex: "done",
      nora: "needs-review",
      milo: "done",
    });
    setActivityLog((current) => current.length ? current : buildFallbackLog(ui));
    setResult(analysis);
    setSelectedTone(0);
    setReplyDraft(analysis.milo.replies.professional);
    setCurrentStep(3);
  }

  async function runCrew() {
    setIsRunning(true);
    setErrorMessage("");
    const sequenceComplete = startCrewSequence();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, language }),
      });
      const data = (await response.json()) as {
        analysis?: ConversationAnalysis;
        error?: string;
      };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error || copy.trial.analysisError);
      }

      await sequenceComplete;
      finishCrewRun(data.analysis);
    } catch (error) {
      await sequenceComplete;
      clearCrewTimers();
      setActiveAgent(null);
      setActivityIndex(0);
      setAgentStates(initialAgentStates);
      setActivityLog([]);
      setCurrentStep(1);
      setErrorMessage(
        error instanceof Error ? error.message : copy.trial.analysisError,
      );
    } finally {
      setIsRunning(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runCrew();
  }

  function selectTone(index: number) {
    setSelectedTone(index);
    setReplyDraft(result?.milo.replies[replyKeys[index]] ?? "");
    setIsEditingReply(false);
    setReplyStatus("");
  }

  function approveReply() {
    setReplyStatus(ui.approved);
  }

  function editReply() {
    setIsEditingReply(true);
    setReplyStatus(ui.editing);
  }

  function holdReply() {
    setReplyStatus(ui.held);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#06060A] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(50,10,236,0.35),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(16,185,129,0.16),transparent_26%),linear-gradient(135deg,#06060A_0%,#090715_48%,#050509_100%)]" />
        <div className="absolute left-1/2 top-20 h-px w-[70rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <header className="relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-[0_0_34px_rgba(74,34,201,0.2)]">
              <Bot aria-hidden="true" className="h-5 w-5 text-cyan-100" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">FlowCrew</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-100/55">
                AI Client Workspace
              </span>
            </span>
          </Link>
          <LanguageSelector />
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col px-5 py-6 sm:px-8 lg:py-8">
        <StepProgress currentStep={currentStep} ui={ui} />

        <div className="mt-6 flex flex-1 items-stretch">
          <div className="mx-auto w-full max-w-6xl">
            <div className="min-w-0 rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: 14 }}
                  key={currentStep}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {currentStep === 1 ? (
                    <InputStep
                      errorMessage={errorMessage}
                      form={form}
                      handleSubmit={handleSubmit}
                      isRunning={isRunning}
                      language={language}
                      ui={ui}
                      updateForm={updateForm}
                    />
                  ) : currentStep === 2 ? (
                    <ProcessingStep
                      activeAgentName={activeAgentName}
                      activityIndex={activityIndex}
                      activityLog={activityLog}
                      activeAgent={activeAgent}
                      agentStates={agentStates}
                      ui={ui}
                    />
                  ) : currentStep === 3 && result ? (
                    <CaseReviewStep
                      result={result}
                      selectedSource={selectedSource}
                      setCurrentStep={setCurrentStep}
                      ui={ui}
                    />
                  ) : result ? (
                    <ReplyApprovalStep
                      isEditingReply={isEditingReply}
                      replyDraft={replyDraft}
                      replyStatus={replyStatus}
                      selectedReply={selectedReply}
                      selectedTone={selectedTone}
                      selectTone={selectTone}
                      setCurrentStep={setCurrentStep}
                      setReplyDraft={setReplyDraft}
                      ui={ui}
                      onApprove={approveReply}
                      onEdit={editReply}
                      onHold={holdReply}
                    />
                  ) : (
                    <InputStep
                      errorMessage={errorMessage}
                      form={form}
                      handleSubmit={handleSubmit}
                      isRunning={isRunning}
                      language={language}
                      ui={ui}
                      updateForm={updateForm}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function buildFallbackLog(ui: (typeof onboardingCopy)[Language]) {
  return agentOrder.map((agent) => ({
    agent,
    message: ui.completedLogs[agent],
    time: formatLogTime(),
  }));
}

function StepProgress({
  currentStep,
  ui,
}: {
  currentStep: OnboardingStep;
  ui: (typeof onboardingCopy)[Language];
}) {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-full border border-white/10 bg-white/[0.045] p-2 backdrop-blur-2xl">
      <ol className="grid grid-cols-4 gap-1.5">
        {ui.steps.map((step, index) => {
          const stepNumber = (index + 1) as OnboardingStep;
          const isActive = currentStep === stepNumber;
          const isDone = currentStep > stepNumber;
          const isLocked = currentStep < stepNumber;

          return (
            <li
              className={`rounded-full border px-2 py-2 transition duration-300 sm:px-3 ${
                isActive
                  ? "border-violet-200/40 bg-violet-300/15 shadow-[0_0_24px_rgba(74,34,201,0.16)]"
                  : isDone
                    ? "border-emerald-200/25 bg-emerald-200/10"
                    : "border-transparent bg-transparent opacity-45"
              }`}
              key={step}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-black ${
                    isActive
                      ? "border-white/30 bg-white text-slate-950"
                      : isDone
                        ? "border-emerald-200/30 bg-emerald-200/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.04] text-white/32"
                  }`}
                >
                  {isDone ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : index + 1}
                </span>
                <span className={`hidden text-xs font-black sm:inline ${isLocked ? "text-white/35" : "text-white"}`}>
                  {step}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function InputStep({
  errorMessage,
  form,
  handleSubmit,
  isRunning,
  language,
  ui,
  updateForm,
}: {
  errorMessage: string;
  form: ConversationForm;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isRunning: boolean;
  language: Language;
  ui: (typeof onboardingCopy)[Language];
  updateForm: <K extends keyof ConversationForm>(
    key: K,
    value: ConversationForm[K],
  ) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-black tracking-[-0.07em] text-white sm:text-5xl">
          {ui.inputTitle}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          {ui.inputSubtitle}
        </p>
      </div>

      <form
        className="mt-7 rounded-[2rem] border border-white/10 bg-[#0D0D17]/80 p-4 shadow-2xl shadow-black/30 sm:p-5"
        onSubmit={handleSubmit}
      >
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={ui.sourceSelector}>
              <select
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#141424] px-4 text-sm font-bold text-white outline-none transition focus:border-violet-200/50"
                onChange={(event) =>
                  updateForm("sourceType", event.target.value as ConversationSource)
                }
                value={form.sourceType}
              >
                {sourceOptions[language].map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={ui.businessType}>
              <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-200/50"
                onChange={(event) => updateForm("businessType", event.target.value)}
                placeholder="Event studio, agency, local service"
                value={form.businessType}
              />
            </Field>
            <Field label={`${ui.clientName} · ${ui.clientOptional}`}>
              <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-violet-200/50"
                onChange={(event) => updateForm("clientName", event.target.value)}
                placeholder="Marco from WhatsApp"
                value={form.clientName}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label={ui.messyMessage}>
              <textarea
                className="min-h-56 w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-200/50"
                onChange={(event) => updateForm("messyMessage", event.target.value)}
                required
                value={form.messyMessage}
              />
            </Field>
          </div>

          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_44px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-cyan-100 disabled:cursor-wait disabled:opacity-70"
            disabled={isRunning}
            type="submit"
          >
            {isRunning ? (
              <>
                <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
                {ui.running}
              </>
            ) : (
              <>
                {ui.cta}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-black text-white/42">
            <Lock aria-hidden="true" className="h-3.5 w-3.5 text-cyan-100/65" />
            {ui.prototypeBadge}
          </p>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-semibold text-rose-100" role="alert">
              <p>{errorMessage}</p>
              <p className="mt-2 text-rose-100/65">{ui.errorHint}</p>
            </div>
          ) : null}
      </form>
    </div>
  );
}

function ProcessingStep({
  activeAgent,
  activeAgentName,
  activityIndex,
  activityLog,
  agentStates,
  ui,
}: {
  activeAgent: AgentId | null;
  activeAgentName?: string | null;
  activityIndex: number;
  activityLog: { agent: AgentId; message: string; time: string }[];
  agentStates: Record<AgentId, OperatorState>;
  ui: (typeof onboardingCopy)[Language];
}) {
  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-100/60">
            {ui.processingTitle}
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl">
            {ui.processingCardTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            {ui.processingSubtitle}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2.25rem] border border-violet-200/20 bg-[#0D0D19]/84 p-6 shadow-2xl shadow-violet-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,34,201,0.26),transparent_36%)]" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                {ui.caseNumber}
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {activeAgentName ? `${activeAgentName} is working` : ui.processingCardTitle}
              </h2>
            </div>
            <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-cyan-100" />
          </div>
          <p className="relative mt-5 text-sm leading-7 text-slate-300">
            {ui.processingCardBody}
          </p>
          <ol className="relative mt-6 space-y-3">
            {activityLog.length ? (
              activityLog.map((item, index) => (
                <li className="flex items-center gap-3 text-sm text-slate-300" key={`${item.agent}-${index}`}>
                  <span className={`h-2 w-2 rounded-full ${accentStyles[item.agent].dot}`} />
                  <time className="font-mono text-xs text-white/35">{item.time}</time>
                  <span>{item.message}</span>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(165,243,252,0.8)]" />
                {ui.caseWaiting}
              </li>
            )}
          </ol>
        </div>
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ui.agents.map((agent) => (
          <AgentCard
            activityIndex={activityIndex}
            agent={agent}
            isActive={activeAgent === agent.id}
            key={agent.id}
            state={agentStates[agent.id]}
            stateLabel={ui.stateLabels[agentStates[agent.id]]}
          />
        ))}
      </div>
    </div>
  );
}

function CaseReviewStep({
  result,
  selectedSource,
  setCurrentStep,
  ui,
}: {
  result: ConversationAnalysis;
  selectedSource: string;
  setCurrentStep: (step: OnboardingStep) => void;
  ui: (typeof onboardingCopy)[Language];
}) {
  const missingInfo = result.jackie.missingInfo.length
    ? result.jackie.missingInfo
    : [ui.noMissingInfo];
  const nextBestAction = result.dex.nextSteps[0] ?? result.nora.questions[0] ?? "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/65">
            {ui.caseNumber}
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl">
            {ui.reviewTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            {ui.reviewSubtitle}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
          onClick={() => setCurrentStep(4)}
          type="button"
        >
          {ui.continueToReply}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        <ReviewCard className="lg:col-span-2" icon={<FileText className="h-5 w-5" />} title={ui.cleanBrief}>
          <p className="text-sm leading-7 text-slate-300">{result.jackie.cleanSummary}</p>
        </ReviewCard>
        <ReviewCard icon={<Workflow className="h-5 w-5" />} title={ui.priority}>
          <Badge value={result.dex.priority} />
          <p className="mt-3 text-sm text-slate-500">{selectedSource}</p>
        </ReviewCard>
        <ReviewCard icon={<CheckCircle2 className="h-5 w-5" />} title={ui.keyFacts}>
          <BulletList items={result.jackie.keyFacts} />
        </ReviewCard>
        <ReviewCard icon={<AlertTriangle className="h-5 w-5" />} title={ui.missingInfo} tone="amber">
          <BulletList items={missingInfo} />
        </ReviewCard>
        <ReviewCard icon={<Radar className="h-5 w-5" />} title={ui.riskClarity} tone="fuchsia">
          <div className="flex flex-wrap gap-2">
            <Badge value={result.nora.riskLevel} variant="amber" />
            <Badge value={result.nora.status} variant="violet" />
          </div>
        </ReviewCard>
        <ReviewCard icon={<Tags className="h-5 w-5" />} title={ui.detectedIntent}>
          <ChipList items={result.jackie.detectedTopics} />
        </ReviewCard>
        <ReviewCard icon={<Tags className="h-5 w-5" />} title={ui.tags}>
          <ChipList items={result.dex.tags} />
        </ReviewCard>
        <ReviewCard className="lg:col-span-2" icon={<ArrowRight className="h-5 w-5" />} title={ui.nextBestAction}>
          <p className="text-sm leading-7 text-slate-300">{nextBestAction}</p>
        </ReviewCard>
      </div>
    </div>
  );
}

function ReplyApprovalStep({
  isEditingReply,
  onApprove,
  onEdit,
  onHold,
  replyDraft,
  replyStatus,
  selectedReply,
  selectedTone,
  selectTone,
  setCurrentStep,
  setReplyDraft,
  ui,
}: {
  isEditingReply: boolean;
  onApprove: () => void;
  onEdit: () => void;
  onHold: () => void;
  replyDraft: string;
  replyStatus: string;
  selectedReply: string;
  selectedTone: number;
  selectTone: (index: number) => void;
  setCurrentStep: (step: OnboardingStep) => void;
  setReplyDraft: (value: string) => void;
  ui: (typeof onboardingCopy)[Language];
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <button
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-white/62 transition hover:bg-white/[0.08]"
        onClick={() => setCurrentStep(3)}
        type="button"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {ui.backToCase}
      </button>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <AgentAvatar agentId="milo" label="Milo" size="lg" />
          <h1 className="mt-5 text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl">
            {ui.replyTitle}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{ui.replySubtitle}</p>
          <p className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4 text-sm font-bold text-amber-100">
            {ui.miloNeverSends}
          </p>
        </div>

        <div className="rounded-[2.25rem] border border-emerald-200/20 bg-[#0D1119]/90 p-5 shadow-2xl shadow-emerald-950/20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/65">
            {ui.tone}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ui.tones.map((tone, index) => (
              <button
                className={`rounded-full px-4 py-2 text-xs font-black transition ${
                  selectedTone === index
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/[0.055] text-white/62 hover:bg-white/10"
                }`}
                key={tone}
                onClick={() => selectTone(index)}
                type="button"
              >
                {tone}
              </button>
            ))}
          </div>

          {isEditingReply ? (
            <textarea
              className="mt-5 min-h-72 w-full resize-y rounded-[1.5rem] border border-white/10 bg-black/24 p-4 text-sm font-semibold leading-7 text-slate-200 outline-none focus:border-emerald-200/50"
              onChange={(event) => setReplyDraft(event.target.value)}
              value={replyDraft}
            />
          ) : (
            <p className="mt-5 min-h-72 whitespace-pre-line rounded-[1.5rem] border border-white/10 bg-black/24 p-5 text-sm font-semibold leading-7 text-slate-200">
              {replyDraft || selectedReply}
            </p>
          )}

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
                {ui.approvalControls}
              </p>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black text-white/42">
                {ui.uiOnly}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
                onClick={onApprove}
                type="button"
              >
                {ui.approveReply}
              </button>
              <button
                className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-black text-white transition hover:bg-white/12"
                onClick={onEdit}
                type="button"
              >
                {ui.editReply}
              </button>
              <button
                className="rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm font-black text-amber-100 transition hover:bg-amber-200/15"
                onClick={onHold}
                type="button"
              >
                {ui.doNotSend}
              </button>
            </div>
            {replyStatus ? (
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-bold text-emerald-100" role="status">
                {replyStatus}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({
  activityIndex,
  agent,
  isActive,
  state,
  stateLabel,
}: {
  activityIndex: number;
  agent: OperatorAgent;
  isActive: boolean;
  state: OperatorState;
  stateLabel: string;
}) {
  const accent = accentStyles[agent.id];
  const stateClass =
    state === "locked"
      ? "border-white/10 bg-white/[0.025] opacity-45"
      : state === "idle"
        ? "border-white/10 bg-white/[0.05]"
        : state === "working"
          ? `${accent.border} ${accent.surface} shadow-2xl ${accent.glow}`
          : state === "needs-review"
            ? "border-amber-200/35 bg-amber-200/10 shadow-2xl shadow-amber-500/15"
            : "border-emerald-200/22 bg-emerald-200/10";
  const message =
    state === "working"
      ? agent.activityMessages[activityIndex % agent.activityMessages.length]
      : state === "done"
        ? "Checklist complete."
        : state === "needs-review"
          ? agent.activityMessages[agent.activityMessages.length - 1]
          : state === "locked"
            ? agent.lockedMessage
            : agent.idleMessage;
  const checklist =
    state === "needs-review" && agent.reviewChecklist
      ? agent.reviewChecklist
      : agent.checklist;

  return (
    <article className={`relative overflow-hidden rounded-[1.7rem] border p-4 transition duration-300 ${stateClass}`}>
      {isActive ? (
        <span className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_34%)]" />
      ) : null}
      <div className="relative flex items-start justify-between gap-3">
        <AgentAvatar agentId={agent.id} decorative size="sm" />
        <StateBadge state={state} stateLabel={stateLabel} />
      </div>
      <h3 className="relative mt-4 text-xl font-black text-white">{agent.name}</h3>
      <p className={`relative mt-1 text-xs font-black uppercase tracking-[0.18em] ${accent.text}`}>
        {agent.role}
      </p>
      <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
        <div className="flex gap-2">
          {state === "working" ? (
            <LoaderCircle aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 animate-spin ${accent.text}`} />
          ) : state === "done" ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
          ) : state === "needs-review" ? (
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-100" />
          ) : state === "locked" ? (
            <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
          ) : (
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accent.dot}`} />
          )}
          <p className="text-sm font-semibold leading-6 text-slate-300">{message}</p>
        </div>
      </div>
      {state === "done" || state === "needs-review" ? (
        <ul className="relative mt-4 space-y-2">
          {checklist.map((item) => (
            <li className="flex items-center gap-2 text-sm font-semibold text-slate-300" key={item}>
              {state === "needs-review" ? (
                <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-100" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-100" />
              )}
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function StateBadge({
  state,
  stateLabel,
}: {
  state: OperatorState;
  stateLabel: string;
}) {
  const badgeClass =
    state === "working"
      ? "border-cyan-200/25 bg-cyan-200/10 text-cyan-100"
      : state === "done"
        ? "border-emerald-200/25 bg-emerald-200/10 text-emerald-100"
        : state === "needs-review"
          ? "border-amber-200/30 bg-amber-200/12 text-amber-100"
          : state === "locked"
            ? "border-white/10 bg-white/[0.025] text-white/28"
            : "border-white/10 bg-white/[0.04] text-white/45";

  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${badgeClass}`}>
      {stateLabel}
    </span>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function ReviewCard({
  children,
  className = "",
  icon,
  title,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  icon: ReactNode;
  title: string;
  tone?: "default" | "amber" | "fuchsia";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200/20 bg-amber-200/8 text-amber-100"
      : tone === "fuchsia"
        ? "border-fuchsia-200/20 bg-fuchsia-200/8 text-fuchsia-100"
        : "border-white/10 bg-white/[0.045] text-cyan-100";

  return (
    <article className={`rounded-[1.75rem] border p-5 ${toneClass} ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          {icon}
        </span>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
          {title}
        </h2>
      </div>
      {children}
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li className="flex gap-2 text-sm leading-6 text-slate-300" key={item}>
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-white/75"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Badge({
  value,
  variant = "emerald",
}: {
  value: string;
  variant?: "emerald" | "amber" | "violet";
}) {
  const className =
    variant === "amber"
      ? "border-amber-200/25 bg-amber-200/10 text-amber-100"
      : variant === "violet"
        ? "border-violet-200/25 bg-violet-200/10 text-violet-100"
        : "border-emerald-200/25 bg-emerald-200/10 text-emerald-100";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${className}`}>
      {value}
    </span>
  );
}
