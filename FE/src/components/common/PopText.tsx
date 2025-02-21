import React from 'react';

interface PopTextProps {
  children: React.ReactNode;
  strokeWidth: number;
  strokeColor?: string;
  textColor?: string;
  fontSize?: string;
  className?: string;
}

function PopText({
  children,
  strokeWidth,
  strokeColor,
  textColor,
  fontSize = '4xl',
  className = '',
}: PopTextProps): JSX.Element {
  const baseStyles = `
    relative
    font-bold
    text-${fontSize}
    ${className}
  `.trim();

  return (
    <div className={baseStyles}>
      {/* Stroke layer */}
      <span
        className="absolute inset-0 text-transparent"
        style={{
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
        }}
      >
        {children}
      </span>

      {/* Main text */}
      <span
        className={`relative text-${textColor} z-10`}
      >
        {children}
      </span>
    </div>
  );
}

export default PopText;
