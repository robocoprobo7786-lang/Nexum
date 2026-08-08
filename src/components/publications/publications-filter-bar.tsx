"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department, PublicationType } from "@/db/schema";

interface PublicationsFilterBarProps {
  departments: Department[];
  publicationTypes: PublicationType[];
  years: number[];
}

export function PublicationsFilterBar({
  departments,
  publicationTypes,
  years,
}: PublicationsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentDept = searchParams.get("dept") || "";
  const currentType = searchParams.get("type") || "";
  const currentYear = searchParams.get("year") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "year-desc";
  const currentQuartile = searchParams.get("quartile") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset page to 1 when filters change (unless page itself is updated)
      if (!("page" in newParams)) {
        params.delete("page");
      }

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasActiveFilters =
    !!currentSearch ||
    !!currentDept ||
    !!currentType ||
    !!currentYear ||
    !!currentStatus ||
    !!currentQuartile ||
    (currentSort !== "year-desc" && currentSort !== "");

  return (
    <div className="space-y-4 bg-card border border-border p-4 rounded-xl shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by title or DOI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => updateFilters({ search: searchTerm.trim() || null })}
            className="pl-9 pr-8 text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateFilters({ search: null });
              }}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-wrap">
          {/* Department Filter */}
          <Select
            value={currentDept || "all"}
            onValueChange={(val: string | null) => updateFilters({ dept: val })}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={currentType || "all"}
            onValueChange={(val: string | null) => updateFilters({ type: val })}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {publicationTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Filter */}
          <Select
            value={currentYear || "all"}
            onValueChange={(val: string | null) => updateFilters({ year: val })}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={currentStatus || "all"}
            onValueChange={(val: string | null) => updateFilters({ status: val })}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Evidence Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>

          {/* Quartile Filter */}
          <Select
            value={currentQuartile || "all"}
            onValueChange={(val: string | null) => updateFilters({ quartile: val })}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Quartile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quartiles</SelectItem>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <Select
            value={currentSort}
            onValueChange={(val: string | null) => updateFilters({ sort: val })}
          >
            <SelectTrigger className="text-xs h-9 w-[130px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year-desc">Year (Newest)</SelectItem>
              <SelectItem value="year-asc">Year (Oldest)</SelectItem>
              <SelectItem value="title-asc">Title (A–Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z–A)</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              title="Clear all active filters"
            >
              <Filter className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
