import React from "react";

interface Props {
  message: string | null;
  onRetry?: () => void;
  onClose?: () => void;
}

const ErrorBanner: React.FC<Props> = ({ message, onRetry, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-banner card" role="alert">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <strong style={{ color: "var(--danger)" }}>Error:</strong>{" "}
          <span style={{ color: "var(--text)" }}>{message}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {onRetry && <button onClick={onRetry}>Retry</button>}
          {onClose && <button onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;
