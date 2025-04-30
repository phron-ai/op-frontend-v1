import serverProvider from "AImarketplace/service/serverProvider";
import { useGlobalContext } from "AImarketplace/context";
import { useEthersSigner } from "utils/useSigner";
import { checkError } from "utils";

const useQuestions = () => {
    const { state, update } = useGlobalContext() as OracleContextValue;
    const { signer } = useEthersSigner();

    const addQuestion = async (question: string, answer: string) => {
        if (!signer) return;
        try {
            const data = {
                oracleId: state.oracleId,
                question,
                answer
            };
            const result = await serverProvider.addQuestion(data);
            _addQuestion(result);
            await updateQuestions();
        } catch (error) {
            console.error("Adding question failed:", error);
        }
    };

    const updateQuestions = async (): Promise<void> => {
        try {
            const questions = await serverProvider.getQuestions();
            checkError(questions, false, false);
            update({ questions });
        } catch (error: any) {
            update({ questions: [] });
            console.error("updateQuestionsError: ", error.message);
        }
    };

    const questionForOracle = (oracleId: string): Question[] => {
        if (!oracleId)
            throw new Error("Oracle ID cannot be empty");
        return state.questions.filter((question: Question) => question.oracleId === oracleId);
    };

    const _addQuestion = (question: Question) => {
        if (!question) return;
        update({ questions: [...state.questions, question] });
    };

    return {
        questions: state.questions,
        addQuestion,
        updateQuestions,
        questionForOracle
    };
};

export default useQuestions;