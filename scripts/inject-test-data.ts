import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const testItems = [
  {
    title: "ROLEX SUBMARINER DATE RESTOCK SEEN AT SELECT ADs",
    slug: "rolex-sub-restock-test-1",
    content_raw: "Breaking news for watch collectors! Reports are flooding in from multiple Authorized Dealers across the US and Europe that a massive shipment of Rolex Submariner Date (Ref. 126610LN) has just landed. Waitlists are supposedly being fulfilled for clients who registered over 18 months ago. If you have a strong purchase history, call your AD immediately!",
    source_url: "https://twitter.com/watch_drops",
    source_name: "WatchDrops",
    source_type: "twitter",
    category: "Watches",
    processing_status: "pending_ai"
  },
  {
    title: "S.H.Figuarts Super Saiyan Goku (Legendary Super Saiyan) Announcement",
    slug: "shfiguarts-goku-legendary-test-1",
    content_raw: "Tamashii Nations has finally revealed the upcoming S.H.Figuarts Super Saiyan Goku (Legendary Super Saiyan) figure from the Frieza Saga! This completely new sculpt features entirely new joint articulation for insane posing capabilities. Pre-orders open this Friday at Premium Bandai. Don't miss out, as it will likely sell out instantly due to high demand.",
    source_url: "https://tamashiiweb.com/goku",
    source_name: "Tamashii Web",
    source_type: "scrape",
    category: "Figures",
    processing_status: "pending_ai"
  },
  {
    title: "Pokémon TCG: Obsidian Flames Early Reveal - Charizard ex!",
    slug: "pokemon-obsidian-flames-charizard-test-1",
    content_raw: "The Pokémon Company just officially revealed the star card of the upcoming Obsidian Flames expansion: a Darkness-type Tera Charizard ex! The card features stunning full-art illustration with a unique crystalline texture. Elite Trainer Boxes and Booster Boxes will be available for pre-order starting next week. Expect this set to be heavily scalped.",
    source_url: "https://pokemon.com/news",
    source_name: "Pokemon Official",
    source_type: "rss",
    category: "TCG",
    processing_status: "pending_ai"
  }
];

async function inject() {
  console.log("Injecting test data into Supabase...");
  const { error } = await supabase
    .from('news_items')
    .insert(testItems);

  if (error) {
    if (error.code === '23505') {
      console.log("Data already exists in the database (Unique slug constraint hit).");
    } else {
      console.error("Failed to inject data:", error);
    }
  } else {
    console.log("Successfully injected 3 test items!");
  }
}

inject();
