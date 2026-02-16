import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MonoIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  title?: string;
}

export function MonoIcon({ icon: Icon, size = 18, className, title }: MonoIconProps) {
  return (
    <Icon
      size={size}
      className={className}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? 'img' : 'presentation'}
    />
  );
}
