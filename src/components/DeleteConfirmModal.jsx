import React, { useState } from 'react';
import { Button } from './Button';

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    const [dontAskAgain, setDontAskAgain] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (dontAskAgain) {
            localStorage.setItem('skipDeleteConfirm', 'true');
        }
        onConfirm();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-[2px] animate-fade-in" onClick={onCancel}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-light backdrop-blur-[25px] saturate-200 border border-[rgba(0,0,0,0.1)] rounded-2xl shadow-lg z-[1001] w-[90%] max-w-[400px] p-6 animate-modal-slide dark:bg-[#1c1c1eb3] dark:border-[rgba(255,255,255,0.15)]">
                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">¿Estás seguro?</h3>
                <p className="text-[15px] leading-[1.5] text-[var(--text-secondary)] mb-6">
                    ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
                </p>

                <label className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)] cursor-pointer mb-6 select-none">
                    <input
                        type="checkbox"
                        checked={dontAskAgain}
                        onChange={(e) => setDontAskAgain(e.target.checked)}
                    />
                    <span>No volver a preguntar</span>
                </label>

                <div className="flex justify-end gap-3">
                    <button className="bg-[rgba(0,0,0,0.05)] text-[var(--text-primary)] border-none py-2.5 px-4 rounded-xl cursor-pointer font-semibold text-[15px] transition-all hover:bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.15)]" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="bg-danger text-white border-none py-2.5 px-4 rounded-xl cursor-pointer font-semibold text-[15px] transition-all hover:brightness-110 hover:shadow-[0_4px_12px_rgba(255,59,48,0.3)]" onClick={handleConfirm}>
                        Eliminar
                    </button>
                </div>
            </div>
        </>
    );
};

export default DeleteConfirmModal;
