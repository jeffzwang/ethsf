export const getAddressForDisplay = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};
