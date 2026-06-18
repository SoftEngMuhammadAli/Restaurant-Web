import { cn } from '../../utils/cn.js';

export const Input = ({ className, label, error, ...props }) => (
  <label className="grid gap-1.5 text-sm font-medium">
    {label ? <span>{label}</span> : null}
    <input
      className={cn(
        'h-10 rounded-md border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring',
        error && 'border-destructive focus:ring-destructive',
        className,
      )}
      {...props}
    />
    {error ? <span className="text-xs text-destructive">{error}</span> : null}
  </label>
);
