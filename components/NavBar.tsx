import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EDITOR_CATALOG } from "./editorCatalog";

/**
 * Primary navigation: Home first, then every editor in catalog order.
 *
 * The numbered index in front of each editor mirrors the ordering on the home
 * page, so "editor 03" means the same thing in both places.
 */
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

  const homeActive = pathname === "/";

  return (
    <nav className="dep-nav" aria-label="Editors">
      <Link
        href="/"
        onMouseEnter={() => prefetch("/")}
        aria-current={homeActive ? "page" : undefined}
        className="dep-navlink dep-navlink--home group"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6.5 8 2l6 4.5V14H2z" />
          <path d="M6.4 14V9.4h3.2V14" />
        </svg>
        Home
      </Link>

      <span aria-hidden="true" className="dep-toolbar__sep h-5" />

      {EDITOR_CATALOG.map(({ id, name, path }, index) => {
        const isActive = pathname === path;
        return (
          <Link
            key={id}
            href={path}
            onMouseEnter={() => prefetch(path)}
            aria-current={isActive ? "page" : undefined}
            className="dep-navlink group"
          >
            <span className="dep-navlink__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
