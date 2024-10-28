import { SyntheticChart } from "./_components/synthetic-chart";

export default function Home() {
  return (
    <div className="p-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <SyntheticChart />
        <SyntheticChart />
        <SyntheticChart />
      </div>
    </div>
  );
}
