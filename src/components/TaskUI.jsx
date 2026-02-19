import React from 'react';

export const ICONS = {
    plus: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
    ),
    chevronUp: (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6" />
        </svg>
    ),
    chevronDown: (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
    x: (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
    ),
    trash: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    ),
    logout: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
};

export const ProgressBar = ({ progress, goal }) => {
    const percentage = Math.round(Math.min(100, Math.max(0, (progress / goal) * 100)));
    const isAchieved = progress >= goal;

    return (
        <div className="flex items-center w-full h-[26px]">
            <div className="w-full h-[24px] bg-[rgba(0,0,0,0.1)] rounded-[12px] overflow-hidden relative box-border flex items-center justify-center dark:bg-[rgba(255,255,255,0.15)]">
                <div
                    className={`absolute top-0 left-0 h-full bg-primary w-0 transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-[1] ${isAchieved ? 'bg-success' : ''}`}
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="relative z-[2] text-[10px] font-bold text-[var(--text-primary)] pointer-events-none text-center mix-blend-normal">{percentage}%</span>
            </div>
        </div>
    );
};

export const Stepper = ({ value, onChange, min = 0, max, className = "" }) => {
    const numValue = Number(value) || 0;

    const handleIncrement = () => {
        const next = numValue + 1;
        if (max !== undefined && next > max) return;
        onChange(next);
    };

    const handleDecrement = () => {
        const next = Math.max(min, numValue - 1);
        onChange(next);
    };

    return (
        <div className={`flex items-center bg-[rgba(0,0,0,0.03)] rounded-md p-0 h-7 box-border overflow-hidden border border-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.05)] dark:border-[rgba(255,255,255,0.15)] pr-0 shrink-0 ${className}`}>
            <input
                type="number"
                className="w-8 border-none bg-transparent text-center text-[var(--text-primary)] text-sm font-semibold outline-none px-1 appearance-[textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                max={max}
            />
            <div className="flex flex-col border-l border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.1)] gap-px dark:border-[rgba(255,255,255,0.15)] dark:bg-[rgba(255,255,255,0.15)] shrink-0">
                <button type="button" className="bg-surface-light border-none text-primary w-5 h-[13.5px] flex items-center justify-center cursor-pointer text-[8px] transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)] dark:bg-[#1c1c1e] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={handleIncrement}>
                    {ICONS.chevronUp}
                </button>
                <button type="button" className="bg-surface-light border-none text-primary w-5 h-[13.5px] flex items-center justify-center cursor-pointer text-[8px] transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)] dark:bg-[#1c1c1e] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={handleDecrement}>
                    {ICONS.chevronDown}
                </button>
            </div>
        </div>
    );
};

export const GoalStepper = ({ value, onUpdate, min = 0, field }) => {
    return (
        <Stepper
            value={value}
            onChange={(val) => onUpdate(field, val)}
            min={min}
        />
    );
};
