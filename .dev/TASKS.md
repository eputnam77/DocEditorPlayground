# Task List

## Overview

This file tracks planned tasks for implementing the **Document Editor Playground** as described in `.dev/PRD.md`.

---

### 1. Initialize Next.js project with TypeScript and Tailwind

- **Priority:** High
- **Estimate:** 3h
- **Acceptance Criteria:** Repository contains Next.js app using TypeScript; Tailwind configured; `package.json` with required dependencies.
- **Labels:** `feature`, `setup`

### 2. Add home page with navigation

- **Priority:** High
- **Estimate:** 2h
- **Acceptance Criteria:** Home page `/` describes project and links to each editor page. Navigation bar available on all pages.
- **Labels:** `feature`, `frontend`
- **Tests:** `tests/e2e/features/home_navigation.feature`

### 3. Implement TipTap editor page

- **Priority:** High
- **Estimate:** 4h
- **Acceptance Criteria:** `/tiptap` shows TipTap editor with toolbar, plugin toggles, validation display, template loader and integration info section.
- **Labels:** `feature`, `editor`, `tiptap`
- **Tests:** `tests/e2e/features/tiptap_page.feature`

### 4. Implement Toast UI editor page

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** `/toast` includes Toast UI Editor with plugin management, validation display, template loader and integration info section.
- **Labels:** `feature`, `editor`, `toast`
- **Tests:** `tests/e2e/features/toast_page.feature`

### 5. Implement Editor.js (CodeX) page

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** `/codex` loads Editor.js with block/plugin controls, validation area, template loader and integration info section.
- **Labels:** `feature`, `editor`, `codex`
- **Tests:** `tests/e2e/features/codex_page.feature`


### 7. Implement Slate page

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** `/slate` demonstrates Slate editor with custom schema example, plugin integration, validations, template loader and integration info section.
- **Labels:** `feature`, `editor`, `slate`
- **Tests:** `tests/e2e/features/slate_page.feature`

### 8. Implement Lexical page

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** `/lexical` displays Lexical editor with extension management, custom nodes example, validations, template loader and integration info section.
- **Labels:** `feature`, `editor`, `lexical`
- **Tests:** `tests/e2e/features/lexical_page.feature`

### 9. Implement CKEditor 5 page

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** `/ckeditor` provides CKEditor 5 with plugin management, toolbar customization, validation area, template loader and integration info section, and demonstrates the DXPR AI Agent plugin.
- **Labels:** `feature`, `editor`, `ckeditor`
- **Tests:** `tests/e2e/features/ckeditor_page.feature`

### 10. Create shared components (PluginManager, TemplateLoader, EditorIntegrationInfo)

- **Priority:** High
- **Estimate:** 3h
- **Acceptance Criteria:** Reusable components exist for managing plugins, loading templates, and displaying integration instructions. Used across editor pages.
- **Labels:** `feature`, `components`

### 11. Add template examples and validation utils

- **Priority:** Medium
- **Estimate:** 2h
- **Acceptance Criteria:** `templates/` directory contains sample templates; utility functions handle basic validation logic shared across editors.
- **Labels:** `feature`, `templates`, `validation`
- **Tests:** `tests/property/validation.test.ts`

### 12. Implement dark mode toggle

- **Priority:** Low
- **Estimate:** 1h
- **Acceptance Criteria:** UI includes a switch to toggle light/dark mode across all pages.
- **Labels:** `enhancement`, `frontend`
- **Tests:** `tests/e2e/features/dark_mode_toggle.feature`

### 13. Add tests for page rendering and component behavior

- **Priority:** Medium
- **Estimate:** 3h
- **Acceptance Criteria:** Test suite (e.g., Jest/React Testing Library) covers main components and pages; tests pass in CI.
- **Labels:** `test`

### 14. Update README with setup and usage instructions

- **Priority:** High
- **Estimate:** 1h
- **Acceptance Criteria:** README explains how to install dependencies, run the dev server, and contribute.
- **Labels:** `documentation`

### 15. Continuous Integration configuration

- **Priority:** Low
- **Estimate:** 2h
- **Acceptance Criteria:** CI workflow installs dependencies and runs tests on pull requests.
- **Labels:** `ci`

### 16. Modernize page designs

- **Priority:** Medium
- **Estimate:** 3h
- **Acceptance Criteria:** All editor pages use a sleek layout with spacious navigation and full-page text areas.
- **Labels:** `enhancement`, `frontend`

### 17. Advanced formatting toolbar

- **Priority:** Medium
- **Estimate:** 5h
- **Acceptance Criteria:** Editors include buttons for common formatting actions similar to Microsoft Word.
- **Labels:** `feature`, `editor`

### 18. Template integration improvements

- **Priority:** Medium
- **Estimate:** 2h
- **Acceptance Criteria:** Templates load correctly in each editor with validation feedback displayed.
- **Labels:** `feature`, `templates`

### 19. Commenting and track changes support

- **Priority:** Low
- **Estimate:** 6h
- **Acceptance Criteria:** Where supported, editors expose basic commenting and change tracking features.
- **Labels:** `enhancement`, `editor`

### 20. Heading and style presets

- **Priority:** Low
- **Estimate:** 2h
- **Acceptance Criteria:** Users can quickly apply heading levels and styles across editors.
- **Labels:** `feature`, `editor`

### 21. Validation information display

- **Priority:** Low
- **Estimate:** 1h
- **Acceptance Criteria:** Pages show real-time document validation status below the editor.
- **Labels:** `enhancement`, `validation`

### 22. Expanded test coverage for new features

- **Priority:** Medium
- **Estimate:** 4h
- **Acceptance Criteria:** Unit and E2E tests cover the modernized UI and toolbar interactions.
- **Labels:** `test`

### 23. Lock headings in TipTap

- **Priority:** Medium
- **Estimate:** 2h
- **Acceptance Criteria:** Heading levels 1 and 2 cannot be edited in the TipTap page.
- **Labels:** `feature`, `tiptap`
- **Tests:** `tests/e2e/features/tiptap_heading_lock.feature`

### 24. Enforce heading structure in TipTap

- **Priority:** Medium
- **Estimate:** 3h
- **Acceptance Criteria:** TipTap enforces a paragraph or list after headings and prevents consecutive headings.
- **Labels:** `feature`, `validation`, `tiptap`
- **Tests:** `tests/property/tiptap_structure.test.ts`

### 25. Add indentation for lists and paragraphs under headings

- **Priority:** Low
- **Estimate:** 2h
- **Acceptance Criteria:** Paragraphs and lists under Heading 1 or 2 support indentation controls.
- **Labels:** `enhancement`, `tiptap`

### 26. Customizable watermark for TipTap

- **Priority:** Low
- **Estimate:** 2h
- **Acceptance Criteria:** Users can toggle and edit a watermark overlay in the TipTap editor.
- **Labels:** `enhancement`, `tiptap`

### 27. Section nodes with draggable Heading 2 blocks

- **Priority:** Medium
- **Estimate:** 3h
- **Acceptance Criteria:** Content can be organized into draggable sections using Heading 2 as the section title.
- **Labels:** `feature`, `tiptap`

### 28. Integrate Yjs collaboration for TipTap

- **Priority:** High
- **Estimate:** 4h
- **Acceptance Criteria:** TipTap page supports real-time collaboration via Yjs.
- **Labels:** `feature`, `tiptap`, `collaboration`

---

**Next agent:** ready-for:scenario-gen
