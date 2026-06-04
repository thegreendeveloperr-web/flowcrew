import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Tags,
  Zap,
} from "lucide-react";

const keywords = [
  "Organizzazione messaggi",
  "Agenti AI",
  "Risposte pronte",
  "Priorità",
  "Follow-up",
  "Lead",
  "Task",
  "Tag automatici",
  "Client chaos",
];

const steps = [
  {
    number: "01",
    title: "Inserisci qualsiasi messaggio",
    body: "Copia una conversazione WhatsApp, una mail caotica o una richiesta cliente scritta male. FlowCrew parte dal casino reale, non da input perfetti.",
  },
  {
    number: "02",
    title: "La crew AI lavora",
    body: "Jackie, Milo, Nora e Dex analizzano il contenuto insieme: riassunto, task, risposta, priorità e categorie.",
  },
  {
    number: "03",
    title: "Ricevi output strutturati",
    body: "Capisci cosa vuole il cliente, cosa è urgente, cosa devi fare e cosa puoi rispondere subito.",
  },
  {
    number: "04",
    title: "Agisci prima di perdere il lead",
    body: "Meno messaggi dimenticati, meno follow-up persi, meno clienti lasciati nel caos.",
  },
];

const agents = [
  {
    name: "Jackie",
    role: "Organizza il caos",
    body: "Legge messaggi, email e note sparse e li trasforma in un riassunto chiaro. Capisce cosa sta chiedendo il cliente, quali dettagli contano e cosa va fatto.",
    tags: ["Riassunti", "Richieste confuse", "Conversazioni lunghe"],
    accent: "var(--fc-accent)",
  },
  {
    name: "Milo",
    role: "Trova priorità e task",
    body: "Prende le informazioni ordinate da Jackie e le trasforma in cose da fare. Evidenzia urgenze, scadenze, problemi e prossimi passi.",
    tags: ["Task list", "Urgenze", "Scadenze"],
    accent: "var(--fc-orange)",
  },
  {
    name: "Nora",
    role: "Prepara risposte",
    body: "Ti aiuta a rispondere ai clienti in modo chiaro, professionale e umano. Prepara messaggi pronti da copiare, adattandoli al tuo tono.",
    tags: ["Risposte veloci", "Follow-up", "Tone of voice"],
    accent: "var(--fc-mint)",
  },
  {
    name: "Dex",
    role: "Classifica e collega",
    body: "Aggiunge tag, categorie e struttura. Aiuta a capire se una richiesta riguarda un lead, un problema, un pagamento, un appuntamento o un'attività.",
    tags: ["Tagging", "Categorie", "Dashboard"],
    accent: "var(--fc-purple)",
  },
];

const features = [
  {
    title: "Incolla da qualsiasi sorgente",
    body: "WhatsApp, Gmail, Instagram DM, Telegram, note o screenshot trascritti. FlowCrew non ti obbliga a cambiare modo di lavorare.",
  },
  {
    title: "Agenti con ruoli chiari",
    body: "Ogni agente ha un compito preciso. Niente output generici: FlowCrew divide il lavoro e ti restituisce risultati leggibili.",
  },
  {
    title: "Risposte pronte, ma controllate da te",
    body: "Nora prepara il messaggio, ma sei tu a decidere se copiarlo, modificarlo o inviarlo.",
  },
  {
    title: "Dashboard ordinata",
    body: "Dex trasforma ogni richiesta in categorie, tag e stato del cliente, così sai sempre cosa sta succedendo.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "€0/mese",
    body: "Per provare FlowCrew senza carta.",
    features: ["1 lead gratuito", "Output completo", "Tutti e 4 gli agenti", "Copia risposta pronta"],
    cta: "Prova gratis",
    href: "/trial",
  },
  {
    name: "Pro",
    price: "€19/mese",
    body: "Per freelance che vogliono usare FlowCrew ogni giorno.",
    features: ["Analisi giornaliere", "Modelli AI migliori", "Dashboard clienti", "Tone of voice personalizzato", "Storico richieste", "Supporto prioritario"],
    cta: "Inizia con Pro",
    href: "/trial",
    featured: true,
  },
  {
    name: "Team",
    price: "€49/mese",
    body: "Per piccoli team e agenzie.",
    features: ["Tutto di Pro", "Più utenti", "Workspace condiviso", "Vista team", "Priorità sulle integrazioni"],
    cta: "Parla con noi",
    href: "mailto:hello@flowcrew.ai",
  },
];

