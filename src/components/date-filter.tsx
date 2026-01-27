'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DateFilterProps {
    onApply: (range: { start: string; end: string }) => void;
    initialStart?: string;
    initialEnd?: string;
}

export function DateFilter({ onApply, initialStart = '', initialEnd = '' }: DateFilterProps) {
    const [open, setOpen] = useState(false);
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);

    const handleApply = () => {
        onApply({ start, end });
        setOpen(false);
    };

    const handleClear = () => {
        setStart('');
        setEnd('');
        onApply({ start: '', end: '' });
        setOpen(false);
    };

    const hasFilter = start || end;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal h-10 px-3 rounded-xl shadow-sm border-none bg-card hover:bg-muted/50",
                        !hasFilter && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {hasFilter ? (
                        <span>
                            {start ? format(new Date(start), 'MMM d') : '...'} - {end ? format(new Date(end), 'MMM d') : '...'}
                        </span>
                    ) : (
                        <span>Filter by Date</span>
                    )}
                    {hasFilter && (
                        <span
                            className="ml-2 hover:bg-muted rounded-full p-0.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Date Range</h4>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium">Start</span>
                            <Input
                                type="date"
                                className="col-span-2 h-8"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm font-medium">End</span>
                            <Input
                                type="date"
                                className="col-span-2 h-8"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button size="sm" onClick={handleApply}>
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
