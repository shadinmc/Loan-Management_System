// src/components/Button.jsx
import { Loader2 } from 'lucide-react';

/**
 * Premium Button Component
 * Clean fintech design with solid colors
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
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
    border-radius: 10px;
    font-family: var(--font-sans);
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .btn:disabled {
    opacity: 0.5;
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
  .btn-sm {
    padding: 10px 18px;
    font-size: 0.875rem;
    min-height: 38px;
  }

  .btn-md {
    padding: 12px 24px;
    font-size: 0.9375rem;
    min-height: 44px;
  }

  .btn-lg {
    padding: 14px 28px;
    font-size: 1rem;
    min-height: 50px;
  }

  .btn-xl {
    padding: 16px 32px;
    font-size: 1.0625rem;
    min-height: 56px;
  }

  /* Primary - Solid Green */
  .btn-primary {
    background: #2DBE60;
    color: white;
    box-shadow: 0 4px 12px rgba(45, 190, 96, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    background: #25A854;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(45, 190, 96, 0.4);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Secondary - Navy */
  .btn-secondary {
    background: #0B1E3C;
    color: white;
    box-shadow: 0 4px 12px rgba(11, 30, 60, 0.2);
  }

  .btn-secondary:hover:not(:disabled) {
    background: #102A4D;
    transform: translateY(-1px);
  }

  /* Outline */
  .btn-outline {
    background: transparent;
    color: #2DBE60;
    border: 2px solid #2DBE60;
  }

  .btn-outline:hover:not(:disabled) {
    background: #E9F8EF;
  }

  /* Ghost */
  .btn-ghost {
    background: transparent;
    color: var(--text-primary);
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--bg-secondary);
  }

  /* Soft */
  .btn-soft {
    background: #E9F8EF;
    color: #2DBE60;
  }

  .btn-soft:hover:not(:disabled) {
    background: #A7E6BF;
  }

  /* Success */
  .btn-success {
    background: #2DBE60;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background: #25A854;
  }

  /* Danger */
  .btn-danger {
    background: #EF4444;
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover:not(:disabled) {
    background: #DC2626;
  }

  /* Warning */
  .btn-warning {
    background: #F59E0B;
    color: white;
  }

  .btn-warning:hover:not(:disabled) {
    background: #D97706;
  }

  /* Full Width */
  .btn-full-width {
    width: 100%;
  }

  /* Focus visible */
  .btn:focus-visible {
    outline: 2px solid #2DBE60;
    outline-offset: 2px;
  }
`;
