"use client";

import { FilmStrip, Hash } from "@phosphor-icons/react";

type JumpToInputProps = {
  onJump: (order: number) => void;
};

export function JumpToInput({ onJump }: JumpToInputProps) {
  return (
    <form
      className="jump-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem("jump") as HTMLInputElement;
        const value = Number(input.value);
        if (value > 0) onJump(value);
      }}
    >
      <label htmlFor="jump-to" className="toolbar-input-label">
        Jump to a particular episode number
      </label>
      <div className="jump-row">
        <div className="toolbar-input-shell jump-input-shell">
          <Hash className="toolbar-input-icon" size={20} weight="regular" aria-hidden />
          <input
            id="jump-to"
            name="jump"
            type="number"
            min={1}
            placeholder="23"
            className="toolbar-input jump-input"
            aria-label="Jump to episode number"
          />
        </div>
        <button type="submit" className="jump-go-button">
          <span>Go</span>
          <FilmStrip size={20} weight="regular" aria-hidden />
        </button>
      </div>
    </form>
  );
}
