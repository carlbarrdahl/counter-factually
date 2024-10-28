"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { z } from "zod";

import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";
import { useChartParams } from "@/hooks/useApi";
import { networks, predictors } from "@/config";

const formSchema = z.object({
  predictor_prio: z.array(z.string()),
  optimize_ssr: z.array(z.string()),
  predictors: z.array(z.string()),
  network: z.string(),
  dependent: z.string(),
  treatment_identifier: z.string(),
  controls_identifier: z.array(z.string()),
});

export function Settings() {
  const [params, setParams] = useChartParams();

  console.log("params", params);

  return (
    <div>
      <div className="flex gap-1">
        <div>
          <Label>Treatment Network</Label>
          <div className="flex gap-1">
            <Select
              value={params.treatment_identifier}
              onValueChange={(treatment_identifier) =>
                setParams({ treatment_identifier })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                {networks.map((network) => (
                  <SelectItem key={network.value} value={network.value}>
                    {network.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-1">
          <div>
            <Label>Intervention date</Label>
            <div className="flex gap-1">
              <Input
                placeholder="2023-01-01"
                value={params.intervention_date}
                onChange={(e) => {
                  setParams({ intervention_date: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="w-[140px]">
            <Label>Months of training</Label>
            <Input
              type="number"
              value={params.months_of_training}
              onChange={(e) =>
                setParams({ months_of_training: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Label>Control Networks</Label>
        <MultiSelect
          placeholder="Select networks..."
          value={params.controls_identifier?.map((id) =>
            networks.find((p) => p.value === id)
          )}
          onChange={(values) =>
            setParams({ controls_identifier: values.map((v) => v.value) })
          }
          options={networks}
        />
      </div>
      <div className="flex-1">
        <Label>Predictors</Label>
        <MultiSelect
          placeholder="Select predictors..."
          value={params.predictors.map((id) =>
            predictors.find((p) => p.value === id)
          )}
          onChange={(values) =>
            setParams({ predictors: values.map((v) => v.value) })
          }
          options={predictors}
        />
      </div>
    </div>
  );
}
