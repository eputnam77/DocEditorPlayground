interface Block { type: string; data: any }

export default class EditorJS {
  public config: any;
  private data: { blocks: Block[] } = { blocks: [] };
  public blocks = {
    insert: (type: string, data: any) => {
      this.data.blocks.push({ type, data });
      this.config?.onChange?.();
    },
    renderFromHTML: (html: string) => {
      const text = html.replace(/<[^>]+>/g, "");
      this.data.blocks = [{ type: "paragraph", data: { text } }];
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
  destroy() {
    // no-op
  }
}
