import type { AppProps } from "next/app";
import React from "react";
import "../styles/ckeditor.css";
import "../styles/codex.css";
import "../styles/globals.css";
import "../styles/lexical.css";
import "../styles/quill.css";
import "../styles/slate.css";
import "../styles/tiptap.css";
import "../styles/toast.css";

/**
 * Root application component that imports global styles.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
