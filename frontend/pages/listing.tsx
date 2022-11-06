import Image from 'next/image';
import pfpPic from '../public/pfp.jpg';
import couchPic from '../public/bluecouchphoto.jpg';
import furnishedCouchPic from '../public/furnishedcouchphoto.jpeg';

const HostProfileSection = () => {
  return (
    <div className="w-[170px] rounded overflow-hidden flex flex-col shadow-[0px_3px_6px_rgba(146,151,160,0.52)] bg-eggshell">
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
      <div className="flex " >
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
