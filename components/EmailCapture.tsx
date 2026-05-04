"use client";

import {Mail} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useState, type FormEvent} from "react";
import type {Locale, ToolSlug} from "@/lib/types";
import {Button} from "./ui/Button";
import {Checkbox, Input} from "./ui/Field";

export function EmailCapture({sourceTool}: {sourceTool: ToolSlug}) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "skipped" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || !email) return;
    setStatus("loading");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, locale, sourceTool, consent, website: honeypot})
    });

    if (response.status === 202) {
      setStatus("skipped");
    } else if (response.ok) {
      setStatus("saved");
      setEmail("");
      setConsent(false);
    } else {
      setStatus("error");
    }
  }

  return (
    <form
      className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-card"
      onSubmit={onSubmit}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <Mail aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-heading-3 text-ink-900">{t("optionalEmailTitle")}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">{t("optionalEmailText")}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          aria-label={t("email")}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("email")}
          type="email"
          value={email}
        />
        <Button disabled={status === "loading" || !consent} type="submit">
          {t("submit")}
        </Button>
      </div>
      <input
        aria-hidden="true"
        className="hidden"
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        value={honeypot}
      />
      <div className="mt-3">
        <Checkbox checked={consent} label={t("consent")} onChange={(event) => setConsent(event.target.checked)} />
      </div>
      {status !== "idle" && status !== "loading" ? (
        <p className="mt-3 text-sm font-semibold text-ink-700">
          {status === "saved" ? t("saved") : status === "skipped" ? t("skipped") : t("error")}
        </p>
      ) : null}
    </form>
  );
}
