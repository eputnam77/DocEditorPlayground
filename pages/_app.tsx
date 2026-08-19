import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "../styles/ckeditor.css";
import "../styles/codex.css";
import "../styles/globals.css";
import "../styles/lexical.css";
import "../styles/slate.css";
import "../styles/tiptap.css";
import "../styles/toast.css";
import "@toast-ui/editor/dist/toastui-editor.css";
// Scoped entirely under .toastui-editor-dark, so importing it is inert until
// pages/toast.tsx adds that class. Without it the Toast editor stayed a white
// slab in dark mode.
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

/**
 * Root application component.
 *
 * Fonts are linked from here rather than a custom `pages/_document.tsx`: the
 * static-export overlay in the dep-streamlit deployment repo owns _document and
 * fails its build if this repo adds one, so the font links live in <Head>.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Compare six open-source rich-text editors - CKEditor 5, TipTap, Toast UI, Editor.js, Slate, and Lexical - in one consistent workspace."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,400&family=Public+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23FAF8F3'/%3E%3Cpath d='M7 9h18M7 15h18M7 21h11' stroke='%2317130F' stroke-width='2'/%3E%3Cpath d='M20 24l9-9' stroke='%23BE3A21' stroke-width='2.5'/%3E%3C/svg%3E"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
