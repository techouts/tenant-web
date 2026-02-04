"use client";

import React, { useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { Search, Loader2 } from "lucide-react";

import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { capitalizeAndCleanString } from "@/lib/CapitalizeString";
import { search } from "../apis";

export default function PlaygroundPage() {
  const { toast } = useToast();
  const [currentQuery, setCurrentQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [facetsData, setFacetsData] = useState<any>({});
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});

  const [loader, setLoader] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (
    searchQuery?: string,
    facets?: Record<string, string[]>,
  ) => {
    const queryToUse = searchQuery ?? currentQuery;
    const facetsToUse = facets ?? selectedFacets;

    if (!queryToUse) {
      setResults([]);
      setFacetsData({});
      setShowResults(false);
      return;
    }

    setLoader(true);

    try {
      const params = new URLSearchParams({
        q: queryToUse,
        source: "ginger",
      });

      Object?.entries(facetsToUse)?.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        }
      });

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/feature/search/tenant?${params.toString()}`;

      const response = await search(url);

      if (response?.error) {
        throw new Error("Search failed");
      }

      setResults(response?.data?.hotels?.main_hotels || []);
      setFacetsData(response?.data?.facets || {});
      setShowResults(true);

      const autoSelected: Record<string, string[]> = {};

      if (response?.facets?.hotelcity) {
        const cities = Object.keys(response?.facets?.hotelcity);
        if (cities?.length === 1) autoSelected.hotelcity = [cities[0]];
      }

      setSelectedFacets((prev) => ({ ...prev, ...autoSelected }));

      if (searchQuery !== undefined) {
        setCurrentQuery(searchQuery);
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again",
      });
      setShowResults(false);
    } finally {
      setLoader(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        handleSearch(value);
      }, 500),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentQuery(value);
    debouncedSearch(value);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        title="Search Playground"
        description="Test and refine search queries on your catalog in real-time."
      />

      <div className="grid md:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Test Query</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels..."
                  className="pl-10"
                  value={currentQuery}
                  onChange={handleQueryChange}
                />
              </div>

              {Object?.keys(facetsData)?.length > 0 && (
                <div className="mt-6 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Facets</h3>
                    {/* <button onClick={() => setSelectedFacets({})}>
                      <CardDescription>Clear filters</CardDescription>
                    </button> */}
                  </div>
                  {Object?.entries(facetsData)?.map(
                    ([facetKey, facetValue]: any) => (
                      <>
                        {Object?.keys(facetValue)?.length > 0 &&
                          facetKey !== "country" && (
                            <div key={facetKey}>
                              <h4 className="mb-2 text-sm font-medium">
                                {capitalizeAndCleanString(facetKey)}
                              </h4>

                              <Select
                                value={selectedFacets[facetKey]?.[0]}
                                onValueChange={(value) => {
                                  const updatedFacets = {
                                    ...selectedFacets,
                                    [facetKey]: [value],
                                  };

                                  setSelectedFacets(updatedFacets);
                                  handleSearch(undefined, updatedFacets);
                                }}
                              >
                                <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                                  <SelectValue
                                    placeholder={`Select ${capitalizeAndCleanString(facetKey)}`}
                                  />
                                </SelectTrigger>

                                <SelectContent className="max-h-[180px]">
                                  {Object?.keys(facetValue)?.map((facet) => (
                                    <SelectItem key={facet} value={facet}>
                                      {capitalizeAndCleanString(facet)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                      </>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 h-[calc(100vh-10rem)]">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Search results will appear here.
              </CardDescription>
            </CardHeader>

            <CardContent className=" h-full  overflow-y-scroll">
              {loader && (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!loader && showResults && results.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  No results found
                </div>
              )}

              {!loader &&
                results.map((item) => (
                  <div
                    key={item.hotel_name}
                    className="p-3 rounded-md hover:bg-muted"
                  >
                    <h3 className="font-semibold">
                      {item.hotel_name || item.name}
                    </h3>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
