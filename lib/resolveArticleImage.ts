import { fetchArticleImage, getCachedArticleImage } from './imageFetcher';
import { generateArticleImage, getCachedGeneratedImage } from './imageGenerator';
import { generateLocalFallbackImage } from './svgGenerator';
import { getFallbackImage } from './constants';

/**
 * Resolve the best available image for an article through a tiered pipeline:
 * 1. Check local cache (previously fetched or generated)
 * 2. Try fetching OG image from the article's source URL
 * 3. Try generating an AI image via Gemini Imagen
 * 4. Try generating a local dynamic SVG image based on title/category keywords
 * 5. Fall back to category-specific static image
 *
 * Returns a public-relative path string (e.g., "/images/articles/slug.jpg")
 */
export async function resolveArticleImage(
  sourceUrl: string,
  title: string,
  category: string,
  slug: string
): Promise<string> {
  // 1. Check if we already have a cached article image (OG-sourced)
  const cachedArticle = getCachedArticleImage(slug);
  if (cachedArticle) {
    return cachedArticle;
  }

  // 2. Check if we already have a cached generated image
  const cachedGenerated = getCachedGeneratedImage(slug);
  if (cachedGenerated) {
    return cachedGenerated;
  }

  // 3. Try fetching OG image from the source
  try {
    const ogImage = await fetchArticleImage(sourceUrl, slug);
    if (ogImage) {
      return ogImage;
    }
  } catch (err) {
    console.log(`[ResolveImage] OG fetch failed for ${slug}:`, (err as Error).message);
  }

  // 4. Try AI image generation
  try {
    const generated = await generateArticleImage(title, category, slug);
    if (generated) {
      return generated;
    }
  } catch (err) {
    console.log(`[ResolveImage] AI generation failed for ${slug}:`, (err as Error).message);
  }

  // 5. Try local dynamic SVG generation based on keywords
  try {
    const localSvg = generateLocalFallbackImage(title, category, slug);
    if (localSvg) {
      return localSvg;
    }
  } catch (err) {
    console.log(`[ResolveImage] Local SVG generation failed for ${slug}:`, (err as Error).message);
  }

  // 6. Final fallback: static category image
  return getFallbackImage(category);
}
