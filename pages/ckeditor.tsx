import PluginManager from '../components/PluginManager';
import TemplateLoader from '../components/TemplateLoader';
import EditorIntegrationInfo from '../components/EditorIntegrationInfo';
import NavBar from '../components/NavBar';

export default function CkeditorPage() {
  return (
    <div>
      <NavBar />
      <h1>CKEditor 5</h1>
      <textarea data-testid="editor" />
      <PluginManager plugins={['alignment', 'image']} />
      <TemplateLoader onLoad={console.log} />
      <EditorIntegrationInfo editorName="ckeditor" />
    </div>
  );
}
