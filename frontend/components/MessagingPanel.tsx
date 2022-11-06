import { cache, useEffect, useRef, useState } from 'react';
import { useSigner, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Conversation, DecodedMessage, Stream, Client } from '@xmtp/xmtp-js'
import { getAddressForDisplay } from '/lib/getAddressForDisplay';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

let stream: Stream<DecodedMessage>

const encode = (arr: Uint8Array): string => {
  return Array.from(arr).map(x => String.fromCharCode(x)).join('');
}

const decode = (val: string): Uint8Array => {
  return new Uint8Array(val.split('').map(x => x.charCodeAt(0)));
}

const createClient = async (signer: ethers.Signer, address: string, cachedPrivateKey: Uint8Array | undefined, callback: Function) => {
  let keys: Uint8Array;
  if (!cachedPrivateKey) {
    keys = await Client.getKeys(signer);
    writeStorage(`xmtpKey_${address}`, encode(keys));
  } else {
    keys = cachedPrivateKey;
  }

  const client = await Client.create(null, { privateKeyOverride: keys });
  callback(client);
}

const useXmtpClient = () => {
  const { address: walletAddress } = useAccount();
  const { data: signer } = useSigner();
  const [client, setClient] = useState<Client | null>(null);
  const [cachedPrivateKey] = useLocalStorage<string | undefined>(`xmtpKey_${walletAddress}`, undefined);

  useEffect(
    () => {
      if (!signer || !walletAddress) {
        setClient(null);
        return;
      }
      createClient(signer, walletAddress, cachedPrivateKey ? decode(cachedPrivateKey) : undefined, setClient);
    },
    [signer]);

  return {
    client,
    walletAddress,
  }
}


const useXMTPConversation = (
  peerAddress: string,
  onMessageCallback?: Function
) => {
  const { client, walletAddress } = useXmtpClient();
  const [convoMessages, setConvoMessages] = useState<DecodedMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [browserVisible, setBrowserVisible] = useState<boolean>(true)

  // useEffect(() => {
  //   window.addEventListener('focus', () => setBrowserVisible(true))
  //   window.addEventListener('blur', () => setBrowserVisible(false))
  // }, [])

  useEffect(() => {
    const getConvo = async () => {
      if (!client || !peerAddress) {
        return
      }
      setIsLoading(true);
      const convo = await client.conversations.newConversation(peerAddress);
      const prevConvoMessages = await convo.messages();
      setConvoMessages(prevConvoMessages);
      setConversation(convo);
      setIsLoading(false);
    }
    getConvo()
  }, [client, peerAddress])

  useEffect(() => {
    if (!conversation) return
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        if (setConvoMessages) {
          const newMessages = convoMessages || [];
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          setConvoMessages(uniqueMessages);
        }

      }
    }
    streamMessages()
    return () => {
      const closeStream = async () => {
        if (!stream) return
        await stream.return()
      }
      closeStream();
    }
  }, [
    // browserVisible,
    conversation,
    // lookupAddress,
    onMessageCallback,
    walletAddress,
  ])

  console.log(convoMessages);
  const handleSend = async (message: string) => {
    if (!conversation) return
    await conversation.send(message)
  }

  return {
    isLoading,
    sendMessage: handleSend,
    convoMessages,
  }
}

const MessageDisplay = ({ message }: { message: DecodedMessage }) => {
  const {
    content,
    senderAddress,
  } = message;
  return (
    <div className="flex flex-col">
      <div className="font-semibold">
        {getAddressForDisplay(senderAddress)}

      </div>
      <div>
        {content}
      </div>
    </div>
  );
}

const MessageInput = ({ onSubmit }: { onSubmit: Function }) => {
  const [message, setMessage] = useState<string>('')

  return (
    <div className="
      flex 
      bg-eggshell
      p-2
      space-x-2
      rounded-md
      border
      border-graphite
    ">
      <input className="
        focus:outline-none
        overflow-hidden
        flex-1
        bg-eggshell
      " type="text" placeholder="Type a message" value={message} onChange={e => setMessage(e.target.value)} />
      <button className="group" onClick={() => {
        if (!message) {
          return;
        }
        onSubmit(message);
        setMessage('')
      }}>
        <div className="rounded-full transition-all group-hover:bg-sky group-hover:text-eggshell p-2 flex justify-center items-center">
          <PaperAirplaneIcon className="h-6 w-6" />
        </div>
      </button>
    </div>
  );
}

const MessagingPanel = () => {
  const { address } = useAccount();
  const { sendMessage, convoMessages, isLoading } = useXMTPConversation(address === '0xBBAaa0548C6F152b709451fD416fF23a771EcF8f' ? '0xc942c9a53012a24c466718f37B31Ed5251a06982' : '0xBBAaa0548C6F152b709451fD416fF23a771EcF8f')
  const [didInitialScroll, setDidInitialScroll] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: didInitialScroll && !isLoading ? "smooth" : "auto" });
    if (!didInitialScroll && !isLoading) {
      setDidInitialScroll(true);
    }
  }

  useEffect(scrollToBottom, [convoMessages]);

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col bg-eggshell p-2 rounded">
      <div className="overflow-scroll h-[400px] flex flex-col ">
        {convoMessages.map((message) => (
          <MessageDisplay message={message} key={message.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSubmit={sendMessage} />
    </div>

  );
}

export default MessagingPanel;
