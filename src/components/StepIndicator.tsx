import './StepIndicator.css';

interface StepIndicatorProps {
  text: string;
  visible: boolean;
}

export default function StepIndicator({ text, visible }: StepIndicatorProps) {
  return (
    <div className={`step-indicator ${visible ? 'step-indicator--visible' : ''}`}>
      {text}
    </div>
  );
}
