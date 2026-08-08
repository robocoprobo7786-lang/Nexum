"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentContributionsList({ recent }: { recent: any[] }) {
  return (
    <Card className="col-span-1 lg:col-span-3 border-border bg-card rounded-card">
      <CardHeader>
        <CardTitle className="text-lg font-heading font-semibold">
          Recent Contributions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No recent publications found.
          </div>
        ) : (
          <div className="space-y-4">
            {recent.map((pub) => {
              const firstAuthorObj = pub.publicationAuthors[0];
              const firstAuthorName =
                firstAuthorObj?.faculty?.name ??
                firstAuthorObj?.externalAuthor?.name ??
                "No authors assigned";

              const extraAuthorsCount = Math.max(
                0,
                pub.publicationAuthors.length - 1
              );

              return (
                <div
                  key={pub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-control border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/publications/${pub.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors font-body line-clamp-1"
                    >
                      {pub.title}
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground/80">
                        {firstAuthorName}
                      </span>
                      {extraAuthorsCount > 0 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-background border-border px-1.5 py-0"
                        >
                          +{extraAuthorsCount}
                        </Badge>
                      )}
                      <span>•</span>
                      <span>{pub.publicationType?.name ?? "Unspecified"}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Link
                      href={`/publications/${pub.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
