// src/pages/WalletPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  RefreshCw,
  CreditCard,
  Smartphone,
  Building,
  Eye,
  EyeOff
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import LottieAnimation from '../components/LottieAnimation';

export default function WalletPage() {
  const { balance, transactions, addMoney, withdrawMoney, isLoading } = useWallet();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  if (isLoading) {
    return (
      <div className="wallet-loading">
        <LottieAnimation
          src="https://lottie.host/embed/wallet-loading.json"
          style={{ width: 120, height: 120 }}
        />
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="wallet-page">
      <div className="wallet-container">

        {/* Header */}
        <div className="wallet-header">
          <div className="header-content">
            <h1>My Wallet</h1>
            <p>Manage your money securely</p>
          </div>
          <div className="header-icon">
            <LottieAnimation
              src="https://lottie.host/embed/wallet-animation.json"
              style={{ width: 60, height: 60 }}
            />
          </div>
        </div>

        {/* Balance Card */}
        <motion.div
          className="balance-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="balance-header">
            <div className="balance-label">
              <WalletIcon size={20} />
              <span>Available Balance</span>
            </div>
            <button
              className="toggle-balance"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="balance-amount">
            {showBalance ? (
              <span>₹{balance.toLocaleString('en-IN')}</span>
            ) : (
              <span>₹****</span>
            )}
          </div>

          <div className="balance-actions">
            <motion.button
              className="action-btn add-money"
              onClick={() => setShowAddMoney(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              Add Money
            </motion.button>

            <motion.button
              className="action-btn withdraw"
              onClick={() => setShowWithdraw(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUpRight size={18} />
              Withdraw
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div
            className="stat-card credit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">
              <ArrowDownLeft size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Received</span>
              <span className="stat-value">₹{totalCredit.toLocaleString('en-IN')}</span>
            </div>
          </motion.div>

          <motion.div
            className="stat-card debit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">
              <ArrowUpRight size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">₹{totalDebit.toLocaleString('en-IN')}</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          className="transactions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header">
            <div className="section-title">
              <History size={20} />
              <span>Recent Transactions</span>
            </div>
            <button className="view-all">View All</button>
          </div>

          <div className="transactions-list">
            {recentTransactions.length === 0 ? (
              <div className="no-transactions">
                <LottieAnimation
                  src="https://lottie.host/embed/empty-state.json"
                  style={{ width: 80, height: 80 }}
                />
                <p>No transactions yet</p>
                <span>Start by adding money to your wallet</span>
              </div>
            ) : (
              recentTransactions.map((txn, idx) => (
                <motion.div
                  key={txn.id}
                  className="transaction-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className={`txn-icon ${txn.type}`}>
                    {txn.type === 'credit' ?
                      <ArrowDownLeft size={16} /> :
                      <ArrowUpRight size={16} />
                    }
                  </div>

                  <div className="txn-details">
                    <span className="txn-description">{txn.description}</span>
                    <span className="txn-date">
                      {new Date(txn.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className={`txn-amount ${txn.type}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showAddMoney && (
            <AddMoneyModal
              onClose={() => setShowAddMoney(false)}
              onSubmit={addMoney}
            />
          )}

          {showWithdraw && (
            <WithdrawModal
              balance={balance}
              onClose={() => setShowWithdraw(false)}
              onSubmit={withdrawMoney}
            />
          )}
        </AnimatePresence>
      </div><style>{`
        .wallet-page {
          min-height: 100vh;
          padding: 100px 24px 60px;
          background: var(--bg-primary);
        }

        .wallet-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .wallet-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .wallet-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .wallet-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }

        .balance-card {
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          padding: 32px;
          border-radius: 20px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(45, 190, 96, 0.25);
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .balance-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9375rem;
          opacity: 0.9;
        }

        .toggle-balance {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          padding: 6px;
          color: white;
          cursor: pointer;
        }

        .balance-amount {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .balance-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.add-money {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .action-btn.add-money:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .action-btn.withdraw {
          background: rgba(255, 255, 255, 0.9);
          color: #2DBE60;
        }

        .action-btn.withdraw:hover {
          background: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .stat-card.credit {
          border-left: 4px solid #2DBE60;
        }

        .stat-card.debit {
          border-left: 4px solid #EF4444;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card.credit .stat-icon {
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .stat-card.debit .stat-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .stat-label {
          display: block;
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .transactions-section {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .view-all {
          color: #2DBE60;
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;}

        .transactions-list {
          padding: 0 24px 24px;
        }

        .no-transactions {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }

        .no-transactions p {
          margin: 16px 0 4px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .txn-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;}

        .txn-icon.credit {
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .txn-icon.debit {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .txn-details {
          flex: 1;
        }

        .txn-description {
          display: block;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .txn-date {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .txn-amount {
          font-weight: 600;
        }

        .txn-amount.credit {
          color: #2DBE60;
        }

        .txn-amount.debit {
          color: #EF4444;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .balance-card {
            padding: 24px;
          }

          .balance-amount {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

// Add Money Modal
function AddMoneyModal({ onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];
  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'card', label: 'Debit/Credit Card', icon: CreditCard },
    { id: 'netbanking', label: 'Net Banking', icon: Building }
  ];

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    onSubmit(parseFloat(amount), selectedMethod.label);

    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="modal-content add-money-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="modal-header">
          <h3>Add Money</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="amount-section">
            <label>Enter Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                max="50000"
              />
            </div>

            <div className="quick-amounts">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  className={`quick-btn ${amount == amt ? 'active' : ''}`}
                  onClick={() => setAmount(amt.toString())}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="payment-section">
            <label>Payment Method</label>
            <div className="payment-methods">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    className={`payment-btn ${paymentMethod === method.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <Icon size={20} />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={!amount || amount <= 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount || 0}`
            )}
          </button>
        </div>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
        }

        .modal-content {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--card-bg);
          border-radius: 20px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 1001;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: var(--bg-secondary);
          border-radius: 8px;
          font-size: 20px;
          color: var(--text-secondary);
          cursor: pointer;}

        .modal-body {
          padding: 24px;
        }

        .amount-section {
          margin-bottom: 32px;
        }

        .amount-section label,
        .payment-section label {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .amount-input-wrapper {
          position: relative;
          margin-bottom: 16px;
        }

        .currency {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .amount-input-wrapper input {
          width: 100%;
          padding: 16px 16px 16px 40px;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .amount-input-wrapper input:focus {
          border-color: #2DBE60;
        }

        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .quick-btn {
          padding: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-btn.active,
        .quick-btn:hover {
          border-color: #2DBE60;
          background: rgba(45, 190, 96, 0.1);
          color: #2DBE60;
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-btn.active {
          border-color: #2DBE60;
          background: rgba(45, 190, 96, 0.05);
          color: #2DBE60;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .btn-submit {
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Withdraw Modal
function WithdrawModal({ balance, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bankAccounts = [
    { id: '1', name: 'HDFC Bank', account: '****1234', type: 'Savings' },
    { id: '2', name: 'SBI Bank', account: '****5678', type: 'Current' },
    { id: '3', name: 'ICICI Bank', account: '****9012', type: 'Savings' }
  ];

  const handleSubmit = async () => {
    if (!amount || amount <= 0 || amount > balance || !selectedBank) return;

    setIsProcessing(true);

    // Simulate withdrawal processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bank = bankAccounts.find(b => b.id === selectedBank);
    onSubmit(parseFloat(amount), `${bank.name} ${bank.account}`);

    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="modal-content withdraw-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="modal-header">
          <h3>Withdraw Money</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="balance-info">
            <span>Available Balance: ₹{balance.toLocaleString('en-IN')}</span>
          </div>

          <div className="amount-section">
            <label>Withdrawal Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                max={balance}
              />
            </div>
          </div>

          <div className="bank-section">
            <label>Select Bank Account</label>
            <div className="bank-accounts">
              {bankAccounts.map(bank => (
                <button
                  key={bank.id}
                  className={`bank-btn ${selectedBank === bank.id ? 'active' : ''}`}
                  onClick={() => setSelectedBank(bank.id)}
                ><Building size={20} />
                  <div className="bank-info">
                    <span className="bank-name">{bank.name}</span>
                    <span className="account-info">{bank.account} • {bank.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={!amount || amount <= 0 || amount > balance || !selectedBank || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              `Withdraw ₹${amount || 0}`
            )}
          </button>
        </div>

        <style>{`
          .balance-info {
            background: var(--bg-secondary);
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .bank-accounts {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .bank-btn {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            border: 2px solid var(--border-color);
            background: var(--bg-primary);
            color: var(--text-secondary);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
          }

          .bank-btn.active {
            border-color: #2DBE60;
            background: rgba(45, 190, 96, 0.05);
            color: #2DBE60;
          }

          .bank-info {
            flex: 1;
          }

          .bank-name {
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .account-info {
            font-size: 0.8125rem;
            opacity: 0.7;
          }
        `}</style>
      </motion.div>
    </>
  );
}
