import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import dotfile
dotenv.config();
import { ethers } from 'hardhat';

async function main() {
  const provider = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_API_KEY!);
  const wallet = new ethers.Wallet(process.env.METAMASK_MUMBAI_KEY!, provider);

  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const stayPlatform = (await ethers.getContractFactory('StayPlatform')).attach('0x075e16213cc0e2EdF1AED1dEaea54F2A347cA8e0').connect(wallet);
  const res = await stayPlatform.createStayTransactionWithoutAuth(0, 1, 0, '0x6CC094360F352c4F03EFB23F253361Af54A2CFeD', 3, zeroAddress, 'asdf', '0x4ff2DcE59593FE35337c5f9Fa844c990c86d54be');

  console.log('added verifier to stayplatform');
  console.log('res', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
