
import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/30",
    secondary: "bg-secondary text-secondary-foreground border-secondary/50",
    outline: "border border-input bg-transparent",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    annual: "bg-leave-annual/10 text-leave-annual border-leave-annual/30",
    sick: "bg-leave-sick/10 text-leave-sick border-leave-sick/30",
    special: "bg-leave-special/10 text-leave-special border-leave-special/30",
    other: "bg-leave-other/10 text-leave-other border-leave-other/30",
  };
  
  const sizes = {
    sm: "text-xs px-1.5 py-0.5 rounded",
    md: "text-xs px-2.5 py-0.5 rounded-md",
    lg: "text-sm px-3 py-1 rounded-md",
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
