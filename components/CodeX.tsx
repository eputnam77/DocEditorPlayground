import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

interface CodeXProps {
  value: string; // Serialized JSON string of Editor.js data
  onChange: (val: string) => void;
  readOnly?: boolean;
}

const DEFAULT_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "",
      },
    },
  ],
  version: "2.29.1",
};

const CodeX: React.FC<CodeXProps> = ({ value, onChange, readOnly = false }) => {
  const ejInstance = useRef<EditorJS | null>(null);
  const holder = useRef<HTMLDivElement | null>(null);

  // Initialize EditorJS instance on mount
  useEffect(() => {
    if (!holder.current) return;

    ejInstance.current = new EditorJS({
      holder: holder.current,
      readOnly,
      tools: {
        header: Header,
        list: List,
        paragraph: Paragraph,
        // Add more plugins here
      },
      data: value ? JSON.parse(value) : DEFAULT_DATA,
      onChange: async () => {
        if (!ejInstance.current) return;
        const output = await ejInstance.current.save();
        onChange(JSON.stringify(output));
      },
      autofocus: true,
      minHeight: 200,
    });

    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === "function") {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
    // Only on mount/unmount!
    // eslint-disable-next-line
  }, []);

  // If value changes from outside, update editor data (rarely needed)
  useEffect(() => {
    if (ejInstance.current && value) {
      ejInstance.current.render(JSON.parse(value));
    }
  }, [value]);

  return (
    <div className="border rounded bg-white dark:bg-zinc-900 min-h-[200px] p-2">
      <div ref={holder} />
    </div>
  );
};

export default CodeX;
