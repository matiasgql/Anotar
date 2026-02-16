import React, { useState, useRef, useEffect } from 'react';

const PRIORITIES = [
    { id: 'low', label: 'Baja', className: 'tag-low' },
    { id: 'medium', label: 'Media', className: 'tag-medium' },
    { id: 'high', label: 'Alta', className: 'tag-high' },
    { id: 'urgent', label: 'Urgente', className: 'tag-urgent' }
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
        <div className="custom-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                className={`tag-select ${currentPriority.className}`}
                onClick={handleToggle}
            >
                {currentPriority.label}
            </button>

            {isOpen && (
                <>
                    <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
                    <div className="dropdown-menu">
                        {PRIORITIES.map((priority) => (
                            <div
                                key={priority.id}
                                className={`dropdown-item ${priority.id === value ? 'active' : ''}`}
                                onClick={() => handleSelect(priority.id)}
                            >
                                <span className={`priority-dot ${priority.className}`} />
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
