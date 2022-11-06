import Image, { StaticImageData } from 'next/image';
import ethsanfranciscologo from '../public/ethsanfranciscologo.png';
import ethdenverlogo from '../public/ethdenverlogo.png';
import ethindialogo from '../public/ethindialogo.png';
import nftnyclogo from '../public/nftnyclogo.png';

type ConferenceEvent = {
  startDate: Date,
  endDate: Date,
  name: string,
  logo: StaticImageData,
  location: string,
}

const EventItem = ({
  isSelected,
  image,
  onClick,
  dateText,
  locationText,
}: {
  isSelected?: boolean;
  image: StaticImageData,
  onClick: Function,
  dateText: string,
  locationText: string,
}) => {
  return (
    <button className={`rounded-b-lg pt-6 pb-2 px-4 flex flex-col items-center  ${isSelected ? 'bg-eggshell hover:bg-eggshell text-graphite' : 'bg-transparent text-eggshell hover:bg-eggshell/20'}`}>
      <div className={`w-32 flex justify-center mb-4 ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
        <Image src={image} alt="EthSanFrancisco logo" height={20} />
      </div>
      <div className="text-sm font-light">
        {dateText}
      </div>
      <div className=" text-sm">
        {locationText}
      </div>
    </button>
  );
};

const EventSelector = () => {
  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <div className="w-full h-[2px] mb-1 bg-eggshell">
        </div>
        <div className="w-full h-[1px] bg-eggshell">
        </div>
        <div className="-mt-[7px] self-center flex space-x-6">
          <EventItem isSelected image={ethsanfranciscologo} onClick={() => {}} dateText="Nov 4-6, 2022" locationText="San Francisco, CA" />
          <EventItem image={ethindialogo} onClick={() => {}} dateText="Dec 2-4, 2022" locationText="Bengaluru, India" />
          <EventItem image={ethdenverlogo} onClick={() => {}} dateText="Feb 24 - Mar 5, 2022" locationText="Denver, CO" />
          <EventItem image={nftnyclogo} onClick={() => {}} dateText="Apr 12-14, 2022" locationText="New York City, NY" />
        </div>
      </div>

    </div>
  );
};

export default EventSelector;
