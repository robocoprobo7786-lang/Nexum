"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  step3PublicationEvidenceSchema,
  type Step3PublicationEvidenceInput,
} from "@/lib/validations/publication";
import { createPublicationEvidence } from "@/actions/publications";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVIDENCE_TYPES = [
  "DOI Link",
  "Journal PDF URL",
  "Repository Link",
  "Conference Proceedings",
  "Certificate / Acceptance Letter",
  "Other Direct URL",
];

export function Step3Form({
  publicationId,
  initialData,
}: {
  publicationId: number;
  initialData?: Omit<Step3PublicationEvidenceInput, "publicationId">;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<Step3PublicationEvidenceInput>({
    resolver: zodResolver(step3PublicationEvidenceSchema),
    defaultValues: {
      publicationId,
      evidenceType: initialData?.evidenceType || "DOI Link",
      reference: initialData?.reference || "",
      verificationStatus: initialData?.verificationStatus || "pending",
    },
  });

  async function onSubmit(data: Step3PublicationEvidenceInput) {
    setIsPending(true);
    setGlobalError(null);

    try {
      const result = await createPublicationEvidence(data);

      if (result.success) {
        toast.success("Publication saved successfully!");
        router.push(`/publications/${publicationId}`);
      } else {
        setGlobalError(result.error || "An error occurred.");
        toast.error(result.error || "Failed to save evidence.");
      }
    } catch (err) {
      setGlobalError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Step 3 of 3
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Evidence & Links</h1>
        <p className="text-muted-foreground mt-2">
          Attach verification evidence or external reference links to finalize the publication record.
        </p>
      </div>

      {globalError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6 text-sm">
          {globalError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="evidenceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Evidence Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val: string | null) => {
                        if (val) field.onChange(val);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select evidence type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVIDENCE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categorize the type of verification material being provided.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reference / URL <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://doi.org/10.1000/182 or https://arxiv.org/abs/..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a direct link or text reference to verify this publication.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="verificationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Verification Status</FormLabel>
                    <Select
                      onValueChange={(val: string | null) => {
                        if (val) field.onChange(val);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending Verification</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      New submissions default to &quot;Pending Verification&quot;.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Back
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Publication"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
