export const COMMUNITY_FEEDS = [
    // Anthropic
    { title: "Anthropic News", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml" },
    { title: "Anthropic Engineering", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_engineering.xml" },
    { title: "Anthropic Research", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_research.xml" },
    { title: "Anthropic Frontier Red Team", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_red.xml" },
    { title: "Claude Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_claude.xml" },
    { title: "Claude Code Changelog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_changelog_claude_code.xml" },

    // AI Labs & Tools
    { title: "OpenAI Research", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_openai_research.xml" },
    { title: "Google AI Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_google_ai.xml" },
    { title: "xAI News", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_xainews.xml" },
    { title: "Ollama Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_ollama.xml" },
    { title: "Cursor Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_cursor.xml" },
    { title: "Surge AI Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_blogsurgeai.xml" },
    { title: "The Batch (DeepLearning.AI)", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_the_batch.xml" },
    { title: "Thinking Machines Lab", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_thinkingmachines.xml" },

    // Windsurf
    { title: "Windsurf Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_windsurf_blog.xml" },
    { title: "Windsurf Changelog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_windsurf_changelog.xml" },
    { title: "Windsurf Next Changelog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_windsurf_next_changelog.xml" },

    // Engineering & Individual Types
    { title: "Paul Graham", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_paulgraham.xml" },
    { title: "Hamel Husain", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_hamel.xml" },
    { title: "Chander Ramesh", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_chanderramesh.xml" },
    { title: "Dagster Blog", url: "https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_dagster.xml" },

    // Others
    { title: "Supabase Blog", url: "https://supabase.com/blog/rss.xml" } // Native
];

export function findCommunityFeed(url: string) {
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '').replace('www.', '');

    // Heuristics
    if (cleanUrl.includes('anthropic.com')) {
        if (cleanUrl.includes('engineering')) return COMMUNITY_FEEDS.find(f => f.title === 'Anthropic Engineering');
        if (cleanUrl.includes('research')) return COMMUNITY_FEEDS.find(f => f.title === 'Anthropic Research');
        return COMMUNITY_FEEDS.find(f => f.title === 'Anthropic News');
    }
    if (cleanUrl.includes('openai.com')) return COMMUNITY_FEEDS.find(f => f.title.includes('OpenAI'));
    if (cleanUrl.includes('blog.google') || cleanUrl.includes('googleblog.com')) return COMMUNITY_FEEDS.find(f => f.title.includes('Google AI'));
    if (cleanUrl.includes('deeplearning.ai')) return COMMUNITY_FEEDS.find(f => f.title.includes('The Batch'));
    if (cleanUrl.includes('paulgraham.com')) return COMMUNITY_FEEDS.find(f => f.title.includes('Paul Graham'));
    if (cleanUrl.includes('x.ai')) return COMMUNITY_FEEDS.find(f => f.title.includes('xAI'));
    if (cleanUrl.includes('ollama.com') || cleanUrl.includes('ollama.ai')) return COMMUNITY_FEEDS.find(f => f.title.includes('Ollama'));
    if (cleanUrl.includes('cursor.com') || cleanUrl.includes('cursor.sh')) return COMMUNITY_FEEDS.find(f => f.title.includes('Cursor'));

    return null;
}
