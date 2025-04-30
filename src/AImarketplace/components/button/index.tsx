import "./index.scss"

const Button = ({ value, isLoading, onClick, }: any) => {
    return (<>
        {isLoading ? (
            <button className="oracle-button" > Loading... </button>
        ) : (
            <button onClick={onClick} className="oracle-button"> {value} </button>
        )}
    </>);
};

export default Button;