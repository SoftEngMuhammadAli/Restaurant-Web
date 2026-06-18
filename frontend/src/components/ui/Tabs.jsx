import { cn } from '../../utils/cn.js';

export const Tabs = ({ items, value, onChange }) => (
  <div className="inline-flex rounded-md border bg-muted p-1">
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        onClick={() => onChange(item.value)}
        className={cn(
          'h-8 rounded px-3 text-sm font-medium text-muted-foreground transition',
          value === item.value && 'bg-background text-foreground shadow-sm',
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);
