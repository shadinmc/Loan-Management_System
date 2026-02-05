// src/components/Input.jsx
import { useState } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
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
          <label className="input-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        )}
        <div className="select-wrapper">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`input-field select-field ${error ? 'error' : ''}`}
            disabled={disabled}
            required={required}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="select-icon" size={20} />
        </div>
        {error && <span className="error-text">{error}</span>}

        <style>{inputStyles}</style>
      </div>
    );
  }

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-container">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`input-field ${error ? 'error' : ''} ${isFocused ? 'focused' : ''}`}
          disabled={disabled}
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="error-text">{error}</span>}

      <style>{inputStyles}</style>
    </div>
  );
}

const inputStyles = `
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .required {
    color: var(--accent-danger);
    margin-left: 2px;
  }

  .input-container {
    position: relative;
  }

  .input-field {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    font-size: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
    outline: none;
  }

  .input-field:focus,
  .input-field.focused {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .input-field.error {
    border-color: var(--accent-danger);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .input-field:disabled {
    background: var(--bg-tertiary);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .select-wrapper {
    position: relative;
  }

  .select-field {
    appearance: none;
    padding-right: 40px;
    cursor: pointer;
  }

  .select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .password-toggle:hover {
    color: var(--text-primary);
  }

  .error-text {
    font-size: 0.85rem;
    color: var(--accent-danger);
    margin-top: 4px;
  }
`;
