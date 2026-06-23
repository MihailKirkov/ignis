export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-14 w-14">
          <span
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--color-border)' }}
          />
          <span
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: '2px solid transparent',
              borderTopColor: 'var(--color-ignis)',
              borderRightColor: 'var(--color-ignis-glow)',
            }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 32px var(--color-ignis)', opacity: 0.35 }}
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-text-muted">
          Ignis
        </span>
      </div>
    </div>
  );
}
