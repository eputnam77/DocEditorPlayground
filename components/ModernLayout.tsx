import React from "react";

/**
 * ModernLayout wraps all pages with a simple header and centered content.
 * It keeps styling consistent and avoids repeating boilerplate.
 */

export default function ModernLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-zinc-800 p-4 border-b">
        <nav className="container mx-auto">Document Editor Playground</nav>
      </header>
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
