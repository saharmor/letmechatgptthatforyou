import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProvider, getDisplayName } from '../config/providers';
import SearchBox from '../components/SearchBox';
import SharePanel from '../components/SharePanel';
import StepIndicator from '../components/StepIndicator';
import AnimatedCursor from '../components/AnimatedCursor';
import './AISitePage.css';

interface AISitePageProps {
  providerId: string;
}

type AnimationPhase =
  | 'idle'
  | 'step1'
  | 'typing'
  | 'step2'
  | 'cursor-to-button'
  | 'clicking'
  | 'message'
  | 'redirecting';

export default function AISitePage({ providerId }: AISitePageProps) {
  const provider = getProvider(providerId);
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q');

  const [inputValue, setInputValue] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [helperText, setHelperText] = useState('Type a question, click the button.');

  // Animation state
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [typedText, setTypedText] = useState('');
  const [stepText, setStepText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [cursorClickEffect, setCursorClickEffect] = useState(false);
  const [cursorTarget, setCursorTarget] = useState<HTMLElement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isAnimationMode = !!queryFromUrl;

  useEffect(() => {
    if (!provider) return;
    const title = queryFromUrl
      ? `${queryFromUrl} - Let me ${provider.name} that for you`
      : getDisplayName(provider);
    document.title = title;
    return () => {
      document.title = 'Let Me AI That For You';
    };
  }, [provider, queryFromUrl]);

  const handleGenerate = useCallback(() => {
    if (!inputValue.trim() || !provider) return;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const url = `${window.location.origin}${base}/${providerId}?q=${encodeURIComponent(inputValue.trim())}`;
    setGeneratedUrl(url);
    setHelperText('All done! Share the link below.');
  }, [inputValue, provider, providerId]);

  // Animation sequence for receiver mode
  useEffect(() => {
    if (!isAnimationMode || !queryFromUrl || !provider) return;

    const query = queryFromUrl;
    let cancelled = false;

    const run = async () => {
      await delay(500);
      if (cancelled) return;

      // Step 1: Show instruction
      setPhase('step1');
      setStepText('Step 1: Type in your question');
      await delay(1500);
      if (cancelled) return;

      setCursorTarget(inputRef.current);
      setShowCursor(true);
      await delay(1000);
      if (cancelled) return;

      // Type characters one by one
      setPhase('typing');
      for (let i = 0; i <= query.length; i++) {
        if (cancelled) return;
        setTypedText(query.slice(0, i));
        await delay(50 + Math.random() * 40);
      }

      await delay(600);
      if (cancelled) return;

      // Step 2: Show click instruction
      setPhase('step2');
      setStepText('Step 2: Hit send!');
      await delay(1200);
      if (cancelled) return;

      setPhase('cursor-to-button');
      setCursorTarget(buttonRef.current);
      await delay(1000);
      if (cancelled) return;

      // Click
      setPhase('clicking');
      setCursorClickEffect(true);
      await delay(300);
      setCursorClickEffect(false);
      await delay(400);
      if (cancelled) return;

      // Show sarcastic message
      setPhase('message');
      setShowCursor(false);
      setStepText('Was that so hard?');
      await delay(2000);
      if (cancelled) return;

      // Redirect
      setPhase('redirecting');
      window.open(provider.buildRedirectUrl(query), '_blank');
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isAnimationMode, queryFromUrl, provider]);

  if (!provider) {
    return <div className="ai-site-error">Unknown provider</div>;
  }

  const accentVars = {
    '--provider-accent': provider.accentColor,
    '--provider-accent-light': provider.accentColorLight,
  } as React.CSSProperties;

  const titleElement = (
    <h1 className="ai-site-title">
      {provider.titlePrefix}
      <span className="ai-site-title-accent">{provider.titleAccent}</span>
      {provider.titleSuffix}
    </h1>
  );

  // Animation mode (receiver experience)
  if (isAnimationMode) {
    return (
      <div className="ai-site" style={accentVars}>
        <div className="ai-site-content">
          <Link to={`/${providerId}`} className="ai-site-logo">
            {titleElement}
          </Link>

          <SearchBox
            provider={provider}
            value={typedText}
            readOnly
            inputRef={inputRef}
            buttonRef={buttonRef}
          />

          <StepIndicator
            text={stepText}
            visible={phase !== 'idle' && phase !== 'redirecting'}
          />

          {phase === 'redirecting' && (
            <div className="ai-site-redirect-fallback">
              <p>
                Opening {provider.name}...{' '}
                <a
                  href={provider.buildRedirectUrl(queryFromUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here if it didn't open
                </a>
              </p>
            </div>
          )}

          <AnimatedCursor
            targetElement={cursorTarget}
            visible={showCursor}
            onClick={cursorClickEffect}
          />
        </div>

        <Footer provider={provider} providerId={providerId} />
      </div>
    );
  }

  // Creator mode
  return (
    <div className="ai-site" style={accentVars}>
      <div className="ai-site-content">
        <Link to="/" className="ai-site-back">&larr; Back</Link>

        {titleElement}
        <p className="ai-site-tagline">{provider.tagline}</p>

        <SearchBox
          provider={provider}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleGenerate}
        />

        <p className="ai-site-helper">{helperText}</p>

        {generatedUrl && (
          <SharePanel
            provider={provider}
            query={inputValue}
            generatedUrl={generatedUrl}
          />
        )}
      </div>

      <Footer provider={provider} providerId={providerId} />
    </div>
  );
}

function Footer({
  provider,
  providerId,
}: {
  provider: { name: string };
  providerId: string;
}) {
  const otherProvider = providerId === 'chatgpt' ? 'claude' : 'chatgpt';
  const otherName = providerId === 'chatgpt' ? 'Claude' : 'ChatGPT';

  return (
    <footer className="ai-site-footer">
      <Link to={`/${otherProvider}`}>Let me {otherName} that</Link>
      <span className="ai-site-footer-sep">|</span>
      <span>Not associated with {provider.name} in any way.</span>
    </footer>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
