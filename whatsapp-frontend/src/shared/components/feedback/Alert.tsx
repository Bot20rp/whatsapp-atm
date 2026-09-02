import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const styles = {
    info: {
      bg: 'bg-slate-50 border-slate-300 text-slate-700',
      icon: <Info className="w-4 h-4 text-slate-600 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-800',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div className={`flex items-center justify-between p-3 border rounded-md text-xs ${current.bg}`}>
      <div className="flex items-center gap-2">
        {current.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm leading-none ml-2">
          &times;
        </button>
      )}
    </div>
  );
};

