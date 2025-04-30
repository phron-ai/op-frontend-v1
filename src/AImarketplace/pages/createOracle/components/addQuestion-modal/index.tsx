import { useState } from "react";

import useQuestions from "AImarketplace/hooks/useQuestions";
import Modal from "AImarketplace/components/modal";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";

const AddQuestionModal = ({ isModalOpen, closeModal }) => {
    const { addQuestion } = useQuestions();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const addtoQuestion = async () => {
        await addQuestion(question, answer);
        setAnswer("");
        setQuestion("");
        closeModal();
    };

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={"Add New Question"} >
            <Input
                value={question}
                type="text"
                placeholder="Question"
                onChange={(e) => setQuestion(e.target.value)}
            />
            <Input
                value={answer}
                type="text"
                placeholder="Answer"
                onChange={(e) => setAnswer(e.target.value)}
            />
            <Button onClick={addtoQuestion} >
                Add Question
            </Button>
        </Modal>
    )
}

export default AddQuestionModal;