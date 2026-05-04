"use client";

import * as Icons from "lucide-react";
import {ChevronDown} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useRef, useState} from "react";
import {categories, getToolsByCategory} from "@/data/categories";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/lib/types";
import {cn} from "@/lib/utils";

type IconName = keyof typeof Icons;

export function CategoryNav() {
  const locale = useLocale() as Locale;
  const tCategories = useTranslations("categories");
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {tNav("categories")}
        <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[680px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-ink-200 bg-white p-2 shadow-cardHover">
          <div className="grid gap-1 md:grid-cols-2">
            {categories.map((category) => {
              const Icon = Icons[category.icon as IconName] as Icons.LucideIcon | undefined;
              const tools = getToolsByCategory(category.key);
              return (
                <Link
                  className="group grid gap-1 rounded-xl p-3 transition hover:bg-brand-50"
                  href={`/categories/${category.slug}`}
                  key={category.key}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-900">
                    {Icon ? <Icon aria-hidden="true" className="h-4 w-4 text-brand-600" /> : null}
                    {tCategories(`${category.key}.label`)}
                  </div>
                  <p className="text-caption leading-5 text-ink-600">
                    {tools.map((tool) => tool.title[locale]).join(" · ")}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="mt-1 border-t border-ink-100 px-3 py-2.5">
            <Link
              className="text-caption font-bold uppercase tracking-wide text-brand-700 hover:text-brand-800"
              href="/#tools"
              onClick={() => setOpen(false)}
            >
              {tNav("allTools")} →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
