import React from "react";
import { useAITheme } from "../../hooks/useAIContext";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  leftLabel?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Toggle = ({ value, onChange, leftLabel = "On", rightLabel = "Off", style, className }: ToggleProps) => {
  const { isAI } = useAITheme();

  const toggle = () => onChange(!value);

  return (
    <div
      className={`toggle__wrapper ${className !== undefined ? className : ''} ${isAI ? 'toggle__wrapper--ai' : ''}`}
      style={style}
      onClick={toggle}
    >
      <div
        className={`toggle__slider ${value ? 'toggle__slider--active' : ''} ${isAI ? 'toggle__slider--ai' : ''}`}
      />

      <div className="toggle__item">
        <span className={`toggle__text ${value ? 'toggle__text--active' : ''}`}>
          {leftLabel}
        </span>
      </div>
      <div className="toggle__item">
        <span className={`toggle__text ${!value ? 'toggle__text--active' : ''}`}>
          {rightLabel}
        </span>
      </div>
    </div>
  );
};
