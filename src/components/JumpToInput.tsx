"use client";

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
      <label htmlFor="jump-to" className="sr-only">
        Jump to episode number
      </label>
      <input
        id="jump-to"
        name="jump"
        type="number"
        min={1}
        placeholder="Go to #"
        className="jump-input"
      />
      <button type="submit" className="toolbar-button">
        Go
      </button>
    </form>
  );
}
