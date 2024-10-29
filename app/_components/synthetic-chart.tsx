"use client";

import {
  Cross,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Customized,
  YAxis,
  Brush,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApi, useChartParams } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { ChartSpline, TrendingUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SyntheticChart() {
  const { data, isPending, error } = useApi();
  const [params, setParams] = useChartParams();
  console.log(123, data);

  const startDate = data?.data[0]?.date;
  const endDate = data?.data[data?.data.length - 1]?.date;

  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.toString()}</AlertDescription>
      </Alert>
    );
  return (
    <Card
      className={cn({
        ["animate-pulse opacity-50"]: isPending,
      })}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {params.view === "default" ? "Synthetic Control" : "Impact Ratio"}

          <div className="flex gap-1 items-center">
            <Button
              size="sm"
              onClick={() => setParams({ smoothing: 1 })}
              variant={params.smoothing === 1 ? "secondary" : "outline"}
            >
              Daily
            </Button>
            <Button
              size="sm"
              onClick={() => setParams({ smoothing: 7 })}
              variant={params.smoothing === 7 ? "secondary" : "outline"}
            >
              7 days
            </Button>
            <Button
              size="sm"
              onClick={() => setParams({ smoothing: 30 })}
              variant={params.smoothing === 30 ? "secondary" : "outline"}
            >
              1 month
            </Button>

            <Button
              size="icon"
              onClick={() =>
                setParams({
                  view: params.view === "default" ? "impact" : "default",
                })
              }
            >
              {params.view === "default" ? <TrendingUpDown /> : <ChartSpline />}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {startDate} - {endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={
              data?.data ?? [{ date: "1900-01-01", treatment: 0, synthetic: 0 }]
            }
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={64}
              tickFormatter={(value) => format(value, "yyyy-MM-dd")}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {params.view === "default" ? (
              <>
                <Line
                  isAnimationActive={false}
                  dataKey="treatment"
                  type="monotone"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  isAnimationActive={false}
                  dataKey="synthetic"
                  type="monotone"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            ) : (
              <Line
                isAnimationActive={false}
                dataKey="impact_ratio"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            )}
            <Brush />
            <Customized
              interventionDate={params.intervention_date}
              component={CustomizedCross}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedCross = (props: any) => {
  const { width, height, formattedGraphicalItems, interventionDate } = props;
  // get first series in chart
  const firstSeries = formattedGraphicalItems[0];
  // get any point at any index in chart
  const secondPoint = firstSeries?.props?.points.find(
    (point) => point.payload.date === interventionDate
  );
  return (
    <Cross
      y={height - 70}
      x={secondPoint?.x}
      height={height}
      width={width}
      stroke={"#000"}
      fill={"none"}
      strokeDasharray="5 5"
    />
  );
};
