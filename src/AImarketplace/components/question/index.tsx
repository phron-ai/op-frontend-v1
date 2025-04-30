import { useEffect, useState } from "react";
import { Copy, CopyCheck, Pencil } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "components/ui/accordion";
import { capitalizeSentences } from "AImarketplace/utils";
import useOracle from "AImarketplace/hooks/useOracle";
import { useEthersSigner } from "utils/useSigner";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { copyToClipboard } from "utils";
import "./index.scss";
import Modal from "../modal";
import { useAccount } from "wagmi";

const QuestionAnswer = ({ question, oracle }: any) => {
  const { signer } = useEthersSigner();
  const { address } = useAccount();
  const { updateQuestion } = useOracle();

  const [openPanel, setOpenPanel] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>(question.answer);
  const [ques, setQues] = useState<string>(question.question);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


  const isOwner = oracle?.owner === address;

  const handleUpdateQuestion = async () => {
    if (!address) return;
    try {
      const data = {
        id: question.id,
        oracleId: oracle.id,
        question: ques,
        answer,
      };
      isChanged && await updateQuestion(data);
      setIsDisabled(true);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const editOnlyOwner = () => {
    if (!isOwner) return;
    console.log("owner");
    setIsDisabled(false);
  };

  const togglePanel = (panel: number) => {
    setOpenPanel(openPanel === panel ? null : panel);
    setIsDisabled(true);
  };

  useEffect(() => {
    if (ques !== question.question || answer !== question.answer) setIsChanged(true);
    else setIsChanged(false);
  }, [ques, answer]);

  return (
    <>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        <AccordionItem
          value="item-1"
          className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-md overflow-hidden my-3"
        >
          {
            isDisabled ? (
              <>
                <AccordionTrigger
                  onCanPlay={() => togglePanel(1)}
                  className="px-6 py-4 text-left text-primary hover:text-purple-600 font-semibold text-lg"
                >
                  {ques}
                </AccordionTrigger>
              </>
            ) : (
              <Input
                value={ques}
                onChange={(e) => setQues(e.target.value)}
                className="answer border-gray-300 bg-white my-4 mx-6 text-lg w-[89%]"
              />
            )
          }
          <AccordionContent
            className="cursor-pointer flex flex-col space-y-3 px-6 pb-4 text-black/70 w-full"
          >
            {isDisabled ? (
              <div className="answer div flex min-h-[50px] items-center text-lg w-full">
                <span className="truncate flex-1 pr-4"
                  onDoubleClick={() => setShowAnswer(true)}
                >{answer}</span>
                {
                  isOwner &&
                  <span className="flex-shrink-0">
                    <Pencil size={15} onClick={editOnlyOwner} />
                  </span>
                }
                <span className="flex justify-end mt-2 ml-5">
                  {isCopied ? (
                    <CopyCheck size={16} />
                  ) : (
                    <Copy size={16} onClick={() => copyToClipboard(question.id, setIsCopied, "Id copied")} className="cursor-pointer" />
                  )}
                </span>
              </div>
            ) : (
              <Textarea
                disabled={isDisabled}
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(capitalizeSentences(e.target.value))}
                className="answer border-gray-300 bg-white text-lg min-h-[90px] w-full"
              />
            )}
            {oracle && oracle.owner === (signer && signer._address) && (
              <>
                {!isDisabled && (
                  <Button
                    onClick={handleUpdateQuestion}
                    className="w-[120px] h-[36px] text-base mt-2"
                  >
                    {isChanged ? "Update" : "Done"}
                  </Button>
                )}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <AnswerModal isOpen={showAnswer} onClose={() => setShowAnswer(false)} question={question} />
    </>
  );
};

const AnswerModal = ({ isOpen, onClose, question }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={question.question}>
      <h3 className="break-all" >{question.answer}</h3>
    </Modal>
  );
}

export default QuestionAnswer;