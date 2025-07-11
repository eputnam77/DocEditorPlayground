import Link from 'next/link';

/** Simple navigation links to all editor pages */
export default function NavBar() {
  const pages = ['tiptap', 'toast', 'codex', 'quill', 'slate', 'lexical', 'ckeditor'];
  return (
    <nav>
      <ul style={{ display: 'flex', gap: '0.5rem' }}>
        {pages.map((p) => (
          <li key={p}>
            <Link href={`/${p}`}>{p}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
