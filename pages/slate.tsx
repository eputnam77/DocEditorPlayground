import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as SlateApi from "slate";
import { createEditor, Element as SlateElement, Node, Transforms } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { Bold, Heading2, Italic, List, ListOrdered } from "lucide-react";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import TemplateLoader from "../components/TemplateLoader";
import sanitizeHtml from "../utils/sanitize";
import ValidationStatus, {
  type ValidationResult,
} from "../components/ValidationStatus";
import CommentTrack from "../components/CommentTrack";
import TrackChanges from "../components/TrackChanges";
import { TEMPLATES } from "../utils/templates";
import { LIPSUM_PARAGRAPHS } from "../utils/lipsum";
import EditorWorkspace from "../components/EditorWorkspace";
import FormatToggleButton from "../components/FormatToggleButton";
import { EDITOR_BY_ID } from "../components/editorCatalog";
import { runEditorDiagnostics } from "../utils/editorDiagnostics";

type CustomText = { text: string; bold?: boolean; italic?: boolean };
type CustomElement = {
  type: "paragraph" | "heading-two" | "bulleted-list" | "numbered-list" | "list-item";
  children: CustomText[];
};

const LIST_TYPES: CustomElement["type"][] = ["bulleted-list", "numbered-list"];

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
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
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
    <div className="mb-3 flex flex-wrap gap-2">
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
      <FormatToggleButton
        label="Heading"
        active={isBlockActive(editor, "heading-two")}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, "heading-two");
        }}
      >
        <Heading2 size={16} />
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
        if (node.type === "heading-two") {
          return `<h2>${Node.string(node)}</h2>`;
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

  async function loadTemplate(filename: string) {
    try {
      const response = await fetch(`/templates/${filename}`);
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      const html = sanitizeHtml(await response.text());
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = (doc.body.textContent || "").trim();
      const nextValue: CustomElement[] = [
        {
          type: "paragraph",
          children: [{ text }],
        },
      ];
      setValue(nextValue);
      setContent(text);
    } catch {
      alert(`Failed to load template: ${filename}`);
    }
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
    <EditorWorkspace
      title="Slate editor"
      description="Official Slate rich-text setup with custom schema rendering and active-state toolbar toggles."
      toolDescription={EDITOR_BY_ID.slate.toolDescription}
      toolRepoUrl={EDITOR_BY_ID.slate.githubRepoUrl}
      controls={
        <>
          <TemplateLoader
            templates={TEMPLATES}
            onLoad={loadTemplate}
            onClear={() => {
              setValue(INITIAL_VALUE);
              setContent("");
            }}
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
          <EditorIntegrationInfo editorName="Slate" />
        </div>
      }
    >
      <div className="h-full p-3">
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
            className="h-[58vh] w-full rounded-md border border-slate-300 bg-white p-3 text-left text-slate-900 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            style={{
              direction: "ltr",
              unicodeBidi: "plaintext",
              textAlign: "left",
            }}
          />
        </Slate>
      </div>
    </EditorWorkspace>
  );
}

export default
  typeof process !== "undefined" && process.env.NODE_ENV === "test"
    ? SlatePage
    : dynamic(() => Promise.resolve(SlatePage), { ssr: false });
