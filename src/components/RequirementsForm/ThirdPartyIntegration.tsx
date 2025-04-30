"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const libraries = [
  { value: "uniswapv2", label: "Uniswap v2" },
  { value: "uniswapv3", label: "Uniswap v3" },
  { value: "chainlink price feed", label: "Oracle" },
  // { value: "openzeppelin", label: "OpenZeppelin" },
];

export default function ThirdPartyIntegration() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="thirdPartyLibrary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select 3rd party library:</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a library" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {libraries.map((lib) => (
                <SelectItem key={lib.value} value={lib.value}>
                  {lib.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
