import type React from 'react';

/** Hover handlers for clickable cards — swaps border color and background. */
export const cardHoverHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = 'rgba(33, 250, 144, 0.6)';
    e.currentTarget.style.background = 'var(--terminal-navy)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = 'rgba(33, 250, 144, 0.2)';
    e.currentTarget.style.background = 'var(--terminal-surface)';
  },
};

/** Hover handlers for bordered buttons — swaps border color only. */
export function borderHoverHandlers(dimColor: string, brightColor: string) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = brightColor;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = dimColor;
    },
  };
}
