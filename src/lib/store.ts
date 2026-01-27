'use client';

import { useState, useEffect } from 'react';

export interface PostItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    image?: string;
    sourceName: string;
    isoDate: string;
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<PostItem[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('burogu-bookmarks');
            if (saved) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setBookmarks(JSON.parse(saved));
            }
        }
    }, []);

    const toggleBookmark = (post: PostItem) => {
        const isBookmarked = bookmarks.some(b => b.link === post.link);
        let updated;
        if (isBookmarked) {
            updated = bookmarks.filter(b => b.link !== post.link);
        } else {
            updated = [post, ...bookmarks];
        }
        setBookmarks(updated);
        localStorage.setItem('burogu-bookmarks', JSON.stringify(updated));
    };

    const isBookmarked = (link: string) => {
        return bookmarks.some(b => b.link === link);
    };

    return { bookmarks, toggleBookmark, isBookmarked };
}
