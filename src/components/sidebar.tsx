'use client';

// import { formatDistanceToNow } from 'date-fns';
import { Trash2, Rss, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeedSource } from './feed-stream'; // Import type locally for now or move type to store
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
    feeds: FeedSource[];
    onRemove: (url: string) => void;
    currentView: 'all' | 'bookmarks' | 'settings';
    onViewChange: (view: 'all' | 'bookmarks' | 'settings') => void;
}

export function Sidebar({ feeds, onRemove, currentView, onViewChange }: SidebarProps) {

    return (
        <div className="w-64 flex-shrink-0 flex flex-col h-[calc(100vh-2rem)] sticky top-4 bg-card rounded-2xl border shadow-sm overflow-hidden ml-4 my-4">

            {/* Brand / Header area done in layout, but sidebar has nav */}
            <div className="p-6 pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <span className="text-2xl">🅱️</span> Borugu
                </h2>
            </div>

            <div className="px-4 py-2 space-y-1">
                <Button
                    variant={currentView === 'all' ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-medium"
                    onClick={() => onViewChange('all')}
                >
                    <Rss className="mr-2 h-4 w-4" /> All Feeds
                </Button>
                <Button
                    variant={currentView === 'bookmarks' ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-medium"
                    onClick={() => onViewChange('bookmarks')}
                >
                    <Star className="mr-2 h-4 w-4" /> Bookmarked
                </Button>
                <Button
                    variant={currentView === 'settings' ? 'secondary' : 'ghost'}
                    className="w-full justify-start font-medium"
                    onClick={() => onViewChange('settings')}
                >
                    <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
            </div>

            <Separator className="my-2 opacity-50" />

            <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">FEEDS</h3>
                <ScrollArea className="h-[400px] w-full pr-4">
                    {feeds.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No feeds yet.</p>
                    ) : (
                        <div className="space-y-1">
                            {feeds.map((feed, idx) => (
                                <div key={`${feed.url}-${idx}`} className="flex items-center justify-between group py-1 rounded-md hover:bg-muted/50 px-2 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {/* Mock Favicon */}
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                            {feed.title.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium truncate opacity-80">{feed.title}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); onRemove(feed.url); }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
