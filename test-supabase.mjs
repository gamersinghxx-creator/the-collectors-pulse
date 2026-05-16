import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual simple parsing of .env.local
const envFile = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || url === 'your_supabase_project_url') {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set or is still the placeholder.");
  process.exit(1);
}

if (!key || key === 'your_supabase_anon_key') {
  console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or is still the placeholder.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
  console.log(`Connecting to Supabase at ${url}...`);
  try {
    const { data, error } = await supabase.from('news_items').select('id').limit(1);
    
    if (error) {
      console.error("❌ Connection failed or table does not exist:");
      console.error(error);
      process.exit(1);
    }
    
    console.log("✅ Connection successful! The 'news_items' table exists.");
    console.log(`Rows found: ${data.length} (This is normal if you haven't inserted any data yet)`);
  } catch (err) {
    console.error("❌ Unexpected error during connection:");
    console.error(err);
    process.exit(1);
  }
}

testConnection();
