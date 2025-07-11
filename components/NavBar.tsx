import Link from 'next/link';

const editors = [
  { name: "TipTap", path: "/editors/tiptap" },
  { name: "Toast Editor", path: "/editors/toast" },
  { name: "CodeX", path: "/editors/codex" },
  { name: "Quill", path: "/editors/quill" },
  { name: "Slate", path: "/editors/slate" },
  { name: "Lexical", path: "/editors/lexical" },
  { name: "CKEditor 5", path: "/editors/ckeditor" },
];

export default function NavBar() {
  return (
    <nav className="w-full flex flex-wrap gap-4 justify-center">
      {editors.map(editor => (
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
