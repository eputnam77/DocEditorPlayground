// components/USWDSDocEditorLayout.tsx

import React from "react";

export default function USWDSDocEditorLayout({
  editorName,
  toolbar,
  menu,
  children,
}: {
  editorName: string;
  toolbar?: React.ReactNode;
  menu?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
        <span className="font-bold text-xl text-gray-800">{editorName}</span>
        {menu}
      </header>

      {/* Main content area */}
      <main className="flex flex-1 w-full max-w-4xl mx-auto mt-6 px-4 flex-col">
        {/* Toolbar */}
        {toolbar}
        {/* Editor area */}
        <section className="bg-white rounded-b-lg shadow p-6 border border-gray-200 min-h-[500px]">
          {children}
        </section>
      </main>
    </div>
  );
}
