import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Star } from "lucide-react";
import { PostItem } from "@/lib/store";

interface PostCardProps {
    post: PostItem;
    isBookmarked: boolean;
    onToggleBookmark: () => void;
}

export function PostCard({ post, isBookmarked, onToggleBookmark }: PostCardProps) {
    const { title, link, pubDate, contentSnippet, image, sourceName } = post;

    const cleanSnippet = contentSnippet?.replace(/<[^>]+>/g, '') || "";
    const truncatedSnippet = cleanSnippet.length > 100 ? cleanSnippet.slice(0, 100) + "..." : cleanSnippet;

    let relativeTime = "";
    try {
        relativeTime = formatDistanceToNow(new Date(post.isoDate || pubDate), { addSuffix: true });
    } catch {
        relativeTime = pubDate;
    }

    return (
        <Card className="flex flex-col h-[320px] overflow-hidden hover:shadow-lg transition-all duration-200 group border-0 shadow-sm bg-card ring-1 ring-border">
            {/* Image Section */}
            <div className="h-32 bg-muted relative overflow-hidden shrink-0">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                        <span className="text-4xl opacity-10 select-none">RSS</span>
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={`h-8 w-8 rounded-full shadow-sm backdrop-blur-md bg-background/80 hover:bg-background ${isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleBookmark();
                        }}
                    >
                        <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                </div>
            </div>

            <CardContent className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{sourceName}</span>
                    <span>•</span>
                    <span>{relativeTime}</span>
                </div>
                <h3 className="font-bold text-base leading-tight line-clamp-2" title={title}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-primary/50 underline-offset-2">
                        {title}
                    </a>
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3">
                    {truncatedSnippet}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button asChild variant="ghost" size="sm" className="w-full text-xs h-8 bg-muted/50 hover:bg-muted">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        Read Article <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
