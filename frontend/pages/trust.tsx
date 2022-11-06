import ChunkyButton from '/components/ChunkyButton';
import { useAccount, useSignMessage } from 'wagmi'
import axios from 'axios';
import { useState } from 'react';
import QRCode from '/components/QRCode';

const Step1 = () => {
  const { signMessageAsync } = useSignMessage({
    message: 'I am signing this message to prove that I own this address',
  });
  const { address } = useAccount();
  return (
    <div className="flex flex space-x-4 justify-between">
      <div className="text-xl font">
        Step 1: Generate a claim to your Polygon ID app.
      </div>
      <ChunkyButton
        className="text-sm self-start"

        title={'Export Proof Card to Polygon ID Wallet'}
        onClick={async () => {
          if (!signMessageAsync || !address) {
            return;
          }
          const signature = await signMessageAsync();
          const result = await axios.post('http://localhost:3001/getReputationClaimOffer', { address, signature });
          window.open(result.data);
        }
        }
      />
    </div>
  )
}

const Step2 = () => {
  const [qrcodeIsVisible, setQrcodeIsVisible] = useState(false);
  return (
    <div className="flex flex space-x-4 justify-between">
      <div className="text-xl font">
        Step 2: Mint an NFT to any wallet that you want (Preferably an undoxxed one).<br /> You can port your credential without exposing your wallet identity.
      </div>
      <ChunkyButton
        className="text-sm self-start"
        title={'Mint NFT to any wallet'}
        onClick={() => {
          setQrcodeIsVisible(true);
        }
        }
      />
      {qrcodeIsVisible && (
        <QRCode />
      )}
    </div>
  );
}

const Step3 = () => {
  return (
    <div className="flex flex space-x-4 justify-between">
      <div className="text-xl font">
        Step 3: Once you are issued your reputation badge, you can now use the Insta-book feature to book a couch.
      </div>

    </div>
  );
}

export default function Trust() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="font-serif font-bold text-2xl text-eggshell">
        Export your reputation using ZK-badges
      </div>
      <div className="p-4 py-6 flex flex-col justify-center text-white text-2xl bg-eggshell rounded-md border-8 text-black border-lightSky">

        <div className=" flex flex-col space-y-12">

          <Step1 />
          <Step2 />
          <Step3 />


        </div>
      </div >
    </div>

  );
}
