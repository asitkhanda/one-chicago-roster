import type { EpisodeDataset } from "./types";

import { getSiteUrl } from "./site-url";

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "One Chicago Roster",
    url: siteUrl,
    description:
      "The definitive in-universe watch order for Chicago Fire, P.D., Med, Justice, and crossover episodes.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebApplicationJsonLd(dataset: EpisodeDataset) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "One Chicago Roster",
    url: siteUrl,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    description:
      "Browse and track 800+ One Chicago episodes in community-curated in-universe chronological order.",
    dateModified: dataset.syncedAt,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: dataset.sourceAttribution,
      url: "https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline",
    },
  };
}

export function buildItemListJsonLd(dataset: EpisodeDataset) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "One Chicago in-universe watch order",
    description:
      "Chronological episode order for Chicago Fire, Chicago P.D., Chicago Med, Chicago Justice, and crossover episodes.",
    numberOfItems: dataset.episodeCount,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
  };
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the correct order to watch One Chicago?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Watch One Chicago in in-universe chronological order rather than original air date. One Chicago Roster lists every Chicago Fire, Chicago P.D., Chicago Med, Chicago Justice, and crossover episode in the community-curated timeline maintained by Game Over Gallery.",
        },
      },
      {
        "@type": "Question",
        name: "Should I watch One Chicago in air date or chronological order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a first binge through the franchise, in-universe chronological order is recommended so crossover storylines and character arcs play out in narrative sequence. One Chicago Roster follows the community spreadsheet timeline, which may differ from broadcast order.",
        },
      },
      {
        "@type": "Question",
        name: "How many episodes are in the One Chicago universe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The roster tracks more than 800 episodes across Chicago Fire, Chicago P.D., Chicago Med, Chicago Justice, and related crossover shows. The count is updated daily from the community Google Sheet.",
        },
      },
      {
        "@type": "Question",
        name: "Where do crossover episodes fit in the One Chicago watch order?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Crossover episodes are placed at their in-universe story position in the roster, not grouped by show. Search the roster for crossover notes or filter by show to see where each series intersects.",
        },
      },
    ],
  };
}

export function buildAboutPageJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About One Chicago Roster",
    url: `${siteUrl}/about`,
    description:
      "Unofficial fan-built companion for binge-watching the One Chicago universe in in-universe order.",
    isPartOf: {
      "@type": "WebSite",
      name: "One Chicago Roster",
      url: siteUrl,
    },
  };
}
