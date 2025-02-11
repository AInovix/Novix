'use client';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';
import { marked } from 'marked';
import { deepseekClient } from '@/lib/clients/deepseek';
import { openai } from '@/lib/clients/openai';
import { anthropic } from '@/lib/clients/anthropic';

export default function Playground() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<'deepseek' | 'openai' | 'claude'>('deepseek');

  const executeCode = async () => {
    setLoading(true);
    try {
      let result;
      switch(provider) {
        case 'deepseek':
          result = await deepseekClient.chat.completions.create({
            messages: [{ role: 'user', content: code }],
            model: 'deepseek-coder-33b-instruct'
          });
          break;
        case 'openai':
          result = await openai.chat.completions.create({
            messages: [{ role: 'user', content: code }],
            model: 'gpt-4'
          });
          break;
        case 'claude':
          result = await anthropic.messages.create({
            messages: [{ role: 'user', content: code }],
            model: 'claude-3-opus-20240229'
          });
          break;
      }

      const content = result.choices?.[0]?.message?.content || 
                     result.content?.[0]?.text || 
                     'No response generated';
      
      setOutput(marked(content));
      setTimeout(() => mermaid.init(), 100);
    } catch (error) {
      setOutput(`## Error\n\`\`\`\n${error instanceof Error ? error.message : 'Unknown error'}\n\`\`\``);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Novix Playground</h1>
        <select 
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          <option value="deepseek">DeepSeek</option>
          <option value="openai">ChatGPT</option>
          <option value="claude">Claude</option>
        </select>
      </header>

      <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-80px)]">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 16
            }}
          />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
          <button
            onClick={executeCode}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded mb-4 disabled:opacity-50"
          >
            {loading ? 'Executing...' : '🚀 Run Code'}
          </button>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
    </div>
  );
}
