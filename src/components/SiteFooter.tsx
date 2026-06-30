import Link from "next/link";

type SiteFooterProps = {
  syncedAt: string;
};

export function SiteFooter({ syncedAt }: SiteFooterProps) {
  const syncedLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(syncedAt));

  return (
    <footer className="site-footer">
      <p>
        Episode order data from{" "}
        <a
          href="https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline"
          target="_blank"
          rel="noreferrer"
        >
          Game Over Gallery / petitcartonvert
        </a>
        , via the{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1d6nnW_I3qrWUujOXi1Db2717wUKX86J4wRZdGOYPDog/edit"
          target="_blank"
          rel="noreferrer"
        >
          community spreadsheet
        </a>
        . UI inspired by{" "}
        <a href="https://arrowverse.info/" target="_blank" rel="noreferrer">
          arrowverse.info
        </a>
        .
      </p>
      <p>
        One Chicago Roster is a fan project and is <strong>not affiliated</strong> with NBCUniversal
        or Wolf Entertainment.
      </p>
      <p className="footer-meta">
        Last synced {syncedLabel} · <Link href="/about">About</Link>
      </p>
    </footer>
  );
}
