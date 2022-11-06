import '../styles/globals.css';
import type { AppProps } from 'next/app';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import EventSelector from '/components/EventSelector';
import ConnectWalletButton from '/components/ConnectWalletButton';

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="bg-gradient-to-b from-sky to-dusk py-4 px-12 flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-eggshell text-xl font-semibold font-serif">
              Decentracouch - powered by Polygon
            </div>
            <div className="flex items-center text-sm font-semibold font-mono space-x-8 text-eggshell">
              <button>
                Host a fren
              </button>
              <div>
                <ConnectWalletButton />
              </div>
            </div>
          </div>
          <EventSelector />
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig >
  );
}
