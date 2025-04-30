import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAccount } from "wagmi";

import useOracles from "AImarketplace/hooks/useOracles";
import { styledString } from "AImarketplace/utils";
import phronEyeSrc from "assets/phron-eye.png";
import { Button } from "components/ui/button";
import "./index.scss";

const CSidebar = ({ setOracleId }) => {
  const { address } = useAccount();

  const { oracles } = useOracles();
  
  const [flag, setFlag] = useState(0);

  const userOracles = oracles.filter((item) => item.owner === address);

  useEffect(() => {
    if (userOracles.length > 0 && flag === 0) {
      setOracleId(userOracles[0].id);
      setFlag(1);
    }
  }, [userOracles, flag, setOracleId]);

  return (
    <div className="relative w-full md:w-1/4">
      <div className="p-5 bg-white min-h-[230px] shadow-md rounded-lg md:flex flex-col justify-center w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={phronEyeSrc}
              alt="phron icon"
              width={14}
              height={14}
              className="object-contain invert"
            />
            <h2 className="text-lg font-semibold">Oracles</h2>
          </div>
          {userOracles.length > 0 ? (
            userOracles.map((oracle, index) => (
              <div
                key={index}
                className="item cursor-pointer"
                onClick={() => setOracleId(oracle.id)}
              >
                {styledString(oracle.name)}
              </div>
            ))
          ) : (
            <p className="text-sm mt-3 opacity-70">No Oracles found</p>
          )}
        </div>
        <Button className="mt-16" variant="outline" onClick={() => setOracleId(null)} asChild>
          <Link to="/contribute">
            <Plus className="mr-1 w-4 h-4" />
            Add New Oracle
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CSidebar;