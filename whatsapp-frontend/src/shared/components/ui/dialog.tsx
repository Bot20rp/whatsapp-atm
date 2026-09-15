import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-200',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>

        {(title || description) && (
          <div className="mb-4 space-y-1">
            {title && <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export { Dialog };
