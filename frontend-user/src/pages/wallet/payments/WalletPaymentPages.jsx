import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Building, CheckCircle2, CreditCard,
  Lock, ShieldCheck, Smartphone, Eye, EyeOff, Info, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../../context/WalletContext';

const PAYMENT_LIMITS = { upi: 100000, card: 500000, netbanking: 1000000 };

const METHOD_CONFIG = {
  upi:        { title: 'UPI Payment',         subtitle: 'Pay securely with any UPI app',       icon: Smartphone },
  card:       { title: 'Debit / Credit Card',  subtitle: 'VISA · Mastercard · RuPay · Amex',   icon: CreditCard  },
  netbanking: { title: 'Net Banking',          subtitle: 'Pay directly from your bank account', icon: Building    }
};

const UPI_APPS = [
  { value: 'gpay',    label: 'Google Pay', color: '#4285F4', abbr: 'G'  },
  { value: 'phonepe', label: 'PhonePe',    color: '#5F259F', abbr: 'P'  },
  { value: 'paytm',   label: 'Paytm',      color: '#00BAF2', abbr: 'Pt' },
  { value: 'bhim',    label: 'BHIM UPI',   color: '#FF6B35', abbr: 'B'  },
];

const BANKS = [
  { value: 'hdfc',  label: 'HDFC Bank',          abbr: 'HDFC',  color: '#004C8F' },
  { value: 'sbi',   label: 'State Bank of India', abbr: 'SBI',   color: '#22409A' },
  { value: 'icici', label: 'ICICI Bank',           abbr: 'ICICI', color: '#B02A30' },
  { value: 'axis',  label: 'Axis Bank',            abbr: 'AXIS',  color: '#97144D' },
  { value: 'kotak', label: 'Kotak Mahindra Bank',  abbr: 'KMB',   color: '#EF4123' },
  { value: 'bob',   label: 'Bank of Baroda',       abbr: 'BOB',   color: '#F05A28' },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function fmtCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function detectNetwork(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))              return 'visa';
  if (/^5[1-5]|^2[2-7]/.test(n)) return 'mastercard';
  if (/^6[0-9]|^508/.test(n))   return 'rupay';
  if (/^3[47]/.test(n))         return 'amex';
  return null;
}

function CardPreview({ cardNumber, cardName, cardExpiry, network }) {
  const dn = (cardNumber || '').padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();
  return (
    <motion.div className="card-preview" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="cp-top">
        <div className="chip"><div className="chip-inner" /></div>
        <Wifi size={18} style={{ color: 'rgba(255,255,255,0.35)' }} />
      </div>
      <div className="cp-num">{dn}</div>
      <div className="cp-bottom">
        <div>
          <div className="cp-lbl">Card Holder</div>
          <div className="cp-val">{(cardName || 'YOUR NAME').toUpperCase()}</div>
        </div>
        <div>
          <div className="cp-lbl">Expires</div>
          <div className="cp-val">{cardExpiry || 'MM/YY'}</div>
        </div>
        <div className="cp-net">
          {network === 'visa'       && <span className="net-visa">VISA</span>}
          {network === 'mastercard' && <span className="net-mc"><i /><i /></span>}
          {network === 'rupay'      && <span className="net-rupay">RuPay</span>}
          {network === 'amex'       && <span className="net-amex">AMEX</span>}
          {!network                 && <CreditCard size={22} style={{ opacity: 0.35 }} />}
        </div>
      </div>
    </motion.div>
  );
}

