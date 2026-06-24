import { fetchArticleImage, getCachedArticleImage } from './imageFetcher';
import { getCachedGeneratedImage } from './imageGenerator'; // Keep cache check for previously generated images
import { generateLocalFallbackImage } from './svgGenerator';
import { getFallbackImage } from './constants';

/**
 * Resolve the best available image for an article through a tiered pipeline:
 * 1. Check local cache (previously fetched or generated)
 * 2. Try fetching and scraping image from the article's source URL
 * 3. Try generating a local dynamic SVG image based on title/category keywords
 * 4. Fall back to category-specific static image
 *
 * Returns a public-relative path string (e.g., "/images/articles/slug.jpg")
 */
export async function resolveArticleImage(
  sourceUrl: string,
  title: string,
  category: string,
  slug: string
): Promise<string> {
  // 1. Check if we already have a cached article image (OG-sourced or scraped)
  const cachedArticle = getCachedArticleImage(slug);
  if (cachedArticle) {
    return cachedArticle;
  }

  // 2. Check if we already have a cached generated image (from legacy runs)
  const cachedGenerated = getCachedGeneratedImage(slug);
  if (cachedGenerated) {
    return cachedGenerated;
  }

  // 3. Try fetching and scraping image from the source URL
  try {
    const ogImage = await fetchArticleImage(sourceUrl, slug);
    if (ogImage) {
      return ogImage;
    }
  } catch (err) {
    console.log(`[ResolveImage] Source fetch/scrape failed for ${slug}:`, (err as Error).message);
  }

  // 4. Try local dynamic SVG generation based on keywords
  try {
    const localSvg = generateLocalFallbackImage(title, category, slug);
    if (localSvg) {
      return localSvg;
    }
  } catch (err) {
    console.log(`[ResolveImage] Local SVG generation failed for ${slug}:`, (err as Error).message);
  }

  // 5. Final fallback: static category image
  return getFallbackImage(category);
}
