import React from "react";
import { useAITheme } from "../../hooks/useAIContext";

interface TripleToggleOption {
  label: string | React.ReactNode;
  value: string | number | boolean;
}

interface TripleToggleProps {
  value: string | number | boolean;
  onChange: (value: any) => void;
  options: [TripleToggleOption, TripleToggleOption, TripleToggleOption];
  style?: React.CSSProperties;
}

export const TripleToggle = ({ value, onChange, options, style }: TripleToggleProps) => {
  const { isAI } = useAITheme();

  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div
      className={`toggle__wrapper toggle__wrapper--tripple ${isAI ? 'toggle__wrapper--ai' : ''}`}
      style={style}
    >
      <div
        className={`toggle__slider toggle__slider--tripple ${isAI ? 'toggle__slider--ai' : ''}`}
        style={{
          // Multiplied by -100% to compensate for the Right-to-Left (RTL) axis flip
          transform: `translateX(${activeIndex * -100 + 200}%)`
        }}
      />

      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            className="toggle__item toggle__item--tripple"
            onClick={() => onChange(option.value)}
          >
            <span className={`toggle__text ${isActive ? 'toggle__text--active' : ''}`}>
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
