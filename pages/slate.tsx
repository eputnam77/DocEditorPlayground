import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as SlateApi from "slate";
import { createEditor, Element as SlateElement, Node, Transforms } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Quote } from "lucide-react";
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

type CustomText = { text: string; bold?: boolean; italic?: boolean };
/**
 * Slate has no built-in schema - these are the only node types that exist here
 * because this file declares them. Headings one through three and block quotes
 * are included so an imported template keeps its structure instead of
 * collapsing into paragraphs.
 */
type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "block-quote"
  | "bulleted-list"
  | "numbered-list"
  | "list-item";
type CustomElement = {
  type: CustomElementType;
  children: Array<CustomText | CustomElement>;
};

const LIST_TYPES: CustomElementType[] = ["bulleted-list", "numbered-list"];

const INITIAL_VALUE: CustomElement[] = LIPSUM_PARAGRAPHS.map((text) => ({
  type: "paragraph",
  children: [{ text }],
}));

function isMarkActive(editor: any, format: "bold" | "italic"): boolean {
  try {
    const marks = SlateApi.Editor.marks(editor) as Record<string, unknown> | null;
    return marks ? Boolean(marks[format]) : false;
  } catch {
    if (typeof document !== "undefined" && typeof document.queryCommandState === "function") {
      return document.queryCommandState(format);
    }
    return false;
  }
}

function toggleMark(editor: any, format: "bold" | "italic") {
  try {
    const active = isMarkActive(editor, format);
    if (active) {
      SlateApi.Editor.removeMark(editor, format);
    } else {
      SlateApi.Editor.addMark(editor, format, true);
    }
  } catch {
    if (typeof editor?.exec === "function") {
      editor.exec(format);
    }
  }
}

function isBlockActive(editor: any, format: CustomElement["type"]): boolean {
  try {
    const { selection } = editor;
    if (!selection) {
      return false;
    }
    const [match] = Array.from(
      SlateApi.Editor.nodes(editor, {
        at: selection,
        match: (node) =>
          !SlateApi.Editor.isEditor(node) &&
          SlateElement.isElement(node) &&
          node.type === format,
      }),
    );
    return Boolean(match);
  } catch {
    return false;
  }
}

function toggleBlock(editor: any, format: CustomElement["type"]) {
  try {
    const isList = LIST_TYPES.includes(format);
    const isActive = isBlockActive(editor, format);

    Transforms.unwrapNodes(editor, {
      match: (node) =>
        !SlateApi.Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        LIST_TYPES.includes(node.type as CustomElement["type"]),
      split: true,
    });

    Transforms.setNodes(
      editor,
      {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
      } as Partial<CustomElement>,
    );

    if (!isActive && isList) {
      const block: CustomElement = {
        type: format,
        children: [{ text: "" }],
      };
      Transforms.wrapNodes(editor, block);
    }
  } catch {
    if (typeof editor?.exec === "function") {
      if (format === "bulleted-list") {
        editor.exec("insertUnorderedList");
      } else if (format === "numbered-list") {
        editor.exec("insertOrderedList");
      } else if (format === "heading-two") {
        editor.exec("formatBlock", "h2");
      }
    }
  }
}

const HTML_BLOCK_MAP: Record<string, CustomElementType> = {
  H1: "heading-one",
  H2: "heading-two",
  H3: "heading-three",
  H4: "heading-three",
  H5: "heading-three",
  H6: "heading-three",
  BLOCKQUOTE: "block-quote",
  UL: "bulleted-list",
  OL: "numbered-list",
  LI: "list-item",
  P: "paragraph",
  PRE: "paragraph",
};

// DOM node types as plain numbers: Slate exports a `Node` of its own, which
// shadows the global DOM `Node` in this module, so `Node.TEXT_NODE` here would
// silently be undefined.
const DOM_ELEMENT_NODE = 1;
const DOM_TEXT_NODE = 3;

/**
 * Convert template HTML into this file's node types.
 *
 * Slate provides no HTML deserializer, so one has to be written per schema.
 * The previous version flattened the entire template into a single paragraph,
 * which discarded every heading and list in the imported document.
 */
