import React from 'react';

interface Props {
  images: string[];                 // 1 image = full cover; 2 images = left/right split
  accent?: string;                  // glow color
  behind?: boolean;                 // z-index -1 (behind normal content) vs 0
  tone?: 'dark' | 'light';          // overlay strength/feel
}

/**
 * A fixed, "living" art background: slow ken-burns drift, breathing
 * saturation, and a pulsing energy glow, with layered overlays.
 * tone="dark" → cinematic (vivid top, readable dark body).
 * tone="light" → airy paper veil that keeps the art bright.
 */
export default function LivingBackground({ images, accent = 'rgba(216,182,90,0.20)', behind = true, tone = 'dark' }: Props) {
  const two = images.length >= 2;

  const overlays = tone === 'light' ? (
    <>
      <div className="poke-pulse" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 52% 42% at 28% 28%, ${accent}, transparent 62%), radial-gradient(ellipse 46% 40% at 76% 64%, ${accent}, transparent 64%)` }} />
      {/* gentle uniform richness so the art reads a little deeper, not washed out */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,7,13,0.22)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(245,241,233,0.03) 0%, rgba(245,241,233,0.08) 44%, rgba(245,241,233,0.42) 74%, rgba(245,241,233,0.72) 90%, var(--obsidian) 100%)' }} />
    </>
  ) : (
    <>
      <div className="poke-pulse" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 40% at 28% 30%, ${accent}, transparent 60%), radial-gradient(ellipse 46% 40% at 76% 64%, ${accent}, transparent 62%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,7,13,0.14) 0%, rgba(7,7,13,0.50) 34%, rgba(7,7,13,0.56) 50%, rgba(7,7,13,0.50) 66%, rgba(7,7,13,0.14) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,13,0.22) 0%, rgba(7,7,13,0.24) 34%, rgba(7,7,13,0.72) 62%, rgba(7,7,13,0.88) 82%, var(--obsidian) 100%)' }} />
    </>
  );

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: behind ? -1 : 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {two ? (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', backgroundImage: `url(${images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns-left 22s ease-in-out infinite, poke-breathe 9s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundImage: `url(${images[1]})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns-right 26s ease-in-out infinite, poke-breathe 9s ease-in-out infinite 1.5s' }} />
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns-left 28s ease-in-out infinite, poke-breathe 10s ease-in-out infinite' }} />
      )}
      {overlays}
    </div>
  );
}
