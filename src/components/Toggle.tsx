"use client";

type ToggleProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export function Toggle({ id, label, checked, onChange }: ToggleProps) {
  return (
    <div className="toolbar-toggle">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="toolbar-toggle-track"
        data-checked={checked}
        onClick={onChange}
      >
        <span className="toolbar-toggle-knob" />
      </button>
      <label htmlFor={id} className="toolbar-toggle-label">
        {label}
      </label>
    </div>
  );
}
