import { useEffect, useState, useRef } from 'react';
import './AnimatedCursor.css';

interface AnimatedCursorProps {
  targetElement: HTMLElement | null;
  visible: boolean;
  onClick?: boolean;
}

export default function AnimatedCursor({
  targetElement,
  visible,
  onClick = false,
}: AnimatedCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const innerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible || !targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [visible, targetElement]);

  useEffect(() => {
    if (!onClick || !visible) return;

    const outer = window.setTimeout(() => {
      setClicking(true);
      innerTimerRef.current = window.setTimeout(() => setClicking(false), 200);
    }, 600);

    return () => {
      window.clearTimeout(outer);
      if (innerTimerRef.current !== null) {
        window.clearTimeout(innerTimerRef.current);
        innerTimerRef.current = null;
      }
    };
  }, [onClick, visible]);

  if (!visible) return null;

  return (
    <div
      className={`animated-cursor ${clicking ? 'animated-cursor--click' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
          fill="#1a1a1a"
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
