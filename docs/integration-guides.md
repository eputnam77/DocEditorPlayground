# Integration Guides

These quick notes show how to add or remove plugins or extensions when you use the editors demonstrated in this playground.

## TipTap

1. Install `@tiptap/react`.
2. Pass extensions to the `Editor` instance:
   ```ts
   import StarterKit from "@tiptap/starter-kit";
   const editor = new Editor({ extensions: [StarterKit, ...custom] });
   ```
3. Remove a plugin by leaving it out of the extensions array.

## Toast UI

1. Install `@toast-ui/react-editor`.
2. Provide the `plugins` option when creating the editor:
   ```ts
   <Editor plugins={[chartPlugin(), ...others]} />
   ```
3. Drop a plugin by removing it from the array.

## CodeX (Editor.js)

1. Install `@editorjs/editorjs` and tool packages.
2. Pass desired tools when initializing:
   ```ts
   const editor = new EditorJS({ tools: { header: Header, list: List } });
   ```
3. To remove a tool, delete its entry from the `tools` object.

## Quill

1. Install `react-quill`.
2. Register modules when creating the component:
   ```ts
   const modules = { toolbar: ['bold', 'italic'] }
   <ReactQuill modules={modules} />
   ```
3. Remove a module by omitting it from the modules object.

## Slate

1. Install `slate` and `slate-react`.
2. Compose plugins as editor transforms:
   ```ts
   const withImages = (e: Editor) => {
     /* ... */
   };
   const editor = withImages(withReact(createEditor()));
   ```
3. Skip a plugin by not applying its wrapper.

## Lexical

1. Install `lexical` and `@lexical/react`.
2. Provide nodes and plugins via the `LexicalComposer` config:
   ```ts
   <LexicalComposer initialConfig={{ nodes: [HeadingNode, ...custom] }}>
   ```
3. Remove a node by not including it in the `nodes` array.

## CKEditor 5

1. Install `@ckeditor/ckeditor5-react` and build packages.
2. Import plugins and include them in the build configuration:
   ```ts
   ClassicEditor.builtinPlugins = [Essentials, Bold, Italic];
   ```
3. Take a plugin out by removing it from the plugins list.
