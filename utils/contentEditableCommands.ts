function getSelectionRange(root: HTMLElement | null): Range | null {
  if (!root || typeof window === "undefined") {
    return null;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const anchorNode = selection.anchorNode;
  if (!anchorNode || !root.contains(anchorNode)) {
    return null;
  }
  return range;
}

function collapseRangeAtEnd(selection: Selection, node: Node): void {
  const next = document.createRange();
  next.selectNodeContents(node);
  next.collapse(false);
  selection.removeAllRanges();
  selection.addRange(next);
}

function insertList(root: HTMLElement | null, ordered: boolean): boolean {
  const range = getSelectionRange(root);
  if (!range || typeof window === "undefined") {
    return false;
  }
  const selection = window.getSelection();
  if (!selection) {
    return false;
  }
  const text = range.toString().trim();
  const list = document.createElement(ordered ? "ol" : "ul");
  const item = document.createElement("li");
  item.innerHTML = text.length > 0 ? text : "<br>";
  list.appendChild(item);
  range.deleteContents();
  range.insertNode(list);
  collapseRangeAtEnd(selection, item);
  return true;
}

function insertParagraph(root: HTMLElement | null): boolean {
  const range = getSelectionRange(root);
  if (!range || typeof window === "undefined") {
    return false;
  }
  const selection = window.getSelection();
  if (!selection) {
    return false;
  }
  const paragraph = document.createElement("p");
  paragraph.innerHTML = "<br>";
  range.insertNode(paragraph);
  collapseRangeAtEnd(selection, paragraph);
  return true;
}

function formatBlock(root: HTMLElement | null, value?: string): boolean {
  const range = getSelectionRange(root);
  if (!range || !value || typeof window === "undefined") {
    return false;
  }
  const selection = window.getSelection();
  if (!selection) {
    return false;
  }
  const normalized = value.replace(/[<>]/g, "").trim().toLowerCase();
  const tagName = normalized === "p" ? "p" : normalized;
  const block = document.createElement(tagName);
  const text = range.toString();
  block.innerHTML = text.length > 0 ? text : "<br>";
  range.deleteContents();
  range.insertNode(block);
  collapseRangeAtEnd(selection, block);
  return true;
}

export function runContentEditableCommand({
  command,
  value,
  root,
}: {
  command: string;
  value?: string;
  root: HTMLElement | null;
}): boolean {
  if (!root || typeof document === "undefined") {
    return false;
  }
  root.focus();

  const hasExec = typeof document.execCommand === "function";
  if (hasExec) {
    const ok = document.execCommand(command, false, value);
    if (ok) {
      return true;
    }
  }

  if (command === "insertUnorderedList") {
    return insertList(root, false);
  }
  if (command === "insertOrderedList") {
    return insertList(root, true);
  }
  if (command === "insertParagraph") {
    return insertParagraph(root);
  }
  if (command === "formatBlock") {
    return formatBlock(root, value);
  }

  return false;
}
