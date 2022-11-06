import { getTransactionKey } from "/lib/KeyFactory";
import { useStayTransactionStore } from "/lib/StayTransactionStore";
import { useTransaction } from "/lib/useTransaction";

const BookedStay = ({
  transactionHash
}: {
  transactionHash: string;
}) => {
  const {
    transaction,
    transactionStatus,
    queryStatus,
  } = useTransaction(getTransactionKey(80001, transactionHash));
  const stayByHash = useStayTransactionStore(state => state.stayByHash);
  const stay = stayByHash[transactionHash];
  return (
    <div>
      {JSON.stringify(stay)}
    </div>
  );
}

export default BookedStay;
