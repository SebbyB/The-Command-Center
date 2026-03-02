import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionLayout from '../components/SectionLayout';

const WS_URL = 'wss://echo.websocket.org';

interface Message {
  id: number;
  timestamp: string;
  text: string;
  direction: 'sent' | 'received';
}

type Status = 'connecting' | 'connected' | 'error' | 'disconnected';

const STATUS_COLOR: Record<Status, string> = {
  connecting:   'var(--terminal-blush)',
  connected:    'var(--terminal-cyan)',
  error:        'var(--terminal-pink)',
  disconnected: 'var(--terminal-text-muted)',
};

const RealtimePage: React.FC = () => {
  const [status, setStatus]     = useState<Status>('connecting');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const wsRef  = useRef<WebSocket | null>(null);
  const idRef  = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((text: string, direction: Message['direction']) => {
    setMessages(prev => [...prev, {
      id: idRef.current++,
      timestamp: new Date().toLocaleTimeString(),
      text,
      direction,
    }]);
  }, []);

  const connect = useCallback(() => {
    wsRef.current?.close();
    setStatus('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen    = () => setStatus('connected');
    ws.onmessage = e => addMessage(String(e.data), 'received');
    ws.onerror   = () => setStatus('error');
    ws.onclose   = () => setStatus(s => s === 'connecting' ? 'error' : 'disconnected');
  }, [addMessage]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || status !== 'connected') return;
    wsRef.current?.send(text);
    addMessage(text, 'sent');
    setInput('');
  };

  return (
    <SectionLayout withBackground>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="terminal-cyan" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          realtime
        </h1>
        <p className="terminal-text-secondary" style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
          Live WebSocket echo demo — messages you send are echoed back by the server.
        </p>
      </div>

      {/* Status + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
        <span>
          <span className="terminal-text-muted">status </span>
          <span style={{ color: STATUS_COLOR[status] }}>● {status}</span>
        </span>
        <span className="terminal-text-muted" style={{ fontFamily: 'inherit' }}>
          {WS_URL}
        </span>
        {(status === 'error' || status === 'disconnected') && (
          <button onClick={connect} style={linkBtnStyle}>
            reconnect
          </button>
        )}
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} style={linkBtnStyle}>
            clear
          </button>
        )}
      </div>

      {/* Message log */}
      <div style={{
        background: 'var(--terminal-surface)',
        border: '1px solid rgba(33, 250, 144, 0.2)',
        borderRadius: '6px',
        minHeight: '260px',
        maxHeight: '420px',
        overflowY: 'auto',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}>
        {messages.length === 0 ? (
          <span className="terminal-text-muted">
            {status === 'connecting' ? 'Connecting…' : status === 'connected' ? 'Send a message below.' : 'Connection failed.'}
          </span>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'baseline',
              justifyContent: msg.direction === 'sent' ? 'flex-end' : 'flex-start',
            }}>
              {msg.direction === 'received' && (
                <span style={{ color: 'var(--terminal-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {msg.timestamp}
                </span>
              )}
              <span style={{
                color: msg.direction === 'sent'
                  ? 'var(--terminal-cyan)'
                  : 'var(--terminal-text-secondary)',
                background: msg.direction === 'sent'
                  ? 'rgba(33, 250, 144, 0.07)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.direction === 'sent' ? 'rgba(33,250,144,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '4px',
                padding: '0.25rem 0.6rem',
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}>
                {msg.direction === 'sent' ? '↑ ' : '↓ '}{msg.text}
              </span>
              {msg.direction === 'sent' && (
                <span style={{ color: 'var(--terminal-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {msg.timestamp}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={status !== 'connected'}
          placeholder={status === 'connected' ? 'Type a message and press Enter…' : status}
          style={{
            flex: 1,
            background: 'var(--terminal-surface)',
            border: '1px solid rgba(33, 250, 144, 0.2)',
            borderRadius: '4px',
            color: 'var(--terminal-text-primary)',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            padding: '0.4rem 0.75rem',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={status !== 'connected' || !input.trim()}
          style={sendBtnStyle(status === 'connected' && !!input.trim())}
        >
          send
        </button>
      </div>
    </SectionLayout>
  );
};

const linkBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--terminal-text-muted)',
  fontFamily: 'inherit',
  fontSize: '0.82rem',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
};

const sendBtnStyle = (active: boolean): React.CSSProperties => ({
  background: 'none',
  border: `1px solid ${active ? 'var(--terminal-cyan)' : 'rgba(33,250,144,0.2)'}`,
  borderRadius: '4px',
  color: active ? 'var(--terminal-cyan)' : 'var(--terminal-text-muted)',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  padding: '0.4rem 0.9rem',
  cursor: active ? 'pointer' : 'not-allowed',
  transition: 'color 0.15s, border-color 0.15s',
});

export default RealtimePage;
