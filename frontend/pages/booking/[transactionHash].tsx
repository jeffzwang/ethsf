import { useRouter } from 'next/router'
import BookedStay from '/components/BookedStay';

const booking = () => {
  const router = useRouter();
  const { transactionHash } = router.query;

  if (!transactionHash) {
    return null;
  }
  return (
    <BookedStay transactionHash={transactionHash as string} />
  );
}

export default booking;