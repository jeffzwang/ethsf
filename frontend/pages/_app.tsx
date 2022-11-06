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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import EventSelector from '/components/EventSelector';
import ConnectWalletButton from '/components/ConnectWalletButton';

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    // publicProvider()
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
        <QueryClientProvider client={queryClient}>
          <div className="bg-gradient-to-b from-sky to-dusk py-4 px-12 flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <a href="/">
                <div className="text-eggshell text-xl font-semibold font-serif">
                  Couch Decentral - powered by Polygon
                </div>
              </a>
              <div className="flex items-center text-sm font-semibold font-mono space-x-8 text-eggshell">
                <button>
                  Host a fren
                </button>
                <a href="/trust">
                  <button>
                    Export your trust
                  </button>
                </a>
                <div>
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
            <EventSelector />
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig >
  );
}
