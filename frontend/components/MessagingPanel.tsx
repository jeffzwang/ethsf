import { cache, useEffect, useRef, useState } from 'react';
import { useSigner, useAccount, useSignTypedData, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { BigNumber, ethers, Signer } from 'ethers';
import { Conversation, DecodedMessage, Stream, Client, SendOptions } from '@xmtp/xmtp-js'
import { getAddressForDisplay } from '/lib/getAddressForDisplay';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { StayRequestCodec, StayRequestApprovalCodec, ContentTypeStayRequest, ContentTypeStayRequestApproval, } from '/lib/xmtpCodecs';
import { StayRequest, StayRequestApproval } from '/lib/stayTypes';
import ChunkyButton from '/components/ChunkyButton';
import GreenButton from '/components/GreenButton';
import RedButton from '/components/RedButton';
import { StayPlatformAbi, StayPlatformAddress } from '/deployments/StayPlatform';
import { useStayTransactionStore } from '/lib/StayTransactionStore';
import { useRouter } from 'next/router'

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

  const client = await Client.create(null, { privateKeyOverride: keys, codecs: [new StayRequestCodec(), new StayRequestApprovalCodec()] });
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
      // const prevConvoMessages = await convo.messages();
      const prevConvoMessages: DecodedMessage[] = [];
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

  const handleSend = async (message: any, options?: SendOptions) => {
    if (!conversation) return
    await conversation.send(message, options)
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

const MessageInput = ({ sendMessage }: { sendMessage: Function }) => {
  const [message, setMessage] = useState<string>('');

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
        sendMessage(message);
        setMessage('')
      }}>
        <div className="rounded-full transition-all group-hover:bg-sky group-hover:text-eggshell p-2 flex justify-center items-center">
          <PaperAirplaneIcon className="h-6 w-6" />
        </div>
      </button>
    </div>
  );
}

const StayRequestMessage = ({ message, sendMessage }: { message: DecodedMessage, sendMessage: Function }) => {
  const stayRequest: StayRequest = message.content;
  message.senderAddress;

  const { address } = useAccount();
  const { data, isError, isLoading, isSuccess, signTypedDataAsync } =
    useSignTypedData({
      // @ts-ignore
      domain: StayTransactionEIP712Domain,
      types: { StayTransaction: StayTransactionEIP712Type },
      value: stayRequest,
    })
  if (!address) {
    return null;
  }

  console.log(address, message)
  if (address === stayRequest.guest) {
    return (
      <div className="">
        You requested a stay between {stayRequest.startTime} and {stayRequest.endTime} at {getAddressForDisplay(stayRequest.host)}'s place.
      </div>
    );
  }
  return (
    <div className="flex flex-col rounded bg-lightSky bg-opacity-40 p-2 space-y-4">
      <div className="flex">
        <span className="font-semibold mr-1">{getAddressForDisplay(address)}</span> requested a stay between {stayRequest.startTime} and {stayRequest.endTime}
      </div>
      <div className="flex space-x-2">
        <GreenButton
          onClick={async () => {
            const signature = await signTypedDataAsync();
            sendMessage({
              ...stayRequest,
              approvalSignature: signature,
            }, {
              contentType: ContentTypeStayRequestApproval,
              contentFallback: 'useglider.xyz'
            });
          }}
          title="Accept"
        />
        <RedButton
          title="Reject"
          onClick={() => {

          }} />
      </div>
    </div >
  )
}

const StayRequestApprovalMessage = ({ message }: { message: DecodedMessage, }) => {
  const stayRequestApproval: StayRequestApproval = message.content;
  const {
    startTime,
    endTime,
    price,
    host,
    guest,
    arbitrationDeadline,
    arbiter,
    tokenURI,
    approvalSignature,
  } = stayRequestApproval

  const addStay = useStayTransactionStore(state => state.addStay);
  const router = useRouter();


  const { v, r, s } = ethers.utils.splitSignature(approvalSignature);
  const { config, error } = usePrepareContractWrite({
    address: StayPlatformAddress,
    abi: StayPlatformAbi,
    functionName: 'createStayTransaction',
    // @ts-ignore
    args: [BigNumber.from(startTime), BigNumber.from(endTime), BigNumber.from(price), host, BigNumber.from(arbitrationDeadline), arbiter, tokenURI, v, r, s],
  });
  const { writeAsync } = useContractWrite(config);

  return (
    <div className="flex flex-col rounded bg-lightSky bg-opacity-40 p-2 space-y-4">
      <div className="flex">
        <span className="font-semibold mr-1">{getAddressForDisplay(host)}</span> accepted your request to stay!
      </div>
      <div className="flex space-x-2">
        <GreenButton
          onClick={async () => {
            // Do the transaction using the guest's address.
            if (!writeAsync) return;
            const transactionResponse = await writeAsync();
            addStay(stayRequestApproval, transactionResponse.hash);
            router.push(`/booking/${transactionResponse.hash}`);
            // const res = await stayPlatform.createStayTransaction(startTime, endTime, price, host, arbitrationDeadline, arbiter, tokenURI, v, r, s);

          }}
          title="Finalize Booking"
        />
      </div>
    </div >
  );
}

const StayTransactionEIP712Domain = {
  name: 'StayPlatform',
  version: '0.0.1',
  chainId: 80001,
  verifyingContract: '0x075e16213cc0e2EdF1AED1dEaea54F2A347cA8e0',
};

const StayTransactionEIP712Type = [
  { name: 'startTime', type: 'uint256' },
  { name: 'endTime', type: 'uint256' },
  { name: 'price', type: 'uint256' },
  { name: 'guest', type: 'address' },
  { name: 'host', type: 'address' },
  { name: 'arbitrationDeadline', type: 'uint256' },
  { name: 'arbiter', type: 'address' },
];

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
      <div className="overflow-scroll h-[400px] flex flex-col space-y-4">
        {convoMessages.map((message) => {
          if (message.contentType.sameAs(ContentTypeStayRequest)) {
            return (
              <StayRequestMessage message={message} sendMessage={sendMessage} key={message.id} />
            )
          } else if (message.contentType.sameAs(ContentTypeStayRequestApproval)) {
            return (
              <StayRequestApprovalMessage message={message} sendMessage={sendMessage} key={message.id} />
            )
          }

          return (
            <MessageDisplay message={message} key={message.id} />
          )
        }

        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput sendMessage={sendMessage} />
      <button onClick={
        () => {
          sendMessage({
            startTime: '0x0',
            endTime: '0x2',
            price: '0x0',
            guest: '0xBBAaa0548C6F152b709451fD416fF23a771EcF8f',
            host: '0xc942c9a53012a24c466718f37B31Ed5251a06982',
            arbitrationDeadline: '0x500',
            arbiter: '0xc942c9a53012a24c466718f37B31Ed5251a06982',
            tokenURI: 'useglider.xyz',
          }, {
            contentType: ContentTypeStayRequest,
            contentFallback: 'useglider.xyz'
          })
        }
      }>
        Send Request
      </button>
    </div>

  );
}

export default MessagingPanel;
