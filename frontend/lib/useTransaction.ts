import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { TransactionKey } from '/lib/KeyFactory';

enum TransactionStatus {
  PendingMine = 'PendingMine',
  PendingConfirmations = 'PendingConfirmations',
  Confirmed = 'Confirmed',
}

const mumbaiChainParams = {
  refetchInterval_PENDING_MEMPOOL: 300,
  refetchInterval_PENDING_MINE: 2000,
  refetchInterval_PENDING_CONFIRMATIONS: 3000,
  requiredConfirmationCount: 20,
}

const fetchTransaction = async (chainId: number, transactionHash: string) => {
  const provider = new ethers.providers.AlchemyProvider(chainId, process.env.NEXT_PUBLIC_ALCHEMY_ID);

  const [transaction, blockNumber] = await Promise.all([
    provider.getTransaction(transactionHash),
    provider.getBlockNumber(),
  ]);
  if (!transaction) {
    return transaction;
  }
  return {
    ...transaction,
    confirmations: transaction.blockNumber ? blockNumber - transaction.blockNumber : 0
  };
};

const getTransactionStatus = (
  transaction?: ethers.providers.TransactionResponse
): TransactionStatus => {
  if (!transaction || transaction.blockHash === null) {
    return TransactionStatus.PendingMine;
  }
  if (transaction.confirmations < 5) {
    return TransactionStatus.PendingConfirmations;
  }
  return TransactionStatus.Confirmed;
};

const useTransaction = (transactionKey?: TransactionKey) => {
  const [chainId = 0, , transactionHash = ''] = transactionKey || [];
  const chainParams = mumbaiChainParams;
  const { data, status } = useQuery(
    transactionKey || [],
    async () => fetchTransaction(chainId, transactionHash),
    {
      enabled: !!transactionKey,
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: (data) => {
        if (!data) {
          return chainParams.refetchInterval_PENDING_MEMPOOL;
        }
        const { blockHash, blockNumber, confirmations } = data;
        if (blockHash === undefined || blockNumber === undefined) {
          return chainParams.refetchInterval_PENDING_MINE;
        }
        if (confirmations < chainParams.requiredConfirmationCount) {
          return chainParams.refetchInterval_PENDING_CONFIRMATIONS;
        }
        return false;
      },
    }
  );

  return {
    transaction: data,
    transactionStatus: getTransactionStatus(data),
    queryStatus: status,
  };
};

export { useTransaction };
