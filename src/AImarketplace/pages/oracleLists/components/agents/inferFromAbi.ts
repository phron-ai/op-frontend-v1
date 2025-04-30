// utils/inferFromABI.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const inferFromABI = async (abi: any[]) => {
  const prompt = `
You are a Web3 smart contract expert.

Analyze the following smart contract ABI and:
1. Suggest a professional, descriptive name for the contract.
2. List 3 to 5 possible use cases based on the functions and events.

Respond ONLY in this JSON format:
{
  "name": "Contract name",
  "useCases": ["use case 1", "use case 2", "use case 3"]
}

ABI:
${JSON.stringify(abi, null, 2)}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    return JSON.parse(res.choices[0].message.content || "");
  } catch (e) {
    console.error("Error parsing OpenAI response:", e);
    return { name: "Unnamed Contract", useCases: [] };
  }
};
