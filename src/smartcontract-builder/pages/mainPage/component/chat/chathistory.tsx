import { useEffect, useMemo, useRef, useState } from "react";

import ContentViewer from "smartcontract-builder/components/contentViewer";
import useTypeWriterEffect from "smartcontract-builder/hooks/typewriter";
import { TypewriterEffect } from "components/shared/TypewriterEffect";
import useContracts from "smartcontract-builder/hooks/contracts";
import useContract from "smartcontract-builder/hooks/contract";
import ApprovePanel from "./approvePanel";
import "./chathistory.scss";

const ChatHistory = ({
  isAvailableToShowMessage,
}: {
  isAvailableToShowMessage: boolean;
}) => {
  const { currentContract, currentMessages, stepId } = useContract();
  const { newTypingMessage } = useTypeWriterEffect();
  const { contractId } = useContracts();

  const contentRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [currentMessages.history.length, stepId, contractId]);

  const newTypingMessageId = useMemo(() => {
    if (!newTypingMessage) return;
    if (!currentContract) return;
    if (newTypingMessage.contractId !== currentContract._id) return;
    if (newTypingMessage.stepId !== stepId) return;
    return newTypingMessage.index;
  }, [newTypingMessage, currentContract, stepId]);

  return (
    <div ref={contentRef} className="chat-history">
      {isAvailableToShowMessage &&
        currentMessages.history.map((msg: Message, index: number) => (
          <ChatMessage
            key={index}
            message={msg}
            isTypingMessage={index === newTypingMessageId}
            isAvailableToShowMessage={isAvailableToShowMessage}
          />
        ))}
      <ApprovePanel isAvailableToShowMessage={isAvailableToShowMessage} />
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  isTypingMessage: boolean;
  isAvailableToShowMessage: boolean;
}

const ChatMessage = (props: ChatMessageProps) => {
  const { message, isTypingMessage, isAvailableToShowMessage } = props;
  const { cleanTypingMessage } = useTypeWriterEffect();
  const { setIsLoading, isLoading } = useContracts();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTypingMessage && isAvailableToShowMessage) {
      setIsLoading(true);
      setIsTyping(true);
      cleanTypingMessage();
      console.log("typing...");
    }
  }, [isTypingMessage, isTyping]);

  return (
    <div
      className={`chat-message max-w-[310px] md:max-w-[655px] lg:max-w-[600px] ${
        message?.role === "user" ? "user-message" : "bg-white/70 other-message"
      }`}
    >
      <div className="message-content px-4 py-1">
        {isTyping ? (
          <TypewriterEffect
            text={message?.content}
            speed={50}
            setIsTyping={setIsTyping}
          />
        ) : (
          <ContentViewer content={message?.content} />
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
