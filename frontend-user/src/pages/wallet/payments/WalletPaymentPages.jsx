import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Building, CheckCircle2, CreditCard, ShieldCheck, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  createStripePaymentIntent,
  confirmStripeWalletTopup,
} from '../../../modules/stripe-gateway/api/stripeGatewayApi';
import {
  PAYMENT_LIMITS,
  PAYMENT_METHOD_LABELS,
} from '../../../modules/stripe-gateway/constants/paymentLimits';

const METHOD_CONFIG = {
  upi: {
    title: 'UPI Payment',
    subtitle: 'Stripe Test Mode - UPI payment flow',
    icon: Smartphone,
  },
  card: {
    title: 'Debit/Credit Card Payment',
    subtitle: 'Stripe Test Mode - Card payment flow',
    icon: CreditCard,
  },
  netbanking: {
    title: 'Net Banking Payment',
    subtitle: 'Stripe Test Mode - Bank payment flow',
    icon: Building,
  },
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const TEST_DECLINE_CARD = {
  number: '4000 0000 0000 0002',
  expiry: 'Any future date',
  cvv: 'Any 3 digits',
};

const mapStripeFailureMessage = (error, paymentIntentStatus) => {
  const code = error?.code || '';
  const declineCode = error?.decline_code || '';
  const rawMessage = error?.message || '';
  const loweredMessage = rawMessage.toLowerCase();

  if (code === 'card_declined' || declineCode || loweredMessage.includes('declin')) {
    return 'Payment failed: card was declined. Please try another card or payment method.';
  }
  if (code === 'expired_card' || loweredMessage.includes('expired')) {
    return 'Payment failed: card is expired. Use a valid expiry date.';
  }
  if (code === 'incorrect_cvc' || loweredMessage.includes('cvc')) {
    return 'Payment failed: CVV is incorrect.';
  }
  if (paymentIntentStatus === 'requires_payment_method') {
    return 'Payment failed. Please re-enter payment details and try again.';
  }
  return rawMessage || 'Payment failed. Please try again.';
};
const getTheme = () => {
  if (typeof document === 'undefined') return 'dark';
  const rootTheme = document.documentElement.getAttribute('data-theme');
  const bodyTheme = document.body?.getAttribute('data-theme');
  return (rootTheme || bodyTheme || 'dark').toLowerCase() === 'light' ? 'light' : 'dark';
};

function StripeCheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePay = async () => {
    if (!stripe || !elements) return;

    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Unable to submit payment details');
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(mapStripeFailureMessage(confirmError, paymentIntent?.status));
        return;
      }

      if (!paymentIntent?.id) {
        setError('Payment could not be completed. Please try again.');
        return;
      }

      if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'canceled') {
        setError(mapStripeFailureMessage(null, paymentIntent.status));
        return;
      }

      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
        const status = await confirmStripeWalletTopup(paymentIntent.id);
        if (status?.walletCredited) {
          setSuccess('Payment successful. Wallet has been credited.');
          setTimeout(() => navigate('/wallet'), 1200);
          return;
        }
        if (status?.status && String(status.status).toLowerCase() === 'succeeded') {
          setSuccess('Payment successful. Wallet credit is being finalized.');
          setTimeout(() => navigate('/wallet'), 1600);
          return;
        }
      }

      setError('Payment is not completed yet. Please retry from Wallet or check status shortly.');
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Payment failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="stripe-element-wrap">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && <div className="state-banner error">{error}</div>}
      {success && (
        <div className="state-banner success">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      <button type="button" className="pay-button" onClick={handlePay} disabled={isSubmitting || !stripe}>
        {isSubmitting ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
    </>
  );
}

function WalletPaymentScreen({ method }) {
  const [searchParams] = useSearchParams();
  const config = METHOD_CONFIG[method];
  const Icon = config.icon;
  const maxLimit = PAYMENT_LIMITS[method];
  const navigate = useNavigate();

  const [amountInput, setAmountInput] = useState(searchParams.get('amount') || '');
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState('');
  const [intentCreated, setIntentCreated] = useState(false);
  const [resolvedMethod, setResolvedMethod] = useState(method);
  const [theme, setTheme] = useState(getTheme());

  const amount = toNumber(amountInput);
  const amountInvalid = amount <= 0 || amount > maxLimit;

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const stripeAppearance = useMemo(
    () => ({
      theme: theme === 'light' ? 'stripe' : 'night',
      labels: 'floating',
      variables: {
        colorPrimary: method === 'netbanking' ? '#2563EB' : '#2DBE60',
        colorText: theme === 'light' ? '#10213f' : '#f1f5ff',
        colorBackground: theme === 'light' ? '#ffffff' : '#0f2847',
      },
    }),
    [method, theme]
  );

  const handleCreateIntent = async () => {
    try {
      if (amountInvalid) {
        setIntentError(`Enter amount between ₹1 and ₹${maxLimit.toLocaleString('en-IN')}`);
        return;
      }
      setIntentError('');
      setLoadingIntent(true);
      const response = await createStripePaymentIntent(amount, method);
      setClientSecret(response.clientSecret);
      setResolvedMethod(response.method || method);
      setIntentCreated(true);
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Unable to initialize payment';
      setIntentError(message);
    } finally {
      setLoadingIntent(false);
    }
  };

  return (
    <div className="wallet-payment-page">
      <motion.div className={`payment-shell ${method}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="payment-top">
          <Link to="/wallet" className="back-link">
            <ArrowLeft size={16} />
            Back to Wallet
          </Link>
          <div className="secure-chip">
            <ShieldCheck size={14} />
            Stripe Test Mode
          </div>
        </div>

        <div className="payment-header">
          <div className="payment-icon">
            <Icon size={22} />
          </div>
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
        </div>

        <div className="summary-card">
          <div>
            <span>Method</span>
            <strong>{PAYMENT_METHOD_LABELS[method]}</strong>
          </div>
          <div>
            <span>Transaction Limit</span>
            <strong>₹{maxLimit.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {!intentCreated && (
          <>
            {method === 'netbanking' && (
              <div className="netbanking-panel">
                <div className="nb-title">Net Banking Checkout</div>
                <div className="nb-subtitle">You will be redirected to your bank’s secure login and then returned automatically.</div>
                <div className="nb-banks">
                  <span>HDFC</span>
                  <span>SBI</span>
                  <span>ICICI</span>
                  <span>Axis</span>
                </div>
              </div>
            )}
            <div className="field-group">
              <label>Add Amount</label>
              <input
                type="number"
                min="1"
                max={maxLimit}
                placeholder="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
            </div>
            {amount > maxLimit && (
              <div className="state-banner error">
                Amount exceeds {PAYMENT_METHOD_LABELS[method]} limit.
              </div>
            )}
            {intentError && <div className="state-banner error">{intentError}</div>}
            <button type="button" className="pay-button" onClick={handleCreateIntent} disabled={loadingIntent}>
              {loadingIntent ? 'Initializing...' : 'Continue to Stripe'}
            </button>
          </>
        )}

        {intentCreated && clientSecret && (
          <>
            {resolvedMethod !== method && (
              <div className="state-banner info">
                Requested method is unavailable on this Stripe account. Using {PAYMENT_METHOD_LABELS[resolvedMethod]} in test mode.
              </div>
            )}
            {resolvedMethod === 'card' && (
              <div className="state-banner warn">
                To test failure use card {TEST_DECLINE_CARD.number}, expiry {TEST_DECLINE_CARD.expiry}, CVV {TEST_DECLINE_CARD.cvv}.
              </div>
            )}
            <div className="state-banner info">
              Complete payment using Stripe test credentials. Amount: ₹{amount.toLocaleString('en-IN')}
            </div>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
              <StripeCheckoutForm amount={amount} />
            </Elements>
            <button type="button" className="text-back" onClick={() => navigate('/wallet')}>
              Cancel and return to Wallet
            </button>
          </>
        )}
      </motion.div>
      <style>{styles}</style>
    </div>
  );
}

export function UpiWalletPaymentPage() {
  return <WalletPaymentScreen method="upi" />;
}

export function CardWalletPaymentPage() {
  return <WalletPaymentScreen method="card" />;
}

export function NetBankingWalletPaymentPage() {
  return <WalletPaymentScreen method="netbanking" />;
}

const styles = `
  .wallet-payment-page {
    min-height: calc(100vh - 70px);
    padding: 96px 16px 40px;
    background: linear-gradient(135deg, #0B1E3C 0%, #1A3563 100%);
    display: flex;
    justify-content: center;
  }
  .payment-shell {
    width: 100%;
    max-width: 580px;
    background: rgba(15, 40, 71, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  }
  .payment-shell.netbanking .payment-icon {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  }
  .payment-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #b8c7e3;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .secure-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    color: #2DBE60;
    background: rgba(45, 190, 96, 0.14);
    border: 1px solid rgba(45, 190, 96, 0.4);
  }
  .payment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .payment-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #fff;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
  }
  .payment-header h1 {
    margin: 0;
    font-size: 1.2rem;
    color: #f1f5ff;
  }
  .payment-header p {
    margin: 4px 0 0;
    color: #b8c7e3;
    font-size: 0.875rem;
  }
  .summary-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 14px;
  }
  .summary-card > div {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 12px;
  }
  .summary-card span {
    display: block;
    font-size: 0.75rem;
    color: #b8c7e3;
    margin-bottom: 4px;
  }
  .summary-card strong {
    color: #f1f5ff;
    font-size: 0.95rem;
  }
  .field-group {
    margin-bottom: 12px;
  }
  .field-group label {
    display: block;
    color: #f1f5ff;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  .field-group input {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: #f1f5ff;
    font-size: 0.95rem;
    padding: 0 12px;
    outline: none;
  }
  .field-group input:focus {
    border-color: #2DBE60;
  }
  .payment-shell.netbanking .field-group input:focus {
    border-color: #3B82F6;
  }
  .netbanking-panel {
    margin-bottom: 12px;
    border-radius: 12px;
    padding: 12px;
    background: rgba(59, 130, 246, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.5);
  }
  .nb-title {
    color: #DBEAFE;
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
  .nb-subtitle {
    color: #BFDBFE;
    font-size: 0.8rem;
    line-height: 1.4;
    margin-bottom: 10px;
  }
  .nb-banks {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .nb-banks span {
    font-size: 0.75rem;
    color: #DBEAFE;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(30, 64, 175, 0.35);
    border: 1px solid rgba(147, 197, 253, 0.45);
  }
  .stripe-element-wrap {
    margin: 10px 0 12px;
    padding: 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .state-banner {
    border-radius: 10px;
    font-size: 0.875rem;
    padding: 10px 12px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .state-banner.error {
    color: #fecaca;
    background: rgba(185, 28, 28, 0.2);
    border: 1px solid rgba(248, 113, 113, 0.4);
  }
  .state-banner.info {
    color: #dbeafe;
    background: rgba(30, 64, 175, 0.22);
    border: 1px solid rgba(96, 165, 250, 0.4);
  }
  .state-banner.warn {
    color: #fef3c7;
    background: rgba(146, 64, 14, 0.28);
    border: 1px solid rgba(251, 191, 36, 0.45);
  }
  .state-banner.success {
    color: #bbf7d0;
    background: rgba(20, 120, 60, 0.22);
    border: 1px solid rgba(74, 222, 128, 0.4);
  }
  .pay-button {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .pay-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  .text-back {
    margin-top: 8px;
    background: transparent;
    border: none;
    color: #b8c7e3;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.85rem;
  }
  [data-theme="light"] .wallet-payment-page {
    background: linear-gradient(180deg, #f6f9ff 0%, #eef3fb 100%);
  }
  [data-theme="light"] .payment-shell {
    background: #fff;
    border-color: #d8e2f0;
    box-shadow: 0 20px 50px rgba(16, 33, 63, 0.12);
  }
  [data-theme="light"] .payment-shell.netbanking .payment-icon {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  }
  [data-theme="light"] .payment-header h1,
  [data-theme="light"] .summary-card strong,
  [data-theme="light"] .field-group label {
    color: #10213f;
  }
  [data-theme="light"] .payment-header p,
  [data-theme="light"] .summary-card span,
  [data-theme="light"] .back-link,
  [data-theme="light"] .text-back {
    color: #4d5f7d;
  }
  [data-theme="light"] .summary-card > div,
  [data-theme="light"] .field-group input,
  [data-theme="light"] .stripe-element-wrap {
    background: #f8fbff;
    border-color: #d8e2f0;
    color: #10213f;
  }
  [data-theme="light"] .state-banner.info {
    color: #1e3a8a;
    background: #eaf2ff;
    border-color: #bcd3fb;
  }
  [data-theme="light"] .state-banner.warn {
    color: #92400e;
    background: #fffbeb;
    border-color: #fcd34d;
  }
  [data-theme="light"] .state-banner.error {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fca5a5;
  }
  [data-theme="light"] .state-banner.success {
    color: #166534;
    background: #dcfce7;
    border-color: #86efac;
  }
  [data-theme="light"] .netbanking-panel {
    background: #EEF5FF;
    border-color: #BFDBFE;
  }
  [data-theme="light"] .nb-title {
    color: #1E3A8A;
  }
  [data-theme="light"] .nb-subtitle {
    color: #334E7D;
  }
  [data-theme="light"] .nb-banks span {
    background: #DBEAFE;
    border-color: #93C5FD;
    color: #1E40AF;
  }
  @media (max-width: 640px) {
    .summary-card {
      grid-template-columns: 1fr;
    }
  }
`;
