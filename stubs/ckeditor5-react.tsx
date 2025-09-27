import React, { useRef, useEffect } from 'react';

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

  const exec = (command: string) => document.execCommand(command);

  const handleInput = () => {
    onChange?.({}, editor);
  };

  return (
    <div className="ck-stub">
      <div role="toolbar">
        {toolbarItems.includes('bold') && (
          <button type="button" aria-label="Bold" onClick={() => exec('bold')}>
            Bold
          </button>
        )}
        {toolbarItems.includes('italic') && (
          <button type="button" aria-label="Italic" onClick={() => exec('italic')}>
            Italic
          </button>
        )}
        {toolbarItems.includes('underline') && (
          <button
            type="button"
            aria-label="Underline"
            onClick={() => exec('underline')}
          >
            Underline
          </button>
        )}
      </div>
      <div
        ref={ref}
        role="textbox"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
};

export default CKEditor;
