interface Block { type: string; data: any }

export default class EditorJS {
  public config: any;
  private data: { blocks: Block[] } = { blocks: [] };
  public blocks = {
    insert: async (type: string, data: any) => {
      this.data.blocks.push({ type, data });
      this.config?.onChange?.();
    },
    render: async (data: { blocks: Block[] }) => {
      this.data = data;
      this.config?.onChange?.();
    },
    renderFromHTML: async (html: string) => {
      const text = html.replace(/<[^>]+>/g, "");
      this.data.blocks = [{ type: "paragraph", data: { text } }];
      this.config?.onChange?.();
    },
    clear: async () => {
      this.data.blocks = [];
      this.config?.onChange?.();
    },
  };
  constructor(config: any) {
    this.config = config;
    const holder = config.holder as HTMLElement;
    if (holder) {
      holder.setAttribute("contenteditable", "true");
      holder.addEventListener("input", () => {
        const text = holder.innerText;
        this.data.blocks = [{ type: "paragraph", data: { text } }];
        this.config?.onChange?.();
      });
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
