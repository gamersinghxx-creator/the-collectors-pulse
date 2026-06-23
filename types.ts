export type Category = 'TCG' | 'Figures' | 'Watches' | 'general';
export type SourceType = 'rss' | 'scrape' | 'twitter' | 'facebook' | 'reddit';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary_short?: string;
  summary_full?: string;
  content_raw: string;
  source_url: string;
  source_name: string;
  source_type: SourceType;
  category: string;
  sub_category?: string;
  hype_score: number;
  engagement_count: number;
  image_url?: string;
  thumbnail_url?: string;
  is_drop_alert: boolean;
  is_restock: boolean;
  is_trending: boolean;
  affiliate_links?: Record<string, string>;
  tags: string[];
  published_at: string;
  scraped_at: string;
  created_at: string;
  processing_status: string;
  metadata?: Record<string, unknown>;
}
