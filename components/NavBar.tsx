import Link from "next/link";

const editors = [
  { name: "TipTap", path: "/tiptap" },
  { name: "Toast Editor", path: "/toast" },
  { name: "CodeX", path: "/codex" },
  { name: "Quill", path: "/quill" },
  { name: "Slate", path: "/slate" },
  { name: "Lexical", path: "/lexical" },
  { name: "CKEditor 5", path: "/ckeditor" },
];

export default function NavBar() {
  return (
    <nav className="w-full flex flex-wrap gap-4 justify-center">
      {editors.map((editor) => (
        <Link
          key={editor.name}
          href={editor.path}
          className="rounded-xl bg-gradient-to-r from-blue-400 to-violet-500 text-white px-6 py-3 font-semibold shadow-md hover:scale-105 hover:from-emerald-400 transition-all"
        >
          {editor.name}
        </Link>
      ))}
    </nav>
  );
}
