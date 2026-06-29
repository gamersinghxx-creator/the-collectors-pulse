// Instant skeleton while the newsroom feed streams in.
export default function NewsLoading() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skel" style={{ width: '320px', height: '20px' }} />
            <div className="skel" style={{ width: '80%', height: '64px' }} />
            <div className="skel" style={{ width: '60%', height: '64px' }} />
            <div className="skel" style={{ width: '70%', height: '40px', marginTop: '10px' }} />
          </div>
          <div className="skel" style={{ height: '420px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '24px', paddingBottom: '64px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    </main>
  );
}
