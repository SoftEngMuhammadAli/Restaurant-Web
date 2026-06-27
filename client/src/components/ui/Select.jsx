import { cn } from '../../utils/cn.js';

export const Select = ({ label, error, options = [], className, ...props }) => (
  <label className="grid gap-1.5 text-sm font-medium">
    {label ? <span>{label}</span> : null}
    <select className={cn('h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring', className)} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error ? <span className="text-xs text-destructive">{error}</span> : null}
  </label>
);
