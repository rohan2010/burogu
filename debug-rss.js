const Parser = require('rss-parser');

async function testFeed(url) {
    console.log(`Testing URL: ${url}`);

    // Mimic the header logic from rss.ts
    const headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; Borugu/1.0; +http://localhost:3000)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    };

    try {
        console.log('Fetching...');
        const response = await fetch(url, { headers });
        console.log(`Response Status: ${response.status}`);

        if (!response.ok) {
            console.error('Fetch failed not OK');
            return;
        }

        const xml = await response.text();
        console.log(`Got XML length: ${xml.length}`);

        const parser = new Parser();
        console.log('Parsing...');
        const feed = await parser.parseString(xml);
        console.log(`Success! Title: ${feed.title}`);
        console.log(`Items: ${feed.items.length}`);

    } catch (error) {
        console.error('FAILED:', error);
    }
}

// Run test
testFeed('https://blog.google/rss/');
