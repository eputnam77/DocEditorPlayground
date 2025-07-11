// components/EditorToolbar.tsx

export default function EditorToolbar() {
  return (
    <div className="flex flex-wrap gap-2 items-center bg-white border-b border-gray-200 px-4 py-2 rounded-t-lg shadow-sm sticky top-0 z-10">
      {/* ...toolbar controls as before... */}
      <select className="border rounded px-2 py-1 mr-2" title="Heading">
        <option>Normal</option>
        <option>Heading 1</option>
        <option>Heading 2</option>
        <option>Heading 3</option>
      </select>
      {/* Add more buttons here as before */}
    </div>
  );
}

