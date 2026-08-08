import { getFacultyProfile } from "@/db/queries/faculty";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FacultyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facultyId = parseInt(id, 10);

  if (isNaN(facultyId)) {
    notFound();
  }

  const profile = await getFacultyProfile(facultyId);

  if (!profile) {
    notFound();
  }

  const { faculty, publications, kpis, evidenceSummary, topCollaborators } = profile;

  // Segmented evidence bar calculation
  const total = evidenceSummary.total;
  const verifiedPct = total > 0 ? (evidenceSummary.verified / total) * 100 : 0;
  const pendingPct = total > 0 ? (evidenceSummary.pending / total) * 100 : 0;
  const missingPct = total > 0 ? (evidenceSummary.missing / total) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href="/faculty">
            <ArrowLeft className="w-4 h-4" />
            Back to Faculty Directory
          </Link>
        </Button>
      </div>

      {/* Header */}
      <PageHeader
        title={faculty.name}
        description={`${faculty.department.name} · ${faculty.email}`}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Publications KPI */}
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Publications
              </p>
              <h3 className="text-2xl font-bold text-foreground font-mono mt-0.5">
                {kpis.publicationCount}
              </h3>
            </div>
          </div>
        </Card>

        {/* Active Years KPI */}
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Years
              </p>
              <h3 className="text-2xl font-bold text-foreground font-mono mt-0.5">
                {kpis.activeYearsRange}
              </h3>
            </div>
          </div>
        </Card>

        {/* External Collaborators KPI */}
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ext. Collaborators
              </p>
              <h3 className="text-2xl font-bold text-foreground font-mono mt-0.5">
                {kpis.externalCollaboratorCount}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Evidence Status Summary Segmented Bar (1 cols or 3 cols layout) */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Evidence Verification Breakdown</span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                {total} total records
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Segmented Bar */}
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
              {verifiedPct > 0 && (
                <div
                  style={{ width: `${verifiedPct}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Verified: ${evidenceSummary.verified}`}
                />
              )}
              {pendingPct > 0 && (
                <div
                  style={{ width: `${pendingPct}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`Pending: ${evidenceSummary.pending}`}
                />
              )}
              {missingPct > 0 && (
                <div
                  style={{ width: `${missingPct}%` }}
                  className="bg-slate-300 dark:bg-slate-700 h-full transition-all"
                  title={`Missing: ${evidenceSummary.missing}`}
                />
              )}
            </div>

            {/* Segment Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground">{evidenceSummary.verified}</span>
                <span className="text-muted-foreground">Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-foreground">{evidenceSummary.pending}</span>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-foreground">{evidenceSummary.missing}</span>
                <span className="text-muted-foreground">Missing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Collaborators Section */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              Top Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCollaborators.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No co-author collaborations recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topCollaborators.map((collab) => (
                  <div
                    key={`${collab.isExternal ? 'ext' : 'fac'}-${collab.id}`}
                    className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                  >
                    <div className="space-y-0.5 truncate max-w-[150px]">
                      <span className="font-medium text-foreground block truncate">
                        {collab.isExternal ? "◇ " : "⦿ "}
                        {collab.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {collab.subtext}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {collab.count} {collab.count === 1 ? "pub" : "pubs"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Publications List Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">
            Publications ({publications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Co-Authors</TableHead>
                <TableHead className="text-center">Year</TableHead>
                <TableHead className="text-center">Evidence</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No publications recorded for this faculty member.
                  </TableCell>
                </TableRow>
              ) : (
                publications.map((pub) => {
                  const authors = pub.publicationAuthors || [];
                  const firstAuthor = authors[0]?.faculty?.name || authors[0]?.externalAuthor?.name || "Unknown";
                  const totalAuthors = authors.length;
                  const authorsLabel = totalAuthors > 1 ? `${firstAuthor} +${totalAuthors - 1}` : firstAuthor;

                  const hasVerified = pub.evidences?.some((e) => e.verificationStatus === "verified");
                  const hasPending = pub.evidences?.some((e) => e.verificationStatus === "pending");

                  return (
                    <TableRow key={pub.id} className="group">
                      <TableCell className="font-medium max-w-xs truncate">
                        <Link
                          href={`/publications/${pub.id}`}
                          className="hover:text-primary hover:underline font-semibold block truncate"
                        >
                          {pub.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal text-xs">
                          {pub.publicationType?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {authorsLabel}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {pub.year}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            hasVerified
                              ? "default"
                              : hasPending
                              ? "outline"
                              : "secondary"
                          }
                          className="capitalize text-[10px]"
                        >
                          {hasVerified ? "Verified" : hasPending ? "Pending" : "Missing"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                          <Link href={`/publications/${pub.id}`}>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
