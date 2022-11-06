import Image from 'next/image';
import couchPic from '../public/bluecouchphoto.jpg';
import pfpPic from '../public/pfp.jpg';
import { MapPinIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { useSigner } from 'wagmi';
import { StayPlatform__factory } from '../../typechain-types/factories/contracts/Main.sol/StayPlatform__factory';

const ListingCard = () => {
  const { data: signer } = useSigner();

  return (
    <div className="flex bg-white">
      <div className="w-[220px]">
        <Image src={couchPic} alt="picture of listing" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="w-[96px] h-[96px]">
            <Image src={pfpPic} alt="picture of host" />
          </div>
          <div className="flex-1 flex flex-col p-1 pl-4">
            <div className="text-2xl font-semibold py-2 font-mono">
              Ashley.eth
            </div>
            <div className="flex space-x-8">
              <div className="flex space-x-2">
                <div className="font">
                  References
                </div>
                <div className="font-semibold">
                  21
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="font">
                  Vouched by
                </div>
                <div className="font-semibold">
                  7
                </div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              ex-MetaMask, into techno, volunteer at EthSF
            </div>
          </div>
          <div className="flex items-start p-2">
            <div className="flex text-md space-x-1 items-center text-green-800">
              <HandThumbUpIcon className="h-5 w-5 mr-1" />
              <div>
                Vouched by
              </div>
              <div className="font-semibold">
                Wadeful.eth
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-3 space-x-4">
          <div className="flex-1 flex flex-col">
            <div className="flex space-x-3">
              <MapPinIcon className="h-5 w-5" />
              <div className="font-semibold">
                Marina District, SF
              </div>
            </div>
            <div>
              Couch in the living room
            </div>
            <div className="text-sm">
              20 min walk to the EthSF hackathon venue. Nice couch that also converts to a futon. I'm looking to make new frens in crypto, while supporting myself to make art
            </div>
          </div>
          <button disabled={signer == null} onClick={async () => {
            const contract = StayPlatform__factory.connect('0xD1501f923b5C6642482962fAd2cD4016Eb5ED2F7', signer!);
            await contract.createStayTransaction(0, 1, 0, '0x0', 3, '0x0', 'some_ipfs', 111, '', '');
          }}>
            Book
          </button>
          <div className="self-end text-2xl font-semibold">
            40 USDC
          </div>
        </div>

      </div>
    </div >
  );
};

const ResultsPanel = () => {
  return (
    <div className="bg-lightSky space-y-2 p-2 rounded-md">
      <ListingCard />
      <ListingCard />
    </div>
  );
};

export default ResultsPanel;
