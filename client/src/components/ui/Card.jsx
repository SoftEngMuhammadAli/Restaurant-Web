import { cn } from '../../utils/cn.js';

export const Card = ({ className, ...props }) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => <div className={cn('p-5 pb-2', className)} {...props} />;
export const CardTitle = ({ className, ...props }) => <h3 className={cn('text-base font-semibold', className)} {...props} />;
export const CardContent = ({ className, ...props }) => <div className={cn('p-5', className)} {...props} />;
