import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function LexicalPage() {
  return (
    <div>
      <NavBar />
      <h1>Lexical Editor</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['history', 'markdown']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="lexical" />
    </div>
  );
}
