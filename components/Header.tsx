"use client";

import * as Icons from "lucide-react";
import {Menu, Sparkles, X} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useState} from "react";
import {Link} from "@/i18n/navigation";
import {categories, getToolsByCategory} from "@/data/categories";
import type {Locale} from "@/lib/types";
import {Logo} from "./Brand/Logo";
import {CategoryNav} from "./CategoryNav";
import {LanguageSwitcher} from "./LanguageSwitcher";
import {Button} from "./ui/Button";

type IconName = keyof typeof Icons;

export function Header() {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-white/85 backdrop-blur-md">
      <div className="container-pad mx-auto flex max-w-7xl items-center justify-between gap-4 py-3">
        <Link aria-label="ImmigrantMoney" className="flex items-center" href="/">
          <Logo size={34} />
        </Link>

        <nav aria-label={tNav("tools")} className="hidden items-center gap-1 lg:flex">
          <CategoryNav />
          <Link
            className="rounded-md px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            href="/#tools"
          >
            {tNav("allTools")}
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link href="/start">
            <Button size="md">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              {tNav("start")}
            </Button>
          </Link>
        </div>

        <button
          aria-label={tNav("menu")}
          className="rounded-lg border border-ink-200 p-2 text-ink-700 transition hover:bg-ink-50 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-200 bg-white p-4 lg:hidden">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <Link className="ml-auto" href="/start" onClick={() => setOpen(false)}>
              <Button size="md">
                <Sparkles aria-hidden="true" className="h-4 w-4" />
                {tNav("start")}
              </Button>
            </Link>
          </div>
          <nav className="grid gap-3">
            {categories.map((category) => {
              const Icon = Icons[category.icon as IconName] as Icons.LucideIcon | undefined;
              const tools = getToolsByCategory(category.key);
              return (
                <div className="grid gap-1" key={category.key}>
                  <Link
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-ink-900 transition hover:bg-brand-50 hover:text-brand-700"
                    href={`/categories/${category.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {Icon ? <Icon aria-hidden="true" className="h-4 w-4 text-brand-600" /> : null}
                    {tCategories(`${category.key}.label`)}
                  </Link>
                  <div className="grid gap-1 pl-9">
                    {tools.map((tool) => (
                      <Link
                        className="rounded-md px-2 py-1 text-caption font-semibold text-ink-600 transition hover:bg-brand-50 hover:text-brand-700"
                        href={`/tools/${tool.slug}`}
                        key={tool.slug}
                        onClick={() => setOpen(false)}
                      >
                        {tool.title[locale]}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              href="/#tools"
              onClick={() => setOpen(false)}
            >
              {tNav("allTools")} →
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
