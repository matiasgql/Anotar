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
        <div className="progress-wrapper">
            <div className="progress-bar-bg">
                <div
                    className={`progress-bar-fill ${isAchieved ? 'achieved' : ''}`}
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="progress-text">{percentage}%</span>
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
        <div className={`stepper-group vertical ${className}`}>
            <input
                type="number"
                className="goal-input"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                max={max}
            />
            <div className="stepper-controls">
                <button type="button" className="step-btn" onClick={handleIncrement}>
                    {ICONS.chevronUp}
                </button>
                <button type="button" className="step-btn" onClick={handleDecrement}>
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
