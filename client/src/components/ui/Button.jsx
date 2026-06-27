import { cn } from '../../utils/cn.js';

const styles = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  accent: 'bg-accent text-accent-foreground hover:opacity-90',
  outline: 'border bg-transparent hover:bg-muted',
  ghost: 'hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
};

export const Button = ({ className, variant = 'default', size = 'md', ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      size === 'sm' ? 'h-8 px-3 text-xs' : size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 text-sm',
      styles[variant],
      className,
    )}
    {...props}
  />
);
