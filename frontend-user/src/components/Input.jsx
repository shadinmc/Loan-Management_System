// src/components/Input.jsx
import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Premium Input Component
 * Clean fintech design with solid colors
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [],
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(e);
  };

  if (type === 'select') {
    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label htmlFor={name} className="input-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        <div className="select-wrapper">
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            className={`input-field select-field ${error ? 'error' : ''}`}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={18} />
        </div>
        {error && (
          <span id={`${name}-error`} className="error-text" role="alert">
            <AlertCircle size={14} />
            {error}
          </span>
        )}
        {helperText && !error && <span className="helper-text">{helperText}</span>}

        <style>{inputStyles}</style>
      </div>
    );
  }

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`input-container ${isFocused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <input
          id={name}
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="input-field"
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${name}-error`} className="error-text" role="alert">
          <AlertCircle size={14} />
          {error}
        </span>
      )}
      {helperText && !error && <span className="helper-text">{helperText}</span>}

      <style>{inputStyles}</style>
    </div>
  );
}

const inputStyles = `
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .required {
    color: #EF4444;
    margin-left: 2px;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  .input-container.focused {
    border-color: #2DBE60;
    box-shadow: 0 0 0 3px rgba(45, 190, 96, 0.1);
  }

  .input-container.has-error {
    border-color: #EF4444;
  }

  .input-container.has-error.focused {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .input-field {
    width: 100%;
    padding: 12px 14px;
    border: none;
    border-radius: 10px;
    font-size: 0.9375rem;
    background: transparent;
    color: var(--text-primary);
    outline: none;
  }

  .input-field::placeholder {
    color: var(--text-muted);
  }

  .input-field:disabled {
    background: var(--bg-tertiary);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .select-wrapper {
    position: relative;
  }

  .select-wrapper .input-field {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    appearance: none;
    padding-right: 40px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .select-wrapper .input-field:focus {
    border-color: #2DBE60;
    box-shadow: 0 0 0 3px rgba(45, 190, 96, 0.1);
  }

  .select-wrapper .input-field.error {
    border-color: #EF4444;
  }

  .select-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;
  }

  .password-toggle:hover {
    color: var(--text-primary);
  }

  .error-text {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8125rem;
    color: #EF4444;
  }

  .helper-text {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }
`;
