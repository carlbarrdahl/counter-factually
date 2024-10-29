"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useChartParams } from "@/hooks/useApi";
import { networks, predictors } from "@/config";
import { useIsFetching } from "@tanstack/react-query";

const formSchema = z.object({
  smoothing: z.number().default(30),
  months_of_training: z.coerce.number().default(8),
  intervention_date: z.string().default("2023-01-01"),
  dependent: z.string(),
  predictors: z.array(z.string()),
  treatment_identifier: z.string(),
  controls_identifier: z.array(z.string()),
});

export function Settings() {
  const [params, setParams] = useChartParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: params,
  });

  const isFetching = useIsFetching({ queryKey: ["api", params] });

  //   console.log(form.formState.errors, form.watch());
  const onSubmit = (data) => {
    console.log("Submitted data", data);
    setParams(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex gap-1 items-end">
          <FormField
            control={form.control}
            name="treatment_identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Network</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-1">
            <FormField
              control={form.control}
              name="intervention_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention date</FormLabel>
                  <FormControl>
                    <Input placeholder="2023-01-01" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="months_of_training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months of training</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="controls_identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control Networks</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select networks..."
                  value={field.value?.map((id) =>
                    networks.find((p) => p.value === id)
                  )}
                  onChange={(values) =>
                    field.onChange(values.map((v) => v.value))
                  }
                  options={networks.filter(
                    (network) => network.value !== params.controls_identifier
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="predictors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Predictors</FormLabel>
              <FormControl>
                <MultiSelect
                  placeholder="Select predictors..."
                  value={field.value.map((id) =>
                    predictors.find((p) => p.value === id)
                  )}
                  onChange={(values) =>
                    field.onChange(values.map((v) => v.value))
                  }
                  options={predictors}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex-1 flex justify-end">
          <Button isLoading={isFetching} type="submit">
            Compute
          </Button>
        </div>
      </form>
    </Form>
  );
}
