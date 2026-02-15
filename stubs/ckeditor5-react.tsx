import React, { useRef, useEffect } from 'react';
import { runContentEditableCommand } from '../utils/contentEditableCommands';

interface Editor {
  setData(data: string): void;
  getData(): string;
}

interface CKEditorProps {
  editor?: unknown;
  data?: string;
  config?: { toolbar?: { items?: string[] } };
  onReady?(editor: Editor): void;
  onChange?(evt: unknown, editor: Editor): void;
}

export const CKEditor: React.FC<CKEditorProps> = ({
  data = '',
  config,
  onReady,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const editor: Editor = {
    setData(d: string) {
      if (ref.current) {
        ref.current.innerHTML = d;
        onChange?.({}, editor);
      }
    },
    getData() {
      return ref.current?.innerHTML ?? '';
    },
  };

  useEffect(() => {
    onReady?.(editor);
  }, []);

  const toolbarItems = config?.toolbar?.items ?? [];

  const exec = (command: string, value?: string) =>
    runContentEditableCommand({
      command,
      value,
      root: ref.current,
    });

  const handleInput = () => {
    onChange?.({}, editor);
  };

  return (
    <div className="ck-stub">
      <div role="toolbar">
        {toolbarItems.includes('bold') && (
          <button
            type="button"
            aria-label="Bold"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('bold');
            }}
          >
            Bold
          </button>
        )}
        {toolbarItems.includes('italic') && (
          <button
            type="button"
            aria-label="Italic"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('italic');
            }}
          >
            Italic
          </button>
        )}
        {toolbarItems.includes('underline') && (
          <button
            type="button"
            aria-label="Underline"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('underline');
            }}
          >
            Underline
          </button>
        )}
        {toolbarItems.includes('heading') && (
          <button
            type="button"
            aria-label="Heading"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('formatBlock', 'h2');
            }}
          >
            Heading
          </button>
        )}
        {toolbarItems.includes('paragraph') && (
          <button
            type="button"
            aria-label="Paragraph"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('insertParagraph');
            }}
          >
            Paragraph
          </button>
        )}
        {toolbarItems.includes('bulletedList') && (
          <button
            type="button"
            aria-label="Bullet List"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('insertUnorderedList');
            }}
          >
            Bullet list
          </button>
        )}
        {toolbarItems.includes('numberedList') && (
          <button
            type="button"
            aria-label="Numbered List"
            onMouseDown={(e) => {
              e.preventDefault();
              exec('insertOrderedList');
            }}
          >
            Numbered list
          </button>
        )}
      </div>
      <div
        ref={ref}
        role="textbox"
        data-testid="ckeditor-editable"
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
};

export default CKEditor;
