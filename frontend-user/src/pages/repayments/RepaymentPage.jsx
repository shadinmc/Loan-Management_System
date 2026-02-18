import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyLoans } from '../../api/loanApi';
import * as repaymentApi from '../../api/repaymentApi';
import './RepaymentPage.css';

export default function RepaymentPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('one_time');
  const [installmentTab, setInstallmentTab] = useState('current');
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const getOtsQuoteFn =
    repaymentApi.getOtsQuote || repaymentApi.default?.getOtsQuote;
  const getRepaymentDashboardFn =
    repaymentApi.getRepaymentDashboard || repaymentApi.default?.getRepaymentDashboard;

  const loansQuery = useQuery({
    queryKey: ['repayment', 'loans'],
    queryFn: getMyLoans,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loanOptions = useMemo(() => {
    const items = loansQuery.data || [];
    const allowedStatuses = new Set(['ACTIVE', 'CLOSED']);
    return items
      .map((loan) => {
        const status = String(loan.status || loan.loanStatus || '').toUpperCase();
        return {
          id: loan.loanId || loan.id,
          label: `${loan.loanId || loan.id} · ${loan.loanType || 'Loan'}`,
          status,
        };
      })
      .filter((loan) => allowedStatuses.has(loan.status));
  }, [loansQuery.data]);

  const selectedLoan = useMemo(
    () => loanOptions.find((loan) => loan.id === selectedLoanId) || null,
    [loanOptions, selectedLoanId]
  );

  const closedStatuses = new Set(['CLOSED', 'DISBURSED']);
  const isLoanClosed = selectedLoan?.status && closedStatuses.has(selectedLoan.status);

  const otsQuoteQuery = useQuery({
    queryKey: ['repayment', 'ots-quote', selectedLoanId],
    queryFn: () => {
      if (typeof getOtsQuoteFn !== 'function') {
        throw new Error('repaymentApi.getOtsQuote is unavailable');
      }
      return getOtsQuoteFn(selectedLoanId);
    },
    enabled: mode === 'one_time' && !!selectedLoanId && !isLoanClosed,
    retry: false,
  });
  const otsErrorMessage =
    otsQuoteQuery.error?.response?.data?.message ||
    otsQuoteQuery.error?.response?.data?.error ||
    otsQuoteQuery.error?.message ||
    'Failed to fetch OTS quote.';

  const repaymentQuery = useQuery({
    queryKey: ['repayment', 'dashboard', selectedLoanId],
    queryFn: () => {
      if (typeof getRepaymentDashboardFn !== 'function') {
        throw new Error('repaymentApi.getRepaymentDashboard is unavailable');
      }
      return getRepaymentDashboardFn(selectedLoanId);
    },
    enabled: mode === 'installments' && !!selectedLoanId,
    retry: false,
  });

  const emis = repaymentQuery.data?.emis || [];
  const dueNowOrEarlierEmis = useMemo(() => {
    if (!emis.length) return [];
    const now = new Date();
    const currentMonthKey = now.getFullYear() * 12 + now.getMonth();

    return emis
      .filter((emi) => ['PENDING', 'OVERDUE'].includes(emi.status))
      .filter((emi) => {
        if (!emi?.dueDate) return false;
        const due = new Date(emi.dueDate);
        const dueMonthKey = due.getFullYear() * 12 + due.getMonth();
        return dueMonthKey <= currentMonthKey;
      })
      .sort((a, b) => {
        const aTime = a?.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b?.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });
  }, [emis]);

  const currentEmi = useMemo(() => {
    return dueNowOrEarlierEmis[0] || null;
  }, [dueNowOrEarlierEmis]);

  const currentEmiPayable = currentEmi
    ? Number(currentEmi.emiAmount || 0) + Number(currentEmi.penaltyAmount || 0)
    : 0;
  const formatInr = (value) =>
    value === null || value === undefined
      ? 'N/A'
      : `₹${Number(value).toLocaleString('en-IN')}`;

  const handlePaySettlement = () => {
    if (!otsQuoteQuery.data?.settlementAmount) return;
    const amount = Number(otsQuoteQuery.data.settlementAmount).toFixed(2);
    navigate(`/wallet?withdraw=1&amount=${encodeURIComponent(amount)}&loanId=${encodeURIComponent(selectedLoanId)}&purpose=ots`);
  };

  const handlePayCurrentEmi = () => {
    if (!currentEmi || !selectedLoanId) return;
    navigate(
      `/wallet?withdraw=1&amount=${encodeURIComponent(currentEmiPayable)}&loanId=${encodeURIComponent(selectedLoanId)}&purpose=emi`
    );
  };

  return (
    <div className="repayment-page">
      <div className="repayment-container">
        <header className="page-header">
          <div>
            <p className="eyebrow">EMI Repayment</p>
            <h1>Repay Your Loan</h1>
            <p className="subtitle">Choose one-time settlement or installment payment.</p>
          </div>
        </header>

        <section className="mode-switch">
          <button
            className={`mode-btn ${mode === 'one_time' ? 'active' : ''}`}
            onClick={() => setMode('one_time')}
          >
            <Banknote size={18} /> One-time (OTS)
          </button>
          <button
            className={`mode-btn ${mode === 'installments' ? 'active' : ''}`}
            onClick={() => setMode('installments')}
          >
            <CreditCard size={18} /> Installments
          </button>
        </section>

        <section className="repayment-card">
          <div className="input-group">
            <label>Select Loan</label>
            <select
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
            >
              <option value="">Choose a loan</option>
              {loanOptions.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.label} {loan.status ? `· ${loan.status}` : ''}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'one_time' ? (
              <motion.div
                key="ots"
                className="mode-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="panel-header">
                  <FileText size={18} /> OTS Quote
                </div>
                {otsQuoteQuery.isLoading && (
                  <div className="panel-body">Fetching quote...</div>
                )}
                {!selectedLoanId && (
                  <div className="panel-body">Select a loan to view the settlement quote.</div>
                )}
                {selectedLoanId && isLoanClosed && (
                  <div className="panel-body info">
                    {selectedLoan?.status === 'CLOSED'
                      ? 'This loan has been closed. One-time settlement is not applicable.'
                      : 'This loan has been disbursed. One-time settlement is not available.'}
                  </div>
                )}
                {otsQuoteQuery.isError && (
                  <div className="panel-body error">{otsErrorMessage}</div>
                )}
                {otsQuoteQuery.data && (
                  <div className="panel-body">
                    <div className="quote-grid">
                      <div>
                        <span>Outstanding Principal</span>
                        <strong>{formatInr(otsQuoteQuery.data.outstandingPrincipal)}</strong>
                      </div>
                      <div>
                        <span>Reduced Interest</span>
                        <strong>{formatInr(otsQuoteQuery.data.reducedInterest)}</strong>
                      </div>
                      <div>
                        <span>Remaining Months</span>
                        <strong>{otsQuoteQuery.data.remainingMonths ?? 'N/A'}</strong>
                      </div>
                    </div>

                    <div className="settlement-box">
                      <div>
                        <p>Settlement Amount</p>
                        <h2>{formatInr(otsQuoteQuery.data.settlementAmount)}</h2>
                      </div>
                      <button className="pay-btn" onClick={handlePaySettlement}>
                        Pay Settlement
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="installments"
                className="mode-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="panel-header">
                  <CreditCard size={18} /> Installments
                </div>
                <div className="panel-body">
                  <div className="installment-tabs">
                    <button
                      className={`tab-btn ${installmentTab === 'current' ? 'active' : ''}`}
                      onClick={() => setInstallmentTab('current')}
                    >
                      Current EMI
                    </button>
                    <button
                      className={`tab-btn ${installmentTab === 'all' ? 'active' : ''}`}
                      onClick={() => setInstallmentTab('all')}
                    >
                      All EMI's
                    </button>
                  </div>

                  {!selectedLoanId && (
                    <div className="info-text">Select a loan to view installment details.</div>
                  )}
                  {repaymentQuery.isLoading && (
                    <div className="info-text">Loading EMI schedule...</div>
                  )}
                  {repaymentQuery.isError && (
                    <div className="info-text error-text">Failed to load EMI schedule.</div>
                  )}

                  {installmentTab === 'current' && selectedLoanId && !repaymentQuery.isLoading && (
                    <div className="current-emi-card">
                      {currentEmi ? (
                        <>
                          <div className="current-emi-grid">
                            <div>
                              <span>EMI Number</span>
                              <strong>{currentEmi.emiNumber}</strong>
                            </div>
                            <div>
                              <span>Due Date</span>
                              <strong>{new Date(currentEmi.dueDate).toLocaleDateString()}</strong>
                            </div>
                            <div>
                              <span>EMI Amount</span>
                              <strong>₹{Number(currentEmi.emiAmount).toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                              <span>Penalty</span>
                              <strong>₹{Number(currentEmi.penaltyAmount || 0).toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                              <span>Status</span>
                              <strong>{currentEmi.status}</strong>
                            </div>
                          </div>
                          <div className="settlement-box">
                            <div>
                              <p>Payable This Month</p>
                              <h2>₹{currentEmiPayable.toLocaleString('en-IN')}</h2>
                            </div>
                            <button className="pay-btn" onClick={handlePayCurrentEmi}>
                              Pay EMI
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="info-text">No EMI due for current or previous months.</div>
                      )}
                    </div>
                  )}

                  {installmentTab === 'all' && selectedLoanId && !repaymentQuery.isLoading && (
                    <div className="emi-table">
                      <div className="emi-row header">
                        <span>#</span>
                        <span>Due Date</span>
                        <span>EMI</span>
                        <span>Paid</span>
                        <span>Penalty</span>
                        <span>Status</span>
                      </div>
                      {emis.map((emi) => (
                        <div key={`${emi.emiNumber}-${emi.dueDate}`} className="emi-row">
                          <span>{emi.emiNumber}</span>
                          <span>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : '-'}</span>
                          <span>₹{Number(emi.emiAmount || 0).toLocaleString('en-IN')}</span>
                          <span>₹{Number(emi.paidAmount || 0).toLocaleString('en-IN')}</span>
                          <span>₹{Number(emi.penaltyAmount || 0).toLocaleString('en-IN')}</span>
                          <span>{emi.status}</span>
                        </div>
                      ))}
                      {emis.length === 0 && (
                        <div className="info-text">No EMI records found.</div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

    </div>
  );
}
