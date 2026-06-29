// Instant skeleton shown while an article streams in — premium perceived speed.
export default function ArticleLoading() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--obsidian)', paddingBottom: 'var(--space-3xl)' }}>
      <div style={{ height: '56px' }} />
      <div className="max-w-4xl mx-auto" style={{ padding: 'var(--space-3xl) var(--space-xl) var(--space-2xl)' }}>
        <div className="skel" style={{ width: '90px', height: '20px', marginBottom: '24px' }} />
        <div className="skel" style={{ width: '95%', height: '54px', marginBottom: '14px' }} />
        <div className="skel" style={{ width: '70%', height: '54px', marginBottom: '28px' }} />
        <div className="skel" style={{ width: '240px', height: '16px' }} />
      </div>
      <div className="max-w-5xl mx-auto" style={{ padding: '0 var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        <div className="skel" style={{ width: '100%', aspectRatio: '21/9', borderRadius: 'var(--radius-xl)' }} />
      </div>
      <div className="mx-auto" style={{ maxWidth: '68ch', padding: '0 var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel" style={{ width: i % 3 === 2 ? '78%' : '100%', height: '18px' }} />
        ))}
      </div>
    </main>
  );
}
