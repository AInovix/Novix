import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';
import { marked } from 'marked';
import axios from 'axios';

mermaid.initialize({ startOnLoad: false });

export default function Playground() {
  const [code, setCode] = useState('# Start coding here\nprint("Hello Novix")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const executeCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/execute', {
        code,
        language: 'python',
        provider: 'openai'
      }, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` }
      });
      
      setOutput(marked(response.data.result));
      setTimeout(() => mermaid.init(), 100);
    } catch (error) {
      setOutput(`## Error\n\`\`\`\n${error.response?.data?.error || error.message}\n\`\`\``);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="playground-container">
      <div className="editor-pane">
        <Editor
          height="80vh"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
        />
        <button onClick={executeCode} disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : '🚀 Run'}
        </button>
      </div>
      <div 
        className="output-pane" 
        dangerouslySetInnerHTML={{ __html: output }}
      />
    </div>
  );
}
