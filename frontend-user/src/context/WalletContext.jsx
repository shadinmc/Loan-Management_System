// src/context/WalletContext.jsx
import { createContext, useContext, useMemo, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  getMyWallet,
  getMyTransactionsPaged,
  reimburseWallet,
  withdrawWallet
} from '../api/walletApi';

const WalletContext = createContext(null);
const ADD_MONEY_LIMITS_BY_METHOD = {
  upi: 100000,
  card: 500000,
  netbanking: 1000000
};

export function WalletProvider({ children }) {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem('token');

  const walletQuery = useQuery({
    queryKey: ['wallet', 'me'],
    queryFn: getMyWallet,
    enabled: hasToken,
    retry: false,
  });

  const transactionsQuery = useQuery({
    queryKey: ['wallet', 'transactions', page, size],
    queryFn: () => getMyTransactionsPaged(page, size),
    placeholderData: keepPreviousData,
    enabled: hasToken,
    retry: false,
  });

  const reimburseMutation = useMutation({
    mutationFn: ({ loanId, amount }) => reimburseWallet(loanId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: ({ loanId, amount }) => withdrawWallet(loanId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
  });

  const mapTransaction = (tx) => {
    const isCredit = tx.action === 'CREDIT' || tx.action === 'REIMBURSEMENT';
    const type = isCredit ? 'credit' : 'debit';
    const base = tx.action === 'WITHDRAWN' ? 'Withdrawal' : 'Wallet';
    const loanRef = tx.loanId ? ` (${tx.loanId})` : '';
    return {
      id: tx.transactionId,
      type,
      amount: Number(tx.amount),
      description: `${base} ${tx.action}${loanRef}`,
      method: 'Wallet',
      date: tx.doneAt,
      status: 'completed'
    };
  };

  const transactions = useMemo(() => {
    const content = transactionsQuery.data?.content || [];
    return content.map(mapTransaction);
  }, [transactionsQuery.data]);

  const addMoney = async (amount, paymentMethod = 'upi') => {
    const normalizedAmount = Number(amount);
    const methodKey = String(paymentMethod || 'upi').toLowerCase();
    const methodLimit = ADD_MONEY_LIMITS_BY_METHOD[methodKey] || ADD_MONEY_LIMITS_BY_METHOD.upi;

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (normalizedAmount > methodLimit) {
      throw new Error(`Maximum add money limit for ${methodKey} is ₹${methodLimit.toLocaleString('en-IN')}`);
    }

    return reimburseMutation.mutateAsync({
      loanId: 'WALLET_TOPUP',
      amount: normalizedAmount
    });
  };

  const withdrawMoney = async (amount) => {
    return withdrawMutation.mutateAsync({
      loanId: 'WALLET_WITHDRAW',
      amount
    });
  };

  const balance = Number(walletQuery.data?.balance || 0);
  const isLoading = walletQuery.isLoading || transactionsQuery.isLoading;
  const refreshWalletData = () => {
    queryClient.invalidateQueries({ queryKey: ['wallet', 'me'] });
    queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
  };

  const totalPages = transactionsQuery.data?.totalPages || 0;
  const totalElements = transactionsQuery.data?.totalElements || 0;

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addMoney,
        withdrawMoney,
        page,
        setPage,
        size,
        totalPages,
        totalElements,
        refreshWalletData
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
