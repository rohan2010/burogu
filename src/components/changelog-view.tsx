'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Version {
    version: string;
    date: string;
    changes: string[];
}

const CHANGELOG_DATA: Version[] = [
    {
        version: "v2.6",
        date: "Jan 27, 2026",
        changes: [
            "Added Changelog page.",
            "Added ability to add custom feeds directly in Settings."
        ]
    },
    {
        version: "v2.5",
        date: "Jan 27, 2026",
        changes: [
            "Improve RSS fetching robustness for Google/Spotify blogs.",
            "Fixed specific feed parsing issues using custom headers.",
            "Ensured serializable data for server actions."
        ]
    },
    {
        version: "v2.3",
        date: "Jan 27, 2026",
        changes: [
            "Rebranded to 'Borugu'.",
            "Added Date Filter Popover with Apply confirmation.",
            "Improved UI responsiveness."
        ]
    },
    {
        version: "v2.2",
        date: "Jan 27, 2026",
        changes: [
            "Added Date Range Filtering (Start/End Date).",
            "Updated filtering logic for precise date matching."
        ]
    },
    {
        version: "v2.1",
        date: "Jan 27, 2026",
        changes: [
            "Added dedicated Settings page.",
            "Removed 'Hidden' feed functionality in favor of Add/Remove.",
            "Reverted branding to 'Burogu' (temporarily)."
        ]
    },
    {
        version: "v2.0",
        date: "Jan 26, 2026",
        changes: [
            "Major UI Redesign with Falconry-style Sidebar.",
            "Added Bookmarks/Favorites functionality.",
            "Added Search Bar.",
            "Implemented Grid Layout for posts."
        ]
    },
    {
        version: "v1.2",
        date: "Jan 25, 2026",
        changes: [
            "Enhanced Feed Discovery (Auto-discovery via HTML link tags).",
            "Added Heuristic search for common feed paths."
        ]
    },
    {
        version: "v1.0",
        date: "Jan 24, 2026",
        changes: [
            "Initial Release.",
            "Basic RSS Feed Stream.",
            "Add Source functionality.",
            "Local storage persistence."
        ]
    }
];

export function ChangelogView() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-bold mb-2">Changelog</h2>
                <p className="text-muted-foreground">History of updates and improvements to Borugu.</p>
            </div>

            <div className="relative border-l border-muted/50 ml-3 space-y-12">
                {CHANGELOG_DATA.map((release, idx) => (
                    <div key={idx} className="relative pl-8">
                        {/* Timeline dot */}
                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                            <h3 className="text-xl font-semibold">{release.version}</h3>
                            <Badge variant="secondary" className="w-fit text-muted-foreground font-normal">
                                {release.date}
                            </Badge>
                        </div>

                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            {release.changes.map((change, cIdx) => (
                                <li key={cIdx} className="leading-relaxed">
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
