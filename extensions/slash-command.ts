// slash-command.ts
import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";

export interface SlashCommandItem {
  /** Text shown in the menu, and the fallback insertion for a custom item. */
  label: string;
  /** One-line hint shown beside the label. */
  hint?: string;
  /** Extra words that should also match this item. */
  keywords?: string;
  /**
   * Apply the item to a command chain that has already focused the editor and
   * deleted the typed "/query". Return the chain; the extension runs it.
   *
   * It has to be one chain: deleting the range in a separate chain shifts every
   * position after it, and the command that followed was applied to stale
   * positions - which left the query text behind in the new block.
   */
  apply?: (chain: any) => any;
}

export interface SlashCommandOptions {
  // The suggestion configuration excluding the editor instance
  suggestion: Omit<SuggestionOptions<SlashCommandItem>, "editor">;
}

/**
 * The commands offered by the slash menu.
 *
 * Exported so the page and its tests can assert on the menu without rendering
 * a full editor.
 */
export const SLASH_COMMAND_ITEMS: SlashCommandItem[] = [
  {
    label: "Heading 1",
    hint: "Top-level title",
    keywords: "h1 title",
    apply: (chain) => chain.setNode("heading", { level: 1 }),
  },
  {
    label: "Heading 2",
    hint: "Section heading",
    keywords: "h2 section",
    apply: (chain) => chain.setNode("heading", { level: 2 }),
  },
  {
    label: "Heading 3",
    hint: "Sub-section heading",
    keywords: "h3 subsection",
    apply: (chain) => chain.setNode("heading", { level: 3 }),
  },
  {
    label: "Paragraph",
    hint: "Plain body text",
    keywords: "text body p",
    apply: (chain) => chain.setParagraph(),
  },
  {
    label: "Bullet list",
    hint: "Unordered list",
    keywords: "ul unordered bullets",
    apply: (chain) => chain.toggleBulletList(),
  },
  {
    label: "Numbered list",
    hint: "Ordered list",
    keywords: "ol ordered numbers",
    apply: (chain) => chain.toggleOrderedList(),
  },
  {
    label: "Block quote",
    hint: "Indented quotation",
    keywords: "quote blockquote citation",
    apply: (chain) => chain.toggleBlockquote(),
  },
  {
    label: "Code block",
    hint: "Preformatted code",
    keywords: "pre code snippet",
    apply: (chain) => chain.toggleCodeBlock(),
  },
  {
    label: "Divider",
    hint: "Horizontal rule",
    keywords: "hr rule separator line",
    apply: (chain) => chain.setHorizontalRule(),
  },
  {
    label: "Table",
    hint: "3 x 3 with a header row",
    keywords: "grid rows columns",
    apply: (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
  },
];

/** Filter the menu by what the user typed after the slash. */
export function filterSlashCommandItems(
  query: string,
  items: SlashCommandItem[] = SLASH_COMMAND_ITEMS,
): SlashCommandItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return items;
  }
  // Match on word prefixes rather than any substring: a plain `includes` made
  // "ul" match "rule", so the divider showed up when asking for a bullet list.
  return items.filter((item) =>
    `${item.label} ${item.keywords ?? ""}`
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(needle)),
  );
}

/**
 * The floating menu.
 *
 * Written as plain DOM rather than a React portal because ProseMirror owns the
 * node it anchors to, and TipTap ships no menu of its own - which is the point
 * this page is demonstrating.
 */
