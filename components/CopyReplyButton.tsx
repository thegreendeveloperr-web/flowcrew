"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyReplyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="fc-button" onClick={copyReply} type="button">
      {copied ? (
        <Check aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Copy aria-hidden="true" className="h-4 w-4" />
      )}
      {copied ? "Copiata" : "Copia risposta"}
    </button>
  );
}
