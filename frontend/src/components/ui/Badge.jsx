import { cn } from '../../utils/cn.js';

const colors = {
  green: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  red: 'bg-red-500/12 text-red-700 dark:text-red-300',
  blue: 'bg-sky-500/12 text-sky-700 dark:text-sky-300',
  gray: 'bg-muted text-muted-foreground',
};

export const Badge = ({ color = 'gray', className, ...props }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', colors[color], className)} {...props} />
);
