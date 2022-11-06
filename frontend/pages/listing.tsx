import Image from 'next/image';
import pfpPic from '../public/pfp.jpg';
import couchPic from '../public/bluecouchphoto.jpg';
import furnishedCouchPic from '../public/furnishedcouchphoto.jpeg';
import { InformationCircleIcon, MapPinIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import router from 'next/router';

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
        {/* <div className=""> */}
        {/*   <Image height={120} src={couchPic} alt="picture of listing" /> */}
        {/* </div> */}
        {/* <div className=""> */}
        {/*   <Image height={120} src={furnishedCouchPic} alt="picture of listing" /> */}
        {/* </div> */}
      </div>
      <div className="p-2">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-4 w-4" />
          <div className="flex-1 font-semibold">
            Marina District, SF
          </div>
          <div className="text-blue-700 text-[10px] flex items-center space-x-1">
            <InformationCircleIcon className="h-3 w-3" />
            <div>
              Host will message exact location shortly before arrival.

            </div>
          </div>
        </div>
        <div className="m-2 text-sm">
          Couch in the living room
        </div>
        <div className="m-2 text-[10px] w-[300px]">
          20min walk to the ETH SF Hackathon venue. It’s a nice couch that also converts to a futon. I’m looking to make new frens in crypto, while making money to support myself doing art. You’ll sometimes hear the fog horns, but otherwise my place is very quiet. The beautiful view of the bay is a bonus!
        </div>
        <div className=" border-b border-black" />
        <div className="flex">
          <div className="flex-1 flex flex-col text-sm p-2">
            <div className="flex">
              <div className="flex-1 font-semibold">
                Arrival Date
              </div>
              <div className="flex-[3]">
                November 6, 2022
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 font-semibold">
                Departure Date
              </div>
              <div className="flex-[3]">
                November 8, 2022
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
