const getTransactionReceiptKey = (
  chainId: number,
  transactionHash: string
): TransactionReceiptKey => {
  return [chainId, 'TransactionReceipt', transactionHash];
};

const getTransactionKey = (chainId: number, transactionHash: string): TransactionKey => {
  return [chainId, 'Transaction', transactionHash];
};

export type TransactionKey = [number, 'Transaction', string];
export type TransactionReceiptKey = [number, 'TransactionReceipt', string];


export { getTransactionReceiptKey, getTransactionKey };
