import React, { useState, useRef, useEffect } from 'react';

const PRIORITIES = [
    { id: 'low', label: 'Baja', className: 'bg-[hsla(138,56%,49%,0.12)] text-[hsl(138,56%,35%)] dark:text-[#32d74b]' },
    { id: 'medium', label: 'Media', className: 'bg-[hsla(35,100%,50%,0.12)] text-[hsl(35,100%,35%)] dark:text-[#ffd60a]' },
    { id: 'high', label: 'Alta', className: 'bg-[hsla(2,100%,60%,0.12)] text-[hsl(2,100%,40%)] dark:text-[#ff453a]' },
    { id: 'urgent', label: 'Urgente', className: 'bg-[hsla(280,68%,60%,0.12)] text-[hsl(280,68%,45%)] dark:text-[#bf5af2]' }
];

const PriorityDropdown = ({ value, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentPriority = PRIORITIES.find(p => p.id === value) || PRIORITIES[1];

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (priorityId) => {
        onUpdate(priorityId);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block w-full" ref={dropdownRef}>
            <button
                type="button"
                className={`appearance-none border-none rounded-[13px] px-2.5 py-1 text-[13px] cursor-pointer font-medium outline-none w-full text-center h-[26px] box-border transition-opacity duration-200 hover:opacity-80 ${currentPriority.className}`}
                onClick={handleToggle}
            >
                {currentPriority.label}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[999]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 bg-surface-light border border-[rgba(0,0,0,0.1)] rounded-xl shadow-md z-[1000] min-w-[140px] p-1.5 flex flex-col gap-1 backdrop-blur-[25px] saturate-200 animate-dropdown-fade dark:bg-[#1c1c1eb3] dark:border-[rgba(255,255,255,0.15)]">
                        {PRIORITIES.map((priority) => (
                            <div
                                key={priority.id}
                                className={`p-[8px_12px] rounded-lg cursor-pointer text-[13px] font-medium flex items-center gap-2 transition-colors duration-200 text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.08)] ${priority.id === value ? 'bg-primary text-white !hover:bg-primary' : ''}`}
                                onClick={() => handleSelect(priority.id)}
                            >
                                <span className={`inline-block w-3 h-3 rounded-full shrink-0 ${priority.className}`} />
                                {priority.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PriorityDropdown;