function createSlashMenu() {
  let element: HTMLDivElement | null = null;
  let items: SlashCommandItem[] = [];
  let selected = 0;
  let onPick: (item: SlashCommandItem) => void = () => undefined;

  function paint() {
    if (!element) {
      return;
    }
    element.innerHTML = "";

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "dep-slash-menu__empty";
      empty.textContent = "No matching command";
      element.appendChild(empty);
      return;
    }

    items.forEach((item, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "dep-slash-menu__item";
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(index === selected));

      const label = document.createElement("span");
      label.className = "dep-slash-menu__label";
      label.textContent = item.label;
      row.appendChild(label);

      if (item.hint) {
        const hint = document.createElement("span");
        hint.className = "dep-slash-menu__hint";
        hint.textContent = item.hint;
        row.appendChild(hint);
      }

      // mousedown, not click: clicking would first blur the editor and collapse
      // the selection the command needs.
      row.addEventListener("mousedown", (event) => {
        event.preventDefault();
        onPick(item);
      });
      row.addEventListener("mouseenter", () => {
        selected = index;
        paint();
      });

      element!.appendChild(row);
    });
  }

  function position(rect: DOMRect | null) {
    if (!element || !rect) {
      return;
    }
    const margin = 6;
    const height = element.offsetHeight || 260;
    const below = rect.bottom + margin;
    const fitsBelow = below + height < window.innerHeight;
    element.style.left = `${Math.round(rect.left)}px`;
    element.style.top = fitsBelow
      ? `${Math.round(below)}px`
      : `${Math.round(rect.top - height - margin)}px`;
  }

  return {
    show(
      nextItems: SlashCommandItem[],
      rect: DOMRect | null,
      pick: (item: SlashCommandItem) => void,
    ) {
      items = nextItems;
      onPick = pick;
      selected = 0;
      if (!element) {
        element = document.createElement("div");
        element.className = "dep-slash-menu";
        element.setAttribute("role", "listbox");
        element.setAttribute("aria-label", "Slash commands");
        document.body.appendChild(element);
      }
      paint();
      position(rect);
    },
    update(
      nextItems: SlashCommandItem[],
      rect: DOMRect | null,
      pick: (item: SlashCommandItem) => void,
    ) {
      items = nextItems;
      // The suggestion plugin supplies a fresh `command` on every keystroke,
      // bound to the range that now covers "/" plus everything typed after it.
      // Holding on to the one from onStart deleted only the slash and left the
      // query text sitting in the new block.
      onPick = pick;
      selected = 0;
      paint();
      position(rect);
    },
    /** Returns true when the key was consumed by the menu. */
    handleKey(event: KeyboardEvent): boolean {
      if (!element || items.length === 0) {
        return false;
      }
      if (event.key === "ArrowDown") {
        selected = (selected + 1) % items.length;
        paint();
        return true;
      }
      if (event.key === "ArrowUp") {
        selected = (selected - 1 + items.length) % items.length;
        paint();
        return true;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        onPick(items[selected]);
        return true;
      }
      return false;
    },
    hide() {
      element?.remove();
      element = null;
      items = [];
      selected = 0;
    },
  };
}

export default Extension.create<SlashCommandOptions>({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        // Any empty block, not only the first line: the menu is most useful on
        // a fresh paragraph in the middle of a document.
        startOfLine: false,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: SlashCommandItem;
        }) => {
          // One chain: focus, remove the "/query" the user typed, then apply.
          const chain = editor.chain().focus().deleteRange(range);
          if (typeof props?.apply === "function") {
            props.apply(chain).run();
            return;
          }
          chain.insertContent(props?.label ?? "").run();
        },
        items: ({ query }: { query: string }) => filterSlashCommandItems(query),
        render: () => {
          const menu = createSlashMenu();

          return {
            onStart: (props: any) => {
              menu.show(props.items, props.clientRect?.() ?? null, (item) =>
                props.command(item),
              );
            },
            onUpdate: (props: any) => {
              menu.update(props.items, props.clientRect?.() ?? null, (item) =>
                props.command(item),
              );
            },
            onKeyDown: (props: any) => {
              if (props.event.key === "Escape") {
                menu.hide();
                return true;
              }
              return menu.handleKey(props.event);
            },
            onExit: () => {
              menu.hide();
            },
          };
        },
      },
    };
  },
  addProseMirrorPlugins() {
    const { suggestion } = this.options;
    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
      }),
    ];
  },
});
