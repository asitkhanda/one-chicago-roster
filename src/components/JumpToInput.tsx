"use client";

type JumpToInputProps = {
  onJump: (order: number) => void;
};

export function JumpToInput({ onJump }: JumpToInputProps) {
  return (
    <form
      className="jump-form toolbar-field"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem("jump") as HTMLInputElement;
        const value = Number(input.value);
        if (value > 0) onJump(value);
      }}
    >
      <label htmlFor="jump-to" className="toolbar-label">
        Go to Series Number
      </label>
      <div className="jump-row">
        <input
          id="jump-to"
          name="jump"
          type="number"
          min={1}
          placeholder="Series number"
          className="jump-input"
          aria-label="Go to series number"
        />
        <button type="submit" className="toolbar-button jump-submit">
          Go
        </button>
      </div>
    </form>
  );
}
