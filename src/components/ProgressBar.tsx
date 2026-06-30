"use client";

type ProgressBarProps = {
  watchedCount: number;
  totalCount: number;
  resumeOrder: number | null;
};

export function ProgressBar({ watchedCount, totalCount, resumeOrder }: ProgressBarProps) {
  const percent = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>
          {watchedCount} / {totalCount} watched ({percent}%)
        </span>
        {resumeOrder != null && <span>Resume at #{resumeOrder}</span>}
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
