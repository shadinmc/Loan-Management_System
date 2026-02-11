// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Wallet, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const loanProducts = [
    { name: 'Personal Loan', path: '/loan/apply/personal' },
    { name: 'Business Loan', path: '/loan/apply/business' },
    { name: 'Education Loan', path: '/loan/apply/education' },
    { name: 'Vehicle Loan', path: '/loan/apply/vehicle' }
  ];

  const quickLinks = [
    { name: 'EMI Calculator', path: '/#emi-calculator' },
    { name: 'Loan Status', path: '/loan/status' },
    { name: 'KYC Verification', path: '/kyc' },
    { name: 'My Wallet', path: '/wallet' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <motion.div
          className="footer-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div className="footer-section company-section" variants={itemVariants}>
            <div className="footer-logo">
              <div className="logo-icon">
                <Wallet size={24} />
              </div>
              <span className="logo-text">LoanWise</span>
            </div>
            <p className="company-description">
              Your trusted partner for smart financial solutions. We provide quick,
              transparent, and hassle-free loan services tailored to your needs.
            </p>
            <div className="company-stats">
              <div className="stat">
                <span className="stat-value">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-value">₹500Cr+</span>
                <span className="stat-label">Loans Disbursed</span>
              </div>
            </div>
          </motion.div>

          {/* Loan Products */}
          <motion.div className="footer-section" variants={itemVariants}>
            <h4 className="section-title">Loan Products</h4>
            <ul className="footer-links">
              {loanProducts.map((product) => (
                <li key={product.name}>
                  <Link to={product.path} className="footer-link">
                    {product.name}
                    <ExternalLink size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="footer-section" variants={itemVariants}>
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                    <ExternalLink size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Contact */}
          <motion.div className="footer-section" variants={itemVariants}>
            <h4 className="section-title">Support & Help</h4>
            <div className="contact-info">
              <a href="mailto:support@loanwise.com" className="contact-item">
                <Mail size={18} />
                <span>support@loanwise.com</span>
              </a>
              <a href="tel:+911800123456" className="contact-item">
                <Phone size={18} />
                <span>1800-123-4567</span>
              </a>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
            <div className="support-hours">
              <p>Customer Support Hours:</p>
              <p className="hours">Mon - Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <div className="disclaimer-content">
            <p className="disclaimer-title">Important Disclaimer</p>
            <p className="disclaimer-text">
              Loans are subject to eligibility criteria and approval. Interest rates,
              processing fees, and other charges may vary based on your profile and
              loan type. Terms and conditions apply. Please read all loan documents
              carefully before signing. LoanWise is a registered NBFC under RBI guidelines.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} LoanWise. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/grievance">Grievance Redressal</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 48px;
          padding: 60px 0 40px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #2DBE60 0%, #22a652 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .company-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .company-stats {
          display: flex;
          gap: 32px;
          margin-top: 8px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2DBE60;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #2DBE60;
        }

        .footer-link svg {
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover svg {
          opacity: 1;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .contact-item:hover {
          color: #2DBE60;
        }

        .contact-item svg {
          color: #2DBE60;
          flex-shrink: 0;
        }

        .support-hours {
          margin-top: 8px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .support-hours p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .support-hours .hours {
          color: var(--text-primary);
          font-weight: 500;
          margin-top: 4px;
        }

        .footer-disclaimer {
          padding: 24px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .disclaimer-content {
          background: var(--bg-tertiary);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #F59E0B;
        }

        .disclaimer-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #F59E0B;
          margin-bottom: 8px;
        }

        .disclaimer-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
        }

        .copyright {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom-links a:hover {
          color: #2DBE60;
        }

        @media (max-width: 992px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 576px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 0 32px;
          }

          .company-stats {
            gap: 24px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 16px;text-align: center;
          }

          .footer-bottom-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
        }
      `}</style>
    </footer>
  );
}
