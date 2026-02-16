import React, { useState, useRef, useEffect } from 'react';
import { ICONS, Stepper } from './TaskUI';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const DateTimePicker = ({ value, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Initialize viewDate only on the client to avoid SSR mismatch
        if (!viewDate) {
            setViewDate(new Date(value || new Date()));
        }
    }, [value]);

    if (!viewDate && typeof window === 'undefined') {
        // Return a predictable placeholder for SSR
        return <div className="datetime-container"><div className="datetime-display">Cargando...</div></div>;
    }

    const currentDate = value ? new Date(value) : null;

    // Helper to get days in month
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const newDate = new Date(currentDate || new Date());
        newDate.setFullYear(viewDate.getFullYear());
        newDate.setMonth(viewDate.getMonth());
        newDate.setDate(day);
        onUpdate(newDate.toISOString());
    };

    const handleTimeChange = (field, val) => {
        const newDate = new Date(currentDate || new Date());
        const numVal = parseInt(val, 10) || 0;
        if (field === 'hour') newDate.setHours(Math.min(23, Math.max(0, numVal)));
        if (field === 'minute') newDate.setMinutes(Math.min(59, Math.max(0, numVal)));
        onUpdate(newDate.toISOString());
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();

        const cells = [];
        // Empty cells for first week
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = currentDate &&
                currentDate.getDate() === day &&
                currentDate.getMonth() === month &&
                currentDate.getFullYear() === year;
            const isToday = today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;

            cells.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }
        return cells;
    };

    const formatDisplay = (iso) => {
        if (!iso) return 'Sin fecha';
        const d = new Date(iso);
        return d.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="datetime-container" ref={dropdownRef}>
            <div className="datetime-display" onClick={() => setIsOpen(!isOpen)}>
                {formatDisplay(value)}
            </div>

            {isOpen && (
                <>
                    <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
                    <div className="datetime-picker-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="calendar-header">
                            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                                {ICONS.chevronDown && <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>{ICONS.chevronDown}</span>}
                            </button>
                            <span>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                            <button className="calendar-nav-btn" onClick={handleNextMonth}>
                                {ICONS.chevronUp && <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>{ICONS.chevronUp}</span>}
                            </button>
                        </div>

                        <div className="calendar-grid">
                            {DAYS.map(d => <div key={d} className="calendar-day-head">{d}</div>)}
                            {renderCalendar()}
                        </div>

                        <div className="time-picker-section">
                            <span>Hora</span>
                            <div className="time-inputs">
                                <Stepper
                                    value={currentDate ? currentDate.getHours() : 0}
                                    onChange={(val) => handleTimeChange('hour', val)}
                                    min={0}
                                    max={23}
                                />
                                <span className="time-separator">:</span>
                                <Stepper
                                    value={currentDate ? currentDate.getMinutes() : 0}
                                    onChange={(val) => handleTimeChange('minute', val)}
                                    min={0}
                                    max={59}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DateTimePicker;
