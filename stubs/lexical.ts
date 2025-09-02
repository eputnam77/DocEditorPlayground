export const FORMAT_TEXT_COMMAND = 'format_text';
export const INSERT_UNORDERED_LIST_COMMAND = 'insert_unordered_list';
export const INSERT_ORDERED_LIST_COMMAND = 'insert_ordered_list';
export const UNDO_COMMAND = 'undo';
export const REDO_COMMAND = 'redo';

export function $getRoot() {
  const el = document.getElementById('lexical-editor');
  return {
    getTextContent: () => (el ? el.textContent || '' : ''),
  };
}
