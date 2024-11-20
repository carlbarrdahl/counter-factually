"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useApi } from "@/hooks/useApi";
import { networks } from "@/config";

export function Weights() {
  const { data, error } = useApi();

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.toString()}</AlertDescription>
      </Alert>
    );
  return (
    <div className="mb-2 text-sm">
      <h3 className="font-semibold">Weighted control networks</h3>
      <div className="flex gap-2 font-mono">
        Synthetic Control ={" "}
        {Object.entries(data?.weights ?? {}).map(([key, val], index, array) => (
          <div key={key}>
            {networks.find((network) => network.value === key)?.label} &times;{" "}
            {String(val)}
            <span className="font-bold">
              {index < array.length - 1 && " +"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
