"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Building2, PieChart as PieIcon, BarChart3, Users, FileCheck, Network, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ReportsChartsProps {
  byYear: {
    data: { year: number; count: number }[];
    insight: string;
  };
  facultyList?: {
    facultyId: number;
    facultyName: string;
    departmentName: string;
    publicationCount: number;
  }[];
  byDepartment: {
    data: { departmentId: number; departmentName: string; publicationCount: number }[];
    insight: string;
  };
  byType: {
    data: { typeId: number; typeName: string; count: number; percentage: number }[];
    total: number;
    insight: string;
  };
  evidenceReadiness?: {
    total: number;
    verified: number;
    pending: number;
    missing: number;
    percentage: number;
  };
  crossDepartmentList?: {
    deptA: string;
    deptB: string;
    count: number;
  }[];
  hideFacultyList?: boolean;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#6366f1"];

export function ReportsCharts({
  byYear,
  facultyList = [],
  byDepartment,
  byType,
  evidenceReadiness,
  crossDepartmentList = [],
  hideFacultyList = false,
}: ReportsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Grid 1: Year Chart & Type Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Publications by Year */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Publications by Year
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-2 space-y-4">
            <div className="h-64 w-full pt-4">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byYear.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card, #fff)",
                        borderColor: "var(--color-border, #ccc)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} name="Publications" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-muted/30 animate-pulse rounded-md" />
              )}
            </div>

            {/* Plain-Language Insight Line */}
            {byYear.insight && (
              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground flex items-start gap-2 border border-border/50">
                <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{byYear.insight}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Publication-Type Distribution */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              Publication Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-2 space-y-4">
            <div className="h-64 w-full pt-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType.data}
                      dataKey="count"
                      nameKey="typeName"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {byType.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, props: any) => [
                        `${value} (${props?.payload?.percentage ?? 0}%)`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "var(--color-card, #fff)",
                        borderColor: "var(--color-border, #ccc)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      formatter={(value, entry: any) => (
                        <span className="text-xs text-foreground font-medium">
                          {value} ({entry.payload.percentage}%)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-muted/30 animate-pulse rounded-md" />
              )}
            </div>

            {/* Plain-Language Insight Line */}
            {byType.insight && (
              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground flex items-start gap-2 border border-border/50">
                <PieIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{byType.insight}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid 2: Department-wise Bar & (Optional) Faculty List Table */}
      <div className={`grid grid-cols-1 ${hideFacultyList ? "md:grid-cols-1 lg:col-span-3" : "md:grid-cols-2"} gap-6`}>
        {/* 3. Department-wise Publications */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              Department-wise Publications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-2 space-y-4">
            <div className="h-64 w-full pt-4">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={byDepartment.data}
                    margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                  >
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="departmentName" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card, #fff)",
                        borderColor: "var(--color-border, #ccc)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="publicationCount" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Publications" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-muted/30 animate-pulse rounded-md" />
              )}
            </div>

            {/* Plain-Language Insight Line */}
            {byDepartment.insight && (
              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground flex items-start gap-2 border border-border/50">
                <Building2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{byDepartment.insight}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Faculty-wise Publication List */}
        {!hideFacultyList && (
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Faculty Publication Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col justify-between">
              <div className="max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card border-b">
                    <TableRow>
                      <TableHead className="text-xs">Faculty Name</TableHead>
                      <TableHead className="text-xs">Department</TableHead>
                      <TableHead className="text-xs text-right">Pubs</TableHead>
                      <TableHead className="text-xs text-right">Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facultyList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                          No faculty publication data available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      facultyList.map((fac) => (
                        <TableRow key={fac.facultyId} className="text-xs">
                          <TableCell className="font-medium text-foreground py-2.5">
                            <Link href={`/faculty/${fac.facultyId}`} className="hover:underline hover:text-primary">
                              {fac.facultyName}
                            </Link>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <Badge variant="outline" className="text-[10px] font-normal">
                              {fac.departmentName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold py-2.5">
                            {fac.publicationCount}
                          </TableCell>
                          <TableCell className="text-right py-2.5">
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link href={`/faculty/${fac.facultyId}`}>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-3 bg-muted/40 border-t border-border/50 text-xs text-muted-foreground">
                Showing top faculty members ranked by publication volume.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Grid 3: Evidence Readiness & Cross-Department Collaborations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evidence Readiness Detail */}
        {evidenceReadiness && (
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  Evidence Readiness Indicator
                </span>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {evidenceReadiness.percentage}% Ready
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-2 space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Institutional verification status across all {evidenceReadiness.total} recorded publication outputs.
                </p>
                {/* Segmented bar */}
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  {evidenceReadiness.total > 0 && (
                    <>
                      <div
                        style={{ width: `${(evidenceReadiness.verified / evidenceReadiness.total) * 100}%` }}
                        className="bg-emerald-500 h-full transition-all"
                        title={`Verified: ${evidenceReadiness.verified}`}
                      />
                      <div
                        style={{ width: `${(evidenceReadiness.pending / evidenceReadiness.total) * 100}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title={`Pending: ${evidenceReadiness.pending}`}
                      />
                      <div
                        style={{ width: `${(evidenceReadiness.missing / evidenceReadiness.total) * 100}%` }}
                        className="bg-slate-300 dark:bg-slate-700 h-full transition-all"
                        title={`Missing: ${evidenceReadiness.missing}`}
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-md border border-border/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold text-foreground font-mono">{evidenceReadiness.verified}</div>
                      <div className="text-[10px] text-muted-foreground">Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-md border border-border/40">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-foreground font-mono">{evidenceReadiness.pending}</div>
                      <div className="text-[10px] text-muted-foreground">Pending</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-md border border-border/40">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <div className="font-bold text-foreground font-mono">{evidenceReadiness.missing}</div>
                      <div className="text-[10px] text-muted-foreground">Missing</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border/50">
                Application-level indicator reflecting continuous evidence readiness for accreditation.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cross-Department Collaboration View */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-500" />
              Cross-Department Collaborations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col justify-between">
            <div className="max-h-64 overflow-y-auto p-4 space-y-2">
              {crossDepartmentList.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No inter-departmental co-authorships recorded yet.
                </p>
              ) : (
                crossDepartmentList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-medium text-foreground truncate">{item.deptA}</span>
                      <span className="text-muted-foreground font-mono">↔</span>
                      <span className="font-medium text-foreground truncate">{item.deptB}</span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] shrink-0">
                      {item.count} {item.count === 1 ? "pub" : "pubs"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 bg-muted/40 border-t border-border/50 text-xs text-muted-foreground">
              Inter-departmental co-authorships derived from publication-author relations.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
