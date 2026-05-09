'use client';

interface FilterTabsProps {
  active: string;
  filters: { key: string; label: string }[];
  onChange: (key: string) => void;
}

export function FilterTabs({ active, filters, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-250 cursor-pointer whitespace-nowrap"
          style={
            active === key
              ? {
                  background: 'linear-gradient(135deg, #ff6b2c 0%, #ffb347 100%)',
                  color: '#fff',
                  border: '1px solid transparent',
                  boxShadow: '0 2px 16px rgba(255,107,44,0.3)',
                }
              : {
                  background: 'transparent',
                  color: '#8e8ea8',
                  border: '1px solid #1e1e2e',
                }
          }
          onMouseEnter={(e) => {
            if (active !== key)
              (e.currentTarget as HTMLButtonElement).style.color = '#f0f0ee';
          }}
          onMouseLeave={(e) => {
            if (active !== key)
              (e.currentTarget as HTMLButtonElement).style.color = '#8e8ea8';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
