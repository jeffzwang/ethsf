import Image from 'next/image';
import couchPic from '../public/bluecouchphoto.jpg';

const ListingCard = () => {
  return (
    <div className="flex">
      <Image src={couchPic} alt="picture of listing" />
      <div>
        Image
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <div>
            Image
          </div>
          <div className="flex flex-col">
            <div>
              Ashley.eth
            </div>
            <div className="flex">
              <div>
                References 21

              </div>
              <div>
                Vouched by 7
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsPanel = () => {
  return (
    <div className="bg-sky space-y-2">
      <ListingCard />
    </div>
  );
};

export default ResultsPanel;
