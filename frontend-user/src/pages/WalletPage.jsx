// src/pages/WalletPage.jsx - PROFESSIONAL ENHANCED VERSION
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CreditCard,
  Smartphone,
  Building,
  Eye,
  EyeOff,
  TrendingUp,
  Send,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as repaymentApi from '../api/repaymentApi';

const toAmountString = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '0';
  return parsed.toFixed(2);
};
const ADD_MONEY_LIMITS_BY_METHOD = {
  upi: 100000,
  card: 500000,
  netbanking: 1000000
};

export default function WalletPage() {
  const {
    balance,
    transactions,
    withdrawMoney,
    isLoading,
    page,
    setPage,
    totalPages,
    totalElements,
    refreshWalletData
  } = useWallet();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [prefillAmount, setPrefillAmount] = useState('');
  const [prefillWithdrawAmount, setPrefillWithdrawAmount] = useState('');
  const [withdrawMeta, setWithdrawMeta] = useState({ loanId: null, purpose: null });
  const [transferAnimation, setTransferAnimation] = useState(null);
  const transferAnimationTimeoutRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const shouldOpen = searchParams.get('add') === '1';
    const shouldWithdraw = searchParams.get('withdraw') === '1';
    const topupSuccess = searchParams.get('topupSuccess') === '1';
    const transferType = searchParams.get('transfer') || 'credit';
    const amountParam = searchParams.get('amount');
    const loanIdParam = searchParams.get('loanId');
    const purposeParam = searchParams.get('purpose');
    if (topupSuccess) {
      triggerTransferAnimation(transferType, amountParam);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('topupSuccess');
      nextParams.delete('transfer');
      nextParams.delete('amount');
      setSearchParams(nextParams, { replace: true });
    }
    if (shouldOpen) {
      if (amountParam) {
        setPrefillAmount(amountParam);
      }
      setShowAddMoney(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('add');
      nextParams.delete('amount');
      setSearchParams(nextParams, { replace: true });
    }
    if (shouldWithdraw) {
      if (amountParam) {
        setPrefillWithdrawAmount(amountParam);
      }
      setWithdrawMeta({ loanId: loanIdParam || null, purpose: purposeParam || null });
      setShowWithdraw(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('withdraw');
      nextParams.delete('amount');
      nextParams.delete('loanId');
      nextParams.delete('purpose');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const stateAnimation = location.state?.transferAnimation;
    if (!stateAnimation) return;

    triggerTransferAnimation(stateAnimation.type || 'credit', stateAnimation.amount);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    const shouldLock = showAddMoney || showWithdraw;
    if (!shouldLock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [showAddMoney, showWithdraw]);

  useEffect(() => () => {
    if (transferAnimationTimeoutRef.current) {
      clearTimeout(transferAnimationTimeoutRef.current);
    }
  }, []);

  const triggerTransferAnimation = (type, amount) => {
    if (transferAnimationTimeoutRef.current) {
      clearTimeout(transferAnimationTimeoutRef.current);
    }
    setTransferAnimation({
      type,
      amount: Number(amount) || 0,
      id: Date.now()
    });
    transferAnimationTimeoutRef.current = setTimeout(() => {
      setTransferAnimation(null);
    }, 1800);
  };

  if (isLoading) {
    return (
      <div className="wallet-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <WalletIcon size={48} />
        </motion.div>
        <p>Loading wallet...</p>
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const handleWalletWithdraw = async (amount) => {
    const normalizedAmount = Number(amount);
    if (withdrawMeta?.purpose === 'ots' && withdrawMeta.loanId) {
      if (typeof settleOtsFn !== 'function') {
        throw new Error('repaymentApi.settleOts is unavailable');
      }
      await settleOtsFn(withdrawMeta.loanId, toAmountString(amount));
      refreshWalletData();
      return;
    }
    if (withdrawMeta?.purpose === 'emi' && withdrawMeta.loanId) {
      if (typeof payEmiFn !== 'function') {
        throw new Error('payEmi API is not available');
      }
      await payEmiFn(withdrawMeta.loanId, toAmountString(amount));
      refreshWalletData();
      return;
    }
    await withdrawMoney(normalizedAmount);
  };

  return (
    <div className="wallet-page">
      <div className="wallet-container">
        {/* Header */}
        <motion.div
          className="wallet-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-content">
            <div className="header-badge">
              <Zap size={14} />
              <span>Digital Wallet</span>
            </div>
            <h1>My Wallet</h1>
            <p>Manage your finances seamlessly</p>
          </div>
          <motion.div
            className="header-icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WalletIcon size={28} />
          </motion.div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          className="balance-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="balance-bg-pattern" />

          <div className="balance-header">
            <div className="balance-label">
              <WalletIcon size={18} />
              <span>Available Balance</span>
            </div>
            <motion.button
              className="toggle-balance"
              onClick={() => setShowBalance(!showBalance)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={showBalance ? 'visible' : 'hidden'}
              className="balance-amount"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {showBalance ? `₹${balance.toLocaleString('en-IN')}` : '₹••••••'}
            </motion.div>
          </AnimatePresence>

          <div className="balance-actions">
            <motion.button
              className="action-btn add"
              onClick={() => setShowAddMoney(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              <span>Add Money</span>
            </motion.button>

            <motion.button
              className="action-btn withdraw"
              onClick={() => setShowWithdraw(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={18} />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
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
              <div className="stat-trend positive">
                <TrendingUp size={12} />
                <span>+12.5%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="stat-card debit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="stat-icon">
              <ArrowUpRight size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">₹{totalDebit.toLocaleString('en-IN')}</span>
              <div className="stat-trend negative">
                <TrendingUp size={12} />
                <span>+8.2%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transactions Section */}
        <motion.div
          className="transactions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <div className="section-title">
              <div className="title-icon">
                <History size={20} />
              </div>
              <div>
                <h3>Recent Activity</h3>
                <p>Your latest transactions</p>
              </div>
            </div>
            <button className="view-all">
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="transactions-list">
            {recentTransactions.length === 0 ? (
              <div className="no-transactions">
                <div className="empty-icon">
                  <WalletIcon size={40} />
                </div>
                <h4>No transactions yet</h4>
                <p>Start by adding money to your wallet</p>
                <button
                  className="start-btn"
                  onClick={() => setShowAddMoney(true)}
                >
                  <Plus size={18} />
                  Add Money Now
                </button>
              </div>
            ) : (
              recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="transaction-item"
                  data-details={`ID: ${txn.id || '-'} | Method: ${txn.method || 'Wallet'} | Status: ${txn.status || 'completed'}`}
                >
                  <div className={`txn-icon ${txn.type}`}>
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>

                  <div className="txn-details">
                    <div className="txn-header">
                      <span className="txn-description">{txn.description}</span>
                      {txn.status === 'completed' && (
                        <CheckCircle2 size={14} className="status-icon" />
                      )}
                    </div>
                    <div className="txn-meta">
                      <Clock size={12} />
                      <span>
                        {new Date(txn.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className={`txn-amount ${txn.type}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>

          {recentTransactions.length > 0 && (
            <div className="pagination">
              <div className="page-info">
                Page {page + 1} of {Math.max(totalPages, 1)} • {totalElements} total
              </div>
              <div className="page-actions">
                <button
                  className="page-btn"
                  onClick={() => setPage(Math.max(page - 1, 0))}
                  disabled={page <= 0}
                >
                  Previous
                </button>
                <button
                  className="page-btn"
                  onClick={() => setPage(page + 1)}
                  disabled={totalPages === 0 || page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modals */}
        {showAddMoney && (
          typeof document !== 'undefined' && document.body
            ? createPortal(
                <AddMoneyModal
                  onClose={() => setShowAddMoney(false)}
                  onSubmit={(amount, paymentMethod) => {
                    setShowAddMoney(false);
                    navigate(
                      `/wallet/payments/${paymentMethod}?amount=${encodeURIComponent(toAmountString(amount))}`
                    );
                  }}
                  initialAmount={prefillAmount}
                />,
                document.body
              )
            : (
              <AddMoneyModal
                onClose={() => setShowAddMoney(false)}
                onSubmit={(amount, paymentMethod) => {
                  setShowAddMoney(false);
                  navigate(
                    `/wallet/payments/${paymentMethod}?amount=${encodeURIComponent(toAmountString(amount))}`
                  );
                }}
                initialAmount={prefillAmount}
              />
            )
        )}

        {showWithdraw && (
          typeof document !== 'undefined' && document.body
            ? createPortal(
                <WithdrawModal
                  balance={balance}
                  onClose={() => setShowWithdraw(false)}
                  onSubmit={handleWalletWithdraw}
                  onSuccess={(amount) => triggerTransferAnimation('debit', amount)}
                  initialAmount={prefillWithdrawAmount}
                  requireBank={!withdrawMeta?.purpose}
                />,
                document.body
              )
            : (
              <WithdrawModal
                balance={balance}
                onClose={() => setShowWithdraw(false)}
                onSubmit={handleWalletWithdraw}
                onSuccess={(amount) => triggerTransferAnimation('debit', amount)}
                initialAmount={prefillWithdrawAmount}
                requireBank={!withdrawMeta?.purpose}
              />
            )
        )}
        <AnimatePresence>
          {transferAnimation && (
            <FundTransferAnimation
              key={transferAnimation.id}
              type={transferAnimation.type}
              amount={transferAnimation.amount}
            />
          )}
        </AnimatePresence>
      </div>

      <style>{styles}</style>
    </div>
  );
}

// Professional Add Money Modal
// Complete AddMoneyModal component
function AddMoneyModal({ onClose, onSubmit, initialAmount = '' }) {
  const [amount, setAmount] = useState(initialAmount || '');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const normalizedAmount = Number(amount);
  const methodLimit = ADD_MONEY_LIMITS_BY_METHOD[paymentMethod] || ADD_MONEY_LIMITS_BY_METHOD.upi;
  const exceedsAddLimit = normalizedAmount > methodLimit;

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  const quickAmounts = [500, 1000, 2000, 5000];
  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone, limit: ADD_MONEY_LIMITS_BY_METHOD.upi },
    { id: 'card', label: 'Debit/Credit Card', icon: CreditCard, limit: ADD_MONEY_LIMITS_BY_METHOD.card },
    { id: 'netbanking', label: 'Net Banking', icon: Building, limit: ADD_MONEY_LIMITS_BY_METHOD.netbanking }
  ];
  const selectedMethodLabel = paymentMethods.find((method) => method.id === paymentMethod)?.label || 'Selected method';

  const handleSubmit = async () => {
    if (!amount || normalizedAmount <= 0 || exceedsAddLimit) return;

    setIsProcessing(true);

    try {
      await onSubmit(parseFloat(amount), paymentMethod);
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Payment failed';
      alert(message);
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon add">
              <Plus size={24} />
            </div>
            <div>
              <h3>Add Money</h3>
              <p>Add funds to your wallet</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <label>Enter Amount</label>
            <div className="amount-input">
              <span className="currency">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                max={methodLimit}
              />
            </div>
            {exceedsAddLimit && (
              <div className="error-text">
                Maximum for {selectedMethodLabel} is ₹{methodLimit.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="quick-amounts">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                className={`quick-btn ${amount == amt ? 'active' : ''}`}
                onClick={() => setAmount(amt.toString())}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="input-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`payment-option ${paymentMethod === method.id ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="payment-icon">
                    <method.icon size={20} />
                  </div>
                  <div className="payment-text">
                    <span className="payment-label">{method.label}</span>
                    <span className="payment-limit">Limit: ₹{method.limit.toLocaleString('en-IN')}</span>
                  </div>
                  {paymentMethod === method.id && <CheckCircle2 size={20} className="check" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!amount || normalizedAmount <= 0 || exceedsAddLimit || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add ₹{amount || 0}
              </>
            )}
          </button>
        </div>
      </motion.div>
      <style>{modalStyles}</style>
    </motion.div>,
    document.body
  );
}

// Complete WithdrawModal component
function WithdrawModal({ balance, onClose, onSubmit, onSuccess, initialAmount = '', requireBank = true }) {
  const [amount, setAmount] = useState(initialAmount || '');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bankAccounts = [
    { id: '1', name: 'HDFC Bank', account: '****1234', type: 'Savings' },
    { id: '2', name: 'State Bank of India', account: '****5678', type: 'Current' },
    { id: '3', name: 'ICICI Bank', account: '****9012', type: 'Savings' }
  ];

  const handleSubmit = async () => {
    if (!amount || amount <= 0 || amount > balance || (requireBank && !selectedBank)) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await onSubmit(parseFloat(amount), selectedBank);
      onSuccess?.(parseFloat(amount));
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Withdrawal failed';
      alert(message);
      console.error('Withdrawal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  return createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon withdraw">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <h3>Withdraw Money</h3>
              <p>Transfer to your bank account</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="balance-info">
            <WalletIcon size={16} />
            Available Balance: ₹{balance.toLocaleString()}
          </div>

          <div className="input-group">
            <label>Withdrawal Amount</label>
            <div className="amount-input">
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
            {amount > balance && (
              <div className="error-text">Amount exceeds available balance</div>
            )}
          </div>

          <div className="input-group">
            <label>Select Bank Account</label>
            <div className="bank-accounts">
              {bankAccounts.map((bank) => (
                <button
                  key={bank.id}
                  className={`bank-option ${selectedBank === bank.id ? 'active' : ''}`}
                  onClick={() => setSelectedBank(bank.id)}
                >
                  <div className="bank-icon">
                    <Building size={20} />
                  </div>
                  <div className="bank-info">
                    <span className="bank-name">{bank.name}</span>
                    <span className="bank-details">{bank.account} • {bank.type}</span>
                  </div>
                  {selectedBank === bank.id && <CheckCircle2 size={20} className="check" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary withdraw"
            onClick={handleSubmit}
            disabled={!amount || amount <= 0 || amount > balance || (requireBank && !selectedBank) || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner" />
                Processing...
              </>
            ) : (
              <>
                <Send size={16} />
                Pay ₹{amount || 0}
              </>
            )}
          </button>
        </div>
      </motion.div>
      <style>{modalStyles}</style>
    </motion.div>,
    document.body
  );
}

function FundTransferAnimation({ type, amount }) {
  const isCredit = type === 'credit';
  const amountText = Number.isFinite(amount) ? amount.toLocaleString('en-IN') : '0';
  const title = isCredit ? 'Money Added Successfully' : 'Withdrawal Successful';
  const subtitle = isCredit ? 'Amount credited to wallet' : 'Amount sent to bank';
  const fromLabel = isCredit ? 'Bank' : 'Wallet';
  const toLabel = isCredit ? 'Wallet' : 'Bank';
  const dotStart = isCredit ? '-46%' : '46%';
  const dotEnd = isCredit ? '46%' : '-46%';
  const ArrowIcon = isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <motion.div
      className="fund-transfer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="fund-transfer-scene"
        initial={{ y: 14, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 12, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 210 }}
      >
        <div className="transfer-header">
          <span className={`transfer-pill ${isCredit ? 'credit' : 'debit'}`}>{title}</span>
          <span className="transfer-amount">INR {amountText}</span>
        </div>
        <p className="transfer-subtitle">{subtitle}</p>

        <div className="transfer-simple">
          <div className="transfer-node">
            <Building size={18} />
            <span>{fromLabel}</span>
          </div>
          <div className="transfer-rail">
            <motion.div
              className={`transfer-dot ${isCredit ? 'credit' : 'debit'}`}
              initial={{ x: dotStart, opacity: 0.7 }}
              animate={{ x: dotEnd, opacity: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </div>
          <div className="transfer-node">
            <WalletIcon size={18} />
            <span>{toLabel}</span>
          </div>
        </div>
        <motion.div
          className={`transfer-icon-wrap ${isCredit ? 'credit' : 'debit'}`}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <ArrowIcon size={20} />
          <span>{isCredit ? 'Credit' : 'Debit'}</span>
        </motion.div>
        <motion.div
          className="transfer-done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <CheckCircle2 size={16} />
          <span>Completed</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


const styles = `
  .wallet-page {
    min-height: 100vh;
    padding: 100px 20px 60px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
  }

  .wallet-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }

  .wallet-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 60vh;
    color: #F1F5FF;
  }

  .loading-spinner {
    color: #2DBE60;
  }

  /* Header */
  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    grid-column: 1 / -1;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(45, 190, 96, 0.15);
    border: 1px solid rgba(45, 190, 96, 0.3);
    border-radius: 20px;
    color: #2DBE60;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .wallet-header h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #F1F5FF;
    margin-bottom: 6px;
  }

  .wallet-header p {
    color: #B8C7E3;
    font-size: 0.9375rem;
  }

  .header-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 20px rgba(45, 190, 96, 0.3);
  }

  /* Balance Card */
  .balance-card {
    position: relative;
    background: linear-gradient(135deg, #1A3563 0%, #0F2847 100%);
    padding: 32px 28px;
    border-radius: 20px;
    color: white;
    margin-bottom: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .balance-bg-pattern {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(45, 190, 96, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  .balance-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .toggle-balance {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .balance-amount {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .balance-actions {
    display: flex;
    gap: 12px;
    position: relative;
    z-index: 1;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn.add {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .action-btn.add:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .action-btn.withdraw {
    background: white;
    color: #0B1E3C;
  }

  .action-btn.withdraw:hover {
    background: #F1F5FF;
  }

  /* Stats Grid */
  .stats-grid {
    display: none;
  }

  .stat-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
  }

  .stat-card.credit {
    border-left: 3px solid #2DBE60;
  }

  .stat-card.debit {
    border-left: 3px solid #EF4444;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-card.credit .stat-icon {
    background: rgba(45, 190, 96, 0.15);
    color: #2DBE60;
  }

  .stat-card.debit .stat-icon {
    background: rgba(239, 68, 68, 0.15);
    color: #EF4444;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    display: block;
    font-size: 0.8125rem;
    color: #B8C7E3;
    margin-bottom: 6px;
  }

  .stat-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #F1F5FF;
    margin-bottom: 6px;
  }

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .stat-trend.positive {
    background: rgba(45, 190, 96, 0.15);
    color: #2DBE60;
  }

  .stat-trend.negative {
    background: rgba(239, 68, 68, 0.15);
    color: #EF4444;
  }

  /* Transactions */
  .transactions-section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    overflow: hidden;
    grid-column: 2;
    grid-row: 2 / span 2;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-icon {
    width: 40px;
    height: 40px;
    background: rgba(45, 190, 96, 0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
  }

  .section-title h3 {
    font-size: 1.0625rem;
    font-weight: 700;
    color: #F1F5FF;
    margin-bottom: 2px;
  }

  .section-title p {
    font-size: 0.8125rem;
    color: #B8C7E3;
  }

  .view-all {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #2DBE60;
    background: rgba(45, 190, 96, 0.1);
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
  }

  .transactions-list {
    padding: 14px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-transactions {
    text-align: center;
    padding: 48px 24px;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    background: rgba(45, 190, 96, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2DBE60;
    margin: 0 auto 16px;
  }

  .no-transactions h4 {
    font-size: 1.0625rem;
    font-weight: 700;
    color: #F1F5FF;
    margin-bottom: 8px;
  }

  .no-transactions p {
    color: #B8C7E3;
    margin-bottom: 20px;
  }

  .start-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .transaction-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 14px;
    border-radius: 12px;
    margin-bottom: 0;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    overflow: hidden;
  }

  .transaction-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(45, 190, 96, 0.35);
    transform: translateY(-1px);
  }

  .transaction-item::after {
    content: attr(data-details);
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(11, 30, 60, 0.95);
    border: 1px solid rgba(45, 190, 96, 0.35);
    color: #B8C7E3;
    font-size: 0.74rem;
    white-space: normal;
    line-height: 1.35;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
  }

  .transaction-item:hover::after {
    opacity: 1;
    transform: translateY(0);
  }

  .transaction-item:hover .txn-details,
  .transaction-item:hover .txn-amount,
  .transaction-item:hover .txn-icon {
    opacity: 0.25;
  }

  .txn-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .txn-icon.credit {
    background: rgba(45, 190, 96, 0.15);
    color: #2DBE60;
  }

  .txn-icon.debit {
    background: rgba(239, 68, 68, 0.15);
    color: #EF4444;
  }

  .txn-details {
    flex: 1;
  }

  .txn-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .txn-description {
    font-weight: 600;
    color: #F1F5FF;
    font-size: 0.9375rem;
  }

  .status-icon {
    color: #2DBE60;
  }

  .txn-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8125rem;
    color: #B8C7E3;
  }

  .txn-amount {
    font-weight: 700;
    font-size: 0.9375rem;
  }

  .txn-amount.credit {
    color: #2DBE60;
  }

  .txn-amount.debit {
    color: #EF4444;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .page-info {
    font-size: 0.8125rem;
    color: #B8C7E3;
  }

  .page-actions {
    display: flex;
    gap: 8px;
  }

  .page-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #F1F5FF;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .fund-transfer-overlay {
    position: fixed;
    inset: 0;
    z-index: 950;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(7, 16, 34, 0.5);
    backdrop-filter: blur(4px);
  }

  .fund-transfer-scene {
    width: min(760px, calc(100vw - 24px));
    background: linear-gradient(150deg, #44bf5a 0%, #30ad4e 100%);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    padding: 18px 18px 28px;
    box-shadow: 0 24px 46px rgba(7, 16, 34, 0.35);
  }

  .transfer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .transfer-pill {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .transfer-pill.credit {
    background: rgba(15, 35, 68, 0.24);
    color: #e7f3ff;
  }

  .transfer-pill.debit {
    background: rgba(11, 30, 60, 0.32);
    color: #f0f7ff;
  }

  .transfer-amount {
    color: #f2fbff;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .transfer-subtitle {
    margin: 8px 0 14px;
    color: rgba(235, 249, 255, 0.9);
    font-size: 0.84rem;
  }

  .transfer-simple {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    border-radius: 12px;
    background: rgba(11, 30, 60, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px;
  }

  .transfer-node {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #f2fbff;
    font-size: 0.82rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .transfer-rail {
    position: relative;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.32);
    overflow: hidden;
  }

  .transfer-dot {
    position: absolute;
    top: -3px;
    left: 50%;
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }

  .transfer-dot.credit {
    background: #9ff2b9;
    box-shadow: 0 0 0 4px rgba(159, 242, 185, 0.25);
  }

  .transfer-dot.debit {
    background: #bfdbfe;
    box-shadow: 0 0 0 4px rgba(191, 219, 254, 0.25);
  }

  .transfer-icon-wrap {
    margin-top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .transfer-icon-wrap.credit {
    background: rgba(45, 190, 96, 0.22);
    color: #f2fffa;
  }

  .transfer-icon-wrap.debit {
    background: rgba(59, 130, 246, 0.24);
    color: #f0f7ff;
  }

  .transfer-done {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #e6fff1;
    font-size: 0.78rem;
    font-weight: 600;
  }

  [data-theme="light"] .fund-transfer-overlay {
    background: rgba(16, 33, 63, 0.2);
  }

  [data-theme="light"] .fund-transfer-scene {
    box-shadow: 0 22px 44px rgba(16, 33, 63, 0.22);
  }

  [data-theme="light"] .wallet-page {
    background: linear-gradient(180deg, #f6f9ff 0%, #eef3fb 100%);
  }

  [data-theme="light"] .wallet-loading {
    color: #10213f;
  }

  [data-theme="light"] .header-badge {
    background: #eaf8ef;
    border-color: #bde8cb;
    color: #0f8a43;
  }

  [data-theme="light"] .header-icon {
    box-shadow: 0 10px 24px rgba(16, 33, 63, 0.12);
  }

  [data-theme="light"] .wallet-header h1,
  [data-theme="light"] .section-title h3,
  [data-theme="light"] .txn-description,
  [data-theme="light"] .no-transactions h4 {
    color: #10213f;
  }

  [data-theme="light"] .wallet-header p,
  [data-theme="light"] .section-title p,
  [data-theme="light"] .txn-meta,
  [data-theme="light"] .page-info,
  [data-theme="light"] .no-transactions p {
    color: #4d5f7d;
  }

  [data-theme="light"] .balance-card {
    background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
    border: 1px solid #d8e2f0;
    box-shadow: 0 14px 30px rgba(16, 33, 63, 0.08);
    color: #10213f;
  }

  [data-theme="light"] .balance-label {
    color: #4d5f7d;
  }

  [data-theme="light"] .balance-bg-pattern {
    background: radial-gradient(circle, rgba(45, 190, 96, 0.16) 0%, transparent 70%);
  }

  [data-theme="light"] .balance-amount {
    color: #10213f;
  }

  [data-theme="light"] .toggle-balance {
    background: #f4f8ff;
    border-color: #c9d7ea;
    color: #10213f;
  }

  [data-theme="light"] .action-btn.add {
    background: #eaf8ef;
    color: #0f5132;
    border: 1px solid #bde8cb;
  }

  [data-theme="light"] .action-btn.add:hover {
    background: #dcf4e6;
  }

  [data-theme="light"] .action-btn.withdraw {
    background: #ffffff;
    color: #10213f;
    border: 1px solid #c9d7ea;
  }

  [data-theme="light"] .action-btn.withdraw:hover {
    background: #f3f7fe;
  }

  [data-theme="light"] .transactions-section {
    background: #ffffff;
    border-color: #d8e2f0;
    box-shadow: 0 12px 24px rgba(16, 33, 63, 0.06);
  }

  [data-theme="light"] .section-header,
  [data-theme="light"] .pagination {
    border-color: #e2e9f3;
  }

  [data-theme="light"] .view-all {
    background: #eaf8ef;
    color: #0f5132;
  }

  [data-theme="light"] .title-icon,
  [data-theme="light"] .empty-icon {
    background: #eaf8ef;
    color: #0f8a43;
  }

  [data-theme="light"] .transaction-item {
    background: #f8fbff;
    border-color: #e2e9f3;
  }

  [data-theme="light"] .transaction-item:hover {
    background: #f1f6fd;
    border-color: #bde8cb;
  }

  [data-theme="light"] .transaction-item::after {
    background: rgba(255, 255, 255, 0.98);
    border-color: #c9d7ea;
    color: #4d5f7d;
  }

  [data-theme="light"] .page-btn {
    background: #f4f8ff;
    border-color: #c9d7ea;
    color: #10213f;
  }

  [data-theme="light"] .txn-amount.credit {
    color: #0f8a43;
  }

  [data-theme="light"] .txn-amount.debit {
    color: #c53030;
  }

  @media (max-width: 768px) {
    .wallet-page {
      padding: 90px 16px 40px;
    }

    .wallet-container {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .wallet-header {
      grid-column: 1;
      margin-bottom: 12px;
    }

    .transactions-section {
      grid-column: 1;
      grid-row: auto;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .balance-amount {
      font-size: 2rem;
    }

    .fund-transfer-scene {
      padding: 16px 14px 20px;
    }

    .transfer-simple {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 12px;
    }

    .transfer-node {
      justify-content: center;
    }

    .transfer-rail {
      width: 100%;
    }
  }
`;

const modalStyles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal-content {
    position: relative;
    background: #0F2847;
    border-radius: 20px;
    width: 90%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1001;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .modal-content::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .modal-title-wrapper {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .modal-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .modal-icon.add {
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
  }

  .modal-icon.withdraw {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  }

  .modal-title-wrapper h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #F1F5FF;
    margin-bottom: 2px;
  }

  .modal-title-wrapper p {
    font-size: 0.875rem;
    color: #B8C7E3;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #F1F5FF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-body {
    padding: 24px;
  }

  .input-group {
    margin-bottom: 24px;
  }

  .input-group label {
    display: block;
    font-weight: 600;
    color: #F1F5FF;
    margin-bottom: 10px;
    font-size: 0.9375rem;
  }

  .amount-input {
    position: relative;
  }

  .currency {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    font-size: 1.125rem;
    color: #B8C7E3;
  }

  .amount-input input {
    width: 100%;
    padding: 14px 16px 14px 40px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    color: #F1F5FF;
    font-size: 1.25rem;
    font-weight: 700;
    outline: none;
  }

  .amount-input input:focus {
    border-color: #2DBE60;
    background: rgba(255, 255, 255, 0.08);
  }

  .quick-amounts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  }

  .quick-btn {
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #B8C7E3;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .quick-btn.active,
  .quick-btn:hover {
    border-color: #2DBE60;
    background: rgba(45, 190, 96, 0.15);
    color: #2DBE60;
  }

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .payment-option.active {
    border-color: #2DBE60;
    background: rgba(45, 190, 96, 0.1);
  }

  .payment-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F1F5FF;
  }

  .payment-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .payment-label {
    font-weight: 600;
    color: #F1F5FF;
    font-size: 0.9375rem;
  }

  .payment-limit {
    font-size: 0.8125rem;
    color: #B8C7E3;
  }

  .payment-option .check {
    color: #2DBE60;
  }

  .balance-info {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(45, 190, 96, 0.15);
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-weight: 600;
    color: #2DBE60;
    font-size: 0.9375rem;
  }

  .error-text {
    color: #EF4444;
    font-size: 0.8125rem;
    margin-top: 6px;
  }

  .bank-accounts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bank-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .bank-option.active {
    border-color: #3B82F6;
    background: rgba(59, 130, 246, 0.1);
  }

  .bank-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F1F5FF;
  }

  .bank-info {
    flex: 1;
  }

  .bank-name {
    display: block;
    font-weight: 600;
    color: #F1F5FF;
    font-size: 0.9375rem;
    margin-bottom: 2px;
  }

  .bank-details {
    font-size: 0.8125rem;
    color: #B8C7E3;
  }

  .bank-option .check {
    color: #3B82F6;
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-secondary,
  .btn-primary {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #F1F5FF;
  }

  .btn-primary {
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: white;
  }

  .btn-primary.withdraw {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  }

  .btn-primary:disabled {
    opacity: 0.6;
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

  @media (max-width: 480px) {
    .quick-amounts {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  [data-theme="light"] .modal-overlay {
    background: rgba(16, 33, 63, 0.28);
  }

  [data-theme="light"] .modal-content {
    background: #ffffff;
    border: 1px solid #d8e2f0;
    box-shadow: 0 24px 60px rgba(16, 33, 63, 0.16);
  }

  [data-theme="light"] .modal-header {
    border-bottom-color: #e2e9f3;
  }

  [data-theme="light"] .modal-title-wrapper h3,
  [data-theme="light"] .payment-label,
  [data-theme="light"] .bank-name {
    color: #10213f;
  }

  [data-theme="light"] .modal-title-wrapper p,
  [data-theme="light"] .currency,
  [data-theme="light"] .bank-details,
  [data-theme="light"] .quick-btn,
  [data-theme="light"] .payment-limit {
    color: #4d5f7d;
  }

  [data-theme="light"] .input-group label {
    color: #10213f;
  }

  [data-theme="light"] .modal-close,
  [data-theme="light"] .payment-icon,
  [data-theme="light"] .bank-icon {
    background: #f4f8ff;
    border-color: #c9d7ea;
    color: #10213f;
  }

  [data-theme="light"] .amount-input input,
  [data-theme="light"] .payment-option,
  [data-theme="light"] .bank-option {
    background: #f8fbff;
    border-color: #d8e2f0;
    color: #10213f;
  }

  [data-theme="light"] .amount-input input::placeholder {
    color: #7c8da8;
  }

  [data-theme="light"] .quick-btn {
    background: #f4f8ff;
    border: 1px solid #c9d7ea;
  }

  [data-theme="light"] .quick-btn:hover,
  [data-theme="light"] .quick-btn.active {
    background: #eaf8ef;
    border-color: #bde8cb;
    color: #0f8a43;
  }

  [data-theme="light"] .btn-secondary {
    background: #f4f8ff;
    border: 1px solid #c9d7ea;
    color: #10213f;
  }

  [data-theme="light"] .modal-footer {
    border-top-color: #e2e9f3;
  }

  [data-theme="light"] .error-text {
    color: #b91c1c;
  }
`;

  const settleOtsFn = repaymentApi.settleOts || repaymentApi.default?.settleOts;
  const payEmiFn = repaymentApi.payEmi || repaymentApi.default?.payEmi;

