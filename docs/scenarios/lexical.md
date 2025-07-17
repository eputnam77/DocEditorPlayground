# Lexical Usage Scenarios

Lexical is extremely modular. The playground integrates only a textarea but you can extend it to match our TipTap demo.

## Track changes

1. Open `/lexical`.
2. Edit the placeholder text.
3. The **Track Changes** readout updates immediately.

## Add comments

Enter notes in the **Add Comment** field to simulate inline feedback.

## Lock down headings

Create a custom node that limits heading changes and registers with the `LexicalComposer` config.

## Yjs collaboration

Combine the Lexical Yjs package with your own provider to broadcast updates between sessions.

## Section nodes

Model sections as draggable nodes wrapping a Heading&nbsp;2 plus its children.

## Custom watermark

Render an absolutely positioned component over the editor surface with your watermark text.

## Indentation

Use commands like `insertIndent` or implement your own indent node for paragraphs.

## Structure enforcement

Run validation on editor state to prevent consecutive headings before saving.
