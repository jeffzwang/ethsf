import { RelayerRouter } from 'src/relayer/RelayerRouter';

export type Chain = {
  rpcUrl: string;
  chainId: number;
  relayerRouter: RelayerRouter;
}

// map from chain ID to chain
export const chainById: Map<number, Chain> = new Map();

type ChainMetadata = {
  confirmations: number;
  forwarderAddress?: string;
  isLocalChain: boolean;
}

export const chainIdToMetadata = (chainID: number): ChainMetadata => {
  switch (chainID) {
  case 1:
    return {
      confirmations: 12,
      forwarderAddress: '0xbeef240F4BAce27f051eE19F141dc71a84C8Fc42',
      isLocalChain: false,
    };
  case 5:
    return {
      confirmations: 5,
      forwarderAddress: '0xbeef240F4BAce27f051eE19F141dc71a84C8Fc42',
      isLocalChain: false,
    };
    // assuming this is hardhat
  case 1337:
    return {
      confirmations: 1,
      forwarderAddress: '0xBadFBdE4824AB5A8f6F1fa8d38e0934b5697A8ad',
      isLocalChain: true,
    };
  default:
    return {
      confirmations: 1,
      forwarderAddress: '0xbeef240F4BAce27f051eE19F141dc71a84C8Fc42',
      isLocalChain: false,
    };
  }
};
