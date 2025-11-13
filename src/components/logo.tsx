import React from 'react';

interface LogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-base' },
    md: { box: 'w-10 h-10', text: 'text-lg' },
    lg: { box: 'w-12 h-12', text: 'text-2xl' },
  };

  const variantStyles = {
    default: {
      box: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      text: 'text-white',
      textGradient: 'from-cyan-400 to-blue-500',
    },
    white: {
      box: 'bg-gradient-to-br from-white to-gray-100 border border-gray-200',
      text: 'text-blue-600',
      textGradient: 'from-white to-gray-200',
    },
    dark: {
      box: 'bg-gradient-to-br from-gray-800 to-gray-900',
      text: 'text-white',
      textGradient: 'from-gray-400 to-gray-300',
    },
  };

  const current = variantStyles[variant];
  const dims = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${dims.box} rounded-lg ${current.box} flex items-center justify-center font-bold ${current.text}`}>
        SS
      </div>
      {showText && (
        <span className={`font-bold ${dims.text} bg-gradient-to-r ${current.textGradient} bg-clip-text text-transparent`}>
          SheetSyncSEI
        </span>
      )}
    </div>
  );
};
