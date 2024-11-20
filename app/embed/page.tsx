import { Suspense } from "react";
import { Settings } from "../_components/settings";
import { SyntheticChart } from "../_components/synthetic-chart";

export default function Embed() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-1">
        <Suspense>
          <SyntheticChart />
        </Suspense>
      </div>
    </div>
  );
}
