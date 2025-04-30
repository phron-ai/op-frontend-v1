import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import image from ".AImarketplace/assets/oracleImage.webp";
import useOracles from "AImarketplace/hooks/useOracles";
import "./index.scss";

const AILibrary = () => {
  const { someOracles } = useOracles();

  return (
    <div className="container shadow-lg">
      <div className="bg-white py-5 px-8 rounded-md">
        <h1 className="text-center font-bold text-3xl mb-6">
          <Link to="/oracle">AI Library</Link>
        </h1>
        <div className="pb-6">
          <div className="theme-gradient flex-wrap gap-10 md:justify-between justify-center px-16 text-white flex py-5 rounded-lg md:rounded-full">
            <h3 className="font-light">DeepAI</h3>
            <h3 className="font-light">Sports</h3>
            <h3 className="font-light">Finance</h3>
            <h3 className="font-light">Game</h3>
            <h3 className="font-light">StarryAI</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {someOracles.map((oracle, i) => (
            <OracleCard oracleId={oracle.id} name={oracle.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OracleCard = (props) => {
  const { name, oracleId } = props;
  const navigate = useNavigate();

  const goOracle = () => {
    navigate(`/oracle/detail/${oracleId}`);
  };

  return (
    <div
      className="oracle-card group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
      onClick={goOracle}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={name + " image"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="p-4">
        <h4 className="text-xl font-bold text-black mb-2">{name}</h4>
        <div
          className="flex items-center text-black/90 text-sm font-medium"
          onClick={goOracle}
        >
          <span>Learn more</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default AILibrary;