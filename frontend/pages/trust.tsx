import ChunkyButton from '/components/ChunkyButton';

export default function Trust() {
  return (
    <div className="flex flex-col items-center justify-center text-white text-lg">
      Export My Trust Signals
      <div>
        <ChunkyButton
          title={'Export Proof Card to Polygon ID Wallet'}
          onClick={() => {
            window.open('https://platform-test.polygonid.com/claim-link/06ba5682-5bf2-4f71-aa41-1552737f8e3f');
          }
          }
        />
      </div>
    </div >
  );
}
