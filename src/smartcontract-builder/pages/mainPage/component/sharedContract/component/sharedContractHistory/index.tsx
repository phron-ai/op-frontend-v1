import ContentViewer from "smartcontract-builder/components/contentViewer";
import ToTopButton from "smartcontract-builder/components/totop-button";
import useContract from "smartcontract-builder/hooks/contract";
import "./index.scss";

const SharedHistory: React.FC = () => {
    const { currentMessages } = useContract();

    return (
        <div className="share-history">
            <ToTopButton />
            {currentMessages?.history?.map((msg: Message, index: number) =>
                <ChatMessage key={index} message={msg} />
            )}
        </div>
    );
};

const ChatMessage = ({ message }: { message: Message }) => {
    return (
        <div
            className={`chat-message ${message?.role === "user"
                ? "user-message"
                : "glassy-background other-message"
                }`}
        >
            <div className="message-content px-4 py-1">
                <ContentViewer content={message?.content} />
            </div>
        </div>
    );
};

export default SharedHistory;