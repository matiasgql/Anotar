import React, { useState, useEffect, useCallback } from 'react';
import { taskStore } from '../lib/taskStore';
import { login, logout, handleAuthCallback, isAuthenticated } from '../lib/auth';
import TaskRow from './TaskRow';
import { ICONS } from './TaskUI';
import { Button } from './Button';
import DeleteConfirmModal from './DeleteConfirmModal';

const TaskApp = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });

    useEffect(() => {
        const initAuth = async () => {
            // Check for callback (redirect from AWS)
            const tokenFromUrl = handleAuthCallback();
            let currentLoginStatus = false;

            if (tokenFromUrl) {
                currentLoginStatus = true;
                setIsLoggedIn(true);
            } else {
                currentLoginStatus = isAuthenticated();
                setIsLoggedIn(currentLoginStatus);
            }

            // If logged in, load tasks from API
            if (currentLoginStatus) {
                try {
                    await taskStore.load();
                    taskStore.startAutosave();
                } catch (e) {
                    if (e.message?.includes('401') || e.message?.toLowerCase().includes('expired')) {
                        console.warn('Sesión expirada, cerrando sesión...');
                        logout();
                    } else {
                        setError('Error al conectar con la base de datos (revisa CORS o el Authorizer)');
                        console.error(e);
                    }
                }
            }
        };

        initAuth();

        const unsubscribe = taskStore.subscribe((newTasks, status) => {
            setTasks(newTasks);
            if (status) setSaving(status.isSyncing);
        });
        return unsubscribe;
    }, []);

    const handleUpdate = useCallback((id, field, value) => {
        taskStore.setTask(id, field, value);
    }, []);

    const handleDelete = useCallback((id) => {
        const skipConfirm = localStorage.getItem('skipDeleteConfirm') === 'true';

        if (skipConfirm) {
            taskStore.deleteTask(id);
        } else {
            setDeleteModal({ isOpen: true, taskId: id });
        }
    }, []);

    const confirmDelete = () => {
        if (deleteModal.taskId) {
            taskStore.deleteTask(deleteModal.taskId);
        }
        setDeleteModal({ isOpen: false, taskId: null });
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, taskId: null });
    };

    const handleAdd = () => {
        taskStore.addTask();
    };

    if (error) {
        return (
            <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#ff453a' }}>❌ {error}</p>
                <Button variant="secondary" onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
                <h1 className="title" style={{ fontSize: '3rem' }}>Anotar</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Organiza tus tareas. Sin complicaciones.</p>
                <Button variant="primary" size="lg" onClick={login}>
                    Iniciar Sesión con AWS
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto py-[60px] px-10 max-md:p-4 max-md:w-full max-md:max-w-[100vw] max-md:overflow-x-hidden">
            <header className="flex justify-between items-end mb-10 max-md:flex-col max-md:items-center max-md:gap-4 max-md:mb-8 max-md:w-full">
                <div className="flex items-center gap-[15px] max-md:justify-center max-md:w-full">
                    <Button variant="danger" onClick={logout} className="max-md:py-2 max-md:px-4 max-md:text-sm">
                        {ICONS.logout}
                        Cerrar Sesión
                    </Button>
                    {saving && <span className="text-[var(--text-secondary)] text-[0.8rem] flex items-center gap-[5px]">
                        <span className="w-2 h-2 bg-[#34c759] rounded-full inline-block animate-[pulse_1.5s_infinite]"></span>
                        Guardando...
                    </span>}
                </div>
                <Button id="btn-new-task" variant="primary" size="lg" onClick={handleAdd} className="max-md:w-full max-md:justify-center max-md:p-3.5 max-md:text-base max-md:rounded-2xl">
                    {ICONS.plus} <span className="text-[22px] font-normal max-md:text-[18px]">Nueva Tarea</span>
                </Button>
            </header>

            <div className="bg-surface-light backdrop-blur-[25px] saturate-200 rounded-[24px] border border-[rgba(0,0,0,0.1)] shadow-md overflow-visible relative z-10 dark:bg-[#1c1c1eb3] dark:border-[rgba(255,255,255,0.15)]">
                <table className="w-full max-w-full border-collapse text-[17px] table-fixed">
                    <thead>
                        <tr>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[30%]">Tarea</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[100px]">Creada</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[120px]">Fecha de vencimiento</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[100px]">Prioridad</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[140px]">Progreso</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[180px]">Meta</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)]">Descripción</th>
                            <th className="text-center font-semibold text-[var(--text-secondary)] border-b border-[rgba(0,0,0,0.1)] p-[12px_14px] text-[11px] uppercase tracking-[0.5px] bg-[rgba(0,0,0,0.02)] dark:border-[rgba(255,255,255,0.15)] w-[60px] max-md:hidden"></th>
                        </tr>
                    </thead>
                    <tbody id="tasks-body" className="[&>tr:last-child>td]:border-b-0">
                        {tasks.map(task => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default TaskApp;
