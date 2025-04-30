import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";

import ShareContract from "smartcontract-builder/pages/mainPage/component/sharedContract";
import UpgradeModal from "smartcontract-builder/pages/mainPage/component/upgrade";
import Signature from "smartcontract-builder/components/authentication";
import ContractContextProvider from "smartcontract-builder/context";
import Dashboard from "smartcontract-builder/pages/dashboard";
import Subscriptions from "AImarketplace/pages/subscriptions";
import DashboardLayout from "components/shared/CustomLayout";
import MainPage from "smartcontract-builder/pages/mainPage";
import CreateOracle from "AImarketplace/pages/createOracle";
import DetailOracle from "AImarketplace/pages/detailOracle";
import OracleContextProvider from "AImarketplace/context";
import OracleList from "AImarketplace/pages/oracleLists";
import ApikeyContextProvider from "api-key/context";
import ApiKey from "api-key";
import CreateAgent from "./components/CreateAgent";
import "./App.css";
import ContractAgent from "./components/ContractAgent";
// import { Toaster } from "components/ui/toaster";
// import GradientBackground from "./components/shared/Backgrounds/Stripe/Gradient";

const App: React.FC = () => {
  return (
    <ApikeyContextProvider>
      <OracleContextProvider>
        <ContractContextProvider>
          <Router>
            {/* <GradientBackground> */}
            <DashboardLayout>
              <Routes>
                <Route path="/oracle/detail/:id" element={<DetailOracle />} />
                <Route path="/contribute" element={<CreateOracle />} />
                <Route path="/oracle/" element={<OracleList />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Signature />} />
                <Route path="/agent" element={<MainPage />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/upgrade" element={<UpgradeModal />} />
                <Route path="/share/:accessToken" element={<ShareContract />} />
                <Route path="/apikey" element={<ApiKey />} />
                <Route
                  path="/contract-agent/:contract_address"
                  element={<ContractAgent />}
                />
              </Routes>
              {/* <Toaster /> */}
            </DashboardLayout>
            {/* </GradientBackground> */}
          </Router>
        </ContractContextProvider>
      </OracleContextProvider>
    </ApikeyContextProvider>
  );
};

export default App;
