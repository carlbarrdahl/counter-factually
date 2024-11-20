import { Suspense } from "react";
import { SyntheticChart } from "../_components/synthetic-chart";
import { Iframe } from "../_components/iframe";

export default function Home() {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-xl">Preset Charts</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3">
        <Iframe src={`/embed?smoothing=30&show=`} width={"100%"} height={300} />
        <Iframe
          src={`/embed?smoothing=30&show=&treatment_identifier=optimism&intervention_date=2023-06-01&dependent=market_cap_eth`}
          width={"100%"}
          height={300}
        />
        <Iframe
          src={`/embed?smoothing=30&show=&treatment_identifier=zksync_era&intervention_date=2024-01-01&dependent=txcount&controls_identifier=base,polygon_zkevm,loopring,metis,scroll,zksync_era,optimism`}
          width={"100%"}
          height={300}
        />
      </div>
      <h3 className="font-semibold text-xl mb-2">Embeddable iframe</h3>
      <div className="bg-gray-950 text-gray-200 rounded p-2 text-sm mb-16">
        <pre className="font-mono">{`<iframe
  src={"https://counter-factually.vercel.app/embed?show=settings,brush,weights,smoothing&smoothing=30&treatment_identifier=optimism&intervention_date=2023-06-01&dependent=market_cap_eth"}
  width={"100%"}
  height={600}
/>`}</pre>
      </div>
      <h3 className="font-semibold text-xl mb-2">Playground</h3>
      <div className="">
        <Suspense>
          <SyntheticChart />
        </Suspense>
      </div>
    </div>
  );
}
