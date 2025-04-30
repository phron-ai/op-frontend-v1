"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const patterns = [
  {
    id: "simple",
    name: "Simple Pattern",
    description:
      "Best for straightforward contracts with limited functionality.",
  },
  {
    id: "upgradeable",
    name: "Upgradeable Pattern",
    description: "Allows you to upgrade your contract in the future.",
  },
  {
    id: "diamond",
    name: "Diamond Pattern",
    description:
      "Ideal for complex contracts with multiple facets of functionality.",
  },
  {
    id: "ai",
    name: "AI Recommendation",
    description:
      "Let our AI choose the best pattern based on your previous selections.",
  },
];

export default function ContractPattern() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="contractPattern"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Choose a Contract Pattern:</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-3"
            >
              {patterns.map((pattern) => (
                <FormItem
                  className="flex items-start space-x-3 space-y-0"
                  key={pattern.id}
                >
                  <FormControl>
                    <RadioGroupItem value={pattern.id} />
                  </FormControl>
                  <div className="flex flex-col">
                    <FormLabel className="font-medium">
                      {pattern.name}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {pattern.description}
                    </p>
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
