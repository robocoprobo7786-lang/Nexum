import { getFacultyListWithCounts } from "@/db/queries/faculty";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function FacultyDirectoryPage() {
  const facultyMembers = await getFacultyListWithCounts();

  return (
    <div className="space-y-6 container mx-auto max-w-5xl py-6">
      <PageHeader
        title="Faculty Directory"
        description="Browse all academic faculty members and their research output."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Publications</TableHead>
                <TableHead className="text-right">Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facultyMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No faculty members found.
                  </TableCell>
                </TableRow>
              ) : (
                facultyMembers.map((faculty) => (
                  <TableRow key={faculty.id} className="group">
                    <TableCell className="font-semibold text-foreground">
                      <Link
                        href={`/faculty/${faculty.id}`}
                        className="hover:text-primary hover:underline flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        {faculty.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {faculty.departmentName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-medium text-sm">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        {faculty.publicationCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="gap-1">
                        <Link href={`/faculty/${faculty.id}`}>
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
