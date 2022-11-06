import { QRCodeSVG } from 'qrcode.react';
import { VerifierNFTAddress } from '/deployments/VerifierNFT';

const QRCode = () => {
  return (
    <QRCodeSVG size={500} value={JSON.stringify({
      'id': 'c811849d-6bfb-4d85-936e-3d9759c7f105',
      'typ': 'application/iden3comm-plain-json',
      'type': 'https://iden3-communication.io/proofs/1.0/contract-invoke-request',
      'body': {
        'transaction_data': {
          'contract_address': VerifierNFTAddress,
          'method_id': 'b68967e2',
          'chain_id': 80001,
          'network': 'polygon-mumbai'
        },
        'reason': 'instabook couch',
        'scope': [{
          'id': 1,
          'circuit_id': 'credentialAtomicQuerySig',
          'rules': {
            'query': {
              'allowed_issuers': ['*'],
              'req': {
                'hasPassport': {
                  '$eq': 1
                }
              },
              'schema': {
                'url': 'https://s3.eu-west-1.amazonaws.com/polygonid-schemas/cca5a13b-bbbf-4460-9172-f3c0ea597b1a.json-ld',
                'type': 'passportPossession'
              }
            }
          }
        }]
      }
    })}
    />
  );
};

export default QRCode;
