import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ title = 'Nothing here yet', description = 'Create your first record to get started.' }) => (
  <div className="grid place-items-center rounded-lg border border-dashed bg-card p-10 text-center">
    <PackageOpen className="mb-3 h-8 w-8 text-muted-foreground" />
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
  </div>
);
