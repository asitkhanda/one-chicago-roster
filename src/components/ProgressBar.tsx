"use client";

type ProgressBarProps = {
  watchedCount: number;
  totalCount: number;
  resumeOrder: number | null;
};

export function ProgressBar({ watchedCount, totalCount, resumeOrder }: ProgressBarProps) {
  const percentExact = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;
  const percentLabel = Math.round(percentExact);
  const fillWidth = watchedCount > 0 ? Math.max(percentExact, 0.5) : 0;

  return (
    <div className="progress-wrap">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentLabel}
        aria-label={`${watchedCount} of ${totalCount} episodes watched`}
      >
        <div className="progress-fill" style={{ width: `${fillWidth}%` }} />
      </div>
      <div className="progress-meta">
        <span>
          {watchedCount} / {totalCount} watched ({percentLabel}%)
        </span>
        {resumeOrder != null && <span>Currently at #{resumeOrder}</span>}
      </div>
    </div>
  );
}
