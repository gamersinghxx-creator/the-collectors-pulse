import { fetchArticleImage, getCachedArticleImage, downloadImage } from './imageFetcher';
import { getFallbackImage } from './constants';

/**
 * Resolve the best available image for an article:
 * 1. Cached (already downloaded) image
 * 2. Feed-provided image (media:content / enclosure) — article-specific
 * 3. og:image / twitter:image / largest content image from the source
 * 4. Captivating category photo (never an ugly generated box)
 *
 * Returns a public-relative path string.
 */
export async function resolveArticleImage(
  sourceUrl: string,
  title: string,
  category: string,
  slug: string,
  feedImageUrl?: string
): Promise<string> {
  // 1. Already downloaded for this article
  const cachedArticle = getCachedArticleImage(slug);
  if (cachedArticle) {
    return cachedArticle;
  }

  // 2. Image straight from the RSS item
  if (feedImageUrl && /^https?:\/\//i.test(feedImageUrl)) {
    try {
      const fromFeed = await downloadImage(feedImageUrl, slug);
      if (fromFeed) return fromFeed;
    } catch (err) {
      console.log(`[ResolveImage] Feed image failed for ${slug}:`, (err as Error).message);
    }
  }

  // 3. Real image from the source article
  try {
    const ogImage = await fetchArticleImage(sourceUrl, slug);
    if (ogImage) return ogImage;
  } catch (err) {
    console.log(`[ResolveImage] Source fetch failed for ${slug}:`, (err as Error).message);
  }

  // 4. Captivating category photo (no generated placeholder boxes).
  return getFallbackImage(category);
}
