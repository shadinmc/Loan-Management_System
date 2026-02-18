// src/context/WalletContext.jsx
import { useEffect } from 'react';
import { create } from 'zustand';
import {
  getMyWallet,
  getMyTransactionsPaged,
  reimburseWallet,
  withdrawWallet
} from '../api/walletApi';

const ADD_MONEY_LIMITS_BY_METHOD = {
  upi: 100000,
  card: 500000,
  netbanking: 1000000
};

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

const useWalletStore = create((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,

  setPage: (page) => set({ page }),

  resetWalletState: () => set({
    balance: 0,
    transactions: [],
    isLoading: false,
    page: 0,
    totalPages: 0,
    totalElements: 0
  }),

  fetchWalletData: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      get().resetWalletState();
      return;
    }

    const { page, size } = get();
    set({ isLoading: true });
    try {
      const [wallet, transactionsResponse] = await Promise.all([
        getMyWallet(),
        getMyTransactionsPaged(page, size)
      ]);

      const content = transactionsResponse?.content || [];
      set({
        balance: Number(wallet?.balance || 0),
        transactions: content.map(mapTransaction),
        totalPages: transactionsResponse?.totalPages || 0,
        totalElements: transactionsResponse?.totalElements || 0,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  refreshWalletData: async () => {
    await get().fetchWalletData();
  },

  addMoney: async (amount, paymentMethod = 'upi') => {
    const normalizedAmount = Number(amount);
    const methodKey = String(paymentMethod || 'upi').toLowerCase();
    const methodLimit = ADD_MONEY_LIMITS_BY_METHOD[methodKey] || ADD_MONEY_LIMITS_BY_METHOD.upi;

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (normalizedAmount > methodLimit) {
      throw new Error(`Maximum add money limit for ${methodKey} is ₹${methodLimit.toLocaleString('en-IN')}`);
    }

    await reimburseWallet('WALLET_TOPUP', normalizedAmount);
    await get().refreshWalletData();
  },

  withdrawMoney: async (amount) => {
    await withdrawWallet('WALLET_WITHDRAW', amount);
    await get().refreshWalletData();
  }
}));

export function WalletProvider({ children }) {
  return children;
}

export function useWallet() {
  const store = useWalletStore();
  const page = useWalletStore((state) => state.page);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      store.resetWalletState();
      return;
    }

    store.fetchWalletData().catch((error) => {
      console.error('Error fetching wallet data:', error);
    });
  }, [page]);

  return store;
}
