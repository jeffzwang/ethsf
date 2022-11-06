import Listing from '/pages/listing';

const BookedStay = ({
  transactionHash
}: {
  transactionHash: string;
}) => {
  // const {
  //   transaction,
  //   transactionStatus,
  //   queryStatus,
  // } = useTransaction(getTransactionKey(80001, transactionHash));
  // const stayByHash = useStayTransactionStore(state => state.stayByHash);
  // const stay = stayByHash[transactionHash];
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-20 bg-green-100 rounded-lg shadow-[0px_3px_6px_rgba(146,151,160,0.52)] m-6 w-[600px]">
        <p className="text-green-800 font-bold">Your booking went through!</p>
      </div>
      {Listing()}
    </div >
  );
};

export default BookedStay;