function deserializeHtml(html: string): CustomElement[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: CustomElement[] = [];

  function textOf(node: globalThis.Node, marks: Partial<CustomText> = {}): CustomText[] {
    if (node.nodeType === DOM_TEXT_NODE) {
      const text = (node.textContent || "").replace(/\s+/g, " ");
      return text ? [{ text, ...marks }] : [];
    }
    if (node.nodeType !== DOM_ELEMENT_NODE) {
      return [];
    }
    const element = node as HTMLElement;
    const nextMarks: Partial<CustomText> = { ...marks };
    if (element.tagName === "STRONG" || element.tagName === "B") {
      nextMarks.bold = true;
    }
    if (element.tagName === "EM" || element.tagName === "I") {
      nextMarks.italic = true;
    }
    return Array.from(element.childNodes).flatMap((child) => textOf(child, nextMarks));
  }

  function push(type: CustomElementType, node: globalThis.Node) {
    const children = textOf(node);
    if (children.length > 0) {
      blocks.push({ type, children });
    }
  }


  function walk(node: globalThis.Node) {
    if (node.nodeType === DOM_TEXT_NODE) {
      const text = (node.textContent || "").trim();
      if (text) {
        blocks.push({ type: "paragraph", children: [{ text }] });
      }
      return;
    }
    if (node.nodeType !== DOM_ELEMENT_NODE) {
      return;
    }
    const element = node as HTMLElement;
    const mapped = HTML_BLOCK_MAP[element.tagName];

    if (mapped === "bulleted-list" || mapped === "numbered-list") {
      // List items are children of the list, not siblings of it - a flat list
      // fails Slate's normalization and the document comes out empty.
      const items: CustomElement[] = [];
      Array.from(element.children).forEach((child) => {
        if (child.tagName === "LI") {
          const children = textOf(child);
          items.push({
            type: "list-item",
            children: children.length > 0 ? children : [{ text: "" }],
          });
        }
      });
      if (items.length > 0) {
        blocks.push({ type: mapped, children: items });
      }
      return;
    }

    if (mapped && mapped !== "list-item") {
      push(mapped, element);
      return;
    }

    Array.from(element.childNodes).forEach(walk);
  }

  Array.from(doc.body.childNodes).forEach(walk);

  return blocks.length > 0
    ? blocks
    : [{ type: "paragraph", children: [{ text: "" }] }];
}

function Element({
  attributes,
  children,
  element,
}: {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  element: CustomElement;
}) {
  switch (element.type) {
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({
  attributes,
  children,
  leaf,
}: {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  leaf: CustomText;
}) {
  let rendered = children;

  if (leaf.bold) {
    rendered = <strong>{rendered}</strong>;
  }
  if (leaf.italic) {
    rendered = <em>{rendered}</em>;
  }

  return <span {...attributes}>{rendered}</span>;
}

function Toolbar() {
  const editor = useSlate();

  return (
    <div className="dep-toolbar mb-3">
      <span className="dep-toolbar__label">Marks</span>
      <FormatToggleButton
        label="Bold"
        active={isMarkActive(editor, "bold")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "bold");
        }}
      >
        <Bold size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Italic"
        active={isMarkActive(editor, "italic")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "italic");
        }}
      >
        <Italic size={16} />
      </FormatToggleButton>
      <span aria-hidden="true" className="dep-toolbar__sep" />
      <span className="dep-toolbar__label">Blocks</span>
      <FormatToggleButton
        label="Heading 1"
        active={isBlockActive(editor, "heading-one")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "heading-one");
        }}
      >
        <Heading1 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Heading 2"
        active={isBlockActive(editor, "heading-two")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "heading-two");
        }}
      >
        <Heading2 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Heading 3"
        active={isBlockActive(editor, "heading-three")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "heading-three");
        }}
      >
        <Heading3 size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Block quote"
        active={isBlockActive(editor, "block-quote")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "block-quote");
        }}
      >
        <Quote size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Bullet List"
        active={isBlockActive(editor, "bulleted-list")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "bulleted-list");
        }}
      >
        <List size={16} />
      </FormatToggleButton>
      <FormatToggleButton
        label="Numbered List"
        active={isBlockActive(editor, "numbered-list")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "numbered-list");
        }}
      >
        <ListOrdered size={16} />
      </FormatToggleButton>
    </div>
  );
}

