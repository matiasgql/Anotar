import { getAuthToken } from './auth';

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} name
 * @property {string} createdAt
 * @property {string|null} dueDate
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {number} progress
 * @property {number|null} goal
 * @property {string} description
 */

const API_URL = import.meta.env.PUBLIC_API_ENDPOINT;

export class TaskStore {
    constructor() {
        this.listeners = new Set();
        this.tasks = [];
        this.syncInterval = null;
        this.isSyncing = false;
        this.hasPendingChanges = false;
    }

    startAutosave() {
        if (this.syncInterval) return;
        this.syncInterval = setInterval(() => {
            if (this.hasPendingChanges && !this.isSyncing) {
                this.syncAllDirtyTasks();
            }
        }, 5000);
    }

    async load() {
        const token = getAuthToken();
        if (!token) {
            console.warn('No se encontraron tareas: Usuario no autenticado (falta token).');
            return [];
        }

        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Error en GET /tasks (Status ${response.status}):`, errorData);
                throw new Error(errorData.message || `Status ${response.status}`);
            }

            const data = await response.json();
            console.log('Tareas cargadas exitosamente:', data);

            let rawItems = data.Items || (Array.isArray(data) ? data : []);

            const unmarshal = (item) => {
                const result = {};
                for (const key in item) {
                    const val = item[key];
                    if (val && typeof val === 'object') {
                        if ('S' in val) result[key] = val.S;
                        else if ('N' in val) result[key] = Number(val.N);
                        else if ('BOOL' in val) result[key] = val.BOOL;
                        else result[key] = val;
                    } else {
                        result[key] = val;
                    }
                }
                return result;
            };

            this.tasks = rawItems.map(unmarshal);
            this.notify();
            return this.tasks;
        } catch (error) {
            console.error('Error load:', error);
            throw error;
        }
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(l => l([...this.tasks], { isSyncing: this.isSyncing, hasPendingChanges: this.hasPendingChanges }));
    }

    async syncTask(task) {
        const token = getAuthToken();
        if (!token) return;

        try {
            const payload = {
                id: String(task.id),
                name: String(task.name || ''),
                createdAt: String(task.createdAt || new Date().toISOString()),
                priority: String(task.priority || 'medium'),
                progress: String(Number(task.progress) || 0),
                description: String(task.description || ''),
                goal: String(Number(task.goal) || 0)
            };

            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error al guardar tarea:', errorData);
                throw new Error(errorData.message || `Save status ${response.status}`);
            }
        } catch (e) {
            console.error('Error de red al guardar:', e);
        }
    }

    async syncAllDirtyTasks() {
        if (this.isSyncing) return;
        this.isSyncing = true;
        this.notify();

        try {
            for (const task of this.tasks) {
                await this.syncTask({
                    ...task,
                    progress: Number(task.progress) || 0,
                    goal: Number(task.goal) || 0
                });
            }
            this.hasPendingChanges = false;
        } finally {
            this.isSyncing = false;
            this.notify();
        }
    }

    async addTask() {
        const newTask = {
            id: crypto.randomUUID(),
            name: '',
            createdAt: new Date().toISOString(),
            dueDate: null,
            priority: 'medium',
            progress: 0,
            goal: 0,
            description: ''
        };
        this.tasks.push(newTask);
        this.hasPendingChanges = true;
        this.notify();

        // Sincronizar creación inmediatamente
        await this.syncTask(newTask);
        return newTask;
    }

    async setTask(id, field, value) {
        const idx = this.tasks.findIndex(t => t.id === id);
        if (idx === -1) return;

        // Actualizar localmente
        const updatedTask = { ...this.tasks[idx], [field]: value };

        // Asegurar tipos numéricos para DynamoDB
        if (field === 'progress') updatedTask.progress = Number(value) || 0;
        if (field === 'goal') updatedTask.goal = value === null ? 0 : (Number(value) || 0);

        this.tasks[idx] = updatedTask;
        this.hasPendingChanges = true;
        this.notify();

        // Enviar a la API
        await this.syncTask(updatedTask);
    }

    async deleteTask(id) {
        const token = getAuthToken();
        if (!token) return;

        // Actualizar localmente primero
        const originalTasks = [...this.tasks];
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.notify();

        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Error al eliminar (Status ${response.status}):`, errorData);

                if (response.status === 401 || errorData.message?.toLowerCase().includes('expired')) {
                    const { logout } = await import('./auth');
                    logout();
                } else {
                    // Si falla por otra cosa, revertimos el cambio local
                    this.tasks = originalTasks;
                    this.notify();
                    alert('No se pudo eliminar la tarea de la base de datos.');
                }
            }
        } catch (e) {
            console.error('Error de red al eliminar:', e);
            this.tasks = originalTasks;
            this.notify();
        }
    }
}

export const taskStore = new TaskStore();
