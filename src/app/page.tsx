import { CrawlerEpisodeIndex } from "@/components/CrawlerEpisodeIndex";
import { EpisodeTable } from "@/components/EpisodeTable";
import { StructuredData } from "@/components/StructuredData";
import { loadDataset } from "@/lib/episodes";
import {
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";

export default function HomePage() {
  const dataset = loadDataset();

  return (
    <>
      <StructuredData
        data={[
          buildWebSiteJsonLd(),
          buildWebApplicationJsonLd(dataset),
          buildItemListJsonLd(dataset),
          buildFaqJsonLd(),
        ]}
      />
      <CrawlerEpisodeIndex dataset={dataset} />
      <EpisodeTable dataset={dataset} />
    </>
  );
}
