import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const GENERATED_DIR = join(process.cwd(), 'public', 'generated');

// Ensure directory exists
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate a simple hash from a string to use for deterministic colors/patterns.
 */
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Generate a beautiful, modern, abstract SVG image for a collector article.
 */
export function generateFallbackSVG(
  title: string,
  category: string,
  slug: string
): string {
  const hash = getHash(slug);
  
  // Custom premium color palettes based on hash
  const palettes = [
    { primary: '#FF416C', secondary: '#FF4B2B', accent: '#FFD700', bg: '#120c1f' }, // Crimson Glow
    { primary: '#8A2387', secondary: '#E94057', accent: '#F27121', bg: '#100a1c' }, // Cosmic Sunset
    { primary: '#00B4DB', secondary: '#0083B0', accent: '#00FFCC', bg: '#061320' }, // Cyber Punk Teal
    { primary: '#11998e', secondary: '#38ef7d', accent: '#CCFF00', bg: '#081c15' }, // Emerald Matrix
    { primary: '#f12711', secondary: '#f5af19', accent: '#FF4500', bg: '#1c120c' }, // Golden Lava
    { primary: '#7F00FF', secondary: '#E100FF', accent: '#00FFFF', bg: '#0f051d' }, // Neon Violet
  ];
  
  const palette = palettes[hash % palettes.length];
  
  // Keyword detection for custom graphic overlays
  const lowerTitle = title.toLowerCase();
  let graphicElement = '';
  
  if (category.toLowerCase() === 'tcg' || lowerTitle.includes('card') || lowerTitle.includes('pokemon') || lowerTitle.includes('tcg')) {
    // TCG Theme: Floating holographic cards and stars
    graphicElement = `
      <!-- Holographic card silhouette -->
      <g transform="translate(400, 225) rotate(${(hash % 20) - 10})">
        <rect x="-85" y="-120" width="170" height="240" rx="12" fill="url(#cardGrad)" stroke="${palette.accent}" stroke-width="2.5" opacity="0.85" filter="url(#glow)" />
        <rect x="-73" y="-108" width="146" height="130" rx="6" fill="#080810" opacity="0.6" />
        <circle cx="0" cy="-43" r="30" fill="url(#accentGrad)" opacity="0.4" />
        <!-- Inner card detail lines -->
        <rect x="-70" y="35" width="140" height="10" rx="2" fill="${palette.primary}" opacity="0.4" />
        <rect x="-70" y="55" width="110" height="8" rx="2" fill="${palette.secondary}" opacity="0.3" />
        <rect x="-70" y="73" width="140" height="6" rx="2" fill="#ffffff" opacity="0.2" />
        <rect x="-70" y="85" width="80" height="6" rx="2" fill="#ffffff" opacity="0.2" />
      </g>
      <!-- Second background card -->
      <g transform="translate(460, 240) rotate(${(hash % 15) + 5})">
        <rect x="-85" y="-120" width="170" height="240" rx="12" fill="none" stroke="${palette.secondary}" stroke-width="1.5" opacity="0.5" />
      </g>
      <!-- Sparkles / Stars -->
      <path d="M 300 130 L 305 140 L 315 145 L 305 150 L 300 160 L 295 150 L 285 145 L 295 140 Z" fill="${palette.accent}" opacity="0.7" />
      <path d="M 520 120 L 523 128 L 531 131 L 523 134 L 520 142 L 517 134 L 509 131 L 517 128 Z" fill="#ffffff" opacity="0.8" />
      <path d="M 280 290 L 282 295 L 287 297 L 282 299 L 280 304 L 278 299 L 273 297 L 278 295 Z" fill="${palette.secondary}" opacity="0.6" />
    `;
  } else if (category.toLowerCase() === 'watches' || lowerTitle.includes('watch') || lowerTitle.includes('rolex') || lowerTitle.includes('omega') || lowerTitle.includes('seiko')) {
    // Watches Theme: Watch gears and circular dials
    graphicElement = `
      <!-- Main Watch Face Dial Outline -->
      <circle cx="400" cy="225" r="110" fill="none" stroke="${palette.primary}" stroke-width="3" opacity="0.8" filter="url(#glow)" />
      <circle cx="400" cy="225" r="98" fill="url(#cardGrad)" stroke="${palette.secondary}" stroke-width="1" opacity="0.9" />
      
      <!-- Watch Hands -->
      <line x1="400" y1="225" x2="400" y2="155" stroke="#ffffff" stroke-width="3" stroke-linecap="round" transform="rotate(${(hash % 12) * 30 + 15}, 400, 225)" />
      <line x1="400" y1="225" x2="465" y2="225" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round" transform="rotate(${(hash % 60) * 6}, 400, 225)" />
      <circle cx="400" cy="225" r="5" fill="#ffffff" />
      
      <!-- Hour Markings -->
      <circle cx="400" cy="137" r="3" fill="#ffffff" />
      <circle cx="488" cy="225" r="3" fill="#ffffff" />
      <circle cx="400" cy="313" r="3" fill="#ffffff" />
      <circle cx="312" cy="225" r="3" fill="#ffffff" />
      
      <!-- Floating gear wheels in background -->
      <g stroke="${palette.accent}" stroke-width="1.5" fill="none" opacity="0.25" transform="translate(290, 160)">
        <circle cx="0" cy="0" r="35" stroke-dasharray="6,4" />
        <circle cx="0" cy="0" r="25" />
      </g>
      <g stroke="${palette.secondary}" stroke-width="1.5" fill="none" opacity="0.2" transform="translate(510, 280) rotate(45)">
        <circle cx="0" cy="0" r="45" stroke-dasharray="8,5" />
        <circle cx="0" cy="0" r="32" />
      </g>
    `;
  } else {
    // Figures / General Theme: Display showcase stands, spotlights, and dynamic rings
    graphicElement = `
      <!-- Dynamic intersecting glowing rings -->
      <ellipse cx="400" cy="235" rx="160" ry="45" fill="none" stroke="url(#primaryGrad)" stroke-width="3" opacity="0.6" transform="rotate(${(hash % 10) - 5}, 400, 235)" filter="url(#glow)" />
      <ellipse cx="400" cy="235" rx="120" ry="30" fill="none" stroke="url(#accentGrad)" stroke-width="2" opacity="0.8" transform="rotate(${((hash % 10) - 5) * -1}, 400, 235)" />
      
      <!-- Showcase Stand pedestal -->
      <path d="M 330 235 L 350 215 L 450 215 L 470 235 Z" fill="url(#cardGrad)" stroke="${palette.secondary}" stroke-width="1" opacity="0.9" />
      
      <!-- Holographic Spotlight effect -->
      <polygon points="340,50 460,50 450,215 350,215" fill="url(#spotlightGrad)" opacity="0.15" />
      
      <!-- Sparkles / Floaties -->
      <circle cx="370" cy="150" r="4" fill="${palette.accent}" opacity="0.6" filter="url(#glow)" />
      <circle cx="430" cy="120" r="3" fill="#ffffff" opacity="0.8" />
      <circle cx="320" cy="180" r="2.5" fill="${palette.secondary}" opacity="0.5" />
      <circle cx="480" cy="160" r="3.5" fill="${palette.accent}" opacity="0.7" />
    `;
  }
  
  // Format Category string nicely
  const displayCategory = category.toUpperCase();

  // Create the complete premium SVG template
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
    <defs>
      <!-- Ambient Background Glow Gradients -->
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="${palette.primary}" stop-opacity="0.15" />
        <stop offset="100%" stop-color="${palette.bg}" stop-opacity="1" />
      </radialGradient>
      
      <radialGradient id="spotlightGrad" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
      </radialGradient>
      
      <!-- Shape Gradients -->
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.primary}" />
        <stop offset="100%" stop-color="${palette.secondary}" />
      </linearGradient>
      
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.secondary}" />
        <stop offset="100%" stop-color="${palette.accent}" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1c1b29" />
        <stop offset="100%" stop-color="#0e0d16" />
      </linearGradient>
      
      <!-- Tech Grid Pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.05" />
      </pattern>
      
      <!-- Blur Filter for Premium Glow Effect -->
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- Base Background -->
    <rect width="800" height="450" fill="${palette.bg}" />
    <rect width="800" height="450" fill="url(#bgGrad)" />
    
    <!-- Tech Grid Overlay -->
    <rect width="800" height="450" fill="url(#grid)" />
    
    <!-- Abstract Ambient Glow Orbs -->
    <circle cx="${100 + (hash % 150)}" cy="${100 + (hash % 100)}" r="180" fill="${palette.primary}" opacity="0.2" filter="url(#glow)" />
    <circle cx="${650 - (hash % 150)}" cy="${350 - (hash % 100)}" r="140" fill="${palette.secondary}" opacity="0.15" filter="url(#glow)" />
    
    <!-- Keyword-driven Category Graphic Base -->
    ${graphicElement}
    
    <!-- Glassmorphic Footer Banner for Text -->
    <rect x="0" y="340" width="800" height="110" fill="#08070d" fill-opacity="0.6" backdrop-filter="blur(10px)" />
    <line x1="0" y1="340" x2="800" y2="340" stroke="url(#primaryGrad)" stroke-width="1.5" opacity="0.6" />
    
    <!-- Category Tag -->
    <rect x="40" y="362" width="65" height="18" rx="4" fill="url(#primaryGrad)" />
    <text x="72.5" y="374" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">${displayCategory}</text>
    
    <!-- Title Text -->
    <text x="40" y="405" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#ffffff" opacity="0.95">
      ${title.length > 70 ? title.substring(0, 67) + '...' : title}
    </text>
    
    <!-- Minimalist Brand Identifier -->
    <text x="760" y="375" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="url(#accentGrad)" text-anchor="end" letter-spacing="2">COLLECTOR'S PULSE</text>
  </svg>`;
}

/**
 * Generate a dynamic fallback SVG, write it to disk, and return the path.
 */
export function generateLocalFallbackImage(
  title: string,
  category: string,
  slug: string
): string {
  ensureDir(GENERATED_DIR);
  const svgContent = generateFallbackSVG(title, category, slug);
  const filename = `${slug}.svg`;
  const filepath = join(GENERATED_DIR, filename);
  
  writeFileSync(filepath, svgContent, 'utf-8');
  console.log(`[SVGGenerator] ✅ Generated fallback SVG ${filename}`);
  return `/generated/${filename}`;
}
