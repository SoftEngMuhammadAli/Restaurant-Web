import { cn } from '../../utils/cn.js';

const colors = {
  green: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  red: 'bg-red-500/15 text-red-700 dark:text-red-300',
  blue: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  orange: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
};

export const Badge = ({ color = 'orange', className, ...props }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', colors[color], className)} {...props} />
);
