import { ethers } from 'hardhat';

const StayTransaction = [
  { name: 'startTime', type: 'uint256' },
  { name: 'endTime', type: 'uint256' },
  { name: 'price', type: 'uint256' },
  { name: 'guest', type: 'address' },
  { name: 'host', type: 'address' },
  { name: 'arbitrationDeadline', type: 'uint256' },
  { name: 'arbiter', type: 'address' },
];

async function main() {
  const provider = ethers.getDefaultProvider();

  // Deploy USDC
  const FiatTokenV2_1 = await ethers.getContractFactory('FiatTokenV2_1');
  const usdc = await FiatTokenV2_1.deploy();
  await usdc.deployed();

  const StayPlatform = await ethers.getContractFactory('StayPlatform');
  const stayPlatform = await StayPlatform.deploy('0xBadFBdE4824AB5A8f6F1fa8d38e0934b5697A8ad', usdc.address);

  await stayPlatform.deployed();
  console.log(`Deployed StayPlatform to ${stayPlatform.address}`);

  // Create signature for a transaction.
  const hostWallet = new ethers.Wallet('0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82', provider);

  const domain = {
    name: 'StayPlatform',
    version: '0.0.1',
    chainId: 1337,
    verifyingContract: stayPlatform.address,
  };

  const req = {
    startTime: 1667748072,
    endTime: 1668007272,
    price: 0,
    guest: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // account 10
    host: await hostWallet.getAddress(),
    arbitrationDeadline: 1668093672,
    arbiter: '0x0000000000000000000000000000000000000000',
    tokenURI: 'QmNjjbQqpeRiV3MLSpHmVWaxVnP1b1buAFuJec7r2xNmYW',
  };

  const signature = await hostWallet._signTypedData(domain, { StayTransaction }, req);
  const { v, r, s } = ethers.utils.splitSignature(signature);

  // Do the transaction using the guest's address.
  const res = await stayPlatform.createStayTransaction(req.startTime, req.endTime, req.price, req.host, req.arbitrationDeadline, req.arbiter, req.tokenURI, v, r, s);

  // sleep 1 second.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await res.wait();
  // Get events from stayPlatform contract.
  // take the sha3 hash of tokenURI.
  const tokenURIHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(req.tokenURI));
  console.log('tokenURIHash', tokenURIHash);
  await stayPlatform.rateHost(true, tokenURIHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
