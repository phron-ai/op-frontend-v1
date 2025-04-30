import { useEffect, useState } from "react";

import Oracle from "AImarketplace/pages/oracleLists/components/oracle";
import QuestionAnswer from "AImarketplace/components/question";
import useQuestions from "AImarketplace/hooks/useQuestions";
import useOracles from "AImarketplace/hooks/useOracles";
import useAuth from "smartcontract-builder/hooks/auth";
import useOracle from "AImarketplace/hooks/useOracle";
import AddQuestionModal from '../addQuestion-modal';
import { Button } from "components/ui/button";
import "./index.scss";

const MainPanel = ({ oracle }) => {
  const { questions } = useQuestions();
  const { userOracles } = useOracles();
  const { changeOracleId } = useOracle();
  const { isAuth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userOracles.length) {
      changeOracleId(null);
      return;
    }
    changeOracleId(userOracles[0]?.id);
  }, [])

  return (
    <div className="flex gap-4 items-start justify-between md:pl-4">
      {
        isAuth && userOracles.length > 0 ? <>
          <div className="questions space-y-4 pt-10 md:pt-0 w-[700px]">
            <h2 className="mb-4 font-semibold text-2xl">Questions</h2>
            {questions && questions.map((q, index) =>
              q.oracleId === oracle.id ? (
                <QuestionAnswer
                  key={index}
                  question={q}
                  oracle={oracle}
                  questionId={q.id}
                />
              ) : null
            )}
            <div className="w-full">
              <Button onClick={openModal}>Add Question</Button>
            </div>
          </div>
          <div>
            <Oracle oracle={oracle} />
          </div>
        </> : <></>
      }
      <AddQuestionModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default MainPanel;