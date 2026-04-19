import React from 'react';
import type { RiskLevel } from '../../types';

interface BadgeProps {
  risk: RiskLevel;
  label?: string;
  className?: string;
}

export function Badge({ risk, label, className = '' }: BadgeProps) {
  const styles = {
    high: 'bg-risk-high text-white',
    medium: 'bg-risk-medium text-white',
    low: 'bg-risk-low text-white',
  };

  const icons = {
    high: '\uD83D\uDD34',
    medium: '\uD83D\uDFE1',
    low: '\uD83D\uDFE2',
  };

  const labels = {
    high: 'HATARI KUBWA',
    medium: 'TAHADHARI',
    low: 'SALAMA',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${styles[risk]} ${className}`}>
      {icons[risk]} {label || labels[risk]}
    </span>
  );
}
