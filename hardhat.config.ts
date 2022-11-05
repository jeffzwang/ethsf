import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.5.12',
      },
      {
        version: '0.8.9',
      },
      {
        version: '0.8.7',
      },
      {
        version: '0.6.0',
      },
      {
        version: '0.8.4',
      },
      {
        version: '0.8.15',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
      },
    ],
  },
  networks: {
    hardhat: {
      // For metamask
      // https://hardhat.org/metamask-issue
      chainId: 1337,

      // Since we compile/deploy monolith contracts (instead of separately deployed)
      // Some contracts (USDC) hit contract size limit
      allowUnlimitedContractSize: true,
    },
  }
};

export default config;
