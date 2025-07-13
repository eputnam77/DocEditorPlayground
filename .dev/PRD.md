# Product Requirements Document (PRD): Document Editor Playground

---

## 1. Overview

**Goal:**
Build a minimal, modular web app that allows in-depth side-by-side testing of modern document editors, including TipTap, Toast UI Editor, CodeX (Editor.js), Quill, Slate, Lexical, and CKEditor 5. The purpose is to evaluate their extensibility, plugin integration, validation features, and template support before integrating them into a larger platform.

---

## 2. Key Objectives

- Provide a separate page for each editor.
- Enable live editing, plugin/extension management, validation, and template loading per editor.
- Expose integration points, including how to add plugins/extensions, validations, and templates.
- Enable side-by-side comparison by keeping the app structure modular and minimal.

---

## 3. Features & Requirements

### 3.1 Core Pages

- `/` (Home):
  Landing page with app description and navigation to each editor.

- `/tiptap`:
  TipTap editor, with extension management, validation, and template support.

- `/toast`:
  Toast UI Editor, with plugin management, validation, and templates.

- `/codex`:
  Editor.js, with block/plugin management, block validation, and templates.

- `/quill`:
  Quill editor, with module/plugin toggling, validation options, and template support.

- `/slate`:
  Slate editor, demonstrating custom schema/validation, plugin integration, and templates.

- `/lexical`:
  Lexical (Meta), showcasing extension/plugin management, custom nodes, validation, and templates.

- `/ckeditor`:
  CKEditor 5, showing plugin management, toolbar customization, validation, template handling, and the **DXPR AI Agent** plugin demonstration.

### 3.2 Editor Feature Matrix

For each editor page, provide:

- Editor instance with toolbar.
- Dynamic plugin/extension/module enable/disable UI (as supported).
- Live validation area showing errors/warnings.
- Template loader (select or paste templates/snippets).
- “Show Integration Code” toggle for all enabled features.

### 3.3 Integration How-To Section

Each editor page includes:

- **How to add/remove plugins/extensions/modules.**
- **How to implement custom validations.**
- **How to load templates or content.**
- Example code snippets for above.

### 3.4 Other Features

- Simple, responsive UI with clear navigation.
- Minimal external dependencies outside those needed for editors and plugins.
- Code comments and doc blocks for easy extension.
- Dark mode toggle (optional).

---

## 4. Architecture & Stack

- **Framework:** Next.js (recommended for routing), or Vite/CRA if preferred.
- **Language:** TypeScript.
- **UI Library:** Tailwind CSS or Chakra UI for rapid prototyping.
- **Editor Packages:**
  - TipTap: `@tiptap/react`, `@tiptap/starter-kit`, etc.
  - Toast UI Editor: `@toast-ui/react-editor`
  - Editor.js: `@editorjs/editorjs`, `@editorjs/header`, etc.
  - Quill: `quill`, `react-quill`
  - Slate: `slate`, `slate-react`
  - Lexical: `@lexical/react`, etc.
  - CKEditor 5: `@ckeditor/ckeditor5-react`, `@ckeditor/ckeditor5-build-classic` or custom build, plus the `dxpr-ai-agent` plugin

### Suggested Folder Structure

```
/editor-playground/
│
├── pages/
│   ├── index.tsx
│   ├── tiptap.tsx
│   ├── toast.tsx
│   ├── codex.tsx
│   ├── quill.tsx
│   ├── slate.tsx
│   ├── lexical.tsx
│   └── ckeditor.tsx
│
├── components/
│   ├── EditorIntegrationInfo.tsx
│   ├── TemplateLoader.tsx
│   └── PluginManager.tsx
│
├── templates/
│
├── utils/
│
├── README.md
│
├── package.json
└── ...
```

---

## 5. Integration Section Details (per editor)

Each editor page includes an **Integration** section:

### 5.1 Plugins/Extensions/Modules

- List of included plugins/extensions/modules with toggle controls (as supported).
- Short code sample for enabling/disabling.
- UI for dynamic enable/disable (checkboxes or toggles).

### 5.2 Validations

- Types of validation available (e.g., required fields, block types, custom checks).
- UI for configuring validations.
- Sample code to add new validation.

### 5.3 Templates

- How to load a template into the editor.
- Template picker or input.
- Sample code for template integration.

### 5.4 Customization/Schema (where relevant)

- For editors like Slate or Lexical, demo custom schema/nodes.

---

## 6. Example Task Breakdown

1. **Initialize project skeleton with Next.js and Tailwind.**
2. **Add routing and home page.**
3. **Add TipTap page:**
   - Install core and extensions.
   - PluginManager and TemplateLoader.
   - Validation UI.
   - Integration guide.

4. **Repeat for each editor:**
   - Toast UI, CodeX, Quill, Slate, Lexical, CKEditor 5.
   - Each with plugin/extensions management, validation, templates, and Integration section.

5. **Add shared components for Integration Info.**
6. **Polish navigation and style.**
7. **Write README with setup notes.**

---

## 7. Deliverables

- Working Next.js app with a dedicated page for each editor.
- Each page has live editor, plugin management, validation, template support, and **Integration** section with code samples.
- Documentation and code comments for rapid onboarding and future expansion.

---

## 8. Out of Scope

- User authentication.
- File save/load to cloud or backend.
- Collaborative/multi-user features.

---

## 9. References

- [TipTap](https://tiptap.dev)
- [Toast UI Editor](https://nhn.github.io/tui.editor/latest/)
- [Editor.js](https://editorjs.io/)
- [Quill](https://quilljs.com/)
- [Slate](https://docs.slatejs.org/)
- [Lexical](https://lexical.dev/)
- [CKEditor 5](https://ckeditor.com/docs/)
- [Awesome Rich Text Editors](https://github.com/jaredreich/awesome-rich-text-editors)
- [Next.js Docs](https://nextjs.org/docs/pages)
