import { useNavigate } from "react-router-dom";

import { TableRow, TableCell } from "components/ui/table";
import useOracle from "AImarketplace/hooks/useOracle";
import { styledString } from "AImarketplace/utils";
import "./index.scss";

const Subscription = ({ sub, index }) => {
  const navigate = useNavigate();

  const { oracle }: any = useOracle();

  const { oracleId } = sub;
  let num = Number(index) + 1;
  const expire = new Date(sub.expire * 1000).toLocaleDateString();

  const goToOracle = () => {
    navigate(`/oracle/detail/${oracleId}`);
  };

  return (
    <TableRow onClick={goToOracle}>
      <TableCell className="rounded-tl-lg pl-4">{num}</TableCell>
      <TableCell>{styledString(sub.oracleId)}</TableCell>
      <TableCell>{oracle.name}</TableCell>
      <TableCell>{styledString(sub.user)}</TableCell>
      <TableCell>{styledString(sub.userContract)}</TableCell>
      <TableCell className="rounded-tr-lg pr-4">{expire}</TableCell>
    </TableRow>
  );
};

export default Subscription;