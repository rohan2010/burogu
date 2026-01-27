'use client';

import { COMMUNITY_FEEDS } from '@/lib/community-feeds';
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { FeedSource } from './feed-stream';
import { AddSource } from './add-source';

interface SettingsViewProps {
    myFeeds: FeedSource[];
    onAdd: (feed: { url: string; title: string }) => void;
    onRemove: (url: string) => void;
}

export function SettingsView({ myFeeds, onAdd, onRemove }: SettingsViewProps) {

    const isSubscribed = (url: string) => myFeeds.some(f => f.url === url);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Feed Settings</h2>
                <p className="text-muted-foreground">Manage your subscriptions from the community repository.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMUNITY_FEEDS.map((feed, idx) => {
                    const subscribed = isSubscribed(feed.url);
                    return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 min-w-0 mr-4">
                                <h3 className="font-semibold text-sm truncate" title={feed.title}>{feed.title}</h3>
                                <p className="text-xs text-muted-foreground truncate" title={feed.url}>{feed.url}</p>
                            </div>

                            {subscribed ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="shrink-0 text-green-600 bg-green-50 hover:bg-red-50 hover:text-red-600 transition-colors group"
                                    onClick={() => onRemove(feed.url)}
                                >
                                    <span className="group-hover:hidden flex items-center"><Check className="mr-1 h-3 w-3" /> Added</span>
                                    <span className="hidden group-hover:flex items-center"><Trash2 className="mr-1 h-3 w-3" /> Remove</span>
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={() => onAdd(feed)}
                                >
                                    <Plus className="mr-1 h-3 w-3" /> Add
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-muted/30 p-6 rounded-xl border border-dashed text-center">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Add Custom Feed</h3>
                <div className="max-w-md mx-auto">
                    <AddSource onFeedAdded={onAdd} />
                </div>
            </div>
        </div>
    );
}
