import serverProvider from "smartcontract-builder/service/server";

const LOCAL_STORAGE_KEY = "deployedContracts";

export const fetchDeployedContracts = async () => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (cached) {
      // ✅ Use cached contracts from localStorage
      console.log("✅ Loaded contracts from localStorage");
      return JSON.parse(cached);
    }

    // 🛰️ Fetch from server
    const contracts = await serverProvider.getContracts();

    // 💾 Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contracts));

    console.log("✅ Fetched contracts from API");
    return contracts;
  } catch (error) {
    console.error("❌ Error fetching deployed contracts:", error);
    return [];
  }
};
