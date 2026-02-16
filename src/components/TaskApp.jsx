import React, { useState, useEffect, useCallback } from 'react';
import { taskStore } from '../lib/taskStore';
import { login, logout, handleAuthCallback, isAuthenticated } from '../lib/auth';
import TaskRow from './TaskRow';
import { ICONS } from './TaskUI';

const TaskApp = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

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

            setLoading(false);
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
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            taskStore.deleteTask(id);
        }
    }, []);

    const handleAdd = () => {
        taskStore.addTask();
    };

    if (loading) return <div className="loading-screen">Cargando...</div>;

    if (error) {
        return (
            <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#ff453a' }}>❌ {error}</p>
                <button className="btn-secondary" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
                <h1 className="title" style={{ fontSize: '3rem' }}>Anotar</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Organiza tus tareas. Sin complicaciones.</p>
                <button className="btn-new" onClick={login} style={{ fontSize: '1.2rem', padding: '12px 24px' }}>
                    Iniciar Sesión con AWS
                </button>
            </div>
        );
    }

    return (
        <div className="notion-container">
            <header className="header-actions">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="btn-logout" onClick={logout}>
                        {ICONS.logout}
                        Cerrar Sesión
                    </button>
                    {saving && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="saving-dot" style={{ width: '8px', height: '8px', background: '#34c759', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                        Guardando...
                    </span>}
                </div>
                <button id="btn-new-task" className="btn-new" onClick={handleAdd}>
                    {ICONS.plus} Nueva Tarea
                </button>
            </header>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Tarea</th>
                            <th style={{ width: '100px' }}>Creada</th>
                            <th style={{ width: '120px' }}>Fecha de vencimiento</th>
                            <th style={{ width: '100px' }}>Prioridad</th>
                            <th style={{ width: '140px' }}>Progreso</th>
                            <th style={{ width: '180px' }}>Meta</th>
                            <th style={{}}>Descripción</th>
                            <th style={{ width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody id="tasks-body">
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
        </div>
    );
};

export default TaskApp;
