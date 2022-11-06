import { useState } from 'react';
import ChunkyButton from '/components/ChunkyButton';
import QRCode from '/components/QRCode';

export default function Trust() {
  const [clickedButton, setClickedButton] = useState(false);
  if (!clickedButton) {
    return (
      <div className="flex flex-col items-center justify-center text-white text-lg">
        Export My Trust Signals
        <div>
          <ChunkyButton title={'Export Proof Card to Polygon ID Wallet'} onClick={() => setClickedButton(true)} />
        </div>
      </div >
    );
  }
  return (
    <div className="flex flex-col items-center justify-center text-white text-lg">
      Scan using Polygon ID wallet.
      <QRCode />
    </div>
  );
}
