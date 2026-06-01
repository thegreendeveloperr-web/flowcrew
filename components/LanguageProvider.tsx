"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "it";

const storageKey = "flowcrew:language";

export const translations = {
  en: {
    languageLabel: "Language",
    nav: {
      how: "How it works",
      agents: "Your Crew",
      pricing: "Plans",
      dashboard: "Dashboard",
      trial: "Try free lead",
    },
    landing: {
      eyebrow: "AI automation hub for your lead workflow",
      headline: "Turn one lead into a scored proposal, follow-up, and CRM log.",
      subheadline:
        "Jackie qualifies the lead, Nora shapes the offer, Milo writes the follow-up, and Dex logs the workflow. Try one lead free.",
      primaryCta: "Try 1 lead free",
      secondaryCta: "See how it works",
      flowLabel: "Live workflow preview",
      flowTitle: "One lead. Four coordinated outputs.",
      flowSteps: [
        "Lead received",
        "Jackie scores the lead",
        "Nora creates the proposal",
        "Milo writes the follow-up",
        "Dex logs the workflow",
      ],
      orchestrationEyebrow: "Why it feels like one product",
      orchestrationTitle:
        "Not four separate AIs. One shared context, four specialist passes.",
      orchestrationBody:
        "FlowCrew keeps the lead brief in one place, then routes it through Jackie, Nora, Milo, and Dex in a fixed operating sequence.",
      orchestrationCenterLabel: "FlowCrew Orchestrator",
      orchestrationCenterTitle: "Shared lead memory",
      orchestrationCenterBody:
        "The same context travels through every agent, so each output builds on the last instead of starting from zero.",
      orchestrationItems: [
        {
          title: "One brief",
          body: "The lead message, budget, project type, and goal become the source of truth.",
        },
        {
          title: "Ordered handoffs",
          body: "Jackie qualifies first, Nora scopes second, Milo writes third, Dex logs last.",
        },
        {
          title: "One workflow",
          body: "The result is a single sales motion: score, scope, follow-up, and CRM log.",
        },
      ],
      orchestrationPassLabel: "Pass",
      orchestrationOutcome: ["Score", "Scope", "Reply", "Log"],
      howEyebrow: "How it works",
      howTitle: "From inbound message to ready-to-send sales motion.",
      howBody:
        "FlowCrew gives every agent a focused job, then turns their work into one clean operating flow.",
      howSteps: [
        {
          title: "Drop in the lead",
          body: "Add the message, business context, budget, project type, and goal.",
        },
        {
          title: "Run the Crew",
          body: "Jackie, Nora, Milo, and Dex work through the same lead in sequence.",
        },
        {
          title: "Act with context",
          body: "Review the score, scope, follow-up, and workflow log in one place.",
        },
      ],
      agentsEyebrow: "Meet the Crew",
      agentsTitle: "Specialists that hand work to each other.",
      agentsBody:
        "Each output is useful on its own. Together, they give you a repeatable sales workflow.",
      agentCards: {
        jackie: {
          role: "Lead Qualifier",
          tagline: "Scores fit, urgency, and buying intent.",
        },
        nora: {
          role: "Proposal Architect",
          tagline: "Shapes scope, deliverables, and complexity.",
        },
        milo: {
          role: "Follow-up Writer",
          tagline: "Drafts a clear, ready-to-send next message.",
        },
        dex: {
          role: "Flow Logger",
          tagline: "Records the motion and lines up next steps.",
        },
      },
      pricingEyebrow: "Plans",
      pricingTitle: "Start with one lead. Expand when the workflow earns it.",
      pricingBody:
        "No billing setup in the trial. Choose the operating depth your Crew needs.",
      pricingDepth: "Crew depth",
      bestValue: "Best fit",
      pricingPlans: [
        {
          description: "For solo operators testing FlowCrew.",
          features: ["Core Brain", "Manual lead entry", "Simple replies"],
          cta: "Start with one free lead",
        },
        {
          description:
            "For freelancers and small teams that want the full Crew.",
          features: [
            "Smart Brain",
            "Nora proposal studio",
            "Dex flow logging",
            "Brand tone",
          ],
          cta: "Unlock Smart Crew",
        },
        {
          description:
            "For teams that need memory, automations, and deeper reasoning.",
          features: [
            "Elite Brain",
            "Business memory",
            "Custom automations",
            "Weekly deal report",
          ],
          cta: "Request Crew+",
        },
      ],
      finalTitle: "Give your next lead a full Crew.",
      finalBody:
        "Run one lead free and see the complete workflow before you commit.",
      footer: "FlowCrew · AI automation hub for focused sales workflows",
    },
    trial: {
      label: "Free Trial - 1 Lead",
      heroTitle: "Run one real lead through your Crew.",
      heroBody:
        "Add the essential context. Jackie, Nora, Milo, and Dex will turn it into a scored, scoped, ready-to-follow-up workflow.",
      intakeLabel: "Lead intake",
      intakeTitle: "Give the Crew a clear brief.",
      intakeBody:
        "The better the input, the sharper the qualification, scope, and next step.",
      ready: "Ready for the Crew",
      fields: {
        businessName: "Business name",
        leadMessage: "Lead message",
        budget: "Budget",
        projectType: "Project type",
        goal: "Goal",
      },
      placeholders: {
        businessName: "e.g. Northstar Studio",
        leadMessage:
          "Paste the inbound lead message, including timing and any known requirements.",
        goal: "e.g. Launch a clearer conversion path",
      },
      projectOptions: [
        "Website refresh",
        "Launch funnel",
        "Automation sprint",
        "Other project",
      ],
      budgetOptions: [
        "Budget to confirm",
        "Under 1k EUR",
        "1k-3k EUR",
        "3k-5k EUR",
        "5k+ EUR",
      ],
      runButton: "Run my free lead",
      running: "Crew is working...",
      previewLabel: "Crew route",
      previewTitle: "One lead, four coordinated handoffs",
      previewBody:
        "Your message stays on this device. The local trial creates a realistic preview without sending data to a server.",
      orchestrationLabel: "Shared context",
      orchestrationTitle: "The Crew works from one brief",
      orchestrationBody:
        "FlowCrew passes the same lead context through each specialist, then assembles one final workflow.",
      orchestrationPoints: [
        "One lead context",
        "Ordered handoffs",
        "Single workflow",
      ],
      previewSteps: [
        ["Jackie", "Qualifies fit, urgency, and intent"],
        ["Nora", "Builds scope and proposal direction"],
        ["Milo", "Writes the next message"],
        ["Dex", "Logs the flow and next steps"],
      ],
      localOnly: "Local preview only",
      used: "Free trial used: 1/1 lead",
      resultsLabel: "Crew output",
      resultsTitle: "Your lead workflow is ready",
      resultSystemLabel: "Crew handoff",
      resultSystemTitle: "One result assembled from four passes",
      resultSystemBody:
        "Jackie adds qualification, Nora adds scope, Milo adds the reply, and Dex turns the run into an operating log.",
      score: "Score",
      status: "Status",
      reasons: "Why this score",
      proposalRange: "Proposal range",
      scope: "Recommended scope",
      rationale: "Why this approach",
      message: "Ready-to-send follow-up",
      timing: "Recommended timing",
      summary: "Operational summary",
      nextSteps: "Next steps",
      upgradeLabel: "Trial complete",
      upgradeTitle:
        "Your free lead is complete. Upgrade to keep your Crew running.",
      upgradeBody:
        "Your first workflow is saved on this device. Continue in the product demo or explore the full Crew.",
      upgrade: "Upgrade to Pro",
      dashboard: "View dashboard",
    },
  },
  it: {
    languageLabel: "Lingua",
    nav: {
      how: "Come funziona",
      agents: "La tua Crew",
      pricing: "Piani",
      dashboard: "Dashboard",
      trial: "Prova gratuita",
    },
    landing: {
      eyebrow: "Hub di automazione AI per il tuo flusso lead",
      headline:
        "Trasforma un lead in proposta valutata, follow-up e log CRM.",
      subheadline:
        "Jackie qualifica il lead, Nora struttura l'offerta, Milo scrive il follow-up e Dex registra il flusso. Prova un lead gratis.",
      primaryCta: "Prova 1 lead gratis",
      secondaryCta: "Scopri come funziona",
      flowLabel: "Anteprima flusso live",
      flowTitle: "Un lead. Quattro output coordinati.",
      flowSteps: [
        "Lead ricevuto",
        "Jackie valuta il lead",
        "Nora crea la proposta",
        "Milo scrive il follow-up",
        "Dex registra il flusso",
      ],
      orchestrationEyebrow: "Perché sembra un prodotto unico",
      orchestrationTitle:
        "Non quattro AI separate. Un contesto condiviso, quattro passaggi specialistici.",
      orchestrationBody:
        "FlowCrew tiene il brief del lead in un unico punto e lo passa a Jackie, Nora, Milo e Dex in una sequenza operativa precisa.",
      orchestrationCenterLabel: "FlowCrew Orchestrator",
      orchestrationCenterTitle: "Memoria lead condivisa",
      orchestrationCenterBody:
        "Lo stesso contesto attraversa ogni agente, così ogni output costruisce sul precedente invece di ripartire da zero.",
      orchestrationItems: [
        {
          title: "Un brief",
          body: "Messaggio, budget, tipo progetto e obiettivo diventano la fonte unica.",
        },
        {
          title: "Handoff ordinati",
          body: "Jackie qualifica, Nora definisce lo scope, Milo scrive, Dex registra.",
        },
        {
          title: "Un workflow",
          body: "Il risultato è un unico flusso commerciale: score, scope, follow-up e log CRM.",
        },
      ],
      orchestrationPassLabel: "Passaggio",
      orchestrationOutcome: ["Score", "Scope", "Risposta", "Log"],
      howEyebrow: "Come funziona",
      howTitle: "Dal messaggio in entrata a un flusso commerciale pronto.",
      howBody:
        "FlowCrew assegna a ogni agente un ruolo preciso e trasforma il lavoro in un unico flusso operativo.",
      howSteps: [
        {
          title: "Inserisci il lead",
          body: "Aggiungi messaggio, contesto, budget, tipo di progetto e obiettivo.",
        },
        {
          title: "Avvia la Crew",
          body: "Jackie, Nora, Milo e Dex lavorano sullo stesso lead in sequenza.",
        },
        {
          title: "Agisci con contesto",
          body: "Rivedi punteggio, scope, follow-up e log operativo in un unico posto.",
        },
      ],
      agentsEyebrow: "Conosci la Crew",
      agentsTitle: "Specialisti che si passano il lavoro.",
      agentsBody:
        "Ogni output è utile da solo. Insieme creano un flusso commerciale ripetibile.",
      agentCards: {
        jackie: {
          role: "Qualifica Lead",
          tagline: "Valuta fit, urgenza e intenzione d'acquisto.",
        },
        nora: {
          role: "Architetta Proposte",
          tagline: "Definisce scope, deliverable e complessità.",
        },
        milo: {
          role: "Follow-up Writer",
          tagline: "Prepara il prossimo messaggio, pronto da inviare.",
        },
        dex: {
          role: "Flow Logger",
          tagline: "Registra il flusso e ordina i prossimi passi.",
        },
      },
      pricingEyebrow: "Piani",
      pricingTitle: "Inizia con un lead. Cresci quando il flusso lo merita.",
      pricingBody:
        "Nessuna configurazione di pagamento nel trial. Scegli il livello operativo adatto alla tua Crew.",
      pricingDepth: "Livello Crew",
      bestValue: "Più adatto",
      pricingPlans: [
        {
          description: "Per professionisti indipendenti che provano FlowCrew.",
          features: [
            "Core Brain",
            "Inserimento lead manuale",
            "Risposte semplici",
          ],
          cta: "Inizia con un lead gratuito",
        },
        {
          description:
            "Per freelance e piccoli team che vogliono la Crew completa.",
          features: [
            "Smart Brain",
            "Studio proposte Nora",
            "Log operativo Dex",
            "Tono del brand",
          ],
          cta: "Sblocca Smart Crew",
        },
        {
          description:
            "Per team che richiedono memoria, automazioni e ragionamento avanzato.",
          features: [
            "Elite Brain",
            "Memoria aziendale",
            "Automazioni personalizzate",
            "Report trattative settimanale",
          ],
          cta: "Richiedi Crew+",
        },
      ],
      finalTitle: "Dai una Crew completa al tuo prossimo lead.",
      finalBody:
        "Prova un lead gratis e guarda il flusso completo prima di decidere.",
      footer: "FlowCrew · Hub di automazione AI per flussi commerciali mirati",
    },
    trial: {
      label: "Prova gratuita - 1 Lead",
      heroTitle: "Fai lavorare la Crew su un lead reale.",
      heroBody:
        "Inserisci il contesto essenziale. Jackie, Nora, Milo e Dex lo trasformeranno in un flusso valutato, strutturato e pronto per il follow-up.",
      intakeLabel: "Inserimento lead",
      intakeTitle: "Dai alla Crew un brief chiaro.",
      intakeBody:
        "Più preciso è l'input, più nitidi saranno qualifica, scope e prossimo passo.",
      ready: "Pronto per la Crew",
      fields: {
        businessName: "Nome attività",
        leadMessage: "Messaggio del lead",
        budget: "Budget",
        projectType: "Tipo di progetto",
        goal: "Obiettivo",
      },
      placeholders: {
        businessName: "es. Northstar Studio",
        leadMessage:
          "Incolla il messaggio ricevuto, includendo tempistiche ed eventuali requisiti noti.",
        goal: "es. Creare un percorso di conversione più chiaro",
      },
      projectOptions: [
        "Restyling sito",
        "Funnel di lancio",
        "Sprint automazioni",
        "Altro progetto",
      ],
      budgetOptions: [
        "Budget da confermare",
        "Meno di 1k EUR",
        "1k-3k EUR",
        "3k-5k EUR",
        "Oltre 5k EUR",
      ],
      runButton: "Avvia il mio lead gratuito",
      running: "La Crew sta lavorando...",
      previewLabel: "Percorso Crew",
      previewTitle: "Un lead, quattro passaggi coordinati",
      previewBody:
        "Il messaggio resta su questo dispositivo. Il trial locale crea un'anteprima realistica senza inviare dati a un server.",
      orchestrationLabel: "Contesto condiviso",
      orchestrationTitle: "La Crew lavora da un solo brief",
      orchestrationBody:
        "FlowCrew passa lo stesso contesto a ogni specialista e poi assembla un unico workflow finale.",
      orchestrationPoints: [
        "Un contesto lead",
        "Handoff ordinati",
        "Un workflow unico",
      ],
      previewSteps: [
        ["Jackie", "Valuta fit, urgenza e intenzione"],
        ["Nora", "Costruisce scope e direzione proposta"],
        ["Milo", "Scrive il prossimo messaggio"],
        ["Dex", "Registra flusso e prossimi passi"],
      ],
      localOnly: "Solo anteprima locale",
      used: "Prova gratuita usata: 1/1 lead",
      resultsLabel: "Output della Crew",
      resultsTitle: "Il flusso del lead è pronto",
      resultSystemLabel: "Handoff Crew",
      resultSystemTitle: "Un risultato assemblato da quattro passaggi",
      resultSystemBody:
        "Jackie aggiunge la qualifica, Nora aggiunge lo scope, Milo aggiunge la risposta e Dex trasforma l'esecuzione in un log operativo.",
      score: "Punteggio",
      status: "Stato",
      reasons: "Perché questo punteggio",
      proposalRange: "Range proposta",
      scope: "Scope consigliato",
      rationale: "Perché questo approccio",
      message: "Follow-up pronto da inviare",
      timing: "Tempistica consigliata",
      summary: "Riepilogo operativo",
      nextSteps: "Prossimi passi",
      upgradeLabel: "Trial completato",
      upgradeTitle:
        "Il tuo lead gratuito è completo. Fai upgrade per mantenere attiva la Crew.",
      upgradeBody:
        "Il primo flusso è salvato su questo dispositivo. Continua nella demo prodotto o scopri la Crew completa.",
      upgrade: "Passa a Pro",
      dashboard: "Vedi dashboard",
    },
  },
} as const;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: (typeof translations)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(storageKey);

    if (storedLanguage === "en" || storedLanguage === "it") {
      window.setTimeout(() => setLanguageState(storedLanguage), 0);
    }
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage: Language) => {
        window.localStorage.setItem(storageKey, nextLanguage);
        setLanguageState(nextLanguage);
      },
      copy: translations[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
