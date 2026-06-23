async function runTest() {
  const subName = 'PokemonTCG';
  console.log(`Testing raw fetch from Reddit for r/${subName}...`);
  try {
    const res = await fetch(`https://www.reddit.com/r/${subName}/new.json?limit=10`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log("Status:", res.status);
    console.log("Status text:", res.statusText);
    const text = await res.text();
    console.log("Response starts with:", text.slice(0, 300));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

runTest();
