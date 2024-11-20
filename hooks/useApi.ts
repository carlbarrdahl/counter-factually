"use client";

import { networks, predictors } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { addMonths, subMonths } from "date-fns";
import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";

const apiUrl = "https://counterfactually-production.up.railway.app/synth";

const networkIds = networks.map((n) => n.value);
const predictorsIds = predictors.map((n) => n.value);

export enum Components {
  settings = "settings",
  brush = "brush",
  weights = "weights",
  smoothing = "smoothing",
}
const components = [
  Components.settings,
  Components.brush,
  Components.weights,
  Components.smoothing,
];
export function useChartParams() {
  return useQueryStates(
    {
      // Only used by frontend
      view: parseAsString.withDefault("default"),
      smoothing: parseAsInteger.withDefault(30),

      months_of_training: parseAsInteger.withDefault(12),
      intervention_date: parseAsString.withDefault("2023-12-01"),

      // Sent to backend
      dependent: parseAsStringEnum(predictorsIds).withDefault("daa"),
      predictors: parseAsArrayOf(parseAsStringEnum(predictorsIds)).withDefault([
        "market_cap_eth",
        "txcount",
        "stables_mcap",
        "txcosts_median_eth",
        "fees_paid_eth",
        "gas_per_second",
        "tvl_eth",
        "stables_mcap_eth",
        "fdv_eth",
      ]),
      treatment_identifier:
        parseAsStringEnum(networkIds).withDefault("arbitrum"),
      controls_identifier: parseAsArrayOf(
        parseAsStringEnum([
          "ethereum",
          "polygon_zkevm",
          "loopring",
          "metis",
          "scroll",
          "zksync_era",
          "base",
          "optimism",
        ])
      ).withDefault(networkIds.filter((network) => network !== networkIds[1])),

      show: parseAsArrayOf(parseAsStringEnum(components)).withDefault(
        components
      ),
    },
    { history: "replace" }
  );
}

export function useApi() {
  const [params] = useChartParams();
  return useQuery({
    queryKey: ["api", params],
    queryFn: async () => {
      const {
        dependent,
        treatment_identifier,
        controls_identifier,
        predictors,
        months_of_training,
      } = params;

      const intervention_date = new Date(params.intervention_date);
      const time_predictors_prior_start = subMonths(
        intervention_date,
        months_of_training
      );
      const time_predictors_prior_end = subMonths(intervention_date, 2);
      return fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
          time_predictors_prior_start: time_predictors_prior_start
            .toISOString()
            .slice(0, -5),
          time_predictors_prior_end: intervention_date
            .toISOString()
            .slice(0, -5),
          time_optimize_ssr_start: intervention_date.toISOString().slice(0, -5),
          time_optimize_ssr_end: addMonths(intervention_date, 4)
            .toISOString()
            .slice(0, -5),
          dependent,
          predictors,
          treatment_identifier,
          controls_identifier: controls_identifier.filter(
            (network) => network !== treatment_identifier
          ),
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.detail) throw new Error(data.detail);
          return {
            ...data,
            data: movingAverage(
              data.data,
              ["treatment", "synthetic"],
              params.smoothing
            ).map((v) => ({
              ...v,
              impact_ratio: v.treatment / v.synthetic,
            })),
          };
        });
    },
  });
}

function movingAverage(
  data: { date: string; treatment: number; synthetic: number }[] = [],
  keys: string[] = [],
  windowSize = 1
) {
  return data.map((_, idx, arr) => {
    const start = Math.max(0, idx - Math.floor(windowSize / 2));
    const end = Math.min(arr.length, idx + Math.ceil(windowSize / 2));
    const subset = arr.slice(start, end);

    // Calculate the average date in the window (for "centered" smoothing)
    const avgTimestamp =
      subset.reduce((acc, item) => acc + new Date(item.date).getTime(), 0) /
      subset.length;
    const avgDate = new Date(avgTimestamp).toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

    // Create a new entry with smoothed date and values
    const smoothedEntry = { date: avgDate };

    // Calculate the moving average for each key
    keys.forEach((key) => {
      const average =
        subset.reduce((acc, item) => acc + item[key], 0) / subset.length;
      smoothedEntry[`${key}`] = average;
    });

    return smoothedEntry;
  });
}
