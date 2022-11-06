import { useRouter } from 'next/router'
import MessagingPanel from '/components/MessagingPanel';

const messaging = () => {
  const router = useRouter();
  const { peerAddress } = router.query;

  if (!peerAddress) {
    return null;
  }
  return (
    <MessagingPanel peerAddress={peerAddress as string} />
  );
}

export default messaging;