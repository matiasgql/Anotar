import React, { memo } from 'react';
import { ProgressBar, GoalStepper, ICONS } from './TaskUI';
import PriorityDropdown from './PriorityDropdown';
import DateTimePicker from './DateTimePicker';

const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const TaskRow = memo(({ task, onUpdate, onDelete }) => {
    const isGoalMode = task.goal !== null && task.goal !== 0;

    return (
        <tr className="task-row">
            <td data-label="Tarea">
                <input
                    type="text"
                    className="cell-input"
                    value={task.name}
                    placeholder="Nombre de la tarea..."
                    onChange={(e) => onUpdate(task.id, 'name', e.target.value)}
                />
            </td>
            <td data-label="Creada" className="cell-date">
                {formatDate(task.createdAt)}
            </td>
            <td data-label="Vencimiento">
                <DateTimePicker
                    value={task.dueDate}
                    onUpdate={(newVal) => onUpdate(task.id, 'dueDate', newVal)}
                />
            </td>
            <td data-label="Prioridad">
                <PriorityDropdown
                    value={task.priority}
                    onUpdate={(newPriority) => onUpdate(task.id, 'priority', newPriority)}
                />
            </td>
            <td data-label="Progreso" className="progress-cell">
                {!isGoalMode ? (
                    <div className="progress-wrapper">
                        <button
                            className={`status-pill ${task.progress >= 100 ? 'completed' : 'incomplete'}`}
                            onClick={() => onUpdate(task.id, 'progress', task.progress >= 100 ? 0 : 100)}
                        >
                            {task.progress >= 100 ? 'COMPLETO' : 'INCOMPLETO'}
                        </button>
                    </div>
                ) : (
                    <ProgressBar progress={task.progress} goal={task.goal} />
                )}
            </td>
            <td data-label="Meta" className="goal-cell">
                {!isGoalMode ? (
                    <div className="goal-cell-content">
                        <button className="ghost-btn" onClick={() => onUpdate(task.id, 'goal', 10)}>Añadir Meta</button>
                    </div>
                ) : (
                    <div className="goal-container">
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
                        <button className="icon-btn-tiny" title="Remove goal" onClick={() => onUpdate(task.id, 'goal', null)}>
                            {ICONS.x}
                        </button>
                    </div>
                )}
            </td>
            <td data-label="Descripción">
                <input
                    type="text"
                    className="cell-input"
                    value={task.description}
                    placeholder="Descripción"
                    onChange={(e) => onUpdate(task.id, 'description', e.target.value)}
                />
            </td>
            <td className="actions-cell">
                <button className="icon-btn-tiny delete" title="Delete task" onClick={() => onDelete(task.id)}>
                    {ICONS.trash}
                </button>
            </td>
        </tr>
    );
});

export default TaskRow;
