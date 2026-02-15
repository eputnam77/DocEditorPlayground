import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Bold,
  Heading2,
  List as ListIcon,
  ListOrdered,
  Pilcrow,
} from "lucide-react";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { TEMPLATES } from "../utils/templates";
import EditorWorkspace from "../components/EditorWorkspace";
import FormatToggleButton from "../components/FormatToggleButton";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

type OutputData = {
  blocks: Array<{ id?: string; type: string; data?: Record<string, unknown> }>;
};

function flattenListItems(items: unknown): string {
  if (!Array.isArray(items)) {
    return "";
  }
  return items
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        const content = typeof rec.content === "string" ? rec.content : "";
        return `${content} ${flattenListItems(rec.items)}`.trim();
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

function outputToText(data: OutputData): string {
  return data.blocks
    .map((block) => {
      if (block.type === "header" || block.type === "paragraph") {
        return String(block.data?.text || "");
      }
      if (block.type === "list") {
        return flattenListItems(block.data?.items);
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function CodexPage() {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const savedDataRef = useRef<OutputData>({ blocks: [] });
  const [savedData, setSavedData] = useState<OutputData>({ blocks: [] });
  const [content, setContent] = useState("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [active, setActive] = useState({
    bold: false,
    paragraph: true,
    heading: false,
    bulletList: false,
    numberedList: false,
  });

  function getEditable(): HTMLElement | null {
    return (
      holderRef.current?.querySelector(".ce-block--focused [contenteditable='true']") ||
      holderRef.current?.querySelector("[contenteditable='true']") ||
      null
    ) as HTMLElement | null;
  }

  function tagEditableNodes() {
    holderRef.current
      ?.querySelectorAll("[contenteditable='true']")
      .forEach((node) => {
        const editable = node as HTMLElement;
        if (!editable.hasAttribute("data-testid")) {
          editable.setAttribute("data-testid", "codex-input");
        }
        if (editable.getAttribute("dir") !== "ltr") {
          editable.setAttribute("dir", "ltr");
        }
        if (editable.style.direction !== "ltr") {
          editable.style.direction = "ltr";
        }
        if (editable.style.unicodeBidi !== "plaintext") {
          editable.style.unicodeBidi = "plaintext";
        }
        if (editable.style.textAlign !== "left") {
          editable.style.textAlign = "left";
        }
      });
  }

  async function syncEditorState(editor: any) {
    const data = (await editor.save()) as OutputData;
    savedDataRef.current = data;
    setSavedData(data);
    setContent(outputToText(data));
    tagEditableNodes();
  }

  function refreshActiveState() {
    try {
      const editor = editorRef.current;
      if (!editor || !editor.blocks) {
        return;
      }
      let bold = false;
      const editable = getEditable();
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (
        editable &&
        selection?.anchorNode &&
        editable.contains(selection.anchorNode) &&
        typeof document.queryCommandState === "function"
      ) {
        bold = document.queryCommandState("bold");
      }

      const index =
        typeof editor.blocks?.getCurrentBlockIndex === "function"
          ? editor.blocks.getCurrentBlockIndex()
          : 0;
      const current = savedDataRef.current.blocks[index];
      const listStyle = String(current?.data?.style || "");
      setActive({
        bold,
        paragraph: current?.type === "paragraph",
        heading: current?.type === "header",
        bulletList: current?.type === "list" && listStyle === "unordered",
        numberedList: current?.type === "list" && listStyle === "ordered",
      });
    } catch {
      // Avoid blocking editor startup if the API surface is not ready yet.
    }
  }

  useEffect(() => {
    if (!holderRef.current || editorRef.current) {
      return;
    }

    let mutationObserver: MutationObserver | null = null;
    let isMounted = true;

    void Promise.all([
      import("@editorjs/editorjs"),
      import("@editorjs/header"),
      import("@editorjs/list"),
      import("@editorjs/paragraph"),
    ]).then(async ([editorModule, headerModule, listModule, paragraphModule]) => {
      if (!isMounted || !holderRef.current) {
        return;
      }

      const EditorJS = editorModule.default;
      const Header = headerModule.default;
      const List = listModule.default;
      const Paragraph = paragraphModule.default;

      const editor = new EditorJS({
        holder: holderRef.current,
        autofocus: true,
        placeholder: "Start writing...",
        data: {
          blocks: [{ type: "paragraph", data: { text: "" } }],
        },
        tools: {
          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
          },
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List as any,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
        },
        async onReady() {
          tagEditableNodes();
          await syncEditorState(editor);
        },
        async onChange() {
          await syncEditorState(editor);
          refreshActiveState();
        },
      });

      editorRef.current = editor;
      (window as unknown as Record<string, unknown>).editor = editor;

      mutationObserver = new MutationObserver(() => {
        tagEditableNodes();
      });
      mutationObserver.observe(holderRef.current, {
        subtree: true,
        childList: true,
      });
    });

    return () => {
      isMounted = false;
      mutationObserver?.disconnect();
      const editor = editorRef.current;
      if (editor) {
        editor.destroy();
      }
      editorRef.current = null;
    };
  }, []);

  async function loadTemplate(filename: string) {
    try {
      const res = await fetch(`/templates/${filename}`);
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      const html = sanitizeHtml(await res.text());
      await editorRef.current?.blocks?.renderFromHTML?.(html);
      if (editorRef.current) {
        await syncEditorState(editorRef.current);
        refreshActiveState();
      }
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
  }

  async function convertCurrentBlock(
    type: "paragraph" | "header" | "list",
    data: Record<string, unknown>,
  ) {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    try {
      const currentIndex =
        typeof editor.blocks?.getCurrentBlockIndex === "function"
          ? editor.blocks.getCurrentBlockIndex()
          : 0;
      const block =
        typeof editor.blocks?.getBlockByIndex === "function"
          ? editor.blocks.getBlockByIndex(currentIndex)
          : null;
      if (!block) {
        editor.blocks.insert(type, data);
      } else {
        if (typeof editor.blocks?.convert === "function") {
          await editor.blocks.convert(block.id, type, data);
        } else {
          editor.blocks.insert(type, data);
        }
      }
      await syncEditorState(editor);
      refreshActiveState();
    } catch {
      alert("Unable to update the selected block.");
    }
  }

  function applyBold() {
    const editable = getEditable();
    if (!editable) {
      return;
    }
    editable.focus();
    if (typeof document.execCommand === "function") {
      document.execCommand("bold");
      refreshActiveState();
    }
  }

  function runDiagnostics() {
    const editor = editorRef.current;
    const editable = getEditable();
    if (!editor) {
      return;
    }
    setValidationResults(
      runEditorDiagnostics({
        editorName: "Editor.js",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: content,
          html: holderRef.current?.innerHTML || "",
          json: savedData,
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: active.bold,
          heading: active.heading,
          bulletList: active.bulletList,
          numberedList: active.numberedList,
        }),
      }),
    );
  }

  return (
    <EditorWorkspace
      title="Editor.js"
      description="Official block editor setup with Header/List/Paragraph tools, inline text formatting, and block conversion controls."
      toolDescription={EDITOR_BY_ID.codex.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.codex.githubRepoUrl}
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => editorRef.current?.blocks?.clear?.()}
            onError={(error) => alert(String(error))}
          />
          <button
            type="button"
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            onClick={runDiagnostics}
          >
            Run diagnostics
          </button>
        </>
      }
      statusPanel={
        <div className="space-y-3">
          <TrackChanges content={content} />
          {validationResults.length > 0 && (
            <ValidationStatus
              results={validationResults}
              onClear={() => setValidationResults([])}
            />
          )}
        </div>
      }
      sidePanel={
        <div className="space-y-4">
          <CommentTrack />
          <EditorIntegrationInfo editorName="Editor.js" />
        </div>
      }
    >
      <div className="h-full p-3">
        <p className="mb-2 text-xs text-slate-600 dark:text-slate-300">
          Editor.js is block-based: use these controls to convert the current block type and use inline selection tools for bold/italic.
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          <FormatToggleButton
            label="Bold"
            active={active.bold}
            onMouseDown={(event) => {
              event.preventDefault();
              applyBold();
            }}
          >
            <Bold size={16} />
          </FormatToggleButton>
          <FormatToggleButton
            label="Paragraph"
            active={active.paragraph}
            onMouseDown={(event) => {
              event.preventDefault();
              void convertCurrentBlock("paragraph", {});
            }}
          >
            <Pilcrow size={16} />
          </FormatToggleButton>
          <FormatToggleButton
            label="Heading"
            active={active.heading}
            onMouseDown={(event) => {
              event.preventDefault();
              void convertCurrentBlock("header", { level: 2 });
            }}
          >
            <Heading2 size={16} />
          </FormatToggleButton>
          <FormatToggleButton
            label="Bullet list"
            active={active.bulletList}
            onMouseDown={(event) => {
              event.preventDefault();
              void convertCurrentBlock("list", { style: "unordered", items: [""] });
            }}
          >
            <ListIcon size={16} />
          </FormatToggleButton>
          <FormatToggleButton
            label="Numbered list"
            active={active.numberedList}
            onMouseDown={(event) => {
              event.preventDefault();
              void convertCurrentBlock("list", { style: "ordered", items: [""] });
            }}
          >
            <ListOrdered size={16} />
          </FormatToggleButton>
        </div>
        <div
          id="codex-editor"
          data-testid="codex-editor"
          ref={holderRef}
          dir="ltr"
          className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-left text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
    </EditorWorkspace>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? CodexPage
    : dynamic(() => Promise.resolve(CodexPage), { ssr: false });
