import { useNavigate } from "react-router-dom";

import { Button } from "AImarketplace/../components/ui/button";
import image from "AImarketplace/assets/oracleImage.webp";
import { styledString } from "AImarketplace/utils";
import "./index.scss";

interface OracleProps {
  oracle: {
    id: string;
    name: string;
    description: string;
    owner: string;
    subscriptionPrice: number;
  };
}

const Oracle: React.FC<OracleProps> = ({ oracle }) => {
  const navigate = useNavigate();

  const onDetail = () => {
    navigate(`/oracle/detail/${oracle.id}`);
  };

  return (
    <div
      className="bg-white max-w-[500px] rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      onClick={onDetail}
    >
      <div className="relative max-h-[200px] overflow-hidden">
        <img src={image} alt="Sports Information" className="object-cover" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {oracle.name}
        </h2>
        <p className="text-gray-600 mb-4">{oracle.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Owner:{" "}
          <span className="font-medium">{styledString(oracle.owner, 10)}</span>
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-600">
            {oracle.subscriptionPrice} ETH
          </span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDetail();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Oracle;