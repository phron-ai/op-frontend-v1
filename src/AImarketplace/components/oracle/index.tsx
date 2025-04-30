import { useNavigate } from "react-router-dom";

import { styledString } from "AImarketplace/utils";
import image from 'assets/oracleImage.webp';
import "./index.scss"

const Oracle = ({ oracle }: { oracle: Oracle }) => {
  const navigate = useNavigate();

  const { id } = oracle;

  const onDetail = () => navigate(`/oracle/detail/${id}`);

  return (
    <div className="card" onClick={onDetail}>
      <img src={image} alt="Sports Information" />
      <div className="card-content">
        <h2>{oracle.name}</h2>
        <p>{oracle.description}</p>
        <p>Owner: {styledString(oracle.owner, 10)}</p>
      </div>
      <div className="card-footer">
        <span>{oracle.subscriptionPrice} ETH</span>
      </div>
    </div>
  )
};

export default Oracle;