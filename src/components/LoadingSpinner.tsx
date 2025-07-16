import React from "react";

type SpinnerProps = {
  size?: number;      // spinner size in px
  color?: string;     // spinner color (default: blue)
  className?: string; // extra classNames if needed
  "aria-label"?: string;
};

const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "#2563eb", // blue-600 tailwind
  className = "",
  "aria-label": ariaLabel = "Loading",
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    border: `${size / 8}px solid ${color}`,
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={className}
        style={style}
      />
    </>
  );
};

export default LoadingSpinner;
