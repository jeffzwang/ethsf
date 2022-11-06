import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import dotfile
dotenv.config();
import { ethers } from 'hardhat';

async function main() {
  const circuitId = 'credentialAtomicQuerySig';
  const validatorAddress = '0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB';

  // Grab the schema hash from Polygon ID Platform
  const schemaHash = '86c3ae3b5f9ce5547cb90a74c84d020b';

  const schemaEnd = fromLittleEndian(hexToBytes(schemaHash));

  const ageQuery = {
    schema: ethers.BigNumber.from(schemaEnd),
    slotIndex: 2,
    operator: 1,
    circuitId,
    // TODO: not sure if this is right. Maybe should just be array of one ele.
    value: [1, ...new Array(63).fill(0).map(_i => 0)],
  };

  // add the address of the contract just deployed
  const ExampleVerifierAddress = '0x4ff2DcE59593FE35337c5f9Fa844c990c86d54be';

  let exampleVerifier = await ethers.getContractAt('ExampleVerifier', ExampleVerifierAddress);

  const requestId = await exampleVerifier.TRANSFER_REQUEST_ID();

  try {
    await exampleVerifier.setZKPRequest(
      requestId,
      validatorAddress,
      ageQuery,
    );
    console.log('Request set');
  } catch (e) {
    console.log('error: ', e);
  }
}

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function fromLittleEndian(bytes: any) {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte: any) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
