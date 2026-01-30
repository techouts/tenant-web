"use client";

import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import Image from "next/image";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { SearchResult } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { search } from "../apis";
import { useToast } from "@/hooks/use-toast";

export default function PlaygroundPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setHasSearched(true);
      try {
        const searchResults = await search(searchQuery);
        if (!searchResults?.error) {
          setResults(searchResults?.hotels?.main_hotels);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast({
            title: `Error:${searchResults?.error as any}`,
          });
        }
      } catch (err: any) {
        toast({
          title: err?.error as any,
          duration: 2000,
        });
      }
    }, 500),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setIsLoading(true);
    debouncedSearch(newQuery);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        title="Search Playground"
        description="Test and refine search queries on your catalog in real-time."
      />
      <div className="grid md:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        {/* Search Panel */}
        <div className="md:col-span-4 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Test Query</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10"
                  value={query}
                  onChange={handleQueryChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-8 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Search results will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {isLoading && (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  {!isLoading && hasSearched && results?.length === 0 && (
                    <div className="text-center p-8">
                      <p className="font-semibold">No results found</p>
                      <p className="text-sm text-muted-foreground">
                        Try a different search term.
                      </p>
                    </div>
                  )}
                  {!isLoading && !hasSearched && (
                    <div className="text-center p-8">
                      <p className="font-semibold">Start searching</p>
                      <p className="text-sm text-muted-foreground">
                        Type in the search box to see results.
                      </p>
                    </div>
                  )}
                  {!isLoading &&
                    results &&
                    results?.length > 0 &&
                    results?.map((result) => (
                      <div
                        key={result?.hotel_name}
                        className="flex items-center gap-4 p-2 rounded-md hover:bg-muted"
                      >
                        {/* <Image  
                          src={result?.imageUrl}
                          alt={result?.hotel_name}
                          width={80}
                          height={60}
                          data-ai-hint={result.imageHint}
                          className="rounded-md object-cover w-20 h-16"
                        /> */}
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {result?.hotel_name || result?.name}
                          </h3>
                        </div>
                        {/* <div className="font-semibold text-lg">
                          ${result.price.toFixed(2)}
                        </div> */}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
