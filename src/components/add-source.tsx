'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchFeed, findFeedUrl } from "@/lib/rss";
import { findCommunityFeed } from "@/lib/community-feeds";
import { Loader2, Plus, AlertCircle } from "lucide-react";

interface AddSourceProps {
    onFeedAdded: (feed: { url: string; title: string }) => void;
}

export function AddSource({ onFeedAdded }: AddSourceProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' | 'info' } | null>(null);

    const handleAdd = async () => {
        if (!url) return;
        setLoading(true);
        setMessage(null);

        // Basic URL normalization
        let cleanUrl = url.trim();
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }

        try {
            // 1. Try fetching as is (Direct RSS link)
            let feed = await fetchFeed(cleanUrl);

            if (feed) {
                onFeedAdded({ url: cleanUrl, title: feed.title || cleanUrl });
                setMessage({ text: "Added successfully!", type: 'success' });
                setUrl('');
                setLoading(false);
                return;
            }

            // 2. Auto-Discovery (Scraping HTML for <link>)
            setMessage({ text: "Checking for feed links...", type: 'info' });
            const discoveredUrl = await findFeedUrl(cleanUrl);
            if (discoveredUrl) {
                feed = await fetchFeed(discoveredUrl);
                if (feed) {
                    onFeedAdded({ url: discoveredUrl, title: feed.title || discoveredUrl });
                    setMessage({ text: "Feed found via auto-discovery!", type: 'success' });
                    setUrl('');
                    setLoading(false);
                    return;
                }
            }

            // 3. Community Fallback
            setMessage({ text: "Checking community database...", type: 'info' });
            const communityMatch = findCommunityFeed(cleanUrl);
            if (communityMatch) {
                onFeedAdded({ url: communityMatch.url, title: communityMatch.title });
                setMessage({ text: `Found in community list: ${communityMatch.title}`, type: 'success' });
                setUrl('');
                setLoading(false);
                return;
            }

            // 4. Heuristics (Common suffixes)
            const commonPaths = ['/rss', '/feed', '/rss.xml', '/atom.xml', '/feed.xml'];
            for (const path of commonPaths) {
                const tryUrl = cleanUrl.replace(/\/$/, '') + path;
                feed = await fetchFeed(tryUrl);
                if (feed) {
                    onFeedAdded({ url: tryUrl, title: feed.title || tryUrl });
                    setMessage({ text: "Feed found via common paths!", type: 'success' });
                    setUrl('');
                    setLoading(false);
                    return;
                }
            }

            // Failed
            setMessage({ text: "Could not find a valid RSS feed. This site might not have one.", type: 'error' });

        } catch (err) {
            setMessage({ text: "Failed to add source. Check URL.", type: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card p-4 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add New Source
            </h3>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Input
                        placeholder="Paste blog URL (e.g. blog.google)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1 border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    <Button onClick={handleAdd} disabled={loading} className="rounded-lg">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Add"}
                    </Button>
                </div>
                {message && (
                    <div className={`text-xs flex items-center gap-2 mt-1 ${message.type === 'error' ? 'text-destructive' :
                            message.type === 'success' ? 'text-green-600' : 'text-blue-500'
                        }`}>
                        {message.type === 'error' && <AlertCircle className="h-3 w-3" />}
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
