interface Block { type: string; data: any }

export default class EditorJS {
  public config: any;
  private holder: HTMLElement | null = null;
  private data: { blocks: Block[] } = { blocks: [] };

  private renderToHolder() {
    if (!this.holder) {
      return;
    }
    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const html = this.data.blocks
      .map((block) => {
        if (block.type === "header") {
          const level = Math.min(Math.max(Number(block.data?.level || 2), 1), 6);
          const text = escapeHtml(block.data?.text ?? "");
          return `<h${level}>${text}</h${level}>`;
        }
        if (block.type === "list") {
          const style = block.data?.style === "ordered" ? "ol" : "ul";
          const items = Array.isArray(block.data?.items) ? block.data.items : [];
          const listItems = items
            .map((item: string) => `<li>${escapeHtml(item)}</li>`)
            .join("");
          return `<${style}>${listItems || "<li><br></li>"}</${style}>`;
        }
        const text = escapeHtml(block.data?.text ?? "");
        return `<p>${text}</p>`;
      })
      .join("");
    this.holder.innerHTML = html;
  }

  private syncDataFromHolder() {
    if (!this.holder) {
      return;
    }
    const text = this.holder.innerText;
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    this.data.blocks =
      lines.length === 0
        ? [{ type: "paragraph", data: { text: "" } }]
        : lines.map((line) => ({ type: "paragraph", data: { text: line } }));
  }

  private pushBlock(block: Block) {
    this.data.blocks.push(block);
    this.renderToHolder();
    this.config?.onChange?.();
  }

  public blocks = {
    insert: async (type: string, data: any) => {
      if (type === "list" && data && !Array.isArray(data.items)) {
        const text = String(data.text || "").trim();
        data = {
          style: data.style || "unordered",
          items: text.length > 0 ? [text] : [""],
        };
      }
      this.pushBlock({ type, data });
    },
    render: async (data: { blocks: Block[] }) => {
      this.data = data;
      this.renderToHolder();
      this.config?.onChange?.();
    },
    renderFromHTML: async (html: string) => {
      const text = html.replace(/<[^>]+>/g, "").trim();
      this.data.blocks = [{ type: "paragraph", data: { text } }];
      this.renderToHolder();
      this.config?.onChange?.();
    },
    clear: async () => {
      this.data.blocks = [{ type: "paragraph", data: { text: "" } }];
      this.renderToHolder();
      this.config?.onChange?.();
    },
  };
  constructor(config: any) {
    this.config = config;
    this.holder = (config.holder as HTMLElement) || null;
    if (this.holder) {
      this.holder.setAttribute("contenteditable", "true");
      this.holder.setAttribute("dir", "ltr");
      this.holder.style.direction = "ltr";
      this.holder.style.textAlign = "left";
      this.holder.addEventListener("input", () => {
        this.syncDataFromHolder();
        this.config?.onChange?.();
      });
      this.renderToHolder();
    }
    if (typeof window !== "undefined") {
      (window as any).editor = this;
    }
  }
  async save() {
    return this.data;
  }
  async render(data: { blocks: Block[] }) {
    this.data = data;
    this.config?.onChange?.();
  }
  destroy() {
    // no-op
  }
}
