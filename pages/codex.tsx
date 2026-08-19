import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Bold,
  Heading2,
  List as ListIcon,
  ListOrdered,
  Pilcrow,
} from "lucide-react";
import Head from "next/head";
import EditorProfile from "../components/EditorProfile";
import EditorOutputPanel from "../components/EditorOutputPanel";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { TEMPLATES, getTemplateHtml } from "../utils/templates";
import { LIPSUM_PARAGRAPHS } from "../utils/lipsum";
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

/**
 * Convert template HTML into Editor.js blocks.
 *
 * Editor.js's own `blocks.renderFromHTML` only understands paragraphs, so a
 * template imported through it arrived as a single line with every heading and
 * list discarded. Mapping the HTML onto the block tools registered below keeps
 * the document's structure - and makes the block model visible, since anything
 * without a matching tool genuinely has nowhere to go.
 */
function htmlToBlocks(html: string): OutputData {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: OutputData["blocks"] = [];

  const inlineHtml = (element: Element) =>
    element.innerHTML.replace(/\s+/g, " ").trim();

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      if (text) {
        blocks.push({ type: "paragraph", data: { text } });
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const element = node as HTMLElement;

    switch (element.tagName) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
        blocks.push({
          type: "header",
          data: {
            text: inlineHtml(element),
            level: Math.min(4, Number(element.tagName.slice(1))),
          },
        });
        return;
      case "UL":
      case "OL":
        blocks.push({
          type: "list",
          data: {
            style: element.tagName === "OL" ? "ordered" : "unordered",
            items: Array.from(element.querySelectorAll(":scope > li")).map((li) => ({
              content: inlineHtml(li),
              items: [],
            })),
          },
        });
        return;
      case "P":
      case "BLOCKQUOTE":
      case "PRE":
        blocks.push({ type: "paragraph", data: { text: inlineHtml(element) } });
        return;
      default:
        Array.from(element.childNodes).forEach(walk);
    }
  }

  Array.from(doc.body.childNodes).forEach(walk);

  return {
    blocks: blocks.length > 0 ? blocks : [{ type: "paragraph", data: { text: "" } }],
  };
}

const INITIAL_BLOCKS: OutputData = {
  blocks: LIPSUM_PARAGRAPHS.map((text) => ({ type: "paragraph", data: { text } })),
};

function CodexPage() {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const savedDataRef = useRef<OutputData>(INITIAL_BLOCKS);
  const [savedData, setSavedData] = useState<OutputData>(INITIAL_BLOCKS);
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
        data: INITIAL_BLOCKS,
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
    // Compiled into the bundle - see utils/templateContent.ts.
    const html = sanitizeHtml(getTemplateHtml(filename));
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    await editor.blocks?.render?.(htmlToBlocks(html));
    await syncEditorState(editor);
    refreshActiveState();
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
    <>
      <Head>
        <title>Editor.js · Document Editor Playground</title>
      </Head>
      <EditorWorkspace
      editorId="codex"
      title="Editor.js"
      description="A block editor, not an HTML editor. The document is an array of typed blocks, and the JSON tab below is the real document - the HTML is generated for display only."
      toolDescription={EDITOR_BY_ID.codex.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.codex.githubRepoUrl}
      surfaceNote={
        <>
          <strong>Look for:</strong> click into a paragraph and a{" "}
          <span aria-hidden="true">⊕</span> plus a drag handle appear beside it -
          Editor.js works one block at a time. Convert a block with the buttons below,
          then open the <em>JSON</em> tab in the output panel: that array of typed blocks
          <em> is</em> the document. There is no HTML source to inspect.
        </>
      }
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => editorRef.current?.blocks?.clear?.()}
            onError={(error) => alert(`Could not load template: ${String(error)}`)}
          />
          <button
            type="button"
            className="dep-btn dep-btn--mark"
            onClick={runDiagnostics}
          >
            Run diagnostics
          </button>
        </>
      }
      diagnostics={
        <ValidationStatus
          results={validationResults}
          onClear={() => setValidationResults([])}
        />
      }
      statusPanel={
        <div className="space-y-3">
          <EditorOutputPanel
            editorName="Editor.js"
            nativeFormat={EDITOR_BY_ID.codex.nativeFormat}
            available={["json", "html"]}
            getters={{
              json: () => JSON.stringify(savedData),
              html: () => holderRef.current?.innerHTML ?? "",
            }}
          />
          <TrackChanges content={content} />
        </div>
      }
      sidePanel={
        <div className="space-y-5">
          <EditorProfile editorId="codex" />
          <hr className="dep-rule" />
          <CommentTrack />
        </div>
      }
    >
      <div className="dep-doc h-full p-3">
        <div className="dep-toolbar mb-3">
          <span className="dep-toolbar__label">Block</span>
          <FormatToggleButton
            label="Bold"
            shortcut="Ctrl+B"
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
            showLabel
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
            showLabel
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
            showLabel
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
            showLabel
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
          className="dep-sheet h-[58vh] w-full overflow-auto p-3 outline-none"
        />
      </div>
      </EditorWorkspace>
    </>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? CodexPage
    : dynamic(() => Promise.resolve(CodexPage), { ssr: false });
