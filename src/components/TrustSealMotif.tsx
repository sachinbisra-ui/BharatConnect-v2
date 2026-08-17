import React from 'react';

interface TrustSealMotifProps {
  size?: number;
  className?: string;
  variant?: 'emerald' | 'navy' | 'saffron' | 'subtle';
  animated?: boolean;
}

export const TrustSealMotif: React.FC<TrustSealMotifProps> = ({
  size = 48,
  className = '',
  variant = 'emerald',
  animated = false,
}) => {
  const getStrokeColor = () => {
    switch (variant) {
      case 'emerald':
        return '#0F9D6C';
      case 'navy':
        return '#0A1F44';
      case 'saffron':
        return '#FF9933';
      case 'subtle':
      default:
        return 'currentColor';
    }
  };

  const stroke = getStrokeColor();

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-spin-slow' : ''}
      >
        {/* Outer Cryptographic Node Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeOpacity="0.4"
        />
        {/* Secondary Concentric Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={stroke}
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
        {/* Inner Geometric Star / 24-spoke Trust Seal Geometry */}
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke={stroke}
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        {/* 16 Radial Trust Rays */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + 26 * Math.cos(rad);
          const y1 = 50 + 26 * Math.sin(rad);
          const x2 = 50 + 38 * Math.cos(rad);
          const y2 = 50 + 38 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
          );
        })}
        {/* Central Hub */}
        <circle cx="50" cy="50" r="10" fill={stroke} fillOpacity="0.15" />
        <circle cx="50" cy="50" r="6" fill={stroke} />
        {/* 4 Cardinal Anchor Points */}
        <circle cx="50" cy="6" r="2.5" fill={stroke} />
        <circle cx="94" cy="50" r="2.5" fill={stroke} />
        <circle cx="50" cy="94" r="2.5" fill={stroke} />
        <circle cx="6" cy="50" r="2.5" fill={stroke} />
      </svg>
    </div>
  );
};
