// src/pages/loans/LoanDecision.jsx
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle, XCircle, FileText,
  Phone, Mail, ChevronDown, ChevronUp, Filter, Search, AlertCircle, Banknote
} from 'lucide-react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { APPLICATION_STATUS, LOAN_CONFIG } from '../../utils/constants';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getMyLoans, getLoanById } from '../../api/loanApi';

export default function LoanDecision() {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const loansQuery = useQuery({
    queryKey: ['loans', 'my-loans'],
    queryFn: getMyLoans,
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });

  const statusOptions = [
    { value: 'all', label: 'All Applications', icon: FileText, color: '#6B7280' },
    { value: APPLICATION_STATUS.SUBMITTED, label: 'Submitted', icon: FileText, color: '#3B82F6' },
    { value: APPLICATION_STATUS.UNDER_REVIEW, label: 'Under Review', icon: Clock, color: '#F59E0B' },
    { value: APPLICATION_STATUS.BRANCH_APPROVED, label: 'Branch Approved', icon: CheckCircle, color: '#10B981' },
    { value: APPLICATION_STATUS.APPROVED, label: 'Approved', icon: CheckCircle, color: '#2DBE60' },
    { value: APPLICATION_STATUS.REJECTED, label: 'Rejected', icon: XCircle, color: '#EF4444' },
    { value: APPLICATION_STATUS.DISBURSED, label: 'Disbursed', icon: Banknote, color: '#8B5CF6' }
  ];

  const normalizeLoanType = (loanType) => {
    const raw = String(loanType || '').toUpperCase();
    if (LOAN_CONFIG[raw]) return raw;
    if (raw.includes('PERSONAL')) return 'PERSONAL';
    if (raw.includes('EDUCATION')) return 'EDUCATION';
    if (raw.includes('BUSINESS')) return 'BUSINESS';
    if (raw.includes('VEHICLE')) return 'VEHICLE';
    return raw;
  };

  const mapBackendStatus = (status) => {
    const normalized = String(status || '').toUpperCase();
    const map = {
      SUBMITTED: APPLICATION_STATUS.SUBMITTED,
      UNDER_REVIEW: APPLICATION_STATUS.UNDER_REVIEW,
      APPLIED: APPLICATION_STATUS.SUBMITTED,
      ELIGIBILITY_CHECK_PASSED: APPLICATION_STATUS.UNDER_REVIEW,
      ELIGIBLE: APPLICATION_STATUS.UNDER_REVIEW,
      UNDER_BRANCH_REVIEW: APPLICATION_STATUS.UNDER_REVIEW,
      UNDER_REGIONAL_REVIEW: APPLICATION_STATUS.UNDER_REVIEW,
      PENDING_REGIONAL_REVIEW: APPLICATION_STATUS.UNDER_REVIEW,
      BRANCH_APPROVED: APPLICATION_STATUS.BRANCH_APPROVED,
      REGIONAL_APPROVED: APPLICATION_STATUS.APPROVED,
      APPROVED: APPLICATION_STATUS.APPROVED,
      DISBURSED: APPLICATION_STATUS.DISBURSED,
      REJECTED: APPLICATION_STATUS.REJECTED,
      BRANCH_REJECTED: APPLICATION_STATUS.REJECTED,
      REGIONAL_REJECTED: APPLICATION_STATUS.REJECTED,
      DISBURSEMENT_PENDING: APPLICATION_STATUS.APPROVED,
      CLARIFICATION_REQUIRED: APPLICATION_STATUS.UNDER_REVIEW,
      NOT_ELIGIBLE: APPLICATION_STATUS.REJECTED,
      CLOSED: APPLICATION_STATUS.DISBURSED,
      ACTIVE: APPLICATION_STATUS.DISBURSED
    };
    return map[normalized] || APPLICATION_STATUS.SUBMITTED;
  };

  const getStage = (backendStatus) => {
    const stageMap = {
      APPLIED: 1,
      ELIGIBILITY_CHECK_PASSED: 2,
      ELIGIBLE: 2,
      UNDER_BRANCH_REVIEW: 2,
      NOT_ELIGIBLE: 2,
      CLARIFICATION_REQUIRED: 2,
      BRANCH_APPROVED: 3,
      BRANCH_REJECTED: 3,
      PENDING_REGIONAL_REVIEW: 4,
      UNDER_REGIONAL_REVIEW: 4,
      REGIONAL_APPROVED: 5,
      REGIONAL_REJECTED: 5,
      APPROVED: 5,
      DISBURSEMENT_PENDING: 5,
      DISBURSED: 6,
      CLOSED: 6
    };
    return stageMap[backendStatus] || 1;
  };

  const buildTimeline = (backendStatus, appliedDate, updatedAt) => {
    const submittedDate = appliedDate ? new Date(appliedDate).toLocaleDateString() : 'Submitted';
    const updated = updatedAt ? new Date(updatedAt).toLocaleDateString() : 'In Progress';
    const stage = getStage(backendStatus);

    const items = [
      { status: 'Application Submitted', date: submittedDate, completed: true, current: stage === 1 },
      { status: 'Eligibility Check', date: updated, completed: stage >= 2, current: stage === 2 },
      {
        status: backendStatus === 'BRANCH_REJECTED' ? 'Branch Rejected' : 'Branch Manager Approved',
        date: updated,
        completed: stage >= 3 && backendStatus !== 'BRANCH_REJECTED',
        current: stage === 3
      },
      {
        status: backendStatus === 'REGIONAL_REJECTED' ? 'Regional Rejected' : 'Regional Review',
        date: updated,
        completed: stage >= 4 && backendStatus !== 'REGIONAL_REJECTED',
        current: stage === 4
      },
      { status: 'Final Approval', date: updated, completed: stage >= 5, current: stage === 5 },
      { status: 'Disbursed', date: updated, completed: stage >= 6, current: stage === 6 }
    ];

    return items.map((item) => ({
      ...item,
      date: item.completed || item.current ? item.date : ''
    }));
  };

  const baseLoans = loansQuery.data || [];
  const loanDetailQueries = useQueries({
    queries: baseLoans.map((loan) => {
      const loanId = loan?.loanId || loan?.id;
      return {
        queryKey: ['loan', 'detail', loanId],
        queryFn: () => getLoanById(loanId),
        enabled: Boolean(loanId),
        retry: false,
        staleTime: 60 * 1000,
      };
    }),
  });

  const loanDetailsById = useMemo(() => {
    const map = new Map();
    baseLoans.forEach((loan, idx) => {
      const loanId = loan?.loanId || loan?.id;
      const detail = loanDetailQueries[idx]?.data;
      if (loanId && detail) {
        map.set(loanId, detail);
      }
    });
    return map;
  }, [baseLoans, loanDetailQueries]);

  const applications = useMemo(() => {
    const items = baseLoans;
    return items.map((loan) => {
      const loanId = loan.loanId || loan.id;
      const detail = loanDetailsById.get(loanId) || {};
      const loanTypeKey = normalizeLoanType(detail.loanType || loan.loanType || '');
      const config = LOAN_CONFIG[loanTypeKey] || {};
      const backendStatus = String(detail.status || loan.status || loan.loanStatus || 'APPLIED').toUpperCase();
      const uiStatus = mapBackendStatus(backendStatus);
      const tenure = detail.tenureMonths ?? loan.tenureMonths ?? loan.tenure ?? null;
      const interestRate = detail.interestRate ?? loan.interestRate ?? config.interestRate ?? null;
      const emi = detail.emiAmount ?? loan.emiAmount ?? null;
      const rawEmiEligible = detail.emiEligible ?? loan.emiEligible;
      const eligibility = typeof rawEmiEligible === 'boolean'
        ? rawEmiEligible
        : backendStatus === 'NOT_ELIGIBLE'
          ? false
          : ['ELIGIBILITY_CHECK_PASSED', 'ELIGIBLE', 'UNDER_BRANCH_REVIEW', 'BRANCH_APPROVED', 'PENDING_REGIONAL_REVIEW', 'UNDER_REGIONAL_REVIEW', 'REGIONAL_APPROVED', 'APPROVED', 'DISBURSEMENT_PENDING', 'DISBURSED', 'ACTIVE', 'CLOSED'].includes(backendStatus)
            ? true
            : null;

      return {
        id: loanId,
        loanType: config.name || String(loanTypeKey || loan.loanType || 'Loan').replaceAll('_', ' '),
        amount: Number(loan.loanAmount || 0),
        tenure,
        interestRate: interestRate != null ? Number(interestRate) : null,
        emi: emi != null ? Number(emi) : null,
        emiEligible: eligibility,
        status: uiStatus,
        backendStatus,
        decisionMessage: loan.decisionMessage || "",
        appliedDate: loan.appliedDate || loan.createdAt || null,
        timeline: buildTimeline(backendStatus, loan.appliedDate || loan.createdAt, loan.updatedAt)
      };
    });
  }, [baseLoans, loanDetailsById]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      [APPLICATION_STATUS.SUBMITTED]: { icon: FileText, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Submitted' },
      [APPLICATION_STATUS.UNDER_REVIEW]: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', label: 'Under Review' },
      [APPLICATION_STATUS.BRANCH_APPROVED]: { icon: CheckCircle, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Branch Approved' },
      [APPLICATION_STATUS.APPROVED]: { icon: CheckCircle, color: '#2DBE60', bg: 'rgba(45, 190, 96, 0.1)', label: 'Approved' },
      [APPLICATION_STATUS.REJECTED]: { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Rejected' },
      [APPLICATION_STATUS.DISBURSED]: { icon: Banknote, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Disbursed' }
    };
    return configs[status] || configs[APPLICATION_STATUS.SUBMITTED];
  };

  const getSelectedOption = () => {
    return statusOptions.find(opt => opt.value === filterStatus) || statusOptions[0];
  };

  const filteredApplications = applications.filter(app => {
    const appId = String(app.id || '').toLowerCase();
    const loanType = String(app.loanType || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = appId.includes(term) || loanType.includes(term);
    const matchesFilter = filterStatus === 'all' ? true : app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loansQuery.isLoading) {
    return (
      <div className="status-page loading-state">
        <motion.div
          className="loading-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSpinner size="large" />
          <p>Loading your applications...</p>
        </motion.div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="page-background">
        <div className="bg-gradient" />
        <div className="bg-pattern" />
      </div>

      <div className="status-container">
        <motion.header
          className="status-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <h1>My Applications</h1>
            <p>Track and manage all your loan applications in one place</p>
          </div>

          <div className="header-controls">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by ID or loan type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search applications"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  x
                </button>
              )}
            </div>

            <div className="filter-dropdown">
              <button
                className={`filter-trigger ${isFilterOpen ? 'open' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterOpen(!isFilterOpen);
                }}
                aria-expanded={isFilterOpen}
                aria-haspopup="listbox"
              >
                <Filter size={18} />
                <span className="filter-label">Status:</span>
                <span
                  className="filter-value"
                  style={{ color: getSelectedOption().color }}
                >
                  {(() => {
                    const IconComponent = getSelectedOption().icon;
                    return <IconComponent size={14} />;
                  })()}{getSelectedOption().label}
                </span>
                <ChevronDown size={16} className="filter-arrow" />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    className="filter-menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    role="listbox"
                  >
                    {statusOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          className={`filter-option ${filterStatus === option.value ? 'selected' : ''}`}
                          onClick={() => {
                            setFilterStatus(option.value);
                            setIsFilterOpen(false);
                          }}
                          role="option"
                          aria-selected={filterStatus === option.value}
                        >
                          <span
                            className="option-icon"
                            style={{ background: `${option.color}15`, color: option.color }}
                          >
                            <IconComponent size={14} />
                          </span>
                          <span className="option-label">{option.label}</span>
                          {filterStatus === option.value && (
                            <CheckCircle size={16} className="option-check" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {filteredApplications.length === 0 ? (
            <motion.div
              className="empty-state"
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="empty-icon">
                <AlertCircle size={40} />
              </div>
              <h2>No applications found</h2>
              <p>
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by applying for a loan to see your applications here'}
              </p>
              <Button variant="primary" onClick={() => navigate('/loans')}>
                Apply for a Loan
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="applications-list"
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredApplications.map((app) => {
                const statusConfig = getStatusConfig(app.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedCard === app.id;

                return (
                  <motion.div
                    key={app.id}
                    className={`application-card ${isExpanded ? 'expanded' : ''}`}
                    variants={itemVariants}
                    layout>
                    <div
                      className="card-header"
                      onClick={() => setExpandedCard(isExpanded ? null : app.id)}
                    >
                      <div className="loan-info">
                        <h3>{app.loanType}</h3>
                        <span className="application-id">#{app.id}</span>
                      </div>
                      <div className="header-right">
                        <span
                          className="status-badge"
                          style={{ background: statusConfig.bg, color: statusConfig.color }}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                        <button className="expand-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="loan-details">
                      <div className="detail-item">
                        <span className="detail-label">Loan Amount</span>
                        <span className="detail-value">INR {app.amount.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Tenure</span>
                        <span className="detail-value">{app.tenure != null ? `${app.tenure} months` : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Interest Rate</span>
                        <span className="detail-value">{app.interestRate != null ? `${app.interestRate}% p.a.` : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Eligibility</span>
                        <span className="detail-value">
                          {app.emiEligible === true ? 'Eligible' : app.emiEligible === false ? 'Not Eligible' : 'Pending'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">EMI</span>
                        <span className="detail-value emi">
                          {app.emi != null && app.emi > 0
                            ? `INR ${app.emi.toLocaleString()}/mo`
                            : app.emiEligible === false
                              ? 'Not Eligible'
                              : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="timeline-section"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4>Application Timeline</h4>
                          <div className="timeline">
                            {app.timeline.map((item, idx) => (
                              <div
                                key={idx}
                                className={`timeline-item ${item.completed ? 'completed' : ''} ${item.current ? 'current' : ''}`}
                              >
                                <div className="timeline-marker">
                                  {item.completed ? (
                                    <CheckCircle size={18} />
                                  ) : item.current ? (
                                    <Clock size={18} />
                                  ) : (
                                    <div className="marker-dot" />
                                  )}
                                </div>
                                <div className="timeline-content">
                                  <span className="timeline-status">{item.status}</span>
                                  {item.date && (
                                    <span className="timeline-date">{item.date}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {app.decisionMessage && (
                            <div className="decision-note">
                              <span className="decision-label">Decision Note</span>
                              <p className="decision-text">{app.decisionMessage}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>


      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `.status-page {
    min-height: calc(100vh - 70px);
    background: var(--bg-secondary);
    padding: 32px 0 64px;
    position: relative;
  }

  .status-page.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--text-secondary);
  }

  .page-background {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(180deg, rgba(45, 190, 96, 0.05) 0%, transparent 100%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.3;
  }

  .status-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  .status-header {
    margin-bottom: 32px;
  }

  .header-content {
    margin-bottom: 24px;
  }

  .header-content h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .header-content p {
    color: var(--text-secondary);
  }

  .header-controls {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    flex: 1;
    min-width: 200px;
    color: var(--text-muted);
    transition: all 0.2s ease;
  }

  .search-box:focus-within {
    border-color: #2DBE60;
    box-shadow: 0 0 0 3px rgba(45, 190, 96, 0.1);
  }

  .search-box input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    color: var(--text-primary);
    outline: none;
  }

  .search-box input::placeholder {
    color: var(--text-muted);
  }

  .clear-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: var(--bg-secondary);
    border: none;
    border-radius: 50%;
    color: var(--text-muted);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-search:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }

  /* Custom Dropdown Styles */
  .filter-dropdown {
    position: relative;
  }

  .filter-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 220px;
  }

  .filter-trigger:hover {
    border-color: #2DBE60;
  }

  .filter-trigger.open {
    border-color: #2DBE60;
    box-shadow: 0 0 0 3px rgba(45, 190, 96, 0.1);
  }

  .filter-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-value {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    flex: 1;
  }

  .filter-arrow {
    color: var(--text-muted);
    transition: transform 0.2s ease;
  }

  .filter-trigger.open .filter-arrow {
    transform: rotate(180deg);
    color: #2DBE60;
  }

  .filter-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    z-index: 100;
    overflow: hidden;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 14px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .filter-option:hover {
    background: var(--bg-secondary);
  }

  .filter-option.selected {
    background: rgba(45, 190, 96, 0.08);
  }

  .option-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .option-label {
    flex: 1;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .option-check {
    color: #2DBE60;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 80px 24px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    text-align: center;
  }

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--bg-secondary);
    color: var(--text-muted);
    border-radius: 50%;
  }

  .empty-state h2 {
    font-size: 1.25rem;
    color: var(--text-primary);
  }

  .empty-state p {
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .applications-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .application-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .application-card:hover {
    border-color: rgba(45, 190, 96, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .application-card.expanded {
    border-color: #2DBE60;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .card-header:hover {
    background: var(--bg-secondary);
  }

  .loan-info h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .application-id {
    font-size: 0.85rem;
    font-family: var(--font-mono, monospace);
    color: var(--text-muted);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 100px;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .expand-btn:hover {
    color: #2DBE60;
    border-color: #2DBE60;
  }

  .loan-details {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 0 24px 24px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .detail-value.emi {
    color: #2DBE60;
  }

  .timeline-section {
    padding: 24px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    overflow: hidden;
  }

  .timeline-section h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 20px;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 24px;
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    position: relative;
  }

  .timeline-item:not(:last-child) {
    padding-bottom: 20px;
  }

  .timeline-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 24px;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
  }

  .timeline-item.completed:not(:last-child)::before {
    background: #2DBE60;
  }

  .timeline-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--text-muted);
  }

  .timeline-item.completed .timeline-marker {
    color: #2DBE60;
  }

  .timeline-item.current .timeline-marker {
    color: #F59E0B;
  }

  .marker-dot {
    width: 10px;
    height: 10px;
    background: var(--border-color);
    border-radius: 50%;
  }

  .timeline-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .timeline-status {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .timeline-item.current .timeline-status {
    color: #F59E0B;
  }

  .timeline-date {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .decision-note {
    margin-top: 16px;
    padding: 14px 16px;
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.25);
    border-radius: 12px;
  }

  .decision-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #92400E;
    margin-bottom: 6px;
  }

  .decision-text {
    margin: 0;
    font-size: 0.9rem;
    color: #78350F;
    line-height: 1.5;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
  }

  .card-actions button {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .help-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 48px;
    padding: 32px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1a365d 100%);
    border-radius: 20px;
    color: white;
  }

  .help-content h3 {
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .help-content p {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .help-actions {
    display: flex;
    gap: 24px;
  }

  .help-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2DBE60;
    font-weight: 500;
    font-size: 0.9rem;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .help-link:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .loan-details {
      grid-template-columns: repeat(2, 1fr);
    }

    .header-controls {
      flex-direction: column;
    }

    .filter-trigger {
      min-width: 100%;
    }

    .help-section {
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    .help-actions {
      flex-direction: column;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .loan-details {
      grid-template-columns: 1fr;
    }

    .card-actions {
      flex-direction: column;
    }

    .header-right {
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
  }
`;
