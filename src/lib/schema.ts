import * as z from "zod";

export const contractFormSchema = z.object({
  contractScope: z.string().min(1, "Select a contract scope"),
  thirdPartyLibrary: z.string().min(1, "Select a third-party library"),
  contractType: z.enum(["ERC20", "ERC721", "ERC1155"], {
    required_error: "Select a contract type",
  }),
  contractPattern: z.enum(["simple", "upgradeable", "diamond", "ai"], {
    required_error: "Select a contract pattern",
  }),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;