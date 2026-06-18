import { cn } from '../../utils/cn.js';

export const Table = ({ className, ...props }) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full min-w-[720px] text-left text-sm', className)} {...props} />
  </div>
);

export const Th = (props) => <th className="border-b px-4 py-3 text-xs font-semibold uppercase text-muted-foreground" {...props} />;
export const Td = (props) => <td className="border-b px-4 py-3 align-middle" {...props} />;
