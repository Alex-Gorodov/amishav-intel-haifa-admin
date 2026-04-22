import React, { useState } from "react";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  leftLabel?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
  style?: React.CSSProperties;
}

export const Toggle = ({ value, onChange, leftLabel = "On", rightLabel = "Off", style }: ToggleProps) => {
  const toggle = () => {
    onChange(!value);
  };

  return (
    <div
      className="toggle__wrapper"
      style={style}
      onClick={toggle}
    >
      <div
        className={`toggle__slider ${value ? 'toggle__slider--active' : ''}`}
      />

      <div className="toggle__item">
        <span className={`toggle__text ${value ? 'toggle__text--active' : ''}`}>{leftLabel}</span>
      </div>
      <div className="toggle__item">
        <span className={`toggle__text ${!value ? 'toggle__text--active' : ''}`}>{rightLabel}</span>
      </div>
    </div>
  );
};
