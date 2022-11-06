import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-// import dotfile
dotenv.config();
import { ethers } from 'hardhat';

async function main() {
  // const provider = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_API_KEY!);
  console.log('fail here');
  const stayPlatform = (await ethers.getContractFactory('StayPlatform')).attach('0x958D9020af499A4E8B76dE5B132E66bbAdFbD09F');
  // const stayPlatform = await StayPlatform.deploy('0xbeef240F4BAce27f051eE19F141dc71a84C8Fc42', '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747');

  // await stayPlatform.deployed();
  // console.log('stayplatform deployed to:', stayPlatform.address);

  const ExampleVerifier = await ethers.getContractFactory('ExampleVerifier');
  const exampleVerifier = await ExampleVerifier.deploy('0x01be60080937d3cF8566eDe846324AE2b638509b', stayPlatform.address);

  await exampleVerifier.deployed();

  console.log(' deployed to:', exampleVerifier.address);

  await stayPlatform.addVerifier(exampleVerifier.address);

  console.log('added verifier to stayplatform');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
