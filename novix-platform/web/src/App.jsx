import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import Markdown from 'react-markdown';

const NovixPlayground = () => {
  const [code, setCode] = useState('# Write your code here\nprint("Hello Novix!")');
  const [messages, setMessages] = useState([]);
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4');
  
  const providers = {
    openai: ['gpt-4', 'gpt-3.5'],
    anthropic: ['claude-3', 'claude-2'],
    // Add models for other providers
  };

  const executeCode = async () => {
    try {
      const response = await axios.post('/api/execute', {
        code,
        provider,
        model
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setMessages([...messages, 
        { type: 'code', content: code },
        { type: 'ai', content: response.data.result, provider }
      ]);
    } catch (error) {
      setMessages([...messages, {
        type: 'error',
        content: 'Execution failed: ' + error.response?.data?.error
      }]);
    }
  };

  return (
    <div className="playground-container">
      <div className="provider-selector">
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          {Object.keys(providers).map(p => (
            <option key={p} value={p}>{p.toUpperCase()}</option>
          ))}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {providers[provider].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="editor-container">
        <Editor
          height="60vh"
          defaultLanguage="python"
          defaultValue={code}
          onChange={setCode}
          theme="vs-dark"
        />
        
        <div className="chat-panel">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.type}`}>
              {msg.type === 'code' ? (
                <pre>{msg.content}</pre>
              ) : (
                <Markdown>{msg.content}</Markdown>
              )}
              {msg.provider && <span className="provider-tag">{msg.provider}</span>}
            </div>
          ))}
        </div>
      </div>

      <button className="execute-button" onClick={executeCode}>
        🚀 Run Code
      </button>
    </div>
  );
};
