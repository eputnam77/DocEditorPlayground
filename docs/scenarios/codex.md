# Editor.js Usage Scenarios

Editor.js pages share common helpers such as commenting and change tracking. Advanced features require custom tools.

## Track changes

1. Visit `/codex`.
2. Edit text in the textarea placeholder.
3. The **Track Changes** component shows a running character diff.

## Add comments

Use the **Add Comment** box to store notes alongside the document.

## Lock down headings

Implement a custom tool that limits heading levels. See the TipTap scenario for a reference approach.

## Yjs collaboration

Integrate the Yjs client and broadcast updates through your preferred backend. This demo does not ship collaboration by default.

## Section nodes

Create a tool that wraps blocks inside a draggable container with a Heading&nbsp;2 label.

## Custom watermark

Inject a DOM element positioned over the editor surface to render a watermark.

## Indentation

Use block-level tools that manage nested lists or paragraphs.

## Structure enforcement

Validate the output JSON before saving to ensure required headings appear in order.
