import Image from 'next/image';
import pfpPic from '../public/pfp.jpg';
import couchPic from '../public/bluecouchphoto.jpg';
import furnishedCouchPic from '../public/furnishedcouchphoto.jpeg';
import { InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

const HostProfileSection = () => {
  return (
    <div className="w-[170px] rounded overflow-hidden flex flex-col shadow-[0px_3px_6px_rgba(146,151,160,0.52)] bg-eggshell mr-4">
      <div className="w-[170px]">
        <Image src={pfpPic} alt="picture of host" />

      </div>
      <div className="p-4 flex flex-col  text-sm">
        <div className="font-semibold text-xl mb-2">
          ashley.eth
        </div>
        <div className="flex mb-4">
          ex-MetaMask. buidlin
        </div>
        <div className="font-light">
          Vouched by: <span className="font-normal">7</span>
        </div>
        <div className="font-light">
          References: <span className="font-normal">21</span>
        </div>
        <div className="font-light">
          Sex: <span className="font-normal">Female</span>
        </div>
      </div>
    </div>
  );
};

const ListingPanel = () => {
  return (
    <div className="flex-1 rounded overflow-hidden flex flex-col shadow-[0px_3px_6px_rgba(146,151,160,0.52)] bg-eggshell ">
      <div className="flex" >
        <div className="">
          <Image height={120} src={couchPic} alt="picture of listing" />
        </div>
        <div className="">
          <Image height={120} src={furnishedCouchPic} alt="picture of listing" />
        </div>
        <div className="">
          <Image height={120} src={couchPic} alt="picture of listing" />
        </div>
        <div className="">
          <Image height={120} src={furnishedCouchPic} alt="picture of listing" />
        </div>
      </div>
      <div className="m-2 flex space-x-2">
        <MapPinIcon className="h-3 w-3" />
        Marina District, SF
        <div className="text-blue-700 text-[10px]">
          <InformationCircleIcon className="h-3 w-3" />
          Host will message exact location shortly before arrival.
        </div>
      </div>
      <div className="m-2 text-sm">
        Couch in the living room
      </div>
      <div className="m-2 text-[10px] w-[300px]">
        20min walk to the ETH SF Hackathon venue. It’s a nice couch that also converts to a futon. I’m looking to make new frens in crypto, while making money to support myself doing art. You’ll sometimes hear the fog horns, but otherwise my place is very quiet. The beautiful view of the bay is a bonus!
      </div>
      <div className="m-4 border-b border-black" />
      <div>
        Arrival Date: November 6, 2022
      </div>
      <div>
        Departure Date: November 7, 2022
      </div>
    </div>
  );
};

const BookPanel = () => {
  return (
    <div className="">
    </div>
  );
};

export default function Listing() {
  return (
    <div className="flex space-x-4">
      <HostProfileSection />
      <ListingPanel />
      <BookPanel />
    </div>
  );
}
