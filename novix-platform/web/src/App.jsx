import React, { useState } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';

export default function Playground() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt: input })
      });

      const data = await response.json();
      
      setConversation(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'ai', content: data.response }
      ]);

      // Render Mermaid diagrams
      setTimeout(() => {
        mermaid.init({ noteMargin: 10 }, '.mermaid');
      }, 100);

    } catch (error) {
      setConversation(prev => [...prev, 
        { role: 'error', content: 'Failed to get response' }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="playground">
      <div className="conversation">
        {conversation.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === 'ai' ? (
              <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        {isLoading && <div className="loader">⚡ Processing...</div>}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Novix to explain concepts, generate code, or analyze data..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
