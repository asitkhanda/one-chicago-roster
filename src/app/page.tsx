import { EpisodeTable } from "@/components/EpisodeTable";
import { loadDataset } from "@/lib/episodes";

export default function HomePage() {
  const dataset = loadDataset();

  return <EpisodeTable dataset={dataset} />;
}
