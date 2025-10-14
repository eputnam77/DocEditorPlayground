import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const editors = [
  { name: "TipTap", path: "/tiptap" },
  { name: "Toast Editor", path: "/toast" },
  { name: "CodeX", path: "/codex" },
  { name: "Slate", path: "/slate" },
  { name: "Lexical", path: "/lexical" },
  { name: "CKEditor 5", path: "/ckeditor" },
];

export default function NavBar() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {editors.map(({ name, path }) => {
        const isActive = pathname === path;
        return (
          <div
            key={name}
            className="transform-gpu transition-transform hover:scale-105"
          >
            <Link
              href={path}
              onMouseEnter={() => router.prefetch(path)}
              className={`group relative inline-block px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-semibold focus-visible:outline-none focus-visible:ring-2 ring-offset-2 ring-indigo-400 transition-colors
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                    : "bg-white/20 dark:bg-zinc-700/40 text-zinc-800 dark:text-zinc-100 backdrop-blur-md hover:bg-gradient-to-r hover:from-blue-400 hover:to-violet-500 hover:text-white"
                }`}
            >
              {/* sheen effect on hover */}
              <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </span>
              <span className="relative z-10">{name}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
