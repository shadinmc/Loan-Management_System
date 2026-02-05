// src/components/Button.jsx
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="btn-spinner" size={18} />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} />}

      <style>{buttonStyles}</style>
    </button>
  );
}

const buttonStyles = `
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .btn-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Sizes */
  .btn-small {
    padding: 8px 16px;
    font-size: 0.875rem;
    min-height: 36px;
  }

  .btn-medium {
    padding: 12px 24px;
    font-size: 1rem;
    min-height: 44px;
  }

  .btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
    min-height: 52px;
  }

  /* Variants */
  .btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-tertiary);
    border-color: var(--accent-primary);
  }

  .btn-outline {
    background: transparent;
    color: var(--accent-primary);
    border: 2px solid var(--accent-primary);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--accent-primary);
    color: white;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-primary);
    border: 2px solid transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--bg-secondary);
  }

  .btn-success {
    background: var(--accent-success);
    color: white;
  }

  .btn-danger {
    background: var(--accent-danger);
    color: white;
  }

  .btn-full-width {
    width: 100%;
  }
`;
