import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-xl max-w-md mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#008069] mb-4 shadow-xs">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="text-sm font-black text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed font-medium">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-sm bg-[#008069] hover:bg-[#006654] text-white text-xs border-none font-bold px-4 shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
