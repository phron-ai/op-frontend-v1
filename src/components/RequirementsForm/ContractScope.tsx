"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

const scopes = [
  { id: "defi", label: "DeFi" },
  { id: "escrow", label: "Escrow" },
  { id: "voting", label: "Voting" },
  { id: "staking", label: "Staking" },
  { id: "minting", label: "Minting" },
  { id: "airdrop", label: "Airdrop" },
];

export default function ContractScope() {
  const { control, setValue, watch } = useFormContext();
  const selectedScopes = watch("contractScope", []);

  const handleCheckboxChange = (scopeId) => {
    setValue(
      "contractScope",
      selectedScopes.includes(scopeId)
        ? selectedScopes.filter((id) => id !== scopeId)
        : [...selectedScopes, scopeId]
    );
  };

  return (
    <FormField
      control={control}
      name="contractScope"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>Select contract scope:</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-1">
              {scopes.map((scope) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={scope.id}
                >
                  <FormControl>
                    <Checkbox
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={() => handleCheckboxChange(scope.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{scope.label}</FormLabel>
                </FormItem>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
