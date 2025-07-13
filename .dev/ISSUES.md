# Known Issues

doceditorplaytgournd


## `npm run lint`

PS C:\Users\ericp\Documents\Vengeance Coding and Script Files\DocEditorPlayground\DocEditorPlayground> 
                                                                                                       npm run lint

> doceditorplayground@0.1.0 lint
> next lint


 ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config

./pages/ckeditor.tsx
45:18  Error: Parsing error: Unexpected token :

./pages/codex.tsx
38:63  Error: Parsing error: Unexpected token ]

./pages/index.tsx
7:5  Error: Parsing error: Unexpected token <

./pages/lexical.tsx
37:14  Error: Parsing error: Unexpected token :

./pages/quill.tsx
22:14  Error: Parsing error: Unexpected token :

./pages/slate.tsx
14:6  Error: Parsing error: Unexpected token Editor

./pages/tiptap.tsx
93:69  Error: Parsing error: Unexpected token ]

./pages/toast.tsx
27:14  Error: Parsing error: Unexpected token :

./pages/_app.tsx
1:13  Error: Parsing error: Unexpected token {

./components/DarkModeToggle.tsx
28:5  Error: Parsing error: Unexpected token <

./components/NavBar.tsx
19:5  Error: Parsing error: Unexpected token <

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules

## `npm run typecheck`

PS C:\Users\ericp\Documents\Vengeance Coding and Script Files\DocEditorPlayground\DocEditorPlayground> npm run typecheck

> doceditorplayground@0.1.0 typecheck
> tsc --noEmit

pages/lexical.tsx:41:3 - error TS2322: Type '({ externalHistoryState, }: { externalHistoryState?: HistoryState | undefined; }) => null' is not assignable to type '(props?: Record<string, unknown> | undefined) => any'.
  Types of parameters '__0' and 'props' are incompatible.
    Type 'Record<string, unknown> | undefined' is not assignable to type '{ externalHistoryState?: HistoryState | undefined; }'.
      Type 'undefined' is not assignable to type '{ externalHistoryState?: HistoryState | undefined; }'.

41   History: HistoryPlugin,
     ~~~~~~~

pages/lexical.tsx:44:3 - error TS2322: Type '({ validateUrl }: Props) => null' is not assignable to type '(props?: Record<string, unknown> | undefined) => any'.
  Types of parameters '__0' and 'props' are incompatible.
    Type 'Record<string, unknown> | undefined' is not assignable to type 'Props'.
      Type 'undefined' is not assignable to type 'Props'.

44   Link: LinkPlugin,
     ~~~~

pages/lexical.tsx:343:12 - error TS2741: Property 'ErrorBoundary' is missing in type '{ placeholder: Element; contentEditable: Element; }' but required in type '{ contentEditable: any; placeholder: any; ErrorBoundary: any; }'.  

343           <RichTextPlugin
               ~~~~~~~~~~~~~~

  node_modules/@lexical/react/LexicalRichTextPlugin.d.ts:13:5
    13     ErrorBoundary: ErrorBoundaryType;
           ~~~~~~~~~~~~~
    'ErrorBoundary' is declared here.

pages/toast.tsx:228:9 - error TS2607: JSX element class does not support attributes because it does not have a 'props' property.

228         <ToastEditor
            ~~~~~~~~~~~~
229           ref={editorRef}
    ~~~~~~~~~~~~~~~~~~~~~~~~~
...
235           plugins={plugins as any}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
236         />
    ~~~~~~~~~~

pages/toast.tsx:228:10 - error TS2786: 'ToastEditor' cannot be used as a JSX component.
  Its type 'typeof Editor' is not a valid JSX element type.
    Type 'typeof Editor' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
      Type 'Editor' is missing the following properties from type 'Component<any, any, any>': context, setState, forceUpdate, render, and 3 more.

228         <ToastEditor
             ~~~~~~~~~~~


Found 5 errors in 2 files.

Errors  Files
     3  pages/lexical.tsx:41
     2  pages/toast.tsx:228

## `npm test`

PS C:\Users\ericp\Documents\Vengeance Coding and Script Files\DocEditorPlayground\DocEditorPlayground> npm test

> doceditorplayground@0.1.0 test
> vitest run


 RUN  v1.6.1 C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground

 ❯ tests/property/validation.test.ts (0)                                                                                                                                                                                            
 ✓ tests/utils/validation.test.ts (2)                                                                                                                                                                                               
 ❯ tests/pages/lexical.test.tsx (0)                                                                                                                                                                                                 
 ❯ tests/pages/index.test.tsx (0)                                                                                                                                                                                                   
 ❯ tests/components/DarkModeToggle.test.tsx (1)                                                                                                                                                                                     
   ❯ DarkModeToggle (1)                                                                                                                                                                                                             
     × toggles dark class on document element                                                                                                                                                                                       
 ❯ tests/pages/codex.test.tsx (0)                                                                                                                                                                                                   
 ❯ tests/pages/toast.test.tsx (0)                                                                                                                                                                                                   
 ❯ tests/pages/quill.test.tsx (0)                                                                                                                                                                                                   
 ❯ tests/pages/ckeditor.test.tsx (0)                                                                                                                                                                                                
 ❯ tests/pages/tiptap.test.tsx (0)                                                                                                                                                                                                  
 ❯ tests/e2e/navigation.test.ts (0)                                                                                                                                                                                                 
 ❯ tests/e2e/toast-plugin-toggle.test.ts (0)                                                                                                                                                                                        
 ❯ tests/e2e/page-availability.test.ts (0)                                                                                                                                                                                          
 ❯ tests/e2e/dark-mode-toggle.test.ts (0)                                                                                                                                                                                           
 ❯ tests/e2e/lexical-plugin-toggle.test.ts (0)                                                                                                                                                                                      
 ❯ tests/e2e/codex-plugin-toggle.test.ts (0)                                                                                                                                                                                        
 ❯ tests/e2e/tiptap-extension-toggle.test.ts (0)                                                                                                                                                                                    
 ❯ tests/e2e/ckeditor-plugin-toggle.test.ts (0)                                                                                                                                                                                     
 ❯ tests/e2e/plugin-persistence.test.ts (0)                                                                                                                                                                                         
 ❯ tests/e2e/slate-plugin-toggle.test.ts (0)                                                                                                                                                                                        
 ❯ tests/e2e/quill-workflow.test.ts (0)                                                                                                                                                                                             
 ❯ tests/e2e/editor-workflows.test.ts (0)                                                                                                                                                                                           
 ❯ tests/e2e/full-workflow.test.ts (0)                                                                                                                                                                                              
 ❯ tests/e2e/quill-module-toggle.test.ts (0)                                                                                                                                                                                        
 ❯ tests/pages/slate.test.tsx (0)                                                                                                                                                                                                   

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 23 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/pages/ckeditor.test.tsx [ tests/pages/ckeditor.test.tsx ]
ReferenceError: self is not defined
 ❯ Object.<anonymous> node_modules/@ckeditor/ckeditor5-react/dist/webpack:/CKEditor/webpack/universalModuleDefinition:10:4
 ❯ TracingChannel.traceSync node:diagnostics_channel:322:14

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/24]⎯

 FAIL  tests/pages/codex.test.tsx [ tests/pages/codex.test.tsx ]
