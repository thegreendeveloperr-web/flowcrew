"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { FlowCrewChatMessage } from "@/lib/flowcrew-types";

const chatText = {
  en: {
    eyebrow: "Gemini-powered workspace assistant",
    title: "Ask FlowCrew about the demo inbox.",
    body: "Try asking what is urgent, who needs a follow-up, or how to answer a client.",
    greeting:
      "Hi, I am FlowCrew Bot. Ask me what is urgent, who needs a follow-up, or let me draft a reply.",
    placeholder: "e.g. Who should I follow up with today?",
    send: "Send",
    thinking: "FlowCrew is thinking...",
    fallback: "I could not read Gemini's response.",
    error: "I cannot answer right now. Please try again.",
  },
  it: {
    eyebrow: "Assistente workspace con Gemini",
    title: "Chiedi a FlowCrew della inbox demo.",
    body: "Prova a chiedere cosa e urgente, chi ricontattare o come rispondere a un cliente.",
    greeting:
      "Ciao, sono FlowCrew Bot. Chiedimi cosa e urgente, chi devi ricontattare o fammi preparare una risposta.",
    placeholder: "Es. Chi devo ricontattare oggi?",
    send: "Invia",
    thinking: "FlowCrew sta ragionando...",
    fallback: "Non ho ricevuto una risposta valida da Gemini.",
    error: "Non riesco a rispondere adesso. Riprova.",
  },
} as const;

export function FlowCrewChat() {
  const { language } = useLanguage();
  const text = chatText[language];
  const [messages, setMessages] = useState<FlowCrewChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) messageList.scrollTop = messageList.scrollHeight;
  }, [isLoading, messages]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();
    if (!content || isLoading) return;

    const nextMessages: FlowCrewChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          language,
        }),
      });
      const data = (await response.json()) as { error?: string; reply?: string };

      if (!response.ok) {
        throw new Error(data.error || text.error);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || text.fallback,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : text.error,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/25 backdrop-blur sm:p-6">
        <div className="border-b border-white/10 pb-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {text.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
            {text.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{text.body}</p>
        </div>

        <div
          aria-live="polite"
          className="my-4 flex h-[420px] flex-col gap-3 overflow-y-auto rounded-2xl bg-black/30 p-4"
          ref={messageListRef}
        >
          <div className="mr-auto max-w-[84%] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white">
            {text.greeting}
          </div>

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[84%] rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-black"
                  : "mr-auto max-w-[84%] whitespace-pre-line rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white"
              }
            >
              {message.content}
            </div>
          ))}

          {isLoading ? (
            <div className="mr-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/60">
              <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
              {text.thinking}
            </div>
          ) : null}
        </div>

        <form className="flex gap-2" onSubmit={sendMessage}>
          <input
            aria-label={text.placeholder}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/55"
            maxLength={2_000}
            placeholder={text.placeholder}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button
            aria-label={text.send}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !input.trim()}
            type="submit"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">{text.send}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
