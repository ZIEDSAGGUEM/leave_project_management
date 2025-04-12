
import React from 'react';
import { cn } from '@/lib/utils';

const GlassPanel = ({ 
  children, 
  className, 
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/50 backdrop-blur-lg border border-white/20 shadow-sm p-6",
        hover && "transition-all duration-300 hover:shadow-md hover:bg-white/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
