import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyles = "font-semibold font-sans transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:animate-pulsing  animate-duration-fast";

    const variants = {
        primary: "bg-primary text-white border-transparent shadow-[0_4px_12px_rgba(0,122,255,0.2)] hover:brightness-110 hover:shadow-[0_8px_24px_rgba(0,122,255,0.3)] hover:-translate-y-0.5 focus-visible:ring-primary",
        secondary: "bg-[rgba(255,255,255,0.08)] text-primary border-transparent hover:bg-primary hover:text-white focus-visible:ring-primary dark:bg-[rgba(255,255,255,0.1)]",
        danger: "bg-[hsla(2,100%,60%,0.1)] text-danger border-[hsla(2,100%,60%,0.2)] hover:bg-danger hover:text-white hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(255,59,48,0.2)] focus-visible:ring-danger",
        ghost: "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[rgba(0,0,0,0.05)] hover:text-[var(--text-primary)] dark:hover:bg-[rgba(255,255,255,0.05)]",
        outline: "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
    };

    const sizes = {
        sm: "text-xs py-1 px-3 rounded-lg h-7",
        md: "text-[15px] py-2.5 px-5 rounded-xl",
        lg: "text-[17px] py-3 px-6 rounded-[14px]",
        icon: "p-0 w-8 h-8 rounded-lg"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} style={{ animationDuration: '300ms' }}>
            {children}
        </button>
    );
};

export default Button;
