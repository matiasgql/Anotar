import React, { memo } from 'react';
import { ProgressBar, GoalStepper, ICONS } from './TaskUI';
import { Button } from './Button';
import PriorityDropdown from './PriorityDropdown';
import DateTimePicker from './DateTimePicker';

const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const TaskRow = memo(({ task, onUpdate, onDelete }) => {
    const isGoalMode = task.goal !== null && task.goal !== 0;

    return (
        <tr className="animate-slide-in">
            <td data-label="Tarea" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                <div className="flex items-center gap-2 max-md:w-full">
                    <div className="w-full">
                        <input
                            type="text"
                            className="w-full border-none bg-transparent text-[var(--text-primary)] font-sans text-[15px] p-[6px_4px] rounded-md transition-colors duration-200 focus:bg-[rgba(0,0,0,0.03)] focus:outline-none dark:focus:bg-[rgba(255,255,255,0.05)]"
                            value={task.name}
                            placeholder="Nombre de la tarea..."
                            onChange={(e) => onUpdate(task.id, 'name', e.target.value)}
                        />
                    </div>
                    <Button
                        variant="danger"
                        size="icon"
                        className="hidden max-md:flex"
                        title="Delete task"
                        onClick={() => onDelete(task.id)}
                    >
                        {ICONS.trash}
                    </Button>
                </div>
            </td>
            <td data-label="Creada" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)] text-[13px] text-[var(--text-secondary)] text-center">
                {formatDate(task.createdAt)}
            </td>
            <td data-label="Vencimiento" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                <DateTimePicker
                    value={task.dueDate}
                    onUpdate={(newVal) => onUpdate(task.id, 'dueDate', newVal)}
                />
            </td>
            <td data-label="Prioridad" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                <PriorityDropdown
                    value={task.priority}
                    onUpdate={(newPriority) => onUpdate(task.id, 'priority', newPriority)}
                />
            </td>
            <td data-label="Progreso" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                {!isGoalMode ? (
                    <div className="flex items-center w-full h-[26px]">
                        <Button
                            variant="secondary"
                            size="sm"
                            className={`w-full !text-[10px] !font-extrabold !tracking-wider !uppercase !h-[24px] !rounded-full ${task.progress >= 100 ? '!bg-[hsl(138,56%,35%)] !text-white hover:!bg-[hsl(138,56%,30%)] hover:brightness-110 shadow-sm' : '!bg-[rgba(60,60,67,0.12)] !text-[var(--text-secondary)] hover:!bg-[rgba(60,60,67,0.18)] hover:!text-[var(--text-primary)] dark:!bg-[rgba(255,255,255,0.12)] dark:hover:!bg-[rgba(255,255,255,0.18)]'}`}
                            onClick={() => onUpdate(task.id, 'progress', task.progress >= 100 ? 0 : 100)}
                        >
                            {task.progress >= 100 ? 'COMPLETO' : 'INCOMPLETO'}
                        </Button>
                    </div>
                ) : (
                    <ProgressBar progress={task.progress} goal={task.goal} />
                )}
            </td>
            <td data-label="Meta" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                {!isGoalMode ? (
                    <div className="flex items-center w-full justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-7 hover:!bg-primary hover:!text-white"
                            title="Añadir Meta"
                            onClick={() => onUpdate(task.id, 'goal', 10)}
                        >
                            {ICONS.plus}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                        <GoalStepper
                            value={task.progress}
                            field="progress"
                            onUpdate={(f, v) => onUpdate(task.id, f, v)}
                        />
                        <span>/</span>
                        <GoalStepper
                            value={task.goal}
                            field="goal"
                            min={1}
                            onUpdate={(f, v) => onUpdate(task.id, f, v)}
                        />
                        <Button variant="secondary" size="icon" className="w-7 h-7 hover:scale-110 shrink-0" title="Remove goal" onClick={() => onUpdate(task.id, 'goal', null)}>
                            {ICONS.x}
                        </Button>
                    </div>
                )}
            </td>

            <td data-label="Descripción" className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)]">
                <div className="w-full">
                    <input
                        type="text"
                        className="w-full border-none bg-transparent text-[var(--text-primary)] font-sans text-[15px] p-[6px_4px] rounded-md transition-colors duration-200 focus:bg-[rgba(0,0,0,0.03)] focus:outline-none dark:focus:bg-[rgba(255,255,255,0.05)]"
                        value={task.description}
                        placeholder="Descripción"
                        onChange={(e) => onUpdate(task.id, 'description', e.target.value)}
                    />
                </div>
            </td>
            <td className="border-b border-[rgba(0,0,0,0.1)] p-[10px_14px] align-middle relative dark:border-[rgba(255,255,255,0.15)] max-md:hidden md:table-cell">
                <Button variant="danger" size="icon" className="w-7 h-7 hover:scale-110" title="Delete task" onClick={() => onDelete(task.id)}>
                    {ICONS.trash}
                </Button>
            </td>
        </tr >
    );
});

export default TaskRow;
