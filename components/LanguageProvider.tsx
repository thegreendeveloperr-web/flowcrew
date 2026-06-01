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
      dashboard: "Workspace",
      trial: "Try free conversation",
    },
    landing: {
      eyebrow: "AI workspace for messy client conversations",
      headline: "Turn messy client messages into clear next steps.",
      subheadline:
        "Paste scattered info from WhatsApp, Gmail, or client chats. Jackie organizes it, Dex tags it, Nora evaluates the opportunity, and Milo helps you reply.",
      primaryCta: "Try with a messy message",
      secondaryCta: "See the Crew in action",
      flowLabel: "Live conversation preview",
      flowTitle: "Messy input. Clean operating flow.",
      flowSteps: [
        "WhatsApp or Gmail message pasted",
        "Jackie cleans and structures it",
        "Dex adds tags and priority",
        "Nora checks if it is worth pursuing",
        "Milo drafts a reply for approval",
      ],
      orchestrationEyebrow: "Separated agents, shared context",
      orchestrationTitle:
        "The Crew does not act as one generic AI. Each agent has a clear job.",
      orchestrationBody:
        "FlowCrew keeps the client conversation in one place, then asks the right specialist only when the topic changes.",
      orchestrationCenterLabel: "FlowCrew Orchestrator",
      orchestrationCenterTitle: "Conversation context",
      orchestrationCenterBody:
        "Jackie starts by cleaning the chaos. When the conversation shifts, FlowCrew suggests the next agent and asks you before moving forward.",
      orchestrationItems: [
        {
          title: "Jackie cleans first",
          body: "Scattered messages become key facts, missing info, topics, and a readable brief.",
        },
        {
          title: "Agents enter when needed",
          body: "If the message turns into an event, Nora evaluates it. If it needs a reply, Milo drafts it.",
        },
        {
          title: "You stay in control",
          body: "FlowCrew can suggest actions, but replies always wait for your confirmation.",
        },
      ],
      orchestrationPassLabel: "Agent",
      orchestrationOutcome: ["Clean", "Tag", "Evaluate", "Reply"],
      howEyebrow: "How it works",
      howTitle: "From scattered client info to a clean workflow.",
      howBody:
        "Instead of losing time decoding long chats, paste them into FlowCrew and get a structured brief, tags, opportunity signal, and reply draft.",
      howSteps: [
        {
          title: "Paste the messy message",
          body: "Drop in WhatsApp texts, Gmail requests, Instagram DMs, phone notes, or copied client context.",
        },
        {
          title: "Let Jackie organize it",
          body: "Jackie separates facts, open questions, detected topics, and the next agent to consult.",
        },
        {
          title: "Approve the next action",
          body: "Dex tags, Nora evaluates, and Milo drafts only with a clear handoff that keeps you in control.",
        },
      ],
      agentsEyebrow: "Meet the Crew",
      agentsTitle: "Four agents, four different responsibilities.",
      agentsBody:
        "FlowCrew works best when the agents stay separated: Jackie clarifies, Dex organizes, Nora judges opportunity, Milo handles replies.",
      agentCards: {
        jackie: {
          role: "Conversation Cleaner",
          tagline:
            "Turns scattered WhatsApp, Gmail, and client notes into a clear brief.",
        },
        nora: {
          role: "Opportunity Evaluator",
          tagline:
            "Checks if the request looks profitable, unclear, risky, or impossible with current info.",
        },
        milo: {
          role: "Reply Assistant",
          tagline:
            "Drafts replies in different tones and always asks for approval before sending.",
        },
        dex: {
          role: "Tagging & Workflow Logger",
          tagline:
            "Adds tags, priority, category, CRM notes, and practical next steps.",
        },
      },
      pricingEyebrow: "Plans",
      pricingTitle: "Start by organizing one conversation.",
      pricingBody:
        "No fake prices, no billing setup in the prototype. Choose the operating depth your Crew needs.",
      pricingDepth: "Crew depth",
      bestValue: "Best fit",
      pricingPlans: [
        {
          description: "For solo operators who want to organize conversations manually.",
          features: [
            "1 free conversation",
            "Jackie cleanup",
            "Basic tags",
            "Manual replies",
          ],
          cta: "Try one conversation",
        },
        {
          description: "For freelancers and small teams receiving many client requests.",
          features: [
            "More conversations",
            "Full Crew workflow",
            "Smart tags",
            "Reply drafts",
            "Opportunity evaluation",
          ],
          cta: "Unlock the Crew",
        },
        {
          description: "For teams that need memory, automations, and custom workflow logic.",
          features: [
            "Memory",
            "Automations",
            "Custom workflow",
            "Priority rules",
            "Weekly report",
          ],
          cta: "Request Crew+",
        },
      ],
      finalTitle: "Give your next messy client message to the Crew.",
      finalBody:
        "Run one conversation free and see how FlowCrew turns confusion into next steps.",
      footer: "FlowCrew · AI workspace for client conversations",
    },
    trial: {
      label: "Free Trial - Organize 1 Client Conversation",
      heroTitle: "Paste a messy client message. Let the Crew make it usable.",
      heroBody:
        "Use a WhatsApp, Gmail, Instagram, phone note, or copied client chat. FlowCrew will clean it, tag it, evaluate it, and help you reply.",
      intakeLabel: "Conversation intake",
      intakeTitle: "Give Jackie the raw message.",
      intakeBody:
        "Do not over-clean it. FlowCrew is made for scattered, incomplete, real client information.",
      ready: "Ready for the Crew",
      fields: {
        clientName: "Client/source name",
        sourceType: "Source type",
        messyMessage: "Messy client message",
        businessType: "Business type",
        goal: "Goal",
      },
      placeholders: {
        clientName: "e.g. Marco from WhatsApp",
        messyMessage:
          "Paste the raw client message here, even if it is long, confused, or split across topics...",
        businessType: "e.g. web studio, event planner, local service",
        goal: "e.g. understand the request and answer professionally",
      },
      sourceOptions: ["WhatsApp", "Gmail", "Instagram", "Phone notes", "Other"],
      runButton: "Run the Crew",
      running: "The Crew is reading...",
      previewLabel: "Crew route",
      previewTitle: "Jackie starts. Others enter only when useful.",
      previewBody:
        "Your message stays on this device. This prototype creates a local simulation without external APIs.",
      previewSteps: [
        ["Jackie", "Cleans the conversation and spots missing info"],
        ["Dex", "Adds tags, priority, category, and CRM-style notes"],
        ["Nora", "Evaluates whether the opportunity is worth pursuing"],
        ["Milo", "Drafts a reply and asks for your approval"],
      ],
      localOnly: "Local preview only",
      used: "Free trial used: 1/1 conversation",
      resultsLabel: "Crew output",
      resultsTitle: "Your client conversation is organized",
      jackieTitle: "Jackie cleaned the conversation",
      dexTitle: "Dex tagged and logged it",
      noraTitle: "Nora evaluated the opportunity",
      miloTitle: "Milo drafted a reply",
      cleanSummary: "Clean summary",
      keyFacts: "Key facts",
      missingInfo: "Missing information",
      detectedTopics: "Detected topics",
      suggestedAgent: "Suggested next agent",
      tags: "Tags",
      priority: "Priority",
      category: "Category",
      crmNote: "CRM-style note",
      nextSteps: "Next steps",
      opportunityStatus: "Opportunity status",
      profitabilitySignal: "Profitability signal",
      riskLevel: "Risk level",
      why: "Why",
      questions: "Questions to ask",
      suggestedReply: "Suggested reply",
      toneSelector: "Tone",
      tones: ["Professional", "Friendly", "Short", "Firm but polite"],
      useReply: "Use this reply",
      regenerate: "Regenerate",
      edit: "Edit manually",
      miloConfirm: "Do you want Milo to answer with this message?",
      transitionJackieNora:
        "This started as a general request, but now it looks like an opportunity. Let’s see what Nora thinks.",
      transitionJackieDex: "Jackie has cleaned the message. Dex can now tag it.",
      transitionDexNora: "Dex found business intent. Nora can evaluate if it is worth pursuing.",
      transitionNoraMilo: "The next step is probably a reply. Milo can draft one, but you approve it.",
      upgradeLabel: "Trial complete",
      upgradeTitle: "Your free conversation is organized.",
      upgradeBody:
        "Upgrade to let FlowCrew process more client messages, remember your workflow, and help you reply faster.",
      upgrade: "Unlock FlowCrew",
      dashboard: "View demo workspace",
    },
  },
  it: {
    languageLabel: "Lingua",
    nav: {
      how: "Come funziona",
      agents: "La tua Crew",
      pricing: "Piani",
      dashboard: "Workspace",
      trial: "Prova conversazione",
    },
    landing: {
      eyebrow: "Workspace AI per conversazioni clienti confuse",
      headline: "Trasforma messaggi confusi dei clienti in prossimi passi chiari.",
      subheadline:
        "Incolla informazioni sparse da WhatsApp, Gmail o chat clienti. Jackie le riordina, Dex le tagga, Nora valuta l’opportunità e Milo ti aiuta a rispondere.",
      primaryCta: "Prova con un messaggio confuso",
      secondaryCta: "Guarda la Crew in azione",
      flowLabel: "Anteprima conversazione live",
      flowTitle: "Input confuso. Flusso operativo chiaro.",
      flowSteps: [
        "Messaggio WhatsApp o Gmail incollato",
        "Jackie lo pulisce e lo struttura",
        "Dex aggiunge tag e priorità",
        "Nora valuta se vale la pena procedere",
        "Milo prepara una risposta da approvare",
      ],
      orchestrationEyebrow: "Agenti separati, contesto condiviso",
      orchestrationTitle:
        "La Crew non è un’AI generica unica. Ogni agente ha un compito preciso.",
      orchestrationBody:
        "FlowCrew tiene la conversazione cliente in un punto solo, poi chiama lo specialista giusto quando cambia l’area del problema.",
      orchestrationCenterLabel: "FlowCrew Orchestrator",
      orchestrationCenterTitle: "Contesto conversazione",
      orchestrationCenterBody:
        "Jackie inizia pulendo il caos. Quando la conversazione cambia area, FlowCrew suggerisce il prossimo agente e chiede conferma.",
      orchestrationItems: [
        {
          title: "Jackie pulisce per prima",
          body: "Messaggi sparsi diventano fatti chiave, info mancanti, argomenti e brief leggibile.",
        },
        {
          title: "Gli agenti entrano quando servono",
          body: "Se il messaggio diventa un evento, Nora lo valuta. Se serve rispondere, Milo prepara la bozza.",
        },
        {
          title: "Tu resti in controllo",
          body: "FlowCrew suggerisce azioni, ma le risposte aspettano sempre la tua conferma.",
        },
      ],
      orchestrationPassLabel: "Agente",
      orchestrationOutcome: ["Pulizia", "Tag", "Valutazione", "Risposta"],
      howEyebrow: "Come funziona",
      howTitle: "Da informazioni clienti sparse a un workflow chiaro.",
      howBody:
        "Invece di perdere tempo a decifrare chat lunghe, incollale in FlowCrew e ottieni brief strutturato, tag, segnale opportunità e bozza di risposta.",
      howSteps: [
        {
          title: "Incolla il messaggio confuso",
          body: "Inserisci testi WhatsApp, richieste Gmail, DM Instagram, note telefoniche o contesto copiato dal cliente.",
        },
        {
          title: "Lascia ordinare Jackie",
          body: "Jackie separa fatti, domande aperte, argomenti rilevati e prossimo agente da consultare.",
        },
        {
          title: "Approva la prossima azione",
          body: "Dex tagga, Nora valuta e Milo scrive solo con un passaggio chiaro che mantiene il controllo a te.",
        },
      ],
      agentsEyebrow: "Conosci la Crew",
      agentsTitle: "Quattro agenti, quattro responsabilità diverse.",
      agentsBody:
        "FlowCrew funziona meglio quando gli agenti restano separati: Jackie chiarisce, Dex organizza, Nora valuta, Milo gestisce le risposte.",
      agentCards: {
        jackie: {
          role: "Pulizia Conversazioni",
          tagline:
            "Trasforma WhatsApp, Gmail e note clienti sparse in un brief chiaro.",
        },
        nora: {
          role: "Valutazione Opportunità",
          tagline:
            "Capisce se la richiesta è profittevole, poco chiara, rischiosa o impossibile con i dati attuali.",
        },
        milo: {
          role: "Assistente Risposte",
          tagline:
            "Prepara risposte in toni diversi e chiede sempre conferma prima dell’invio.",
        },
        dex: {
          role: "Tag e Log Workflow",
          tagline:
            "Aggiunge tag, priorità, categoria, nota CRM e prossimi passi pratici.",
        },
      },
      pricingEyebrow: "Piani",
      pricingTitle: "Inizia ordinando una conversazione.",
      pricingBody:
        "Niente prezzi finti, nessun pagamento nel prototipo. Scegli il livello operativo adatto alla tua Crew.",
      pricingDepth: "Livello Crew",
      bestValue: "Più adatto",
      pricingPlans: [
        {
          description: "Per chi vuole ordinare conversazioni manualmente.",
          features: [
            "1 conversazione gratuita",
            "Pulizia Jackie",
            "Tag base",
            "Risposte manuali",
          ],
          cta: "Prova una conversazione",
        },
        {
          description: "Per freelance e piccoli team che ricevono molte richieste clienti.",
          features: [
            "Più conversazioni",
            "Workflow Crew completo",
            "Tag intelligenti",
            "Bozze risposta",
            "Valutazione opportunità",
          ],
          cta: "Sblocca la Crew",
        },
        {
          description: "Per team che vogliono memoria, automazioni e workflow personalizzati.",
          features: [
            "Memoria",
            "Automazioni",
            "Workflow personalizzato",
            "Regole di priorità",
            "Report settimanale",
          ],
          cta: "Richiedi Crew+",
        },
      ],
      finalTitle: "Dai alla Crew il tuo prossimo messaggio cliente confuso.",
      finalBody:
        "Prova una conversazione gratis e guarda come FlowCrew trasforma il caos in prossimi passi.",
      footer: "FlowCrew · Workspace AI per conversazioni clienti",
    },
    trial: {
      label: "Prova gratuita - Organizza 1 conversazione cliente",
      heroTitle: "Incolla un messaggio cliente confuso. La Crew lo rende utilizzabile.",
      heroBody:
        "Usa WhatsApp, Gmail, Instagram, note telefoniche o chat cliente copiate. FlowCrew pulisce, tagga, valuta e ti aiuta a rispondere.",
      intakeLabel: "Inserimento conversazione",
      intakeTitle: "Dai a Jackie il messaggio grezzo.",
      intakeBody:
        "Non pulirlo troppo. FlowCrew nasce per informazioni reali, sparse, incomplete e confuse.",
      ready: "Pronto per la Crew",
      fields: {
        clientName: "Nome cliente/fonte",
        sourceType: "Tipo fonte",
        messyMessage: "Messaggio cliente confuso",
        businessType: "Tipo attività",
        goal: "Obiettivo",
      },
      placeholders: {
        clientName: "es. Marco da WhatsApp",
        messyMessage:
          "Incolla qui il messaggio cliente grezzo, anche se è lungo, confuso o diviso in più argomenti...",
        businessType: "es. web studio, organizzatore eventi, servizio locale",
        goal: "es. capire la richiesta e rispondere in modo professionale",
      },
      sourceOptions: ["WhatsApp", "Gmail", "Instagram", "Note telefoniche", "Altro"],
      runButton: "Avvia la Crew",
      running: "La Crew sta leggendo...",
      previewLabel: "Percorso Crew",
      previewTitle: "Jackie inizia. Gli altri entrano solo se servono.",
      previewBody:
        "Il messaggio resta su questo dispositivo. Il prototipo crea una simulazione locale senza API esterne.",
      previewSteps: [
        ["Jackie", "Pulisce la conversazione e trova le info mancanti"],
        ["Dex", "Aggiunge tag, priorità, categoria e nota CRM"],
        ["Nora", "Valuta se l’opportunità vale la pena"],
        ["Milo", "Prepara una risposta e chiede approvazione"],
      ],
      localOnly: "Solo anteprima locale",
      used: "Prova gratuita usata: 1/1 conversazione",
      resultsLabel: "Output della Crew",
      resultsTitle: "La conversazione cliente è organizzata",
      jackieTitle: "Jackie ha pulito la conversazione",
      dexTitle: "Dex ha taggato e registrato",
      noraTitle: "Nora ha valutato l’opportunità",
      miloTitle: "Milo ha preparato una risposta",
      cleanSummary: "Riepilogo pulito",
      keyFacts: "Fatti chiave",
      missingInfo: "Informazioni mancanti",
      detectedTopics: "Argomenti rilevati",
      suggestedAgent: "Prossimo agente suggerito",
      tags: "Tag",
      priority: "Priorità",
      category: "Categoria",
      crmNote: "Nota stile CRM",
      nextSteps: "Prossimi passi",
      opportunityStatus: "Stato opportunità",
      profitabilitySignal: "Segnale profitto",
      riskLevel: "Livello rischio",
      why: "Perché",
      questions: "Domande da fare",
      suggestedReply: "Risposta suggerita",
      toneSelector: "Tono",
      tones: ["Professionale", "Amichevole", "Breve", "Ferma ma educata"],
      useReply: "Usa questa risposta",
      regenerate: "Rigenera",
      edit: "Modifica manualmente",
      miloConfirm: "Vuoi che Milo risponda con questo messaggio?",
      transitionJackieNora:
        "Era iniziata come richiesta generica, ma ora sembra un’opportunità. Vediamo cosa ne pensa Nora.",
      transitionJackieDex: "Jackie ha pulito il messaggio. Ora Dex può taggarlo.",
      transitionDexNora: "Dex ha trovato intento commerciale. Nora può valutare se vale la pena procedere.",
      transitionNoraMilo: "Il prossimo passo è probabilmente una risposta. Milo può scriverla, ma la approvi tu.",
      upgradeLabel: "Trial completato",
      upgradeTitle: "La tua conversazione gratuita è organizzata.",
      upgradeBody:
        "Fai upgrade per permettere a FlowCrew di processare più messaggi clienti, ricordare il tuo workflow e aiutarti a rispondere più velocemente.",
      upgrade: "Sblocca FlowCrew",
      dashboard: "Vedi workspace demo",
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
