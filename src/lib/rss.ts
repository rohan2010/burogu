'use server';

import Parser from 'rss-parser';

import fs from 'fs';

export async function fetchFeed(url: string) {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['enclosure', 'enclosure'],
        ['content:encoded', 'contentEncoded'],
      ]
    }
  });
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Borugu/1.0; +http://localhost:3000)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      fs.appendFileSync('rss-debug.log', `[${new Date().toISOString()}] Fetch failed for ${url}: ${response.status} ${response.statusText}\n`);
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    // fs.appendFileSync('rss-debug.log', `[${new Date().toISOString()}] Fetched ${url}, length: ${xml.length}\n`);

    const feed = await parser.parseString(xml);

    // Sanitize for serialization
    return {
      title: feed.title,
      description: feed.description,
      items: feed.items.map(item => {
        // ... re-implement image finding logic inside map ...
        let imageUrl = null;
        if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
          imageUrl = item.enclosure.url;
        } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
          imageUrl = item['media:content'].$.url;
        } else if (item.mediaContent && item.mediaContent.url) {
          imageUrl = item.mediaContent.url;
        }
        if (!imageUrl && (item.content || item.contentEncoded)) {
          const content = item.contentEncoded || item.content;
          const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch && imgMatch[1]) imageUrl = imgMatch[1];
        }

        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          isoDate: item.isoDate,
          contentSnippet: item.contentSnippet,
          summary: item.summary,
          image: imageUrl
        };
      })
    };
  } catch (error) {
    fs.appendFileSync('rss-debug.log', `[${new Date().toISOString()}] Error parsing ${url}: ${error}\n`);
    console.error("Failed to parse RSS", error);
    return null;
  }
}

export async function findFeedUrl(siteUrl: string): Promise<string | null> {
  try {
    // 1. Fetch the HTML
    const response = await fetch(siteUrl, {
      headers: {
        'User-Agent': 'Burogu-RSS-Discovery/1.0'
      }
    });

    if (!response.ok) return null;
    const html = await response.text();

    // 2. Regex to find <link rel="alternate" ... href="...">
    // Looking for type="application/rss+xml" or "application/atom+xml"
    const linkRegex = /<link[^>]+Rel=["']alternate["'][^>]+>/gi;
    const matches = html.match(linkRegex);

    if (matches) {
      for (const tag of matches) {
        if (tag.includes('application/rss+xml') || tag.includes('application/atom+xml') || tag.includes('text/xml')) {
          const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
          if (hrefMatch && hrefMatch[1]) {
            let feedUrl = hrefMatch[1];
            // Handle relative URLs
            if (feedUrl.startsWith('/')) {
              const u = new URL(siteUrl);
              feedUrl = `${u.protocol}//${u.host}${feedUrl}`;
            } else if (!feedUrl.startsWith('http')) {
              const u = new URL(siteUrl);
              feedUrl = `${u.protocol}//${u.host}/${feedUrl}`;
            }
            return feedUrl;
          }
        }
      }
    }

    return null;
  } catch (e) {
    console.error("Error finding feed URL:", e);
    return null;
  }
}
