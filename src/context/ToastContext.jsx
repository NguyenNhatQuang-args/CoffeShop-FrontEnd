import { createContext, useState, useCallback, useEffect } from 'react';

export const ToastContext = createContext(null);

let toastId = 0;

// --- Global toast (callable outside React, e.g. axios interceptors) ---
let _addToast = null;
let _dismissToast = null;

export const globalToast = {
  info: (msg, opts) => _addToast?.(msg, 'info', opts?.autoClose ?? 3000),
  success: (msg) => _addToast?.(msg, 'success', 3000),
  error: (msg) => _addToast?.(msg, 'error', 3000),
  dismiss: (id) => _dismissToast?.(id),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration !== false) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  // Expose to module-level so non-React code can call toast
  useEffect(() => {
    _addToast = addToast;
    _dismissToast = dismissToast;
    return () => { _addToast = null; _dismissToast = null; };
  }, [addToast, dismissToast]);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded shadow-lg text-sm font-medium animate-slide-in ${
              t.type === 'success'
                ? 'bg-green-600 text-white'
                : t.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-primary text-bg'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
