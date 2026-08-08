import { getPublicationById } from "@/db/queries/publications";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicationDetailActions } from "@/components/publications/publication-detail-actions";

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pubId = parseInt(id, 10);

  if (isNaN(pubId)) {
    notFound();
  }

  const { publication, error } = await getPublicationById(pubId);

  if (error || !publication) {
    return (
      <div className="space-y-6">
        <PageHeader title="Publication Detail" />
        <Card className="p-8 text-center text-muted-foreground">
          Publication #{pubId} not found.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href="/publications">
            <ArrowLeft className="w-4 h-4" />
            Back to Publications
          </Link>
        </Button>
      </div>

      <PageHeader
        title={publication.title}
        description={`${publication.publicationType?.name ?? "Publication"} · ${publication.year}`}
        action={
          <PublicationDetailActions
            publicationId={publication.id}
            title={publication.title}
          />
        }
      />

      <div className="grid gap-6">
        {/* Basic Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Publication Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-border/50">
              <span className="text-muted-foreground">Type</span>
              <span className="col-span-2 font-medium">
                <Badge variant="secondary">{publication.publicationType?.name || "N/A"}</Badge>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-border/50">
              <span className="text-muted-foreground">Journal / Conference</span>
              <span className="col-span-2 font-medium">{publication.journalOrConference || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-border/50">
              <span className="text-muted-foreground">Year</span>
              <span className="col-span-2 font-medium">{publication.year}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="text-muted-foreground">DOI / Reference</span>
              <span className="col-span-2 font-medium truncate">{publication.doiOrReference || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Authors Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Authors ({publication.publicationAuthors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {publication.publicationAuthors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No authors assigned.</p>
            ) : (
              publication.publicationAuthors.map((pa) => {
                const isExternal = !!pa.externalAuthor;
                const name = pa.faculty?.name || pa.externalAuthor?.name || "Unknown";
                const affiliation = pa.faculty ? "Internal Faculty" : (pa.externalAuthor?.affiliation || "External");

                return (
                  <div
                    key={pa.id}
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-xs w-6">#{pa.authorOrder}</span>
                      <span className={isExternal ? "text-amber-500" : "text-primary"}>
                        {isExternal ? "◇" : "⦿"}
                      </span>
                      <span className="font-medium">
                        {pa.faculty ? (
                          <Link
                            href={`/faculty/${pa.facultyId}`}
                            className="text-primary hover:underline font-semibold"
                          >
                            {name}
                          </Link>
                        ) : (
                          name
                        )}
                      </span>
                    </div>
                    <Badge variant={isExternal ? "outline" : "secondary"}>
                      {affiliation}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Evidence Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              Evidence & Attachments ({publication.evidences.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {publication.evidences.length === 0 ? (
              <p className="text-sm text-muted-foreground">No evidence records attached.</p>
            ) : (
              publication.evidences.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-sm"
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <span>{ev.evidenceType}</span>
                      <Badge
                        variant={
                          ev.verificationStatus === "verified"
                            ? "default"
                            : ev.verificationStatus === "rejected"
                            ? "destructive"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {ev.verificationStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                      {ev.reference}
                    </p>
                  </div>
                  {ev.reference.startsWith("http") && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={ev.reference} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
