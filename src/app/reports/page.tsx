import { getReportsData } from "@/db/queries/reports";
import { ReportsCharts } from "@/components/reports/reports-charts";
import { PageHeader } from "@/components/shell/page-header";
import { ErrorState } from "@/components/states/error-state";

export const revalidate = 0;

export default async function ReportsPage() {
  const { byYear, facultyList, byDepartment, byType, evidenceReadiness, crossDepartmentList, error } =
    await getReportsData();

  if (error) {
    return (
      <div className="space-y-6 container mx-auto max-w-6xl py-6">
        <PageHeader
          title="Reports & Analytics"
          description="Institutional publication metrics, faculty output, and distribution analysis"
        />
        <ErrorState title="Failed to load reports" message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto max-w-6xl py-6">
      <PageHeader
        title="Reports & Analytics"
        description="Institutional publication metrics, faculty output, and distribution analysis"
      />

      <ReportsCharts
        byYear={byYear}
        facultyList={facultyList}
        byDepartment={byDepartment}
        byType={byType}
        evidenceReadiness={evidenceReadiness}
        crossDepartmentList={crossDepartmentList}
      />
    </div>
  );
}
