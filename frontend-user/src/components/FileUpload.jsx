// src/components/FileUpload.jsx
import { useState } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

export default function FileUpload({
  label,
  name,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5, // MB
  required = false,
  error
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize}MB`);
      return;
    }

    setUploadedFile(file);
    onChange?.({
      target: {
        name,
        value: file,
        files: [file]
      }
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    onChange?.({
      target: {
        name,
        value: null,
        files: []
      }
    });
  };

  return (
    <div className="file-upload-wrapper">
      {label && (
        <label className="file-upload-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {!uploadedFile ? (
        <div
          className={`file-upload-zone ${dragActive ? 'drag-active' : ''} ${error ? 'error' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="file-upload-input"
            onChange={handleChange}
            accept={accept}
            required={required}
          />
          <div className="file-upload-content">
            <Upload className="file-upload-icon" size={32} />
            <p className="file-upload-text">
              <span className="file-upload-highlight">Click to upload</span> or drag and drop
            </p>
            <p className="file-upload-hint">
              {accept} up to {maxSize}MB
            </p>
          </div></div>
      ) : (
        <div className="file-uploaded">
          <div className="file-info">
            <File className="file-icon" size={20} />
            <div className="file-details">
              <span className="file-name">{uploadedFile.name}</span>
              <span className="file-size">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <div className="file-actions">
            <Check className="file-success" size={20} />
            <button
              type="button"
              className="file-remove"
              onClick={removeFile}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {error && <span className="error-text">{error}</span>}

      <style>{fileUploadStyles}</style>
    </div>
  );
}

const fileUploadStyles = `
  .file-upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .file-upload-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .required {
    color: #EF4444;
    margin-left: 2px;
  }

  .file-upload-zone {
    position: relative;
    padding: 32px 24px;
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    background: var(--bg-secondary);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .file-upload-zone:hover {
    border-color: #2DBE60;
    background: #E9F8EF;
  }

  [data-theme="dark"] .file-upload-zone:hover {
    background: rgba(45, 190, 96, 0.1);
  }

  .file-upload-zone.drag-active {
    border-color: #2DBE60;
    background: #E9F8EF;
  }

  [data-theme="dark"] .file-upload-zone.drag-active {
    background: rgba(45, 190, 96, 0.15);
  }

  .file-upload-zone.error {
    border-color: #EF4444;
  }

  .file-upload-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .file-upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    pointer-events: none;
  }

  .file-upload-icon {
    color: var(--text-muted);
  }

  .file-upload-text {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .file-upload-highlight {
    color: #2DBE60;
    font-weight: 600;
  }

  .file-upload-hint {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin: 0;
  }

  .file-uploaded {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #E9F8EF;
    border: 1px solid #2DBE60;
    border-radius: 12px;
  }

  [data-theme="dark"] .file-uploaded {
    background: rgba(45, 190, 96, 0.1);
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .file-icon {
    color: #2DBE60;
  }

  .file-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .file-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .file-size {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .file-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .file-success {
    color: #2DBE60;
  }

  .file-remove {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .file-remove:hover {
    color: #EF4444;
    background: #FEE2E2;
  }

  .error-text {
    font-size: 0.8125rem;
    color: #EF4444;
  }
`;
