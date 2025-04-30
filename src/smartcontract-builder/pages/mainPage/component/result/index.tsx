import { useState } from "react";

import ContentViewer from "smartcontract-builder/components/contentViewer";
import Modal from "smartcontract-builder/components/modal";
import "./index.scss";

const ResultPage = ({ results }) => {
  const [showModal, setShowModal] = useState(-1);

  const handleCardClick = (index: number) => {
    setShowModal(index);
  };

  const closeModal = () => {
    setShowModal(-1);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mt-[10px]">
        {results.map((result: any, index: any) => (
          <ResultCard
            result={result}
            key={index}
            onClick={() => handleCardClick(index)}
          />
        ))}
        {showModal !== -1 && (
          <Modal onClose={closeModal}>
            <h2 className="card-name text-2xl uppercase font-semibold">
              {results[showModal].name}
            </h2>
            <ContentViewer content={results[showModal].content} />
          </Modal>
        )}
      </div>
    </>
  );
};

const ResultCard = ({ result, onClick }) => {
  return (
    <>
      {result.content && (
        <div
          className="w-full overflow-hidden cursor-pointer bg-white px-4 py-4 rounded-[8px]"
          onClick={onClick}
        >
          <div className="w-full">
            <h2 className="text-base font-bold uppercase border-b pb-1 mb-2">
              {result.name}
            </h2>
            <ContentViewer content={result.content} />
          </div>
        </div>
      )}
    </>
  );
};

export default ResultPage;
