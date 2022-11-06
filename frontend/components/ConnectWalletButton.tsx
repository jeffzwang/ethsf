import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="flex-1 flex"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="
                    font-mono
                    bg-aqua
                    text-eggshell
                    py-3
                    px-4
                    font-bold
                    shadow-[0px_3px_6px_rgba(146,151,160,0.52)]
                    shadow-[inset_0px_3px_7px_#436AEA]
                    hover:opacity-80 
                    rounded-full
                    "
                    onClick={openConnectModal}
                    type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network (Only Ethereum and Polygon are supported). Make sure the network is added to your Metamask.
                  </button>
                );
              }
              return (
                <div className="flex-1 flex font-mono
                space-x-2
                ">

                  <button
                    onClick={openChainModal}
                    className="
                      flex
                      items-center
                      border
                      border-eggshell
                      active:scale-[90%]
                      transition-all
                      px-2
                      rounded-[2px]
                      "
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {/* {chain.name} */}
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="
                      rounded-[2px]
                      active:scale-[90%]
                      transition-all
                      font-semibold
                      flex-1
                      flex
                      justify-center
                      items-center
                      relative
                      border
                       border-eggshell
                       p-2
                       "
                    onClick={openAccountModal} type="button">
                    <div className="mr-6">
                      {account.displayName}

                    </div>
                    <ChevronDownIcon className="absolute right-3 w-4 h-4" />
                  </button>

                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

// .arrow - down {
//   width: 0;
//   height: 0;
//   border - left: 20px solid transparent;
//   border - right: 20px solid transparent;

//   border - top: 20px solid #f00;
// }

export default ConnectWalletButton;
