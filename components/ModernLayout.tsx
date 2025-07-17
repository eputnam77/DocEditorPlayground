import React from "react";

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
