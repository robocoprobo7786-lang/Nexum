"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import type { PublicationWithDetails } from "@/db/queries/publications";
import { cn } from "@/lib/utils";
import { FilterX } from "lucide-react";

interface PublicationsTableProps {
  publications: PublicationWithDetails[];
  error?: string | null;
  activeFilterLabels?: string[];
  onClearFilters?: () => void;
}

export function PublicationsTable({
  publications,
  error,
  activeFilterLabels = [],
}: PublicationsTableProps) {
  const router = useRouter();

  if (error) {
    return <ErrorState title="Database Error" message={error} />;
  }

  if (!publications || publications.length === 0) {
    const hasFilters = activeFilterLabels.length > 0;
    return (
      <EmptyState
        title={hasFilters ? "No publications match your filters" : "No publications found"}
        description={
          hasFilters
            ? `No matching records found for active filters: ${activeFilterLabels.join(", ")}.`
            : "No publication records exist in the database."
        }
        action={
          hasFilters
            ? {
                label: "Clear Filters",
                onClick: () => router.push("/publications"),
              }
            : undefined
        }
      />
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden p-0 rounded-card">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground py-3">
              Title
            </TableHead>
            <TableHead className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 w-32">
              Type
            </TableHead>
            <TableHead className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 w-64">
              Authors
            </TableHead>
            <TableHead className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 w-24">
              Year
            </TableHead>
            <TableHead className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground py-3 w-36 text-right">
              Evidence Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications.map((pub) => {
            const firstAuthorObj = pub.publicationAuthors[0];
            const firstAuthorName =
              firstAuthorObj?.faculty?.name ??
              firstAuthorObj?.externalAuthor?.name ??
              "No authors assigned";

            const extraAuthorsCount = Math.max(
              0,
              pub.publicationAuthors.length - 1
            );

            const primaryEvidence = pub.evidences[0];
            const rawStatus = primaryEvidence?.verificationStatus ?? "missing";

            let badgeConfig = {
              label: "Missing",
              dotClass: "bg-danger",
              badgeClass: "bg-danger/10 text-danger border-danger/20",
            };

            if (rawStatus === "verified") {
              badgeConfig = {
                label: "Verified",
                dotClass: "bg-secondary",
                badgeClass: "bg-secondary/15 text-secondary border-secondary/30",
              };
            } else if (rawStatus === "pending") {
              badgeConfig = {
                label: "Pending",
                dotClass: "bg-warning",
                badgeClass: "bg-warning/15 text-warning border-warning/30",
              };
            }

            return (
              <TableRow
                key={pub.id}
                onClick={() => router.push(`/publications/${pub.id}`)}
                className="cursor-pointer transition-colors hover:bg-muted/60 border-b border-border/70 group"
              >
                {/* Title */}
                <TableCell className="font-medium text-foreground py-3.5">
                  <Link
                    href={`/publications/${pub.id}`}
                    className="group-hover:text-primary font-body text-sm font-semibold transition-colors block line-clamp-2"
                  >
                    {pub.title}
                  </Link>
                  {pub.doiOrReference && (
                    <span className="text-xs text-muted-foreground font-mono block mt-0.5">
                      DOI: {pub.doiOrReference}
                    </span>
                  )}
                </TableCell>

                {/* Type */}
                <TableCell className="py-3.5">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="inline-flex items-center text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-control bg-muted border border-border">
                      {pub.publicationType?.name ?? "Unspecified"}
                    </span>
                    {pub.quartile && pub.publicationType?.name === "Journal" && (
                      <span className="inline-flex items-center text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-md px-1.5 py-0.5">
                        {pub.quartile}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Authors */}
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-foreground font-medium truncate max-w-[160px]">
                      {firstAuthorName}
                    </span>
                    {extraAuthorsCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[11px] font-semibold text-muted-foreground bg-background border-border px-1.5 py-0 rounded-control shrink-0"
                      >
                        +{extraAuthorsCount}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Year */}
                <TableCell className="py-3.5 text-sm font-medium text-foreground">
                  {pub.year}
                </TableCell>

                {/* Evidence Status */}
                <TableCell className="py-3.5 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-pill border",
                      badgeConfig.badgeClass
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        badgeConfig.dotClass
                      )}
                    />
                    {badgeConfig.label}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
