import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PluginManager from "../components/PluginManager";
import TemplateLoader from "../components/TemplateLoader";
import EditorIntegrationInfo from "../components/EditorIntegrationInfo";
import NavBar from "../components/NavBar";

export interface TiptapPageProps {
  /** Additional TipTap extensions to load */
  extensions?: any[];
}

export default function TiptapPage({ extensions = [] }: TiptapPageProps) {
  const [content, setContent] = useState("");
  const editor = useEditor({
    extensions: [StarterKit, ...extensions],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  return (
    <div>
      <NavBar />
      <h1>TipTap Editor</h1>
      <EditorContent editor={editor} data-testid="tiptap-editor" />
      <PluginManager plugins={["bold", "italic"]} />
      <TemplateLoader
        onLoad={(tpl) => setContent(JSON.stringify(tpl, null, 2))}
      />
      <EditorIntegrationInfo editorName="tiptap" />
    </div>
  );
}
