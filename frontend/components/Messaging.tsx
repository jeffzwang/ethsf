import { Client, Conversation } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import { useEffect, useState } from 'react';

const Messaging = () => {
  // asynchronously fetch using axios https://owlracle.info/eth.
  const [client, setClient] = useState<Client | null>();
  // const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState<Map<string, Conversation>>(
    new Map()
  );
  useEffect(() => {
    const fetchMessages = async () => {
      const wallet = Wallet.createRandom();
      const client = await Client.create(wallet);
      setClient(client);
      const conversations = await client.conversations.list();
      setConversations(new Map(conversations));
    };
    await fetchMessages();
  }, [client]);

  return (
    <div className="bg-sky space-y-2">
    </div>
  );
};

export default Messaging;
