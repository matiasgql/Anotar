import React, { useState, useRef, useEffect } from 'react';
import { ICONS, Stepper } from './TaskUI';
import { Button } from './Button';

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
            cells.push(<div key={`empty-${i}`} className="aspect-square" />);
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
                    className={`aspect-square flex items-center justify-center text-xs rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.08)] ${isSelected ? 'bg-primary text-white font-semibold' : ''} ${isToday ? 'text-primary font-bold shadow-[inset_0_0_0_1px_var(--color-primary)]' : ''}`}
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
        <div className="relative inline-block w-full" ref={dropdownRef}>
            {value ? (
                <div
                    className="w-full cursor-pointer p-[6px_8px] rounded-lg bg-[rgba(0,0,0,0.04)] border border-transparent text-[13px] text-[var(--text-primary)] text-center transition-all duration-200 box-border whitespace-nowrap overflow-hidden text-ellipsis hover:bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)] flex items-center justify-center group relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{formatDisplay(value)}</span>
                    <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 absolute right-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdate(null);
                        }}
                    >
                        {ICONS.x}
                    </button>
                </div>
            ) : (
                <div className="flex items-center w-full justify-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-7 hover:!bg-primary hover:!text-white"
                        title="Añadir Fecha de Vencimiento"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {ICONS.plus}
                    </Button>
                </div>
            )}

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[999]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 translate-y-2 bg-surface-light border border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-md z-[1001] w-[280px] p-4 backdrop-blur-[25px] saturate-200 animate-dropdown-fade box-border dark:bg-[#1c1c1eb3] dark:border-[rgba(255,255,255,0.15)]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-3">
                            <button className="bg-transparent border-none text-primary cursor-pointer p-1 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={handlePrevMonth}>
                                {ICONS.chevronDown && <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>{ICONS.chevronDown}</span>}
                            </button>
                            <span className="font-bold text-sm">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                            <button className="bg-transparent border-none text-primary cursor-pointer p-1 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={handleNextMonth}>
                                {ICONS.chevronUp && <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>{ICONS.chevronUp}</span>}
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {DAYS.map(d => <div key={d} className="text-[10px] font-bold text-[var(--text-secondary)] text-center py-1">{d}</div>)}
                            {renderCalendar()}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.15)]">
                            <span className="text-[13px] font-semibold">Hora</span>
                            <div className="flex items-center gap-2">
                                <Stepper
                                    value={currentDate ? currentDate.getHours() : 0}
                                    onChange={(val) => handleTimeChange('hour', val)}
                                    min={0}
                                    max={23}
                                />
                                <span className="font-bold text-[var(--text-secondary)] text-lg">:</span>
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
