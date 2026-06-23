import { existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const GENERATED_DIR = join(process.cwd(), 'public', 'generated');

// Ensure directory exists
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Check if we already have a generated image for this slug.
 */
export function getCachedGeneratedImage(slug: string): string | null {
  ensureDir(GENERATED_DIR);
  try {
    const files = readdirSync(GENERATED_DIR);
    const match = files.find(f => f.startsWith(slug + '.'));
    if (match) {
      return `/generated/${match}`;
    }
  } catch {
    // Directory read failed
  }
  return null;
}

/**
 * Build a category-aware image generation prompt from the article title and category.
 */
function buildPrompt(title: string, category: string): string {
  const categoryThemes: Record<string, string> = {
    tcg: 'collectible trading card game scene, glowing holographic cards with dramatic lighting, Pokémon or anime card art style, vibrant blues and purples, premium collector display',
    figures: 'premium collectible anime action figure display, dramatic studio lighting, glass display case with LED backlighting, detailed sculpt, reds and golds, collector showcase',
    watches: 'luxury mechanical chronograph watch, macro photography, polished steel and sapphire crystal, elegant dark background with golden accents, premium horology',
  };

  const theme = categoryThemes[category.toLowerCase()] || 'premium collectible items arranged in an elegant display, dramatic studio lighting';

  // Extract key terms from the title (strip generic words)
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'is', 'it', 'as', 'be', 'was', 'are', 'has', 'have', 'had', 'this', 'that', 'these', 'those', 'how', 'what', 'when', 'where', 'why', 'who', 'which', 'more', 'about', 'into', 'than', 'can', 'could', 'would', 'should', 'will', 'just', 'also', 'very', 'most', 'best', 'new', 'now', 'after', 'before', 'but', 'not', 'all', 'its', 'may'];
  
  const keywords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w))
    .slice(0, 6)
    .join(', ');

  return `Professional editorial photograph for a collector's magazine article. Theme: ${theme}. Context keywords: ${keywords}. Style: ultra-high quality, moody ambient lighting, shallow depth of field, cinematic color grading, 16:9 aspect ratio. No text, no watermarks, no logos.`;
}

/**
 * Generate an image using the Gemini Imagen API and save it locally.
 * Returns the public-relative path or null on failure.
 */
export async function generateArticleImage(
  title: string,
  category: string,
  slug: string
): Promise<string | null> {
  // 1. Check cache first
  const cached = getCachedGeneratedImage(slug);
  if (cached) {
    return cached;
  }

  // 2. Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('[ImageGenerator] No GEMINI_API_KEY configured — skipping AI generation');
    return null;
  }

  try {
    const prompt = buildPrompt(title, category);
    console.log(`[ImageGenerator] Generating image for: "${title.slice(0, 50)}..."`);

    // Use the Gemini Imagen API via REST (simpler than the SDK for image generation)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ImageGenerator] Imagen API error ${response.status}:`, errorText.slice(0, 200));
      return null;
    }

    const result = await response.json();

    // Extract base64 image data from the response
    const predictions = result.predictions;
    if (!predictions || predictions.length === 0) {
      console.log('[ImageGenerator] No predictions returned from Imagen API');
      return null;
    }

    const base64Data = predictions[0].bytesBase64Encoded;
    if (!base64Data) {
      console.log('[ImageGenerator] No image data in prediction response');
      return null;
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Save as PNG
    ensureDir(GENERATED_DIR);
    const filename = `${slug}.png`;
    const filepath = join(GENERATED_DIR, filename);
    writeFileSync(filepath, buffer);

    console.log(`[ImageGenerator] ✅ Generated ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
    return `/generated/${filename}`;
  } catch (err) {
    console.error('[ImageGenerator] Generation failed:', (err as Error).message);
    return null;
  }
}
