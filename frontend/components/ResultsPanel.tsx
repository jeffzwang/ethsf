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

import couchPic4 from '../public/basement.jpeg';
import couchPic3 from '../public/couchpic3.png';
import couchPic2 from '../public/couchpic2.png';
import couchPic from '../public/bluecouchphoto.jpg';
import pfpPic2 from '../public/pfp2.avif';
import pfpPic from '../public/pfp.jpg';
import pfpPic3 from '../public/spiral.avif';
import pfpPic4 from '../public/azuki.png';
import { useStayTransactionStore } from '/lib/StayTransactionStore';
import { useEffect, useState } from 'react';

const useIsEligibleForInstantBook = () => {
  const { address } = useAccount();

  const [scoped, setScoped] = useState(false);
  useEffect(() => {
    setScoped(true);
  });

  const { data: balance, isError, isLoading } = useContractRead({
    abi: VerifierNFTAbi,
    address: VerifierNFTAddress,
    functionName: 'balanceOf',
    args: [address || '0x0'],
  });

  if (!scoped) {
    return false;
  }

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
  pricePerNight: number;
  lensFollowers: number;
  listingPic: StaticImageData;
  hostPic: StaticImageData;
}

// A ES5 function that automatically generates a random string of length 10 without using randomUUID.
function generateRandomString() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const defaultStayRequest = {
  startTime: ethers.utils.hexlify(1667748072),
  endTime: ethers.utils.hexlify(1668007272),
  price: '0x0',
  host: '0xc942c9a53012a24c466718f37B31Ed5251a06982',
  arbitrationDeadline: ethers.utils.hexlify(1668093672),
  arbiter: '0x0000000000000000000000000000000000000000',
  tokenURI: 'QmNjjbQqpeRiV3MLSpHmVWaxVnP1b1buAFuJec7r2xNmYW' + generateRandomString(),
};

// pass ListingInfo in as props.
const ListingCard = ({ listingInfo }: {listingInfo: ListingInfo}) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const router = useRouter();
  const isEligibleForInstantBook = useIsEligibleForInstantBook();
  const addStay = useStayTransactionStore(state => state.addStay);

  const { ensName, referencesNumber, vouchesNumber, personalDescription, voucherName, neighborhoodName, accommodationDescription, neighborhoodDescription, pricePerNight, listingPic, hostPic, lensFollowers } = listingInfo;

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
              <div className="flex space-x-2">
                <div className="font">
                  Lens Followers
                </div>
                <div className="font-semibold">
                  {lensFollowers}
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
            {pricePerNight.toString()}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <GreenButton
            className={`items-center flex space-x-2 shadow-none justify-center text-sm ${isEligibleForInstantBook ? 'bg-cyan-600' : 'bg-gray-400 opacity-80'}`}
            onClick={async () => {
              if (!address || !isEligibleForInstantBook) {
                return;
              }
              const contract = new ethers.Contract(StayPlatformAddress, StayPlatformAbi, signer!);
              const transactionResponse = await contract.createStayTransactionWithoutAuth(defaultStayRequest.startTime, defaultStayRequest.endTime, 0x0, defaultStayRequest.host, defaultStayRequest.arbitrationDeadline, defaultStayRequest.arbiter, defaultStayRequest.tokenURI, VerifierNFTAddress);
              // @ts-ignore
              addStay({
                ...defaultStayRequest, guest: address, approvalSignature: '0x0',
              }, transactionResponse.hash);
              router.push(`/booking/${transactionResponse.hash}`);

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
                tokenURI: 'QmNjjbQqpeRiV3MLSpHmVWaxVnP1b1buAFuJec7r2xNmYW' + generateRandomString(),
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
  pricePerNight: 40,
  lensFollowers: 19,
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
  ipfsHash: 'QmZFGaHBF2Arm7zNEgafKrL7bQkXsi33rQ1BAPVkR1DfZN',
  voucherName: 'vitalik.eth',
  neighborhoodName: 'Mission District, SF',
  accommodationDescription: 'Sofa bed in upstairs corner',
  neighborhoodDescription: 'Vibrant part of the Mission. Near the 16th St. BART station.',
  pricePerNight: 30,
  lensFollowers: 0,
  listingPic: couchPic2,
  hostPic: pfpPic2,
};

const listingInfo3: ListingInfo = {
  hostAddress: '0xdd4ffD5B749cB86B20c70AD51e22FfA4Da6246bC',
  ensName: 'samkim.eth',
  referencesNumber: 20,
  vouchesNumber: 1,
  personalDescription: 'ETH maxi. I like to code and play with my dog. GPT-3 said this.',
  // real
  ipfsHash: 'QmZxW4v2jYTsJM29KrUng7pthwVfgddhQRSeenQjTnDpDK',
  voucherName: 'none',
  neighborhoodName: 'Lower Haight, SF',
  accommodationDescription: 'Spare room',
  neighborhoodDescription: 'Live near the Centre and Alamo Square Park! Friends mostly work at startups.',
  pricePerNight: 25,
  lensFollowers: 4,
  listingPic: couchPic3,
  hostPic: pfpPic3,
};

const listingInfo4: ListingInfo = {
  hostAddress: '0x74D8a2472067e506453f0e3395A59BBA7d865f2D',
  ensName: 'jeffzwang.eth',
  referencesNumber: 0,
  vouchesNumber: 0,
  personalDescription: 'Who likes it when I say "I\'m a web3 developer"? Svelte and Ethers.js!',
  // real
  ipfsHash: 'QmcbffFc4gR2CB3ZVDvSUDYmJzFCjU9vQ9puUFP9SECh1z',
  voucherName: 'none',
  neighborhoodName: 'Sunset District, SF',
  accommodationDescription: 'Basement - promise it is not that bad!',
  neighborhoodDescription: 'Work at a Chinese restaurant - happy to cook for you!',
  pricePerNight: 15,
  lensFollowers: 2,
  listingPic: couchPic4,
  hostPic: pfpPic4,
};

const ResultsPanel = () => {
  // TODO: when polygon ID on mainnet, fetch listings from IPFS.
  const listingInfoArr = [listingInfo1, listingInfo2, listingInfo3, listingInfo4];
  return (
    <div className="bg-lightSky space-y-2 p-2 rounded-md">
      {listingInfoArr.map((listingInfo, index) => {
        return (
          <ListingCard
            key={index}
            listingInfo={listingInfo}
          />
        );
      })}
    </div>
  );
};

export default ResultsPanel;
