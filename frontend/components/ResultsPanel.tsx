import Image, { StaticImageData } from 'next/image';
import couchPic from '../public/bluecouchphoto.jpg';
import couchPic2 from '../public/couchpic2.png';
import couchPic3 from '../public/couchpic3.png';
import pfpPic2 from '../public/pfp2.avif'
import pfpPic from '../public/pfp.jpg';
import { MapPinIcon, HandThumbUpIcon, BoltIcon } from '@heroicons/react/24/solid';
import { useSigner, useContractRead, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { StayPlatformAbi, StayPlatformAddress } from '/deployments/StayPlatform';
import { VerifierNFTAbi, VerifierNFTAddress } from '/deployments/VerifierNFT';
import { sendRequestToBook } from '/lib/sendRequestToBook';
import { useRouter } from 'next/router';
import GreenButton from '/components/GreenButton';
import USDCIcon from '/icons/USDCIcon';
import { getAddressForDisplay } from '/lib/getAddressForDisplay';

const useIsEligibleForInstantBook = () => {
  const { address } = useAccount();

  const { data: balance, isError, isLoading } = useContractRead({
    abi: VerifierNFTAbi,
    address: VerifierNFTAddress,
    functionName: 'balanceOf',
    args: [address || '0x0'],
  })

  if (balance && balance.gt(0)) {
    return true;
  }
  return false;
}

const ListingCard = ({
  listingPic,
  hostPic,
  host,
  location,
  description,
  hostAddress
}: {
  listingPic: StaticImageData,
  hostPic: StaticImageData,
  host?: string,
  location: string,
  description: string,
  hostAddress: string,
}) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const router = useRouter();

  return (
    <div className="flex bg-white">
      <div className="w-[220px] relative">
        <Image src={listingPic} alt="picture of listing" fill />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="w-[96px] h-[96px] relative">
            <Image src={hostPic} alt="picture of host" fill />
          </div>
          <div className="flex-1 flex flex-col p-1 pl-4">
            <div className="text-2xl font-semibold py-2 font-mono">
              {host ? host : getAddressForDisplay(hostAddress)}
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
        </div>
        <div className="flex p-3 space-x-4">
          <div className="flex-1 flex flex-col">
            <div className="flex space-x-3">
              <MapPinIcon className="h-5 w-5" />
              <div className="font-semibold">
                {location}

              </div>
            </div>
            <div>
              Couch in the living room
            </div>
            <div className="text-sm">
              {description}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex items-start">
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
        <div className="self-end flex-1 flex items-center text-2xl font-semibold space-x-2">
          <USDCIcon className="w-6 h-6" color="" />
          <div>
            40 USDC

          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <GreenButton
            className="opacity-80 bg-gray-400 shadow-none items-center flex space-x-2 justify-center text-sm"
            onClick={async () => {
              const contract = new ethers.Contract(StayPlatformAddress, StayPlatformAbi, signer!);
              await contract.createStayTransaction(0, 1, 0, '0x0', 3, '0x0', 'some_ipfs', 111, '', '');
            }}>
            <BoltIcon className="h-4 w-4" />
            <div>
              Instant Book
            </div>
          </GreenButton>
          <GreenButton
            className="text-sm"
            onClick={async () => {
              if (!signer || !address) {
                return;
              }
              const stayRequest = {
                startTime: ethers.utils.hexlify(1667748072),
                endTime: ethers.utils.hexlify(1668007272),
                price: '0x0',
                guest: address,
                host: '0xc942c9a53012a24c466718f37B31Ed5251a06982',
                arbitrationDeadline: ethers.utils.hexlify(1668093672),
                arbiter: '0x0000000000000000000000000000000000000000',
                tokenURI: 'QmNjjbQqpeRiV3MLSpHmVWaxVnP1b1buAFuJec7r2xNmYW',
              };
              //@ts-ignore
              await sendRequestToBook(signer!, stayRequest);
              router.push(`/messaging/${'0xc942c9a53012a24c466718f37B31Ed5251a06982'}`);
            }}>
            Request to book
          </GreenButton>
        </div>

      </div >
    </div >
  );
};

const ResultsPanel = () => {
  return (
    <div className="bg-lightSky space-y-2 p-2 rounded-md">
      <ListingCard
        listingPic={couchPic}
        host="tectonicplate.eth"
        hostAddress="0xc942c9a53012a24c466718f37B31Ed5251a06982"
        hostPic={pfpPic}
        location="Marina District, SF"
        description="20 min walk to the EthSF hackathon venue. Nice couch that also converts to a futon. I'm looking to make new frens in crypto, while supporting myself to make art"
      />
      <ListingCard
        listingPic={couchPic2}
        hostAddress="0xc942c9a53012a24c466718f37B31Ed5251a06982"
        hostPic={pfpPic2}
        location="Mission, SF"
        description="I’m looking to make crypto friends! I have two dogs and a cat, so if you’re allergic my place isn’t for you. "

      />
    </div>
  );
};

export default ResultsPanel;
