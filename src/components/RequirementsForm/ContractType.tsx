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

const contractTypes = ["ERC20", "ERC721", "ERC1155"];

export default function ContractType() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="contractType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select contract type:</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {contractTypes.map((type) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={type}
                >
                  <FormControl>
                    <RadioGroupItem value={type} />
                  </FormControl>
                  <FormLabel className="font-normal">{type}</FormLabel>
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