function SlatePage() {
  const [value, setValue] = useState<CustomElement[]>(INITIAL_VALUE);
  const [content, setContent] = useState(LIPSUM_PARAGRAPHS.join(" "));
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  function serializeToHtml(nodes: CustomElement[]): string {
    return nodes
      .map((node) => {
        if (!SlateElement.isElement(node)) {
          return "";
        }
        if (node.type === "heading-one") {
          return `<h1>${Node.string(node)}</h1>`;
        }
        if (node.type === "heading-two") {
          return `<h2>${Node.string(node)}</h2>`;
        }
        if (node.type === "heading-three") {
          return `<h3>${Node.string(node)}</h3>`;
        }
        if (node.type === "block-quote") {
          return `<blockquote>${Node.string(node)}</blockquote>`;
        }
        if (node.type === "bulleted-list") {
          const items = node.children
            .map((child) => `<li>${Node.string(child as unknown as Node)}</li>`)
            .join("");
          return `<ul>${items}</ul>`;
        }
        if (node.type === "numbered-list") {
          const items = node.children
            .map((child) => `<li>${Node.string(child as unknown as Node)}</li>`)
            .join("");
          return `<ol>${items}</ol>`;
        }
        if (node.type === "list-item") {
          return `<li>${Node.string(node)}</li>`;
        }
        return `<p>${Node.string(node)}</p>`;
      })
      .join("");
  }

  /**
   * Replace the whole document.
   *
   * Assigning `editor.children` leaves slate-react's rendered tree stale, so
   * the swap has to go through transforms: remove every top-level node, then
   * insert the new ones. onChange then updates the mirrored React state.
   */
  function replaceDocument(nextValue: CustomElement[]) {
    Transforms.deselect(editor);
    // Insert first, then drop the old tail: emptying the document entirely
    // makes Slate normalize in an empty state, and the insert that followed
    // was discarded.
    const previousLength = editor.children.length;
    Transforms.insertNodes(editor, nextValue as never, { at: [0] });
    for (let i = 0; i < previousLength; i++) {
      Transforms.removeNodes(editor, { at: [nextValue.length] });
    }
    setValue(editor.children as CustomElement[]);
    setContent(
      (editor.children as CustomElement[])
        .map((node) => Node.string(node as unknown as Node))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  function loadTemplate(filename: string) {
    const html = sanitizeHtml(getTemplateHtml(filename));
    replaceDocument(deserializeHtml(html));
  }

  function runDiagnostics() {
    const editable = document.querySelector("[data-testid='slate-editor']") as HTMLElement | null;
    setValidationResults(
      runEditorDiagnostics({
        editorName: "Slate",
        capabilities: {
          heading: true,
          bulletList: true,
          numberedList: true,
        },
        getContent: () => ({
          text: content,
          html: serializeToHtml(value),
          json: value,
        }),
        getDirection: () =>
          editable ? window.getComputedStyle(editable).direction : null,
        getSelectionFormatState: () => ({
          bold: isMarkActive(editor, "bold"),
          italic: isMarkActive(editor, "italic"),
          heading: isBlockActive(editor, "heading-two"),
          bulletList: isBlockActive(editor, "bulleted-list"),
          numberedList: isBlockActive(editor, "numbered-list"),
        }),
      }),
    );
  }

  return (
    <>
      <Head>
        <title>Slate · Document Editor Playground</title>
      </Head>
      <EditorWorkspace
      editorId="slate"
      title="Slate"
      description="A toolkit rather than an editor. Every node type, every renderer, and the HTML importer used by the template picker are written in this page's source - Slate supplies none of them."
      toolDescription={EDITOR_BY_ID.slate.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.slate.githubRepoUrl}
      surfaceNote={
        <>
          <strong>Look for:</strong> this page declares exactly eight node types, so
          those are the only things the document can contain. Loading a template runs a
          hand-written HTML deserializer - anything it does not recognize is dropped,
          because with Slate there is no default behavior to fall back on.
        </>
      }
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => replaceDocument(INITIAL_VALUE)}
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
            editorName="Slate"
            nativeFormat={EDITOR_BY_ID.slate.nativeFormat}
            available={["json", "html"]}
            getters={{
              json: () => JSON.stringify(value),
              html: () => serializeToHtml(value),
            }}
          />
          <TrackChanges content={content} />
        </div>
      }
      sidePanel={
        <div className="space-y-5">
          <EditorProfile editorId="slate" />
          <hr className="dep-rule" />
          <CommentTrack />
        </div>
      }
    >
      <div className="dep-doc h-full p-3">
        <Slate
          editor={editor}
          value={value}
          onChange={(nextValue) => {
            const normalizedValue = Array.isArray(nextValue)
              ? (nextValue as CustomElement[])
              : ((editor as any).children as CustomElement[]) || INITIAL_VALUE;
            setValue(normalizedValue);
            setContent(
              normalizedValue
                .map((node) => Node.string(node as unknown as Node))
                .join(" ")
                .replace(/\s+/g, " ")
                .trim(),
            );
          }}
        >
          <Toolbar />
          <Editable
            data-testid="slate-editor"
            dir="ltr"
            renderElement={(props) => <Element {...props} />}
            renderLeaf={(props) => <Leaf {...props} />}
            className="dep-sheet h-[58vh] w-full overflow-auto p-4 outline-none"
            style={{
              direction: "ltr",
              unicodeBidi: "plaintext",
              textAlign: "left",
            }}
          />
        </Slate>
      </div>
      </EditorWorkspace>
    </>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? SlatePage
    : dynamic(() => Promise.resolve(SlatePage), { ssr: false });
