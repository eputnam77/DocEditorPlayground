import type { ComponentType, SVGProps } from "react";

declare module "lucide-react" {
  export type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

  export const Bold: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Clock: LucideIcon;
  export const Code: LucideIcon;
  export const Italic: LucideIcon;
  export const List: LucideIcon;
  export const ListOrdered: LucideIcon;
  export const Quote: LucideIcon;
  export const Redo2: LucideIcon;
  export const Strikethrough: LucideIcon;
  export const Underline: LucideIcon;
  export const Undo2: LucideIcon;
  export const Image: LucideIcon;
  export const Table: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Loader2: LucideIcon;
}