Error: Failed to load url react-editor-js (resolved id: react-editor-js) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/codex.tsx. Does the file exist?
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/24]⎯

 FAIL  tests/pages/index.test.tsx [ tests/pages/index.test.tsx ]
Error: Failed to load url framer-motion (resolved id: framer-motion) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/index.tsx. Does the file exist?
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/24]⎯

 FAIL  tests/pages/lexical.test.tsx [ tests/pages/lexical.test.tsx ]
Error: Missing "./LexicalCodeHighlightPlugin" specifier in "@lexical/react" package
 ❯ e ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46042:25
 ❯ n ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46042:627
 ❯ o ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46042:1297
 ❯ resolveExportsOrImports ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46663:18
 ❯ resolveDeepImport ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46686:25
 ❯ tryNodeResolve ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46451:16
 ❯ ResolveIdContext.resolveId ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:46201:19
 ❯ PluginContainer.resolveId ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49018:17
 ❯ TransformPluginContext.resolve ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49178:15

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/24]⎯

 FAIL  tests/pages/quill.test.tsx [ tests/pages/quill.test.tsx ]
Error: Failed to load url react-quill (resolved id: react-quill) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/quill.tsx. Does the file exist?
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/24]⎯

 FAIL  tests/pages/slate.test.tsx [ tests/pages/slate.test.tsx ]
Error: Failed to load url slate-history (resolved id: slate-history) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/slate.tsx. Does the file exist?
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/24]⎯

 FAIL  tests/pages/tiptap.test.tsx [ tests/pages/tiptap.test.tsx ]