function WalletPaymentScreen({ method }) {
  const navigate     = useNavigate();
  const [sp]         = useSearchParams();
  const { addMoney } = useWallet();
  const cfg          = METHOD_CONFIG[method];
  const Icon         = cfg.icon;
  const limit        = PAYMENT_LIMITS[method];

  const [amount,     setAmount]     = useState(sp.get('amount') || '');
  const [upiId,      setUpiId]      = useState('');
  const [upiApp,     setUpiApp]     = useState('gpay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv,    setCardCvv]    = useState('');
  const [showCvv,    setShowCvv]    = useState(false);
  const [bankCode,   setBankCode]   = useState('');
  const [bankUser,   setBankUser]   = useState('');
  const [bankPin,    setBankPin]    = useState('');
  const [showPin,    setShowPin]    = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [error,      setError]      = useState('');
  const [processing, setProcessing] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const num       = Number(amount);
  const badAmount = !Number.isFinite(num) || num <= 0;
  const overLimit = num > limit;
  const network   = detectNetwork(cardNumber);
  const selBank   = BANKS.find(b => b.value === bankCode);
  const selApp    = UPI_APPS.find(a => a.value === upiApp);

  const fieldErr = useMemo(() => {
    if (method === 'upi') {
      return !upiId || !/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/i.test(upiId)
        ? 'Enter a valid UPI ID (e.g. name@okicici)' : '';
    }
    if (method === 'card') {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return 'Enter a valid 16-digit card number.';
      if (!cardName.trim())                                 return 'Enter cardholder name.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry))   return 'Enter expiry in MM/YY format.';
      if (!/^\d{3,4}$/.test(cardCvv))                      return 'Enter a valid CVV.';
      return '';
    }
    if (!bankCode)             return 'Select a bank.';
    if (!bankUser.trim())      return 'Enter your net banking user ID.';
    if (!bankPin || bankPin.length < 4) return 'Enter a valid login PIN.';
    return '';
  }, [method, upiId, cardNumber, cardName, cardExpiry, cardCvv, bankCode, bankUser, bankPin]);

  const disabled = processing || success || badAmount || overLimit || Boolean(fieldErr);

  const handlePay = async () => {
    if (disabled) {
      setError(badAmount ? 'Enter a valid amount.' : overLimit ? `Limit is ${fmt(limit)}.` : fieldErr);
      return;
    }
    try {
      setError(''); setProcessing(true);
      await addMoney(num, method);
      setSuccess(true);
      const successRedirect = `/wallet?topupSuccess=1&transfer=credit&amount=${encodeURIComponent(String(num))}`;
      setTimeout(() => navigate(successRedirect, {
        state: { transferAnimation: { type: 'credit', amount: num } }
      }), 2000);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Payment failed. Please try again.');
    } finally { setProcessing(false); }
  };

  const onExpiry = (e) => {
    let v = e.target.value.replace(/[^\d]/g, '');
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    setCardExpiry(v);
  };

  const fi = (name) => ({ onFocus: () => setFocusField(name), onBlur: () => setFocusField(null) });

  return (
    <div className="wp-page">
      <motion.div className="wp-shell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div className="wp-topbar">
          <Link to="/wallet" className="wp-back"><ArrowLeft size={15} /> Back</Link>
          <span className="wp-secure"><ShieldCheck size={13} /> 256-bit SSL Secured</span>
        </div>

        <div className="wp-header">
          <div className="wp-hicon"><Icon size={20} /></div>
          <div><h1>{cfg.title}</h1><p>{cfg.subtitle}</p></div>
        </div>

        <div className="wp-hr" />

        {/* Amount */}
        <div className="wp-block">
          <span className="wp-slabel">Enter Amount</span>
          <div className={`wp-amtwrap ${focusField==='amt'?'focused':''} ${overLimit?'err':''}`}>
            <span className="wp-rs">₹</span>
            <input type="number" min="1" max={limit} value={amount} placeholder="0"
              {...fi('amt')} onChange={e => { setAmount(e.target.value); setError(''); }} />
            {num > 0 && !overLimit && !badAmount && <span className="wp-amtlabel">{fmt(num)}</span>}
          </div>
          {overLimit && <p className="wp-hint err">Exceeds {method} limit of {fmt(limit)}</p>}
          <div className="wp-quickrow">
            {QUICK_AMOUNTS.map(q => (
              <button key={q} type="button" className={`wp-qchip ${num===q?'active':''}`}
                onClick={() => { setAmount(String(q)); setError(''); }}>
                ₹{q.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <p className="wp-limitnote"><Info size={11} /> Transaction limit: {fmt(limit)}</p>
        </div>

        <div className="wp-hr" />

        {/* UPI */}
        {method === 'upi' && (
          <div className="wp-block">
            <span className="wp-slabel">Payment Details</span>
            <div className="upi-grid">
              {UPI_APPS.map(a => (
                <button key={a.value} type="button"
                  className={`upi-btn ${upiApp===a.value?'active':''}`}
                  style={{'--ac': a.color}} onClick={() => setUpiApp(a.value)}>
                  <span className="upi-icon" style={{background: a.color}}>{a.abbr}</span>
                  {a.label}
                </button>
              ))}
            </div>
            <div className={`wp-fg ${focusField==='upi'?'focused':''}`}>
              <label>UPI ID</label>
              <div className="wp-iw">
                <Smartphone size={15} className="wp-ii" />
                <input type="text" value={upiId}
                  placeholder={`name@${upiApp==='gpay'?'okicici':upiApp==='phonepe'?'ybl':'upi'}`}
                  {...fi('upi')} onChange={e => { setUpiId(e.target.value); setError(''); }} />
                {/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/i.test(upiId) && <CheckCircle2 size={15} className="wp-icheck" />}
              </div>
              <p className="wp-hint">Enter UPI ID linked to your {selApp?.label} account</p>
            </div>
          </div>
        )}

        {/* Card */}
        {method === 'card' && (
          <div className="wp-block">
            <CardPreview cardNumber={cardNumber.replace(/\s/g,'')}
              cardName={cardName} cardExpiry={cardExpiry} network={network} />
            <div className={`wp-fg mt16 ${focusField==='cn'?'focused':''}`}>
              <div className="wp-lrow">
                <label>Card Number</label>
                {network && <span className={`net-badge net-${network}`}>
                  {network==='visa'?'VISA':network==='mastercard'?'MC':network==='rupay'?'RuPay':'AMEX'}
                </span>}
              </div>
              <div className="wp-iw">
                <CreditCard size={15} className="wp-ii" />
                <input type="text" inputMode="numeric" value={cardNumber}
                  placeholder="1234  5678  9012  3456" {...fi('cn')}
                  onChange={e => { setCardNumber(fmtCard(e.target.value)); setError(''); }} />
              </div>
            </div>
            <div className={`wp-fg ${focusField==='cname'?'focused':''}`}>
              <label>Cardholder Name</label>
              <div className="wp-iw">
                <input type="text" value={cardName} placeholder="As printed on card"
                  style={{paddingLeft:12}} {...fi('cname')}
                  onChange={e => { setCardName(e.target.value); setError(''); }} />
              </div>
            </div>
            <div className="wp-2col">
              <div className={`wp-fg ${focusField==='exp'?'focused':''}`}>
                <label>Expiry Date</label>
                <div className="wp-iw">
                  <input type="text" inputMode="numeric" value={cardExpiry}
                    placeholder="MM / YY" style={{paddingLeft:12}} {...fi('exp')} onChange={onExpiry} />
                </div>
              </div>
              <div className={`wp-fg ${focusField==='cvv'?'focused':''}`}>
                <div className="wp-lrow">
                  <label>CVV</label>
                  <span className="wp-cvvhint">3 digits on back</span>
                </div>
                <div className="wp-iw">
                  <input type={showCvv?'text':'password'} inputMode="numeric"
                    value={cardCvv} placeholder="•••" style={{paddingLeft:12}} {...fi('cvv')}
                    onChange={e => { setCardCvv(e.target.value.replace(/\D/g,'').slice(0,4)); setError(''); }} />
                  <button type="button" className="wp-eye" onClick={() => setShowCvv(v => !v)}>
                    {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Net Banking */}
        {method === 'netbanking' && (
          <div className="wp-block">
            <span className="wp-slabel">Select Your Bank</span>
            <div className="bank-grid">
              {BANKS.map(b => (
                <button key={b.value} type="button"
                  className={`bank-btn ${bankCode===b.value?'active':''}`}
                  style={{'--bc': b.color}}
                  onClick={() => { setBankCode(b.value); setError(''); }}>
                  <span className="bank-icon" style={{background: b.color}}>{b.abbr}</span>
                  <span className="bank-lbl">{b.label}</span>
                  {bankCode === b.value && <CheckCircle2 size={13} className="bank-chk" />}
                </button>
              ))}
            </div>
            {bankCode && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bank-login-hdr">
                  <span className="bank-icon-sm" style={{background: selBank?.color}}>{selBank?.abbr}</span>
                  {selBank?.label} — Secure Login
                </div>
                <div className={`wp-fg ${focusField==='buid'?'focused':''}`}>
                  <label>Customer / User ID</label>
                  <div className="wp-iw">
                    <Building size={15} className="wp-ii" />
                    <input type="text" value={bankUser} placeholder="Net banking user ID"
                      {...fi('buid')} onChange={e => { setBankUser(e.target.value); setError(''); }} />
                  </div>
                </div>
                <div className={`wp-fg ${focusField==='bpin'?'focused':''}`}>
                  <label>Login Password / IPIN</label>
                  <div className="wp-iw">
                    <Lock size={15} className="wp-ii" />
                    <input type={showPin?'text':'password'} value={bankPin}
                      placeholder="Enter your secure password"
                      {...fi('bpin')} onChange={e => { setBankPin(e.target.value); setError(''); }} />
                    <button type="button" className="wp-eye" onClick={() => setShowPin(v => !v)}>
                      {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div className="wp-hr" />

        <div className="wp-trust">
          <span><Lock size={12} /> End-to-end encrypted</span>
          <span><ShieldCheck size={12} /> RBI regulated</span>
          <span><CheckCircle2 size={12} /> PCI-DSS compliant</span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="wp-error"
              initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <span className="wp-dot" /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div className="wp-success"
              initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}>
              <CheckCircle2 size={18} />
              <div><strong>Payment Successful!</strong>
                <p>₹{num.toLocaleString('en-IN')} added to your wallet</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="button"
          className={`wp-paybtn ${processing?'busy':''} ${success?'done':''}`}
          onClick={handlePay} disabled={disabled}>
          {success    ? <><CheckCircle2 size={17} /> Payment Successful</> :
           processing ? <><span className="wp-spinner" /> Verifying &amp; Processing…</> :
                        <><Lock size={15} /> Pay {num > 0 ? fmt(num) : 'Securely'}</>}
        </button>

        <p className="wp-footer">
          By proceeding you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
        </p>
      </motion.div>
      <style>{CSS}</style>
    </div>
  );
}

export function UpiWalletPaymentPage()        { return <WalletPaymentScreen method="upi" />; }
export function CardWalletPaymentPage()       { return <WalletPaymentScreen method="card" />; }
export function NetBankingWalletPaymentPage() { return <WalletPaymentScreen method="netbanking" />; }

const CSS = `
.wp-page{--wp-bg:linear-gradient(145deg,#06112B,#0F2347 55%,#0A1C3A);--wp-shell-bg:rgba(13,32,60,.95);--wp-shell-border:rgba(255,255,255,.1);--wp-shell-shadow:0 24px 64px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.04);--wp-text:#EEF4FF;--wp-muted:#7A90AE;--wp-label:#5C7A9E;--wp-quiet:#4C6A8A;--wp-divider:rgba(255,255,255,.07);--wp-input-bg:rgba(255,255,255,.04);--wp-input-border:rgba(255,255,255,.12);--wp-input-placeholder:rgba(255,255,255,.18);--wp-chip-bg:rgba(255,255,255,.05);--wp-chip-border:rgba(255,255,255,.12);--wp-chip-text:#B8CBE8;--wp-choice-bg:rgba(255,255,255,.04);--wp-choice-border:rgba(255,255,255,.1);--wp-choice-hover-bg:rgba(255,255,255,.07);--wp-choice-hover-border:rgba(255,255,255,.2);--wp-choice-text:#C2D2E8;--wp-note:#3A5070;--wp-link:#5C7A9E;--wp-link-hover:#8CA0C0;min-height:calc(100vh - 70px);padding:80px 16px 48px;background:var(--wp-bg);display:flex;justify-content:center;align-items:flex-start;color-scheme:dark}
[data-theme="light"] .wp-page{--wp-bg:linear-gradient(145deg,#f0f4fb,#e6edf8);--wp-shell-bg:#fff;--wp-shell-border:#dce7f5;--wp-shell-shadow:0 20px 60px rgba(16,33,63,.1);--wp-text:#10213f;--wp-muted:#5a6e8a;--wp-label:#7a90ae;--wp-quiet:#8090aa;--wp-divider:#e8eef8;--wp-input-bg:#f7faff;--wp-input-border:#d0dcea;--wp-input-placeholder:rgba(0,0,0,.2);--wp-chip-bg:#f0f5ff;--wp-chip-border:#d0dcea;--wp-chip-text:#4a6080;--wp-choice-bg:#f7faff;--wp-choice-border:#d8e4f0;--wp-choice-hover-bg:#f0f7ff;--wp-choice-hover-border:#c8d6e8;--wp-choice-text:#3a5070;--wp-note:#9aabbb;--wp-link:#6a8aaa;--wp-link-hover:#446b94;color-scheme:light}
.wp-shell{width:100%;max-width:520px;background:var(--wp-shell-bg);border:1px solid var(--wp-shell-border);border-radius:20px;padding:24px;box-shadow:var(--wp-shell-shadow);backdrop-filter:blur(10px)}
.wp-topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.wp-back{display:inline-flex;align-items:center;gap:6px;color:var(--wp-muted);text-decoration:none;font-size:.85rem;font-weight:600;transition:color .15s}
.wp-back:hover{color:var(--wp-link-hover)}
.wp-secure{display:inline-flex;align-items:center;gap:5px;padding:5px 10px;border-radius:999px;font-size:.7rem;font-weight:600;color:#34D27E;background:rgba(45,190,96,.1);border:1px solid rgba(45,190,96,.3)}
.wp-header{display:flex;align-items:center;gap:14px;margin-bottom:20px}
.wp-hicon{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#2DBE60,#1a9e4c);box-shadow:0 6px 20px rgba(45,190,96,.35);flex-shrink:0}
.wp-header h1{margin:0;font-size:1.1rem;font-weight:700;color:var(--wp-text)}
.wp-header p{margin:3px 0 0;font-size:.8rem;color:var(--wp-muted)}
.wp-hr{height:1px;background:var(--wp-divider);margin:18px 0}
.wp-block{margin-bottom:4px}
.wp-slabel{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--wp-label);margin-bottom:10px}
.wp-amtwrap{display:flex;align-items:center;gap:4px;background:var(--wp-input-bg);border:1.5px solid var(--wp-input-border);border-radius:12px;padding:0 14px;transition:border-color .2s,background .2s}
.wp-amtwrap.focused{border-color:#2DBE60;background:rgba(45,190,96,.05)}
.wp-amtwrap.err{border-color:rgba(248,113,113,.6)}
.wp-rs{font-size:1.6rem;font-weight:700;color:var(--wp-text);line-height:1;flex-shrink:0}
.wp-amtwrap input{flex:1;background:transparent;border:none;outline:none;font-size:1.8rem;font-weight:700;color:var(--wp-text);padding:14px 6px;-moz-appearance:textfield}
.wp-amtwrap input::-webkit-outer-spin-button,.wp-amtwrap input::-webkit-inner-spin-button{-webkit-appearance:none}
.wp-amtwrap input::placeholder{color:var(--wp-input-placeholder)}
.wp-amtlabel{font-size:.8rem;color:#2DBE60;font-weight:600;white-space:nowrap;flex-shrink:0}
.wp-quickrow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.wp-qchip{padding:6px 14px;border-radius:999px;font-size:.8rem;font-weight:600;background:var(--wp-chip-bg);border:1px solid var(--wp-chip-border);color:var(--wp-chip-text);cursor:pointer;transition:all .15s}
.wp-qchip:hover{background:rgba(45,190,96,.1);border-color:rgba(45,190,96,.4);color:#34D27E}
.wp-qchip.active{background:rgba(45,190,96,.15);border-color:#2DBE60;color:#34D27E}
.wp-limitnote{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;color:var(--wp-label);margin:8px 0 0}
.wp-hint{margin:5px 0 0;font-size:.75rem;color:var(--wp-label)}
.wp-hint.err{color:#f87171}
.upi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px}
.upi-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--wp-choice-bg);border:1.5px solid var(--wp-choice-border);color:var(--wp-choice-text);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .15s;text-align:left}
.upi-btn:hover{background:var(--wp-choice-hover-bg);border-color:var(--wp-choice-hover-border)}
.upi-btn.active{border-color:var(--ac);background:var(--wp-choice-hover-bg);color:var(--wp-text)}
.upi-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;color:#fff;font-size:.7rem;font-weight:800;flex-shrink:0}
.card-preview{width:100%;border-radius:16px;padding:20px;background:linear-gradient(135deg,#1a2e55,#0d1f42 60%,#162843);border:1px solid rgba(255,255,255,.12);box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.07);margin-bottom:4px;position:relative;overflow:hidden}
.card-preview::before{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:rgba(45,190,96,.08)}
.card-preview::after{content:'';position:absolute;bottom:-40px;left:-40px;width:130px;height:130px;border-radius:50%;background:rgba(45,120,220,.07)}
.cp-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.chip{width:36px;height:26px;border-radius:5px;background:linear-gradient(135deg,#d4a843,#f0cc6e);display:flex;align-items:center;justify-content:center}
.chip-inner{width:20px;height:14px;border-radius:3px;border:1px solid rgba(0,0,0,.2);background:linear-gradient(135deg,#c9922c,#e8b94a)}
.cp-num{font-size:1.05rem;font-family:'Courier New',monospace;font-weight:600;color:rgba(255,255,255,.9);letter-spacing:.18em;margin-bottom:16px}
.cp-bottom{display:flex;align-items:flex-end;gap:16px}
.cp-lbl{font-size:.6rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px}
.cp-val{font-size:.78rem;color:rgba(255,255,255,.85);font-weight:600;letter-spacing:.03em;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cp-net{margin-left:auto}
.net-visa{font-style:italic;font-weight:900;font-size:1.1rem;color:#fff;letter-spacing:-.02em}
.net-mc{display:inline-flex;position:relative;width:36px;height:22px}
.net-mc i{position:absolute;width:22px;height:22px;border-radius:50%}
.net-mc i:first-child{left:0;background:#EB001B;opacity:.9}
.net-mc i:last-child{left:14px;background:#F79E1B;opacity:.9}
.net-rupay{font-weight:800;font-size:.85rem;color:#fff;background:#097939;padding:2px 7px;border-radius:4px}
.net-amex{font-weight:800;font-size:.8rem;color:#fff;background:#016FD0;padding:2px 7px;border-radius:4px;letter-spacing:.05em}
.net-badge{padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700;letter-spacing:.04em;color:#fff}
.net-badge.net-visa{background:#1A1F71}.net-badge.net-mastercard{background:#EB001B}.net-badge.net-rupay{background:#097939}.net-badge.net-amex{background:#016FD0}
.mt16{margin-top:16px}
.wp-fg{margin-bottom:14px}
.wp-fg.focused .wp-iw{border-color:#2DBE60;background:rgba(45,190,96,.06)}
.wp-lrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.wp-fg label,.wp-lrow label{display:block;font-size:.8rem;font-weight:700;color:var(--wp-muted);letter-spacing:.01em;margin-bottom:8px}
.wp-lrow label{margin-bottom:0}
.wp-cvvhint{font-size:.7rem;color:var(--wp-quiet);font-style:italic}
.wp-iw{display:flex;align-items:center;height:44px;border-radius:10px;border:1.5px solid var(--wp-input-border);background:var(--wp-input-bg);transition:border-color .2s,background .2s;overflow:hidden}
.wp-ii{flex-shrink:0;margin:0 10px;color:var(--wp-quiet)}
.wp-icheck{flex-shrink:0;margin:0 10px;color:#2DBE60}
.wp-iw input{flex:1;height:100%;background:transparent;border:none;outline:none;font-size:.9rem;color:var(--wp-text)}
.wp-iw input::placeholder{color:var(--wp-input-placeholder)}
.wp-eye{background:none;border:none;cursor:pointer;color:var(--wp-quiet);padding:0 12px;height:100%;display:flex;align-items:center;transition:color .15s}
.wp-eye:hover{color:var(--wp-muted)}
.wp-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.bank-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.bank-btn{display:flex;align-items:center;gap:8px;padding:10px;border-radius:10px;background:var(--wp-choice-bg);border:1.5px solid var(--wp-choice-border);color:var(--wp-choice-text);font-size:.78rem;font-weight:600;cursor:pointer;transition:all .15s;text-align:left;position:relative}
.bank-btn:hover{background:var(--wp-choice-hover-bg);border-color:var(--wp-choice-hover-border)}
.bank-btn.active{border-color:var(--bc);background:var(--wp-choice-hover-bg);color:var(--wp-text)}
.bank-icon{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:#fff;font-size:.6rem;font-weight:800;flex-shrink:0}
.bank-lbl{flex:1;font-size:.75rem;line-height:1.3}
.bank-chk{color:#2DBE60;flex-shrink:0}
.bank-login-hdr{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--wp-choice-bg);border:1px solid var(--wp-choice-border);font-size:.82rem;font-weight:600;color:var(--wp-choice-text);margin-bottom:14px}
.bank-icon-sm{width:28px;height:28px;border-radius:7px;display:grid;place-items:center;color:#fff;font-size:.58rem;font-weight:800;flex-shrink:0}
.wp-trust{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.wp-trust span{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;color:var(--wp-quiet)}
.wp-error,.wp-success{border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px;font-size:.85rem;font-weight:500}
.wp-error{color:#fca5a5;background:rgba(185,28,28,.15);border:1px solid rgba(248,113,113,.35)}
.wp-success{color:#bbf7d0;background:rgba(20,120,60,.2);border:1px solid rgba(74,222,128,.35);align-items:flex-start}
.wp-success strong{display:block;color:#4ade80;margin-bottom:2px}
.wp-success p{margin:0;font-size:.8rem;color:#86efac}
.wp-dot{width:8px;height:8px;border-radius:50%;background:#f87171;flex-shrink:0}
.wp-paybtn{width:100%;height:50px;border:none;border-radius:12px;background:linear-gradient(135deg,#2DBE60,#1a9e4c);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s,transform .15s,box-shadow .2s;box-shadow:0 6px 20px rgba(45,190,96,.3);letter-spacing:.01em;margin-bottom:14px}
.wp-paybtn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(45,190,96,.4)}
.wp-paybtn:not(:disabled):active{transform:translateY(0)}
.wp-paybtn:disabled{cursor:not-allowed;opacity:.4;box-shadow:none}
.wp-paybtn.done{background:linear-gradient(135deg,#1a9e4c,#127a38);opacity:1!important}
.wp-paybtn.busy{cursor:wait}
.wp-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.wp-footer{text-align:center;font-size:.72rem;color:var(--wp-note);margin:0}
.wp-footer a{color:var(--wp-link);text-decoration:underline;text-underline-offset:2px}
.wp-footer a:hover{color:var(--wp-link-hover)}
@media(max-width:520px){
  .wp-page{padding:70px 12px 32px}
  .wp-shell{padding:18px;border-radius:16px}
  .wp-2col,.bank-grid{grid-template-columns:1fr}
  .wp-trust{gap:10px}
  .cp-num{font-size:.88rem;letter-spacing:.12em}
}
`;
