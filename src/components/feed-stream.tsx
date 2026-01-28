'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AddSource } from './add-source';
import { PostCard } from './post-card';
import { Sidebar } from './sidebar';
import { SettingsView } from './settings-view';
import { DateFilter } from './date-filter';
import { ChangelogView } from './changelog-view';
import { fetchFeed } from '@/lib/rss';
import { Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookmarks, PostItem } from '@/lib/store';

export interface FeedSource {
  url: string;
  title: string;
  addedAt?: string;
}

export function FeedStream() {
  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [items, setItems] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'all' | 'bookmarks' | 'settings' | 'changelog'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const initialized = useRef(false);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // Load sources from localStorage
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('burogu-feeds');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeeds(JSON.parse(saved));
      } else {
        const defaults = [
          { url: 'https://openai.com/blog/rss.xml', title: 'OpenAI', addedAt: new Date().toISOString() },
          { url: 'https://security.googleblog.com/feeds/posts/default', title: 'Google Security', addedAt: new Date().toISOString() }
        ];
        setFeeds(defaults);
        localStorage.setItem('burogu-feeds', JSON.stringify(defaults));
      }
    }
  }, []);

  const refreshFeeds = useCallback(async () => {
    if (feeds.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const allItems: PostItem[] = [];

    await Promise.all(feeds.map(async (source) => {
      const feedData = await fetchFeed(source.url);
      if (feedData && feedData.items) {
        feedData.items.forEach(item => {
          if (item.title && item.link && (item.pubDate || item.isoDate)) {
            allItems.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
              contentSnippet: item.contentSnippet || item.summary,
              sourceName: source.title,
              isoDate: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              image: (item as any).image
            });
          }
        });
      }
    }));

    // Sort by date desc
    allItems.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

    setItems(allItems);
    setLoading(false);
  }, [feeds]);

  // Fetch when feeds change
  useEffect(() => {
    if (view === 'all') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshFeeds();
    }
  }, [refreshFeeds, view]);

  const handleFeedAdded = (newFeed: { url: string; title: string }) => {
    if (feeds.some(f => f.url === newFeed.url)) return;
    const feedWithDate: FeedSource = { ...newFeed, addedAt: new Date().toISOString() };
    const updated = [...feeds, feedWithDate];
    setFeeds(updated);
    localStorage.setItem('burogu-feeds', JSON.stringify(updated));
  };

  const handleRemoveFeed = (url: string) => {
    if (confirm('Remove this source?')) {
      const updated = feeds.filter(f => f.url !== url);
      setFeeds(updated);
      localStorage.setItem('burogu-feeds', JSON.stringify(updated));
    }
  };

  // Filter Logic
  const getFilteredItems = () => {
    let data = view === 'bookmarks' ? bookmarks : items;

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.title.toLowerCase().includes(lowerQ) ||
        item.sourceName.toLowerCase().includes(lowerQ)
      );
    }

    if (dateRange.start || dateRange.end) {
      data = data.filter(item => {
        const itemDate = new Date(item.isoDate).toISOString().split('T')[0];
        const start = dateRange.start || '0000-01-01';
        const end = dateRange.end || '9999-12-31';
        return itemDate >= start && itemDate <= end;
      });
    }

    return data;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="flex bg-muted/10 min-h-screen">
      <Sidebar
        feeds={feeds}
        onRemove={handleRemoveFeed}
        currentView={view}
        onViewChange={setView}
      />

      <div className="flex-1 w-full min-w-0 p-8 pl-4">

        {view === 'settings' ? (
          <SettingsView
            myFeeds={feeds}
            onAdd={handleFeedAdded}
            onRemove={handleRemoveFeed}
          />
        ) : view === 'changelog' ? (
          <ChangelogView />
        ) : (
          <>
            {/* Header Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 bg-card border-none shadow-sm rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <DateFilter
                  onApply={(range) => setDateRange(range)}
                  initialStart={dateRange.start}
                  initialEnd={dateRange.end}
                />
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shadow-sm border-none bg-card" onClick={refreshFeeds} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Add Source Area (Only on All Feeds) */}
            {view === 'all' && (
              <div className="mb-8">
                <AddSource onFeedAdded={handleFeedAdded} />
              </div>
            )}

            {/* Grid Content */}
            {loading && items.length === 0 && view === 'all' ? (
              <div className="text-center py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                <p>Hunting for feeds...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-muted-foreground">
                    {view === 'bookmarks' ? "No bookmarks yet. Star some posts!" : "No posts found matching your filters."}
                  </div>
                ) : (
                  filteredItems.map((item, idx) => (
                    <PostCard
                      key={`${item.link}-${idx}`}
                      post={item}
                      isBookmarked={isBookmarked(item.link)}
                      onToggleBookmark={() => toggleBookmark(item)}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
