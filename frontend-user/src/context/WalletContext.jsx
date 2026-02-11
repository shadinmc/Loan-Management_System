// src/context/WalletContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load wallet data from localStorage
    const savedBalance = localStorage.getItem('walletBalance');
    const savedTransactions = localStorage.getItem('walletTransactions');

    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (newBalance, newTransactions) => {
    localStorage.setItem('walletBalance', newBalance.toString());
    localStorage.setItem('walletTransactions', JSON.stringify(newTransactions));
  };

  const addMoney = (amount, method = 'Bank Transfer') => {
    const newBalance = balance + amount;
    const transaction = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount,
      description: `Added money via ${method}`,
      method,
      date: new Date().toISOString(),
      status: 'completed'
    };

    const newTransactions = [transaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveToStorage(newBalance, newTransactions);

    return transaction;
  };

  const withdrawMoney = (amount, method = 'Bank Transfer') => {
    if (amount > balance) {
      throw new Error('Insufficient balance');
    }

    const newBalance = balance - amount;
    const transaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description: `Withdrawn to ${method}`,
      method,
      date: new Date().toISOString(),
      status: 'completed'
    };

    const newTransactions = [transaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveToStorage(newBalance, newTransactions);

    return transaction;
  };

  const payEMI = (loanId, amount, loanType) => {
    if (amount > balance) {
      throw new Error('Insufficient balance');
    }

    const newBalance = balance - amount;
    const transaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description: `EMI Payment - ${loanType} (${loanId})`,
      method: 'Wallet',
      date: new Date().toISOString(),
      status: 'completed',
      category: 'emi'
    };

    const newTransactions = [transaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveToStorage(newBalance, newTransactions);

    return transaction;
  };

  const receiveDisbursement = (loanId, amount, loanType) => {
    const newBalance = balance + amount;
    const transaction = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount,
      description: `Loan Disbursement - ${loanType} (${loanId})`,
      method: 'Loan',
      date: new Date().toISOString(),
      status: 'completed',
      category: 'disbursement'
    };

    const newTransactions = [transaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveToStorage(newBalance, newTransactions);

    return transaction;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addMoney,
        withdrawMoney,
        payEMI,
        receiveDisbursement
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
