# Slate Usage Scenarios

Slate's composable plugins let you build rich behavior. Integrate the actual editor package to enable editing functionality.

## Track changes

1. Head to `/slate`.
2. The page displays placeholder controls only; integrate Slate to enable editing.

## Add comments

Use the **Add Comment** widget to leave feedback for later review.

## Lock down headings

Wrap the editor with a custom plugin that blocks disallowed heading levels.

## Yjs collaboration

Use `slate-yjs` with a provider such as WebSocket to sync operations between editors.

## Section nodes

Create a container element that groups a Heading&nbsp;2 with its following blocks so it can be reordered.

## Custom watermark

Overlay an absolutely positioned element for the watermark and exclude it when saving.

## Indentation

Implement commands that manipulate list or paragraph indent properties.

## Structure enforcement

Validate node structure on each change to keep the document outline correct.
