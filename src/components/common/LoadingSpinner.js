import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizes = {
    sm: { outer: 32, inner: 20, border: 3 },
    md: { outer: 56, inner: 36, border: 4 },
    lg: { outer: 80, inner: 52, border: 5 },
  };
  const s = sizes[size] || sizes.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${s.border}px solid transparent`,
            borderTopColor: '#1d4ed8',
            borderRightColor: '#1d4ed8',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: s.inner,
            height: s.inner,
            top: '50%',
            left: '50%',
            marginTop: -(s.inner / 2),
            marginLeft: -(s.inner / 2),
            border: `${s.border}px solid transparent`,
            borderBottomColor: '#f59e0b',
            borderLeftColor: '#f59e0b',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <div
          className="absolute bg-blue-700 dark:bg-blue-500 rounded-full"
          style={{
            width: s.border * 2,
            height: s.border * 2,
            top: '50%',
            left: '50%',
            marginTop: -(s.border),
            marginLeft: -(s.border),
          }}
        />
      </div>
      {text && (
        <motion.p
          className="text-sm font-medium text-gray-500 dark:text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-16">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