export default function Home() {
  return (
    <main className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-70" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#080808]/78 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">F</span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {[
              ["Come funziona", "#come-funziona"],
              ["Agenti", "#agenti"],
              ["Demo", "#demo"],
              ["Prezzi", "#prezzi"],
            ].map(([label, href]) => (
              <a className="text-sm font-medium text-[var(--fc-text-muted)] transition hover:text-[var(--fc-text)]" href={href} key={label}>
                {label}
              </a>
            ))}
          </div>

          <Link className="fc-button fc-button-primary" href="/trial">
            Prova gratis
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-[18%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.08)] blur-[120px]" />

        <div className="fc-pill relative z-10 mb-8">
          <span className="fc-status-dot text-[var(--fc-accent)]" />
          AI-powered · Agenti autonomi · Made for freelance
        </div>

        <h1 className="relative z-10 max-w-5xl text-[clamp(3.4rem,8vw,7.6rem)] font-extrabold leading-[0.94] tracking-[-0.06em]">
          Non perdere più clienti <br />
          <em className="flow-serif font-normal text-[var(--fc-accent)]">nel caos.</em>
        </h1>

        <p className="relative z-10 mt-8 max-w-2xl text-lg leading-8 text-[var(--fc-text-muted)]">
          FlowCrew trasforma messaggi sparsi, mail confuse e richieste dei clienti in task chiari, priorità e risposte pronte.
        </p>

        <div className="relative z-10 mt-10 flex flex-col gap-3 sm:flex-row">
          <Link className="fc-button fc-button-primary px-6 py-4 text-base" href="/trial">
            Prova un lead gratis
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
          <a className="fc-button px-6 py-4 text-base" href="#demo">
            Guarda la demo
          </a>
        </div>

        <p className="flow-mono relative z-10 mt-8 text-xs uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
          In beta privata · Creato per freelance e piccoli team
        </p>
      </section>

      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 sm:px-6 lg:px-8">
          {keywords.map((keyword) => (
            <span className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-text-soft)]" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <Section id="come-funziona" kicker="Come funziona" title={<>Incolla il caos.<br /><em className="flow-serif font-normal text-[var(--fc-accent)]">Ottieni chiarezza.</em></>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article className="fc-card p-6" key={step.number}>
              <p className="flow-mono text-xs text-[var(--fc-accent)]">{step.number}</p>
              <h3 className="mt-8 text-2xl font-bold tracking-[-0.045em]">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">{step.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="agenti" kicker="Tutti gli agenti operativi" title={<>Quattro agenti.<br /><em className="flow-serif font-normal text-[var(--fc-accent)]">Un sistema.</em></>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <article className="fc-card relative overflow-hidden p-6" key={agent.name}>
              <div className="absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full blur-[70px]" style={{ background: agent.accent, opacity: 0.12 }} />
              <div className="relative">
                <div className="flow-mono mb-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-sm" style={{ color: agent.accent }}>
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-3xl font-extrabold tracking-[-0.055em]">{agent.name}</h3>
                <p className="mt-1 text-sm font-bold" style={{ color: agent.accent }}>{agent.role}</p>
                <p className="mt-5 text-sm leading-7 text-[var(--fc-text-muted)]">{agent.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {agent.tags.map((tag) => (
                    <span className="fc-pill" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="demo" kicker="Demo" title={<>Vedi FlowCrew<br /><em className="flow-serif font-normal text-[var(--fc-accent)]">in azione.</em></>}>
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="fc-panel p-5 sm:p-6">
            <p className="fc-label">Messaggio incollato</p>
            <div className="mt-5 rounded-3xl border border-white/[0.06] bg-[#0e0e0e] p-5 text-base leading-8 text-[var(--fc-text-muted)]">
              “ciao, io e mio fratello dobbiamo fare una cosa per il negozio... sì voglio dire un sito, ma magari anche la gestione social? non lo so ancora bene. comunque ci serviva entro fine mese tipo. ah, e non abbiamo budget enorme, max 800€ forse. dimmi tu”
            </div>
          </div>

          <div className="grid gap-4">
            <OutputCard badge="Urgente" title="Cosa vuole il cliente" icon={<Zap className="h-4 w-4" />}>
              Sito web per negozio, con possibile gestione social. Scadenza entro fine mese. Budget massimo indicativo: 800€. Lead da qualificare subito.
            </OutputCard>

            <OutputCard badge="Task - Milo" title="Prossimi passi" icon={<ClipboardList className="h-4 w-4" />}>
              <ul className="space-y-2">
                {[
                  "Chiedi se il sito deve essere vetrina o e-commerce",
                  "Chiarisci se la gestione social è mensile o solo setup iniziale",
                  "Prepara un preventivo entro 24 ore",
                  "Verifica se il budget copre tutto lo scope richiesto",
                ].map((task) => (
                  <li className="flex gap-2" key={task}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </OutputCard>

            <OutputCard badge="Risposta - Nora" title="Messaggio pronto" icon={<MessageSquareText className="h-4 w-4" />}>
              Ciao! Certo, possiamo parlarne. Per capire meglio: il sito deve essere solo vetrina o deve anche vendere online? E per i social pensavate a una gestione mensile o solo a un setup iniziale? Con queste info ti preparo una proposta chiara entro domani.
            </OutputCard>

            <OutputCard badge="Tags - Dex" title="Classificazione" icon={<Tags className="h-4 w-4" />}>
              <div className="flex flex-wrap gap-2">
                {["lead-caldo", "sito-web", "social-tbd", "scadenza-urgente", "budget-limitato"].map((tag) => (
                  <span className="fc-pill" key={tag}>{tag}</span>
                ))}
              </div>
            </OutputCard>
          </div>
        </div>
      </Section>

      <Section kicker="Sistema" title={<>Non solo AI.<br /><em className="flow-serif font-normal text-[var(--fc-accent)]">Un sistema.</em></>}>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article className="fc-card p-6" key={feature.title}>
              <h3 className="text-2xl font-bold tracking-[-0.045em]">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">{feature.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="prezzi" kicker="Prezzi" title={<>Semplice.<br /><em className="flow-serif font-normal text-[var(--fc-accent)]">Come deve essere.</em></>}>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article className={`fc-card p-6 ${plan.featured ? "border-[rgba(200,245,66,0.3)] shadow-[0_0_70px_rgba(200,245,66,0.08)]" : ""}`} key={plan.name}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-extrabold tracking-[-0.045em]">{plan.name}</h3>
                {plan.featured ? <span className="fc-pill fc-pill-success">Popular</span> : null}
              </div>
              <p className="mt-6 text-4xl font-extrabold tracking-[-0.06em]">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">{plan.body}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex gap-2 text-sm text-[var(--fc-text-muted)]" key={feature}>
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link className={`fc-button mt-8 w-full ${plan.featured ? "fc-button-primary" : ""}`} href={plan.href}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[rgba(200,245,66,0.22)] bg-[rgba(200,245,66,0.06)] p-8 text-center shadow-[0_0_90px_rgba(200,245,66,0.08)] sm:p-12">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
            Il tuo team AI <br />
            <em className="flow-serif font-normal text-[var(--fc-accent)]">è già pronto.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)]">
            Inizia con un lead gratuito. Nessuna carta di credito. Nessuna configurazione complicata.
          </p>
          <Link className="fc-button fc-button-primary mt-8 px-7 py-4 text-base" href="/trial">
            Prova FlowCrew gratis
          </Link>
          <p className="flow-mono mt-5 text-xs uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
            1 lead gratis · Nessuna carta di credito · Output immediato
          </p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--fc-accent)] text-xs font-extrabold text-[#080808]">F</span>
            <span className="font-bold">FlowCrew</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--fc-text-muted)]">
            <Link className="transition hover:text-[var(--fc-text)]" href="/privacy">Privacy</Link>
            <Link className="transition hover:text-[var(--fc-text)]" href="/terms">Termini</Link>
            <a className="transition hover:text-[var(--fc-text)]" href="mailto:hello@flowcrew.ai">Contatti</a>
            <span>© 2026 FlowCrew</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8" id={id}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="fc-label">{kicker}</p>
          <h2 className="mt-4 text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function OutputCard({
  badge,
  title,
  icon,
  children,
}: {
  badge: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="fc-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="fc-pill fc-pill-success">{badge}</span>
        <span className="text-[var(--fc-accent)]">{icon}</span>
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-[-0.045em]">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-[var(--fc-text-muted)]">{children}</div>
    </article>
  );
}
