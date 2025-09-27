import React, { useRef, useImperativeHandle, forwardRef } from 'react';

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
            if (divRef.current) {
              divRef.current.innerHTML += html;
              onChange?.();
            }
          } else {
            document.execCommand(command);
          }
        },
      };
    },
  }));

  const handleInput = () => {
    onChange?.();
  };

  const insertTable = () => {
    const instance = {
      rowCount: 2,
      columnCount: 2,
    };
    let html = '<table><tbody>';
    for (let r = 0; r < instance.rowCount; r++) {
      html += '<tr>';
      for (let c = 0; c < instance.columnCount; c++) {
        html += '<td></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    if (divRef.current) {
      divRef.current.innerHTML += html;
      onChange?.();
    }
  };

  return (
    <div className="toastui-editor-stub">
      <div role="toolbar">
        <button type="button" aria-label="Bold" onClick={() => document.execCommand('bold')}>
          Bold
        </button>
        <button type="button" aria-label="Table" onClick={insertTable}>
          Table
        </button>
      </div>
      <div
        ref={divRef}
        className="toastui-editor-contents"
        data-testid="toast-editor"
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

