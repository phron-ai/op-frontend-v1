import useOracle from "AImarketplace/hooks/useOracle";
import CreatePanel from "./components/createPanel";
import MainPanel from "./components/mainPan";
import "./index.scss";

const CreateOracle = () => {
  const { oracle, oracleId } = useOracle();

  return (
    <div className="w-full">
      <div className="max-w-[1120px] mx-auto mt-10">
        <div className="px-4 xl:px-0 flex flex-col md:flex-row gap-8 justify-center mx-auto pt-4">
          {oracleId === null ? <CreatePanel /> : <MainPanel oracle={oracle} />}
        </div>
      </div>
    </div>
  );
};

export default CreateOracle;
