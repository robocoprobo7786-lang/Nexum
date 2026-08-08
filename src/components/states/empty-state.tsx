import { LucideIcon, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({
  title = "No records found",
  description = "No items match the selected criteria. Try adjusting filters or adding a new record.",
  icon: Icon = FileQuestion,
  action,
}: EmptyStateProps) {
  return (
    <Card className="p-8 sm:p-12 text-center bg-card border-border flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-heading font-bold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {action && (
        <div className="pt-2">
          <Button
            onClick={action.onClick}
            asChild={Boolean(action.href)}
            size="sm"
            className="font-heading font-semibold"
          >
            {action.href ? <a href={action.href}>{action.label}</a> : action.label}
          </Button>
        </div>
      )}
    </Card>
  );
}
