import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import UpgradeModal from "../mainPage/component/upgrade";
import useCost from "smartcontract-builder/hooks/cost";
import useAuth from "smartcontract-builder/hooks/auth";
import WorkflowSteps from "./component/workFlowSteps";
import "./index.scss";

const Dashboard = () => {
  const navigator = useNavigate();

  const { upgradeModalVisible, closeUpgradeModal } = useCost();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) navigator("/");
  }, [isAuth]);

  return (
    <div className="w-full">
      {upgradeModalVisible && (
        <UpgradeModal visible={true} onClose={closeUpgradeModal} />
      )}
      <WorkflowSteps />
    </div>
  );
};

export default Dashboard;