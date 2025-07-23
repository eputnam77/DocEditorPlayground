# TipTap Usage Scenarios

The TipTap page showcases advanced collaboration features while keeping the interface simple.

## Track changes

1. Open `/tiptap` in your browser.
2. Type or paste text in the editor.
3. The **Track Changes** widget below the editor displays how many characters were added or removed.

```tsx
<TrackChanges content={content} />
```

## Add comments

1. Use the text box labeled **Add Comment** beneath the editor.
2. Press **Enter** to store the note.

```tsx
<CommentTrack />
```

## Lock down headings

Heading levels 1 and 2 are locked by default. Any attempt to change them is ignored thanks to the `tiptapHeadingLock` extension.

```ts
const ALWAYS_ENABLED = [
  { name: "HeadingLock", extension: tiptapHeadingLock() },
];
```

## Yjs collaboration

1. Open the **Extensions** menu.
2. Enable **YjsCollab**.
3. Share the page URL with collaborators.

```ts
{ name: "YjsCollab", extension: tiptapYjsCollab() }
```

## Section nodes

Toggle **SectionNode** from the extension list to allow dragging content by its Heading&nbsp;2 title.

## Custom watermark

Enable **Watermark** and edit the overlay text in the side panel.

## Indentation

Paragraphs and lists support basic indentation via the `Indentation` extension.

## AI Suggest

Enable **AI Suggest** in the sidebar to rewrite selected text. Highlight a sentence and press **AI Suggest** in the toolbar. The default API just uppercases your text; customize `pages/api/ai-suggest.ts` to call your language model with a federal writing prompt.

## Structure enforcement

The `tiptapStructure` extension prevents consecutive headings and ensures paragraphs follow each heading.
