import { AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while fetching information. Check connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="p-6 bg-card border-danger/30 border text-foreground space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-control bg-danger/10 text-danger flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-base font-heading font-bold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="flex justify-end pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      )}
    </Card>
  );
}
