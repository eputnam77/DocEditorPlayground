import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EDITOR_CATALOG } from "./editorCatalog";

export default function NavBar() {
  let pathname = "";
  let prefetch: (path: string) => Promise<void> | void = () => undefined;

  try {
    const router = useRouter();
    pathname = router.pathname;
    prefetch = router.prefetch;
  } catch {
    // Some unit tests render pages without a mounted Next router.
  }

  return (
    <nav className="flex w-full flex-wrap items-center gap-2 sm:gap-3">
      {EDITOR_CATALOG.map(({ name, path }) => {
        const isActive = pathname === path;
        return (
          <div key={name} className="transform-gpu transition-transform hover:scale-[1.015]">
            <Link
              href={path}
              onMouseEnter={() => prefetch(path)}
              className={`group relative inline-block rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                ${
                  isActive
                    ? "border-sky-300 bg-sky-500 text-white shadow-lg shadow-sky-500/25 dark:border-sky-700 dark:bg-sky-400 dark:text-slate-950"
                    : "border-slate-300 bg-white text-slate-900 hover:border-sky-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-600 dark:hover:bg-slate-800"
                }`}
            >
              <span className="relative z-10">{name}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
