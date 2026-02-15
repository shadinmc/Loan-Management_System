// src/components/EMICalculator.jsx
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  User,
  Briefcase,
  Car,
  GraduationCap,
  IndianRupee,
  Percent,
  Calendar,
  Clock,
  ArrowDown,
  Info,
  TrendingUp,
  PieChart
} from 'lucide-react';

const LOAN_TYPES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
  VEHICLE: 'vehicle',
  EDUCATION: 'education'
};

const LOAN_CONFIG = {
  [LOAN_TYPES.PERSONAL]: {
    name: 'Personal Loan',
    icon: User,
    color: '#3B82F6',
    minAmount: 50000,
    maxAmount: 2500000,
    minRate: 11,
    maxRate: 24,
    minTenure: 12,
    maxTenure: 60,
    defaultAmount: 500000,
    defaultRate: 11.5,
    defaultTenure: 36,
    hasMoratorium: false,
    hasDownPayment: false,
    description: 'No collateral required, quick approval'
  },
  [LOAN_TYPES.BUSINESS]: {
    name: 'Business Loan',
    icon: Briefcase,
    color: '#8B5CF6',
    minAmount: 100000,
    maxAmount: 10000000,
    minRate: 12,
    maxRate: 22,
    minTenure: 12,
    maxTenure: 84,
    defaultAmount: 1000000,
    defaultRate: 13,
    defaultTenure: 48,
    hasMoratorium: true,
    hasDownPayment: false,
    maxMoratorium: 6,
    description: 'Grow your business with flexible EMIs'
  },
  [LOAN_TYPES.VEHICLE]: {
    name: 'Vehicle Loan',
    icon: Car,
    color: '#F59E0B',
    minAmount: 100000,
    maxAmount: 5000000,
    minRate: 8,
    maxRate: 15,
    minTenure: 12,
    maxTenure: 84,
    defaultAmount: 800000,
    defaultRate: 9.25,
    defaultTenure: 60,
    hasMoratorium: false,
    hasDownPayment: true,
    minDownPayment: 10,
    maxDownPayment: 50,
    description: 'Low interest rates, up to 90% financing'
  },
  [LOAN_TYPES.EDUCATION]: {
    name: 'Education Loan',
    icon: GraduationCap,
    color: '#10B981',
    minAmount: 100000,
    maxAmount: 7500000,
    minRate: 8.5,
    maxRate: 14,
    minTenure: 12,
    maxTenure: 180,
    defaultAmount: 1500000,
    defaultRate: 8.5,
    defaultTenure: 120,
    hasMoratorium: true,
    hasDownPayment: false,
    maxMoratorium: 48,
    description: 'EMI starts after course completion'
  }
};

