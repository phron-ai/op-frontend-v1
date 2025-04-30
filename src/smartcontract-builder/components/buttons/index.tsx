import { Loader } from "lucide-react";
import { useContext } from "react";

import { ContractContext } from "smartcontract-builder/context";
import { Button } from "components/ui/button";

const LoadingButton = (props) => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { onClick, children, className = "", disabled = false } = props;

  return (
    <Button disabled={state.isLoading || disabled} onClick={onClick} className={className}>
      {state.isLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
      {children}
    </Button>
  );
};

export default LoadingButton;