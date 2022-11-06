import Image from 'next/image';
import { InformationCircleIcon, MapPinIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import router from 'next/router';
import { ListingInfo } from '/components/ResultsPanel';

const HostProfileSection = (props: {listingInfo: ListingInfo}) => {
  const { hostAddress, ensName, referencesNumber, vouchesNumber, personalDescription, ipfsHash, voucherName, neighborhoodName, accommodationDescription, neighborhoodDescription, pricePerNight, lensFollowers, listingPic, hostPic } = props.listingInfo;
  return (
    <div className="w-[170px] rounded overflow-hidden flex flex-col shadow-[0px_3px_6px_rgba(146,151,160,0.52)] bg-eggshell mr-4">
      <div className="w-[170px]">
        <Image src={hostPic} alt="picture of host" />

      </div>
      <div className="p-4 flex flex-col  text-sm">
        <div className="font-semibold text-xl mb-2">
          {ensName}
        </div>
        <div className="flex mb-4">
          {personalDescription}
        </div>
        <div className="font-light">
          Vouched by: <span className="font-normal">{vouchesNumber}</span>
        </div>
        <div className="font-light">
          References: <span className="font-normal">{referencesNumber}</span>
        </div>
        <div className="font-light">
          Sex: <span className="font-normal">Female</span>
        </div>
      </div>
    </div>
  );
};

const ListingPanel = (props: {listingInfo: ListingInfo}) => {
  const { hostAddress, ensName, referencesNumber, vouchesNumber, personalDescription, ipfsHash, voucherName, neighborhoodName, accommodationDescription, neighborhoodDescription, pricePerNight, lensFollowers, listingPic, hostPic } = props.listingInfo;
  return (
    <div className="flex-1 rounded overflow-hidden flex flex-col shadow-[0px_3px_6px_rgba(146,151,160,0.52)] bg-eggshell ">
      <div className="flex" >
        <div className="">
          <Image height={120} src={listingPic} alt="picture of listing" />
        </div >
      </div >
      <div className="p-2">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-4 w-4" />
          <div className="flex-1 font-semibold">
            {neighborhoodName}
          </div>
          <div className="text-blue-700 text-[10px] flex items-center space-x-1">
            <InformationCircleIcon className="h-3 w-3" />
            <div>
              Host will message exact location shortly before arrival.
            </div>
          </div>
        </div>
        <div className="m-2 text-sm">
          {accommodationDescription}
        </div>
        <div className="m-2 text-[10px] w-[300px]">
          {neighborhoodDescription}
        </div>
        <div className=" border-b border-black" />
        <div className="flex">
          <div className="flex-1 flex flex-col text-sm p-2">
            <div className="flex">
              <div className="flex-1 font-semibold">
                Arrival Date
              </div>
              <div className="flex-[3]">
                November 4, 2022
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 font-semibold">
                Departure Date
              </div>
              <div className="flex-[3]">
                November 6, 2022
              </div>
            </div>
          </div>
          <button className="flex items-center" onClick={() => {
            router.push(`/messaging/${'0xc942c9a53012a24c466718f37B31Ed5251a06982'}`);

          }}>
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-sky" />
          </button>
        </div>

      </div >
    </div >
  );
};

export default function Listing(listingInfo: ListingInfo) {
  return (
    <div className="flex space-x-4">
      <HostProfileSection listingInfo={listingInfo} />
      <ListingPanel listingInfo={listingInfo} />
    </div>
  );
}
