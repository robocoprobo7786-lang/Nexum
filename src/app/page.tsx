import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getDashboardKPIs, getRecentContributions } from "@/db/queries/dashboard";
import { getReportsData } from "@/db/queries/reports";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { RecentContributionsList } from "@/components/dashboard/recent-contributions-list";
import { ReportsCharts } from "@/components/reports/reports-charts";
import { ErrorState } from "@/components/states/error-state";

export const revalidate = 0;

export default async function DashboardPage() {
  const [kpisResponse, recentResponse, reportsResponse] = await Promise.all([
    getDashboardKPIs(),
    getRecentContributions(5),
    getReportsData(),
  ]);

  if (kpisResponse.error || recentResponse.error || reportsResponse.error) {
    return (
      <div className="space-y-6 container mx-auto max-w-6xl py-6">
        <PageHeader
          title="Research Portfolio"
          description="Institutional research activity & accreditation readiness overview"
        />
        <ErrorState 
          title="Failed to load dashboard" 
          message={kpisResponse.error || recentResponse.error || reportsResponse.error || "Unknown error"} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto max-w-6xl py-6">
      <PageHeader
        title="Research Portfolio"
        description="Institutional research activity & accreditation readiness overview"
        action={
          <Button asChild className="gap-2 font-heading font-semibold">
            <Link href="/publications/new">
              <Plus className="w-4 h-4" />
              New Publication
            </Link>
          </Button>
        }
      />
      
      <DashboardKpiCards
        totalPublications={kpisResponse.totalPublications}
        totalFaculty={kpisResponse.totalFaculty}
        totalExternal={kpisResponse.totalExternal}
        evidenceReadiness={kpisResponse.evidenceReadiness}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contributions List */}
        <RecentContributionsList recent={recentResponse.recent} />
      </div>

      <div className="pt-2">
        <ReportsCharts
          byYear={reportsResponse.byYear}
          byDepartment={reportsResponse.byDepartment}
          byType={reportsResponse.byType}
          hideFacultyList={true}
        />
      </div>
    </div>
  );
}