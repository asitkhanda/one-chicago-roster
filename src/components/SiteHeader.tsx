import Image from "next/image";

type SiteHeaderProps = {
  episodeCount: number;
  syncedAt: string;
};

function formatLastUpdated(syncedAt: string) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(syncedAt));

  return formatted.toUpperCase();
}

export function SiteHeader({ episodeCount, syncedAt }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-brand" aria-hidden="true">
        <Image
          src="/images/header/one-chicago-logo.png"
          alt=""
          width={285}
          height={171}
          className="site-header-logo"
          priority
        />
      </div>

      <div className="site-header-collage" aria-hidden="true">
        <Image
          src="/images/header/one-chicago-collage.png"
          alt=""
          fill
          sizes="205px"
          className="site-header-collage-image"
          priority
        />
      </div>

      <div className="site-header-meta">
        <div className="site-header-badge-group">
          <span className="site-header-episode-badge">
            {episodeCount.toLocaleString()} Episodes
          </span>
          <div className="site-header-updated">
            <span>Last Updated: {formatLastUpdated(syncedAt)}</span>
            <Image
              src="/images/header/calendar.png"
              alt=""
              width={16}
              height={16}
              className="site-header-calendar"
            />
          </div>
        </div>
        <p className="site-header-tagline">
          The in-universe watch order for Chicago Fire, P.D., Med and other crossovers
        </p>
      </div>
    </header>
  );
}
