import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  type?: "table" | "cards" | "profile" | "dashboard";
  count?: number;
}

export function LoadingState({ type = "table", count = 4 }: LoadingStateProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-5 space-y-3 bg-card border-border">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-card border-border space-y-4">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-control" />
            ))}
          </div>
        </Card>
        <Card className="p-6 bg-card border-border space-y-3">
          <Skeleton className="h-6 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </Card>
      </div>
    );
  }

  // Default: Table skeleton matching design.md
  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-32 rounded-control" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-border/60">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}
