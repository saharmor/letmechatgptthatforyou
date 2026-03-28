import type { AIProvider } from '../config/providers';
import './SearchBox.css';

interface SearchBoxProps {
  provider: AIProvider;
  value: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function SearchBox({
  provider,
  value,
  onChange,
  onSubmit,
  readOnly = false,
  inputRef,
  buttonRef,
}: SearchBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="search-box">
      <input
        ref={inputRef}
        type="text"
        className="search-box-input"
        placeholder={provider.placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        autoComplete="off"
      />
      <button
        ref={buttonRef}
        className="search-box-button"
        onClick={onSubmit}
        aria-label={provider.buttonLabel}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  );
}