Error: Failed to load url @tiptap/extension-underline (resolved id: @tiptap/extension-underline) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/tiptap.tsx. Does the file exist?
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/24]⎯

 FAIL  tests/pages/toast.test.tsx [ tests/pages/toast.test.tsx ]
Error: Failed to load url @toast-ui/react-editor (resolved id: @toast-ui/react-editor) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/pages/toast.tsx. Does the file exist?  
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/24]⎯

 FAIL  tests/e2e/ckeditor-plugin-toggle.test.ts [ tests/e2e/ckeditor-plugin-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/ckeditor-plugin-toggle.test.ts:5:6
      3| const PLUGINS = ["Bold", "Italic", "Underline"];
      4|
      5| test.describe("ckeditor plugin toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/ckeditor");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/24]⎯

 FAIL  tests/e2e/codex-plugin-toggle.test.ts [ tests/e2e/codex-plugin-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/codex-plugin-toggle.test.ts:5:6
      3| const PLUGINS = ["Header", "List", "Checklist"];
      4|
      5| test.describe("codex plugin toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/codex");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/24]⎯

 FAIL  tests/e2e/dark-mode-toggle.test.ts [ tests/e2e/dark-mode-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/dark-mode-toggle.test.ts:3:6
      1| import { test, expect } from "@playwright/test";
      2|
      3| test.describe("dark mode toggle", () => {
       |      ^
      4|   test("toggles the dark class", async ({ page }) => {
      5|     await page.goto("/");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/24]⎯

 FAIL  tests/e2e/editor-workflows.test.ts [ tests/e2e/editor-workflows.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/editor-workflows.test.ts:19:8
     17|
     18| for (const editor of editors) {
     19|   test.describe(`${editor.name} workflow`, () => {
       |        ^
     20|     test("opens and closes history", async ({ page }) => {
     21|       await page.goto(editor.path);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/24]⎯

 FAIL  tests/e2e/full-workflow.test.ts [ tests/e2e/full-workflow.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/full-workflow.test.ts:21:8
     19| 
     20| for (const editor of editors) {
     21|   test.describe(`${editor.path} full workflow`, () => {
       |        ^
     22|     test("runs full editor workflow", async ({ page }) => {
     23|       await page.goto(editor.path);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/24]⎯

 FAIL  tests/e2e/lexical-plugin-toggle.test.ts [ tests/e2e/lexical-plugin-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/lexical-plugin-toggle.test.ts:5:6
      3| const PLUGINS = ["History", "Lists", "CodeHighlight", "Link"];
      4|
      5| test.describe("lexical plugin toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/lexical");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/24]⎯

 FAIL  tests/e2e/navigation.test.ts [ tests/e2e/navigation.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/navigation.test.ts:13:6
     11| ];
     12|
     13| test.describe("navigation bar", () => {
       |      ^
     14|   for (const { name, path, heading } of pages) {
     15|     test(`navigates to ${name}`, async ({ page }) => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/24]⎯

 FAIL  tests/e2e/page-availability.test.ts [ tests/e2e/page-availability.test.ts ]
Error: Playwright Test did not expect test() to be called here.
Most common reasons include:
- You are calling test() in a configuration file.
- You are calling test() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._createTest node_modules/playwright/lib/common/testType.js:87:24
 ❯ Module.<anonymous> node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/page-availability.test.ts:15:3
     13|
     14| for (const { path, text } of pages) {
     15|   test(`opens ${path}`, async ({ page }) => {
       |   ^
     16|     await page.goto(path);
     17|     await expect(page.getByText(text)).toBeVisible();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/24]⎯

 FAIL  tests/e2e/plugin-persistence.test.ts [ tests/e2e/plugin-persistence.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/plugin-persistence.test.ts:20:8
     18|
     19| for (const e of editors) {
     20|   test.describe(`${e.path} plugin persistence`, () => {
       |        ^
     21|     test(`persists ${e.label} toggle`, async ({ page }) => {
     22|       await page.goto(e.path);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/24]⎯

 FAIL  tests/e2e/quill-module-toggle.test.ts [ tests/e2e/quill-module-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/quill-module-toggle.test.ts:5:6
      3| const MODULES = ["History", "Clipboard", "Keyboard"];
      4|
      5| test.describe("quill module toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/quill");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/24]⎯

 FAIL  tests/e2e/quill-workflow.test.ts [ tests/e2e/quill-workflow.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/quill-workflow.test.ts:3:6
      1| import { test, expect } from "@playwright/test";
      2|
      3| test.describe("quill workflow", () => {
       |      ^
      4|   test("opens and closes history", async ({ page }) => {
      5|     await page.goto("/quill");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/24]⎯

 FAIL  tests/e2e/slate-plugin-toggle.test.ts [ tests/e2e/slate-plugin-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/slate-plugin-toggle.test.ts:5:6
      3| const PLUGINS = ["History", "Lists"];
      4|
      5| test.describe("slate plugin toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/slate");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/24]⎯

 FAIL  tests/e2e/tiptap-extension-toggle.test.ts [ tests/e2e/tiptap-extension-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/tiptap-extension-toggle.test.ts:5:6
      3| const EXTENSIONS = ["StarterKit", "Underline", "History"];
      4|
      5| test.describe("tiptap extension toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/tiptap");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/24]⎯

 FAIL  tests/e2e/toast-plugin-toggle.test.ts [ tests/e2e/toast-plugin-toggle.test.ts ]
Error: Playwright Test did not expect test.describe() to be called here.
Most common reasons include:
- You are calling test.describe() in a configuration file.
- You are calling test.describe() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
 ❯ TestTypeImpl._currentSuite node_modules/playwright/lib/common/testType.js:74:13
 ❯ TestTypeImpl._describe node_modules/playwright/lib/common/testType.js:114:24
 ❯ Function.describe node_modules/playwright/lib/transform/transform.js:275:12
 ❯ tests/e2e/toast-plugin-toggle.test.ts:5:6
      3| const PLUGINS = ["CodeSyntax", "TableMerge", "ColorSyntax"];
      4|
      5| test.describe("toast plugin toggles", () => {
       |      ^
      6|   test.beforeEach(async ({ page }) => {
      7|     await page.goto("/toast");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/24]⎯

 FAIL  tests/property/validation.test.ts [ tests/property/validation.test.ts ]
Error: Failed to load url fast-check (resolved id: fast-check) in C:/Users/ericp/Documents/Vengeance Coding and Script Files/DocEditorPlayground/DocEditorPlayground/tests/property/validation.test.ts. Does the file exist?        
 ❯ loadAndTransform ../../../Vengeance%20Coding%20and%20Script%20Files/DocEditorPlayground/DocEditorPlayground/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/24]⎯

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/components/DarkModeToggle.test.tsx > DarkModeToggle > toggles dark class on document element
ReferenceError: React is not defined
 ❯ tests/components/DarkModeToggle.test.tsx:7:12
      5| describe("DarkModeToggle", () => {
      6|   it("toggles dark class on document element", () => {
      7|     render(<DarkModeToggle />);
       |            ^
      8|     const btn = screen.getByTestId("dark-mode-toggle");
      9|     expect(document.documentElement.classList.contains("dark")).toBe(false);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/24]⎯

 Test Files  24 failed | 1 passed (25)
      Tests  1 failed | 2 passed (3)
   Start at  09:29:30
   Duration  4.73s (transform 1.09s, setup 1ms, collect 3.12s, tests 6ms, environment 4ms, prepare 17.70s)

## `npx playwright test --reporter=line`

PS C:\Users\ericp\Documents\Vengeance Coding and Script Files\DocEditorPlayground\DocEditorPlayground> npx playwright test --reporter=line

Running 64 tests using 14 workers
  1) tests\e2e\plugin-persistence.test.ts:21:5 › /tiptap plugin persistence › persists Underline toggle

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  2) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to TipTap ──────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  3) tests\e2e\page-availability.test.ts:15:3 › opens / ────────────────────────────────────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  4) tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle History ────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  5) tests\e2e\editor-workflows.test.ts:20:5 › TipTap workflow › opens and closes history ──────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  6) tests\e2e\quill-workflow.test.ts:4:3 › quill workflow › opens and closes history ──────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  7) tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle CodeSyntax ─────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  8) tests\e2e\full-workflow.test.ts:22:5 › /tiptap full workflow › runs full editor workflow ──────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  9) tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle History ────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  10) tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle StarterKit                                                                                                                                 

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  11) tests\e2e\dark-mode-toggle.test.ts:4:3 › dark mode toggle › toggles the dark class ───────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  12) tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Bold ────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  13) tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle Header ────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  14) tests\e2e\slate-plugin-toggle.test.ts:12:5 › slate plugin toggles › toggle History ───────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  15) tests\e2e\plugin-persistence.test.ts:21:5 › /toast plugin persistence › persists ColorSyntax toggle

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  16) tests\e2e\page-availability.test.ts:15:3 › opens /tiptap ─────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  17) tests\e2e\quill-workflow.test.ts:13:3 › quill workflow › shows alert on save ─────────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  18) tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle Clipboard ─────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  19) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Toast Editor ───────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  20) tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle Underline ─

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  21) tests\e2e\editor-workflows.test.ts:30:7 › TipTap workflow › shows alert on save ──────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  22) tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle Lists ─────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  23) tests\e2e\full-workflow.test.ts:22:5 › /toast full workflow › runs full editor workflow ──────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  24) tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle List ──────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  25) tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle TableMerge ────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  26) tests\e2e\slate-plugin-toggle.test.ts:12:5 › slate plugin toggles › toggle Lists ─────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  27) tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Italic ──────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  28) tests\e2e\page-availability.test.ts:15:3 › opens /toast ──────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  29) tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle Keyboard ──────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  30) tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle History ───                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  31) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to CodeX ──────────────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  32) tests\e2e\plugin-persistence.test.ts:21:5 › /codex plugin persistence › persists Checklist toggle                                                                                                                             

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  33) tests\e2e\full-workflow.test.ts:22:5 › /codex full workflow › runs full editor workflow ──────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  34) tests\e2e\editor-workflows.test.ts:20:5 › Toast UI workflow › opens and closes history ───────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  35) tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle CodeHighlight ─

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  36) tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle ColorSyntax ───────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  37) tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Underline ───                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  38) tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle Checklist ─────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  39) tests\e2e\page-availability.test.ts:15:3 › opens /codex ──────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  40) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Quill ──────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  41) tests\e2e\full-workflow.test.ts:22:5 › /quill full workflow › runs full editor workflow ──────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  42) tests\e2e\plugin-persistence.test.ts:21:5 › /quill plugin persistence › persists History toggle                                                                                                                               

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  43) tests\e2e\editor-workflows.test.ts:30:7 › Toast UI workflow › shows alert on save ────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  44) tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle Link ──────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  45) tests\e2e\page-availability.test.ts:15:3 › opens /quill ──────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  46) tests\e2e\full-workflow.test.ts:22:5 › /slate full workflow › runs full editor workflow ──────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  47) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Slate ──────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  48) tests\e2e\plugin-persistence.test.ts:21:5 › /slate plugin persistence › persists History toggle                                                                                                                               

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  49) tests\e2e\editor-workflows.test.ts:20:5 › CodeX workflow › opens and closes history ──────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  50) tests\e2e\page-availability.test.ts:15:3 › opens /slate ──────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  51) tests\e2e\full-workflow.test.ts:22:5 › /lexical full workflow › runs full editor workflow ────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  52) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Lexical ────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  53) tests\e2e\editor-workflows.test.ts:30:7 › CodeX workflow › shows alert on save ───────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  54) tests\e2e\plugin-persistence.test.ts:21:5 › /lexical plugin persistence › persists CodeHighlight toggle                                                                                                                       

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  55) tests\e2e\page-availability.test.ts:15:3 › opens /lexical ────────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  56) tests\e2e\full-workflow.test.ts:22:5 › /ckeditor full workflow › runs full editor workflow ───

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  57) tests\e2e\plugin-persistence.test.ts:21:5 › /ckeditor plugin persistence › persists Bold toggle

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  58) tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to CKEditor 5 ─────────────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  59) tests\e2e\editor-workflows.test.ts:20:5 › Slate workflow › opens and closes history ──────────                                                                                                                                

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  60) tests\e2e\page-availability.test.ts:15:3 › opens /ckeditor ───────────────────────────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  61) tests\e2e\editor-workflows.test.ts:30:7 › Slate workflow › shows alert on save ───────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  62) tests\e2e\editor-workflows.test.ts:20:5 › Lexical workflow › opens and closes history ────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  63) tests\e2e\editor-workflows.test.ts:30:7 › Lexical workflow › shows alert on save ─────────────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  64) tests\e2e\editor-workflows.test.ts:20:5 › CKEditor workflow › opens and closes history ───────

    Error: browserType.launch: Executable doesn't exist at C:\Users\ericp\AppData\Local\ms-playwright\chromium_headless_shell-1181\chrome-win\headless_shell.exe
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝

  64 failed
    tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Bold ──────────
    tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Italic ────────
    tests\e2e\ckeditor-plugin-toggle.test.ts:12:5 › ckeditor plugin toggles › toggle Underline ─────
    tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle Header ──────────────
    tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle List ────────────────
    tests\e2e\codex-plugin-toggle.test.ts:12:5 › codex plugin toggles › toggle Checklist ───────────
    tests\e2e\dark-mode-toggle.test.ts:4:3 › dark mode toggle › toggles the dark class ─────────────
    tests\e2e\editor-workflows.test.ts:20:5 › TipTap workflow › opens and closes history ───────────
    tests\e2e\editor-workflows.test.ts:30:7 › TipTap workflow › shows alert on save ────────────────
    tests\e2e\editor-workflows.test.ts:20:5 › Toast UI workflow › opens and closes history ─────────
    tests\e2e\editor-workflows.test.ts:30:7 › Toast UI workflow › shows alert on save ──────────────
    tests\e2e\editor-workflows.test.ts:20:5 › CodeX workflow › opens and closes history ────────────
    tests\e2e\editor-workflows.test.ts:30:7 › CodeX workflow › shows alert on save ─────────────────
    tests\e2e\editor-workflows.test.ts:20:5 › Slate workflow › opens and closes history ────────────
    tests\e2e\editor-workflows.test.ts:30:7 › Slate workflow › shows alert on save ─────────────────
    tests\e2e\editor-workflows.test.ts:20:5 › Lexical workflow › opens and closes history ──────────
    tests\e2e\editor-workflows.test.ts:30:7 › Lexical workflow › shows alert on save ───────────────
    tests\e2e\editor-workflows.test.ts:20:5 › CKEditor workflow › opens and closes history ─────────
    tests\e2e\full-workflow.test.ts:22:5 › /tiptap full workflow › runs full editor workflow ───────
    tests\e2e\full-workflow.test.ts:22:5 › /toast full workflow › runs full editor workflow ────────
    tests\e2e\full-workflow.test.ts:22:5 › /codex full workflow › runs full editor workflow ────────
    tests\e2e\full-workflow.test.ts:22:5 › /quill full workflow › runs full editor workflow ────────
    tests\e2e\full-workflow.test.ts:22:5 › /slate full workflow › runs full editor workflow ────────
    tests\e2e\full-workflow.test.ts:22:5 › /lexical full workflow › runs full editor workflow ──────
    tests\e2e\full-workflow.test.ts:22:5 › /ckeditor full workflow › runs full editor workflow ─────
    tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle History ─────────
    tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle Lists ───────────
    tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle CodeHighlight ───
    tests\e2e\lexical-plugin-toggle.test.ts:12:5 › lexical plugin toggles › toggle Link ────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to TipTap ───────────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Toast Editor ─────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to CodeX ────────────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Quill ────────────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Slate ────────────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to Lexical ──────────────────────
    tests\e2e\navigation.test.ts:15:5 › navigation bar › navigates to CKEditor 5 ───────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens / ─────────────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /tiptap ───────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /toast ────────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /codex ────────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /quill ────────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /slate ────────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /lexical ──────────────────────────────────────
    tests\e2e\page-availability.test.ts:15:3 › opens /ckeditor ─────────────────────────────────────
    tests\e2e\plugin-persistence.test.ts:21:5 › /tiptap plugin persistence › persists Underline toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /toast plugin persistence › persists ColorSyntax toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /codex plugin persistence › persists Checklist toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /quill plugin persistence › persists History toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /slate plugin persistence › persists History toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /lexical plugin persistence › persists CodeHighlight toggle
    tests\e2e\plugin-persistence.test.ts:21:5 › /ckeditor plugin persistence › persists Bold toggle
    tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle History ─────────────
    tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle Clipboard ───────────
    tests\e2e\quill-module-toggle.test.ts:12:5 › quill module toggles › toggle Keyboard ────────────
    tests\e2e\quill-workflow.test.ts:4:3 › quill workflow › opens and closes history ───────────────
    tests\e2e\quill-workflow.test.ts:13:3 › quill workflow › shows alert on save ───────────────────
    tests\e2e\slate-plugin-toggle.test.ts:12:5 › slate plugin toggles › toggle History ─────────────
    tests\e2e\slate-plugin-toggle.test.ts:12:5 › slate plugin toggles › toggle Lists ───────────────
    tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle StarterKit ──
    tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle Underline ───
    tests\e2e\tiptap-extension-toggle.test.ts:12:5 › tiptap extension toggles › toggle History ─────
    tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle CodeSyntax ──────────
    tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle TableMerge ──────────
    tests\e2e\toast-plugin-toggle.test.ts:12:5 › toast plugin toggles › toggle ColorSyntax ─────────