// Core EMI calculation function
const calculateEMI = (principal, annualRate, months) => {
  if (principal <= 0 || annualRate <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
};

// Loan-specific EMI calculations
const calculateLoanEMI = (type, params) => {
  const { principal, rate, tenure, moratorium = 0, downPaymentPercent = 0 } = params;

  let adjustedPrincipal = principal;
  const r = rate / 12 / 100;

  switch (type) {
    case LOAN_TYPES.VEHICLE:
      const downPayment = (principal * downPaymentPercent) / 100;
      adjustedPrincipal = principal - downPayment;
      break;

    case LOAN_TYPES.BUSINESS:
    case LOAN_TYPES.EDUCATION:
      if (moratorium > 0) {
        adjustedPrincipal = principal * Math.pow(1 + r, moratorium);
      }
      break;

    default:
      break;
  }

  const emi = calculateEMI(adjustedPrincipal, rate, tenure);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - adjustedPrincipal;

  return {
    emi,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    adjustedPrincipal: Math.round(adjustedPrincipal),
    originalPrincipal: principal,
    downPayment: type === LOAN_TYPES.VEHICLE ? Math.round((principal * downPaymentPercent) / 100) : 0
  };
};

const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatFullCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export default function EMICalculator({ isModal = false, onClose }) {
  const [activeType, setActiveType] = useState(LOAN_TYPES.PERSONAL);
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    Object.keys(LOAN_CONFIG).forEach(type => {
      const config = LOAN_CONFIG[type];
      initial[type] = {
        amount: config.defaultAmount,
        rate: config.defaultRate,
        tenure: config.defaultTenure,
        moratorium: 0,
        downPaymentPercent: type === LOAN_TYPES.VEHICLE ? 20 : 0
      };
    });
    return initial;
  });

  const config = LOAN_CONFIG[activeType];
  const currentInputs = inputs[activeType];

  const handleInputChange = useCallback((field, value) => {
    setInputs(prev => ({
      ...prev,
      [activeType]: {
        ...prev[activeType],
        [field]: value
      }
    }));
  }, [activeType]);

  const result = useMemo(() => {
    return calculateLoanEMI(activeType, {
      principal: currentInputs.amount,
      rate: currentInputs.rate,
      tenure: currentInputs.tenure,
      moratorium: currentInputs.moratorium,
      downPaymentPercent: currentInputs.downPaymentPercent
    });
  }, [activeType, currentInputs]);

  const principalPercent = Math.round((result.adjustedPrincipal / result.totalPayment) * 100) || 0;
  const interestPercent = 100 - principalPercent;

  // Calculate slider fill percentage for each input
  const getSliderPercent = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const amountPercent = getSliderPercent(currentInputs.amount, config.minAmount, config.maxAmount);
  const ratePercent = getSliderPercent(currentInputs.rate, config.minRate, config.maxRate);
  const tenurePercent = getSliderPercent(currentInputs.tenure, config.minTenure, config.maxTenure);
  const downPaymentSliderPercent = config.hasDownPayment
    ? getSliderPercent(currentInputs.downPaymentPercent, config.minDownPayment, config.maxDownPayment)
    : 0;
  const moratoriumPercent = config.hasMoratorium
    ? getSliderPercent(currentInputs.moratorium, 0, config.maxMoratorium)
    : 0;

  return (
    <div className={`emi-calculator ${isModal ? 'modal-mode' : ''}`}>
      {/* Loan Type Tabs */}
      <div className="calculator-tabs">
        {Object.entries(LOAN_CONFIG).map(([type, cfg]) => {
          const Icon = cfg.icon;
          const isActive = activeType === type;
          return (
            <motion.button
              key={type}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                '--tab-color': cfg.color,
                '--tab-bg': isActive ? `${cfg.color}15` : 'transparent'
              }}
            >
              <Icon size={18} />
              <span className="tab-label">{cfg.name.split(' ')[0]}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="calculator-body">
        {/* Left: Inputs */}
        <div className="calculator-inputs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="inputs-container"
            >
              {/* Loan Description */}
              <div className="loan-description">
                <div className="desc-icon" style={{ background: `${config.color}20`, color: config.color }}>
                  <config.icon size={20} />
                </div>
                <div className="desc-text">
                  <h4>{config.name}</h4>
                  <p>{config.description}</p>
                </div>
              </div>

              {/* Amount Slider */}
              <div className="input-group">
                <div className="input-header">
                  <label>
                    <IndianRupee size={14} />
                    {activeType === LOAN_TYPES.VEHICLE ? 'Vehicle Price' : 'Loan Amount'}
                  </label>
                  <span className="input-value">{formatFullCurrency(currentInputs.amount)}</span>
                </div>
                <div className="slider-container">
                  <div
                    className="slider-track"
                    style={{
                      '--fill-percent': `${amountPercent}%`,
                      '--slider-color': config.color
                    }}
                  />
                  <input
                    type="range"
                    min={config.minAmount}
                    max={config.maxAmount}
                    step={10000}
                    value={currentInputs.amount}
                    onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                    className="range-slider"
                    style={{ '--slider-color': config.color }}
                  />
                </div>
                <div className="range-labels">
                  <span>{formatCurrency(config.minAmount)}</span>
                  <span>{formatCurrency(config.maxAmount)}</span>
                </div>
              </div>

              {/* Down Payment for Vehicle */}
              {config.hasDownPayment && (
                <div className="input-group">
                  <div className="input-header">
                    <label>
                      <ArrowDown size={14} />
                      Down Payment
                    </label>
                    <span className="input-value">
                      {currentInputs.downPaymentPercent}% ({formatFullCurrency(Math.round((currentInputs.amount * currentInputs.downPaymentPercent) / 100))})
                    </span>
                  </div>
                  <div className="slider-container">
                    <div
                      className="slider-track"
                      style={{
                        '--fill-percent': `${downPaymentSliderPercent}%`,
                        '--slider-color': config.color
                      }}
                    />
                    <input
                      type="range"
                      min={config.minDownPayment}
                      max={config.maxDownPayment}
                      step={5}
                      value={currentInputs.downPaymentPercent}
                      onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                      className="range-slider"
                      style={{ '--slider-color': config.color }}
                    />
                  </div>
                  <div className="range-labels">
                    <span>{config.minDownPayment}%</span>
                    <span>{config.maxDownPayment}%</span>
                  </div>
                </div>
              )}

              {/* Interest Rate */}
              <div className="input-group">
                <div className="input-header">
                  <label>
                    <Percent size={14} />
                    Interest Rate (p.a.)
                  </label>
                  <span className="input-value">{currentInputs.rate}%</span>
                </div>
                <div className="slider-container">
                  <div
                    className="slider-track"
                    style={{
                      '--fill-percent': `${ratePercent}%`,
                      '--slider-color': config.color
                    }}
                  />
                  <input
                    type="range"
                    min={config.minRate}
                    max={config.maxRate}
                    step={0.25}
                    value={currentInputs.rate}
                    onChange={(e) => handleInputChange('rate', Number(e.target.value))}
                    className="range-slider"
                    style={{ '--slider-color': config.color }}
                  />
                </div>
                <div className="range-labels">
                  <span>{config.minRate}%</span>
                  <span>{config.maxRate}%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="input-group">
                <div className="input-header">
                  <label>
                    <Calendar size={14} />
                    Loan Tenure
                  </label>
                  <span className="input-value">
                    {currentInputs.tenure} months ({(currentInputs.tenure / 12).toFixed(1)} yrs)
                  </span>
                </div>
                <div className="slider-container">
                  <div
                    className="slider-track"
                    style={{
                      '--fill-percent': `${tenurePercent}%`,
                      '--slider-color': config.color
                    }}  
                  />
                  <input
                    type="range"
                    min={config.minTenure}
                    max={config.maxTenure}
                    step={6}
                    value={currentInputs.tenure}
                    onChange={(e) => handleInputChange('tenure', Number(e.target.value))}
                    className="range-slider"
                    style={{ '--slider-color': config.color }}
                  />
                </div>
                <div className="range-labels">
                  <span>{config.minTenure} mo</span>
                  <span>{config.maxTenure} mo</span>
                </div>
              </div>

              {/* Moratorium for Business/Education */}
              {config.hasMoratorium && (
                <div className="input-group">
                  <div className="input-header">
                    <label>
                      <Clock size={14} />
                      {activeType === LOAN_TYPES.EDUCATION ? 'Course Duration + Grace' : 'Moratorium Period'}
                    </label>
                    <span className="input-value">{currentInputs.moratorium} months</span>
                  </div>
                  <div className="slider-container">
                    <div
                      className="slider-track"
                      style={{
                        '--fill-percent': `${moratoriumPercent}%`,
                        '--slider-color': config.color
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={config.maxMoratorium}
                      step={3}
                      value={currentInputs.moratorium}
                      onChange={(e) => handleInputChange('moratorium', Number(e.target.value))}
                      className="range-slider"
                      style={{ '--slider-color': config.color }}
                    />
                  </div>
                  <div className="range-labels">
                    <span>0 mo</span>
                    <span>{config.maxMoratorium} mo</span>
                  </div>
                  {currentInputs.moratorium > 0 && (
                    <motion.div
                      className="moratorium-info"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Info size={14} />
                      <span>Interest accrues during this period. New principal: {formatFullCurrency(result.adjustedPrincipal)}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Results */}
        <div className="calculator-results">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeType}-${result.emi}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="results-container"
            >
              {/* EMI Display */}
              <div className="emi-display" style={{ '--accent-color': config.color }}>
                <span className="emi-label">Monthly EMI</span>
                <motion.div
                  className="emi-amount"
                  key={result.emi}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <IndianRupee size={28} />
                  <span>{result.emi.toLocaleString('en-IN')}</span>
                </motion.div>
                {config.hasMoratorium && currentInputs.moratorium > 0 && (
                  <span className="emi-note">EMI starts after {currentInputs.moratorium} months</span>
                )}
              </div>

              {/* Breakdown Chart */}
              <div className="breakdown-chart">
                <div className="chart-visual">
                  <svg viewBox="0 0 100 100" className="donut-chart">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="var(--bg-tertiary, #e5e7eb)"
                      strokeWidth="10"
                    />
                    {/* Interest portion (bottom layer) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="10"
                      strokeDasharray="264"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      opacity="0.3"
                    />
                    {/* Principal portion (animated) */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={config.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: '0 264' }}
                      animate={{
                        strokeDasharray: `${(principalPercent / 100) * 264} 264`
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="chart-center">
                    <span className="chart-percent" style={{ color: config.color }}>
                      {principalPercent}%
                    </span>
                    <span className="chart-label">Principal</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: config.color }} />
                    <span className="legend-label">Principal</span>
                    <span className="legend-value">{formatFullCurrency(result.adjustedPrincipal)}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#EF4444', opacity: 0.6 }} />
                    <span className="legend-label">Interest</span>
                    <span className="legend-value">{formatFullCurrency(result.totalInterest)}</span>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="summary-stats">
                {activeType === LOAN_TYPES.VEHICLE && (
                  <div className="stat-item">
                    <span className="stat-label">Down Payment</span>
                    <span className="stat-value">{formatFullCurrency(result.downPayment)}</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Loan Amount</span>
                  <span className="stat-value">{formatFullCurrency(result.adjustedPrincipal)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Interest</span>
                  <span className="stat-value">{formatFullCurrency(result.totalInterest)}</span>
                </div>
                <div className="stat-item highlight">
                  <span className="stat-label">Total Payment</span>
                  <span className="stat-value">{formatFullCurrency(result.totalPayment)}</span>
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                className="apply-btn"
                style={{ background: config.color }}
                whileHover={{ scale: 1.02, boxShadow: `0 8px 24px ${config.color}40` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = `/loan/apply/${activeType}`}
              >
                <TrendingUp size={18} />
                Apply for {config.name}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .emi-calculator {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .emi-calculator.modal-mode {
          max-width: 900px;
          margin: 0 auto;
        }

        .calculator-tabs {
          display: flex;
          gap: 4px;
          padding: 16px 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .calculator-tabs::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--tab-bg);
          border: 1px solid transparent;
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .tab-btn.active {
          background: var(--tab-bg);
          border-color: var(--tab-color);
          color: var(--tab-color);
          font-weight: 600;
        }

        .tab-label {
          display: block;
        }

        @media (max-width: 480px) {
          .tab-label {
            display: none;
          }
          .tab-btn {
            padding: 12px 14px;
          }
        }

        .calculator-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        @media (max-width: 768px) {
          .calculator-body {
            grid-template-columns: 1fr;
          }
        }

        .calculator-inputs {
          padding: 28px;
          border-right: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .calculator-inputs {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
        }

        .inputs-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .loan-description {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 14px;
        }

        .desc-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .desc-text h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .desc-text p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-header label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .input-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Slider Container with visible track */
        .slider-container {
          position: relative;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: var(--bg-tertiary, #e5e7eb);
        }

        .slider-track {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: var(--fill-percent, 0%);
          background: var(--slider-color, #3B82F6);
          border-radius: 4px;
          pointer-events: none;
          transition: width 0.1s ease;
        }

        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: transparent;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
          margin: 0;
        }

        .range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          background: var(--slider-color, #3B82F6);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(59, 130, 246, 0.15);
          margin-top: -7px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          border: 3px solid white;
        }

        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 6px rgba(59, 130, 246, 0.2);
        }

        .range-slider::-moz-range-track {
          width: 100%;
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: var(--slider-color, #3B82F6);
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .range-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
        }

        .range-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(59, 130, 246, 0.25);
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .moratorium-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #F59E0B;
          overflow: hidden;
        }

        .calculator-results {
          padding: 28px;
          background: var(--bg-secondary);
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .emi-display {
          text-align: center;
          padding: 28px 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
        }

        .emi-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .emi-amount {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent-color);
          letter-spacing: -0.02em;
        }

        .emi-note {
          display: block;
          margin-top: 8px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .breakdown-chart {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .chart-visual {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .donut-chart {
          width: 100%;
          height: 100%;}

        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .chart-percent {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1;
        }

        .chart-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .chart-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-label {
          flex: 1;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .legend-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .summary-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .stat-item.highlight {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #0B1E3C 0%, #1a365d 100%);
          border: none;
        }

        .stat-item.highlight .stat-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-item.highlight .stat-value {
          color: #2DBE60;
          font-size: 1.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
          .calculator-inputs,
          .calculator-results {
            padding: 20px;
          }

          .emi-amount {
            font-size: 2rem;
          }

          .breakdown-chart {
            flex-direction: column;
            text-align: center;
          }

          .chart-visual {
            width: 140px;
            height: 140px;
          }

          .chart-percent {
            font-size: 1.5rem;
          }

          .chart-label {
            font-size: 0.7rem;
          }

          .chart-legend {
            width: 100%;
          }

          .legend-item {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .chart-visual {
            width: 120px;
            height: 120px;
          }

          .summary-stats {
            grid-template-columns: 1fr;
          }

          .stat-item.highlight {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
}
