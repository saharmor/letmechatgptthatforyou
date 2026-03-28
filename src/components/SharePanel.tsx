import { useState, useRef } from 'react';
import type { AIProvider } from '../config/providers';
import './SharePanel.css';

interface SharePanelProps {
  provider: AIProvider;
  query: string;
  generatedUrl: string;
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.07 1.373.14v3.16c-.149-.016-.408-.023-.731-.023-1.037 0-1.438.392-1.438 1.414v2.867h3.984l-.683 3.667h-3.301v8.151z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function SharePanel({ provider, query, generatedUrl }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      inputRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `Let me ${provider.name} that for you: "${query}"`;
  const encodedUrl = encodeURIComponent(generatedUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <div
      className="share-panel"
      style={{ '--provider-accent': provider.accentColor } as React.CSSProperties}
    >
      <p className="share-panel-label">Share this link</p>

      <div className="share-panel-url-row">
        <input
          ref={inputRef}
          className="share-panel-url"
          value={generatedUrl}
          readOnly
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button className="share-panel-copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="share-panel-actions">
        <button
          className="share-panel-action"
          onClick={() => setShowPreview((p) => !p)}
        >
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
      </div>

      <div className="share-panel-social">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-social-btn"
          title="Share on X"
        >
          <XIcon />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-social-btn"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>
        <a
          href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-social-btn"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
        <a
          href={`mailto:?subject=${encodedText}&body=${encodedUrl}`}
          className="share-social-btn"
          title="Share via Email"
        >
          <MailIcon />
        </a>
      </div>

      {showPreview && (
        <div className="share-panel-preview">
          <p className="share-panel-preview-label">Preview</p>
          <iframe
            src={generatedUrl}
            className="share-panel-iframe"
            title="Animation preview"
          />
        </div>
      )}
    </div>
  );
}
