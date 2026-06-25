import cron from 'node-cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.GEMINI_API_KEY) {
  console.error('[AI] GEMINI_API_KEY is missing in .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n[AI] ⚠ Supabase is not configured.');
  console.error('[AI]   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('[AI]   (see SUPABASE_SETUP.md). The AI processor needs a database to read from.\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: { responseMimeType: "application/json" }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function processPendingItems() {
  console.log('[AI] Starting AI Processor cycle...');

  const { data: items, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('processing_status', 'pending_ai')
    .limit(10);

  if (error) {
    console.error('[AI] Supabase fetch error:', error);
    return;
  }

  if (!items || items.length === 0) {
    console.log('[AI] No pending items found.');
    return;
  }

  console.log(`[AI] Found ${items.length} items to process.`);

  for (const item of items) {
    try {
      console.log(`[AI] Processing item ${item.id}: "${item.title}"`);
      
      const prompt = `
        You are a hobby news classifier for a collector's platform. Given raw scraped content, analyze it and return a strict JSON object.
        
        Raw Content:
        Title: ${item.title}
        Source Name: ${item.source_name}
        Content: ${item.content_raw}

        Determine the following:
        1. is_genuine: true if this is genuine hobby news (not spam, not completely unrelated), false otherwise.
        2. category: exactly one of ["TCG", "Figures", "Watches", "general"]
        3. sub_category: be specific (e.g., 'one_piece_tcg', 'sh_figuarts', 'rolex_sports', 'pokemon_tcg', 'nendoroid', 'seiko')
        4. tags: array of 3-6 relevant tags (strings)
        5. is_drop_alert: true if this announces a new product drop, pre-order opening, or restock
        6. is_restock: true if specifically a restock
        7. summary_short: 2-sentence punchy summary
        8. summary_full: detailed 2-3 paragraph summary
        9. hype_score: integer from 1 to 10 based on how highly anticipated or popular this item is likely to be (e.g., Charizard or Rolex Daytona gets a 9 or 10).

        Return ONLY valid JSON.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean markdown formatting if present
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const aiData = JSON.parse(cleanText);
      
      if (aiData.is_genuine) {
        const { error: updateError } = await supabase
          .from('news_items')
          .update({
            category: aiData.category,
            sub_category: aiData.sub_category,
            tags: aiData.tags,
            is_drop_alert: aiData.is_drop_alert || false,
            is_restock: aiData.is_restock || false,
            summary_short: aiData.summary_short,
            summary_full: aiData.summary_full,
            hype_score: aiData.hype_score,
            processing_status: 'published'
          })
          .eq('id', item.id);
          
        if (updateError) {
          console.error(`[AI] Failed to update item ${item.id}:`, updateError);
        } else {
          console.log(`[AI] Successfully published item ${item.id} with Hype Score: ${aiData.hype_score}`);
        }
      } else {
        // Mark as spam/rejected
        await supabase
          .from('news_items')
          .update({ processing_status: 'rejected' })
          .eq('id', item.id);
        console.log(`[AI] Rejected item ${item.id} as non-genuine.`);
      }

    } catch (err) {
      console.error(`[AI] Error processing item ${item.id}:`, err);
    }
  }
}

// When running manually with --run flag
if (process.argv.includes('--run')) {
  processPendingItems().then(() => process.exit(0));
} else {
  // Cron schedule (every 2 minutes)
  cron.schedule('*/2 * * * *', () => {
    processPendingItems();
  });
  console.log('[AI] Processor Cron Job Started. Listening for pending items...');
}
