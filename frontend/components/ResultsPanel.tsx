import { BoltIcon, HandThumbUpIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Image, { StaticImageData } from 'next/image';
import { StayPlatformAbi, StayPlatformAddress } from '/deployments/StayPlatform';
import { VerifierNFTAbi, VerifierNFTAddress } from '/deployments/VerifierNFT';
import { useAccount, useContractRead, useSigner } from 'wagmi';

import GreenButton from '/components/GreenButton';
import USDCIcon from '/icons/USDCIcon';
import { ethers } from 'ethers';
import { sendRequestToBook } from '/lib/sendRequestToBook';
import { useRouter } from 'next/router';

import couchPic2 from '../public/couchpic2.png';
import couchPic from '../public/bluecouchphoto.jpg';
import pfpPic2 from '../public/pfp2.avif';
import pfpPic from '../public/pfp.jpg';

const useIsEligibleForInstantBook = () => {
  const { address } = useAccount();

  const { data: balance, isError, isLoading } = useContractRead({
    abi: VerifierNFTAbi,
    address: VerifierNFTAddress,
    functionName: 'balanceOf',
    args: [address || '0x0'],
  });

  if (balance && balance.gt(0)) {
    return true;
  }
  return false;
};

export type ListingInfo = {
  hostAddress: string;
  ensName: string;
  referencesNumber: number;
  vouchesNumber: number;
  personalDescription: string;
  ipfsHash: string;
  voucherName: string;
  neighborhoodName: string;
  accommodationDescription: string;
  neighborhoodDescription: string;
  pricePerNight: string;
  listingPic: StaticImageData;
  hostPic: StaticImageData;
}

// pass ListingInfo in as props.
const ListingCard = ({ listingInfo }: {listingInfo: ListingInfo}) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const router = useRouter();
  const { ensName, referencesNumber, vouchesNumber, personalDescription, voucherName, neighborhoodName, accommodationDescription, neighborhoodDescription, pricePerNight, listingPic, hostPic } = listingInfo;

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
              {ensName}
            </div>
            <div className="flex space-x-8">
              <div className="flex space-x-2">
                <div className="font">
                  References
                </div>
                <div className="font-semibold">
                  {referencesNumber}
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="font">
                  Vouched by
                </div>
                <div className="font-semibold">
                  {vouchesNumber}
                </div>
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {personalDescription}
            </div>
          </div>
        </div>
        <div className="flex p-3 space-x-4">
          <div className="flex-1 flex flex-col">
            <div className="flex space-x-3">
              <MapPinIcon className="h-5 w-5" />
              <div className="font-semibold">
                {neighborhoodName}
              </div>
            </div>
            <div>
              {neighborhoodDescription}
            </div>
            <div className="text-sm">
              {accommodationDescription}
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
              {voucherName}
            </div>
          </div>
        </div>
        <div className="self-end flex-1 flex items-center text-2xl font-semibold space-x-2">
          <USDCIcon className="w-6 h-6" color="" />
          <div>
            {pricePerNight}
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

const listingInfo1: ListingInfo = {
  hostAddress: '0xc942c9a53012a24c466718f37B31Ed5251a06982',
  ensName: 'ashley.eth',
  referencesNumber: 21,
  vouchesNumber: 7,
  personalDescription: 'ex-MetaMask, into techno, volunteer at EthSF',
  // real
  ipfsHash: 'QmUTCm2NLJ2Rwb2oH6pa1GhWF2vARPY9wkyyRJ3PdbXuyH',
  voucherName: 'Wadeful.eth',
  neighborhoodName: 'Marina District, SF',
  accommodationDescription: 'Couch in the living room',
  neighborhoodDescription: '20 min walk to the EthSF hackathon venue. Nice couch that also converts to a futon. I\'m looking to make new frens in crypto, while supporting myself to make art',
  pricePerNight: '40',
  listingPic: couchPic,
  hostPic: pfpPic,
};

const listingInfo2: ListingInfo = {
  hostAddress: '0xc942c9a53012a24c466718f37B31Ed5251a06123',
  ensName: 'billy.eth',
  referencesNumber: 15,
  vouchesNumber: 3,
  personalDescription: 'Full time web2, part time web3',
  // real
  ipfsHash: 'QmYcYP5XzgAMD1SnNavEgbu4iSoptBGVuMwNzcVnYGNt8z',
  voucherName: 'vitalik.eth',
  neighborhoodName: 'Mission District, SF',
  accommodationDescription: 'Sofa bed in upstairs corner',
  neighborhoodDescription: 'Vibrant part of the Mission. Near the 16th St. BART station.',
  pricePerNight: '30',
  listingPic: couchPic2,
  hostPic: pfpPic2,
};

const ResultsPanel = () => {
  return (
    <div className="bg-lightSky space-y-2 p-2 rounded-md">
      <ListingCard listingInfo={listingInfo1} />
      <ListingCard listingInfo={listingInfo2} />
    </div>
  );
};

export default ResultsPanel;
