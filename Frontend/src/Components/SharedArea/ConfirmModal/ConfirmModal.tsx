import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ConfirmModal.css";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger"
}: ConfirmModalProps) {

    useEffect(() => {
        if (!isOpen) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onCancel();
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return createPortal(
        <div className="ConfirmModal-overlay" onClick={onCancel}>
            <div className="ConfirmModal" onClick={(e) => e.stopPropagation()}>
                <div className={`ConfirmModal-header ${variant}`}>
                    <h3>{title}</h3>
                </div>

                <div className="ConfirmModal-body">
                    <p>{message}</p>
                </div>

                <div className="ConfirmModal-footer">
                    <button className="cancel-btn" onClick={onCancel}>{cancelText}</button>
                    <button className={`confirm-btn ${variant}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
