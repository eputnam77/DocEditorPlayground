import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { runContentEditableCommand } from '../utils/contentEditableCommands';

export interface EditorProps {
  initialValue?: string;
  height?: string;
  previewStyle?: string;
  plugins?: any[];
  onChange?(): void;
  usageStatistics?: boolean;
}

export interface EditorHandle {
  getInstance(): {
    getHTML(): string;
    setHTML(html: string): void;
    exec(command: string, data?: any): void;
  };
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ initialValue = '', onChange }, ref) => {
  const divRef = useRef<HTMLDivElement>(null);

  const runCommand = (command: string, data?: any) => {
    if (!divRef.current) {
      return;
    }
    if (command === 'addTable') {
      const rows = data?.rowCount ?? 2;
      const cols = data?.columnCount ?? 2;
      let html = '<table><tbody>';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
          html += '<td></td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      divRef.current.innerHTML += html;
      onChange?.();
      return;
    }
    if (command === 'heading') {
      runContentEditableCommand({
        command: 'formatBlock',
        value: 'h2',
        root: divRef.current,
      });
      onChange?.();
      return;
    }
    runContentEditableCommand({
      command,
      root: divRef.current,
    });
    onChange?.();
  };

  useImperativeHandle(ref, () => ({
    getInstance() {
      return {
        getHTML() {
          return divRef.current?.innerHTML ?? '';
        },
        setHTML(html: string) {
          if (divRef.current) {
            divRef.current.innerHTML = html;
            onChange?.();
          }
        },
        exec(command: string, data?: any) {
          runCommand(command, data);
        },
      };
    },
  }));

  const handleInput = () => {
    onChange?.();
  };

  return (
    <div className="toastui-editor-stub">
      <div role="toolbar" className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          aria-label="Bold"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('bold');
          }}
        >
          Bold
        </button>
        <button
          type="button"
          aria-label="Italic"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('italic');
          }}
        >
          Italic
        </button>
        <button
          type="button"
          aria-label="Heading"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('heading');
          }}
        >
          Heading
        </button>
        <button
          type="button"
          aria-label="Bullet List"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertUnorderedList');
          }}
        >
          Bullet list
        </button>
        <button
          type="button"
          aria-label="Numbered List"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertOrderedList');
          }}
        >
          Numbered list
        </button>
        <button
          type="button"
          aria-label="Paragraph"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('insertParagraph');
          }}
        >
          Paragraph
        </button>
        <button
          type="button"
          aria-label="Table"
          onMouseDown={(e) => {
            e.preventDefault();
            runCommand('addTable', { rowCount: 2, columnCount: 2 });
          }}
        >
          Table
        </button>
      </div>
      <div
        ref={divRef}
        className="toastui-editor-contents"
        data-testid="toast-editor"
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
    </div>
  );
}) as unknown as React.FC<EditorProps & { ref?: React.Ref<EditorHandle> }>;

export { Editor };
export default Editor;
export type Editor = EditorHandle;

