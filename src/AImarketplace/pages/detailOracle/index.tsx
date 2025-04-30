import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Copy, MoreVertical } from "lucide-react";
import { useAccount } from "wagmi";

import useSubscription from "../../hooks/useSubscription";
import { Button } from "../../../components/ui/button";
import QuestionAnswer from "../../components/question";
import CodeModal from "api-key/components/codeModal";
import useQuestions from "../../hooks/useQuestions";
import TextField from "../../components/textField";
import image from "../../assets/oracleImage.webp";
import { updateFeeds_guide } from "api-key/utils";
import useOracle from "../../hooks/useOracle";
import Modal from "../../components/modal";
import { copyToClipboard } from "utils";
import "./index.scss";
import { IconButton, Menu, MenuItem } from "@mui/material";

const DetailOracle = () => {
  const { id } = useParams();

  const { oracle, subscribe, changeOracleId } = useOracle() as UseOracleReturn;
  const { name, description, subscriptionPrice } = oracle as Oracle;
  const { questions } = useQuestions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isData, setIsData] = useState("Loading...");
  const [isCopied, setIsCopied] = useState(false);
  const [isCodeModal, setIsCodeModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (!id) return;
    changeOracleId(id);
  }, [id])

  useEffect(() => {
    setTimeout(() => {
      console.log("nodata");
      if (!oracle) setIsData("No Data!");
    }, 5000);
  }, [oracle]);

  return (
    <div className="py-5">
      {!oracle ? (
        <div className="loading">
          <h1 className="no-data">{isData}</h1>
          {isData !== "No Data!" && <div className="loader"></div>}
        </div>
      ) : (
        <div className="flex items-start max-w-[1390px] gap-6 mx-auto px-4 xl:px-0">
          <SubScribleModal
            subscribe={subscribe}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
          <CodeModal isOpen={isCodeModal} onClose={() => setIsCodeModal(false)} title="How to get updated data?" content={updateFeeds_guide} isUser={true} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="w-full space-y-4 bg-white p-1 rounded-2xl max-h-[280px] ">
              <img src={image} alt="oracle-detail-image" className="rounded-xl" />
            </div>
            <div className="space-y-8 lg:col-span-2 w-full">
              <div className="bg-white w-full rounded-3xl p-5 md:p-8 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold text-blue-800 mb-4">
                    {name}
                  </h2>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertical className="h-4 w-4" />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => {
                      setAnchorEl(null);
                      copyToClipboard(oracle.id, setIsCopied, "Id copied to clipboard");
                    }}>
                      <span className="text-blue-500 cursor-pointer">id</span>
                    </MenuItem>
                    <MenuItem onClick={() => {
                      setAnchorEl(null);
                      copyToClipboard(oracle.owner, setIsCopied, "Owner's address has been copied to the clipboard");
                    }}>
                      <span className="text-blue-500 cursor-pointer">owner</span>
                    </MenuItem>
                  </Menu>
                </div>
                <p className="text-gray-600 mb-4">{description} </p>
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <span className="text-2xl font-bold text-teal-600">
                    {subscriptionPrice}
                  </span>
                  <Button onClick={openModal}
                    className="w-full sm:w-auto text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Subscribe
                  </Button>
                  <Button size={'sm'} onClick={() => setIsCodeModal(true)} >how</Button>
                </div>
              </div>
            </div>
            <QuestionContrainer questions={questions} oracle={oracle} />
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionContrainer = ({ questions, oracle }) => {
  return (
    <div className="w-full space-y-4">
      {!oracle ? (
        <></>
      ) : (
        questions &&
        questions.map((question: Question, index: number) =>
          oracle && question.oracleId === oracle.id ? (
            <QuestionAnswer
              key={index}
              oracle={oracle}
              question={question}
            />
          ) : (""))
      )}
    </div>
  );
};

const SubScribleModal = ({ subscribe, isModalOpen, closeModal }) => {
  const { subscribeForSign } = useSubscription();
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const data = await subscribeForSign(contractAddress);
      console.log({ data })
      await subscribe(data);
      setLoading(false);
      closeModal();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={"Subscribe this Oracle"}
    >
      <TextField
        value={contractAddress}
        type="text"
        tagType="input"
        onChange={(e: any) => setContractAddress(e.target.value)}
        label="Contract Address Please"
      />
      <Button onClick={onSubscribe} disabled={isLoading}>
        {isLoading ? "Loading" : "SUBSCRIBE"}
      </Button>
    </Modal>
  );
};

export default DetailOracle;