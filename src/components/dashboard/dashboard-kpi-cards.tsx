import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Globe2, FileCheck } from "lucide-react";

interface DashboardKpiCardsProps {
  totalPublications: number;
  totalFaculty: number;
  totalExternal: number;
  evidenceReadiness: {
    verified: number;
    pending: number;
    missing: number;
  };
}

export function DashboardKpiCards({
  totalPublications,
  totalFaculty,
  totalExternal,
  evidenceReadiness,
}: DashboardKpiCardsProps) {
  const totalEvidence =
    evidenceReadiness.verified + evidenceReadiness.pending + evidenceReadiness.missing;
  const verifiedPct = totalEvidence > 0 ? (evidenceReadiness.verified / totalEvidence) * 100 : 0;
  const pendingPct = totalEvidence > 0 ? (evidenceReadiness.pending / totalEvidence) * 100 : 0;
  const missingPct = totalEvidence > 0 ? (evidenceReadiness.missing / totalEvidence) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Publications
          </CardTitle>
          <BookOpen className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-heading">{totalPublications}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faculty Researchers
          </CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-heading">{totalFaculty}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            External Collaborators
          </CardTitle>
          <Globe2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-heading">{totalExternal}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Evidence Readiness
          </CardTitle>
          <FileCheck className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-xl font-bold font-heading">
              {evidenceReadiness.verified} / {totalEvidence} Verified
            </div>
            {totalEvidence > 0 ? (
              <div className="flex h-2.5 w-full rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${verifiedPct}%` }}
                  title={`${evidenceReadiness.verified} Verified`}
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${pendingPct}%` }}
                  title={`${evidenceReadiness.pending} Pending`}
                />
                <div
                  className="bg-rose-500"
                  style={{ width: `${missingPct}%` }}
                  title={`${evidenceReadiness.missing} Missing`}
                />
              </div>
            ) : (
              <div className="flex h-2.5 w-full rounded-full bg-muted overflow-hidden" />
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Missing
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
