
import React from 'react';
import { cn } from '@/lib/utils';

const ProfileAvatar = ({ 
  src, 
  name, 
  size = 'md', 
  className, 
  ...props 
}) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-lg",
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-medium overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={name || "Avatar"} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default ProfileAvatar;
