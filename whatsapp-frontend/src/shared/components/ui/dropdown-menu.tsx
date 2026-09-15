import * as React from 'react';
import { cn } from '../../utils/cn';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  className,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl text-slate-100 animate-in fade-in-0 zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  className,
  children,
  active,
  ...props
}) => (
  <div
    className={cn(
      'flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white',
      active && 'bg-emerald-600/20 text-emerald-400 font-semibold',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSeparator = () => (
  <div className="-mx-1 my-1.5 h-px bg-slate-800" />
);

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator };
