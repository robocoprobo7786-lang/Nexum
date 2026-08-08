"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

import {
  step1PublicationSchema,
  type Step1PublicationInput,
} from "@/lib/validations/publication";
import { createPublicationStep1, updatePublicationStep1 } from "@/actions/publications";
import type { PublicationType } from "@/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Step1FormProps {
  publicationTypes: PublicationType[];
  initialData?: Step1PublicationInput & { id: number };
}

export function Step1Form({ publicationTypes, initialData }: Step1FormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const currentYear = new Date().getFullYear();

  const form = useForm<Step1PublicationInput>({
    resolver: zodResolver(step1PublicationSchema),
    defaultValues: {
      title: initialData?.title || "",
      publicationTypeId: initialData?.publicationTypeId || publicationTypes[0]?.id || 1,
      journalOrConference: initialData?.journalOrConference || "",
      year: initialData?.year || currentYear,
      doiOrReference: initialData?.doiOrReference || "",
    },
  });

  async function onSubmit(data: Step1PublicationInput) {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing) {
        result = await updatePublicationStep1(initialData.id, data);
      } else {
        result = await createPublicationStep1(data);
      }

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to save publication details.");
        setIsSubmitting(false);
        return;
      }

      toast.success(isEditing ? "Publication details updated." : "Publication details saved. Proceeding to Authors step.");
      const newId = result.data.publicationId;
      if (isEditing) {
        router.push(`/publications/${newId}/edit/authors`);
      } else {
        router.push(`/publications/new/${newId}/authors`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving.");
      setIsSubmitting(false);
    }
  }


  return (
    <Card className="p-6 sm:p-8 bg-card border-border max-w-3xl mx-auto space-y-6">
      {/* Wizard Step Header per design.md §3.3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <span className="text-xs font-heading font-bold text-primary uppercase tracking-wider">
            Step 1 of 3
          </span>
          <h2 className="text-xl font-heading font-bold text-foreground mt-0.5">
            Publication Details
          </h2>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            1. Details
          </span>
          <span className="text-muted-foreground font-semibold">→</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full border border-muted-foreground inline-block" />
            2. Authors
          </span>
          <span className="text-muted-foreground font-semibold">→</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full border border-muted-foreground inline-block" />
            3. Evidence
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-foreground">
                  Publication Title <span className="text-danger">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. AI-Based Medical Imaging and Diagnostic Optimization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grid for Type and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Publication Type */}
            <FormField
              control={form.control}
              name="publicationTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    Publication Type <span className="text-danger">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(val: string | null) => {
                      if (val === null) return;
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) field.onChange(num);
                    }}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {publicationTypes.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-foreground">
                    Publication Year <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1990}
                      max={2030}
                      placeholder="2026"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Journal or Conference */}
          <FormField
            control={form.control}
            name="journalOrConference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-foreground">
                  Journal / Conference Venue
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. IEEE Transactions on Medical Imaging"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DOI / Reference */}
          <FormField
            control={form.control}
            name="doiOrReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-foreground">
                  DOI / Reference Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 10.1000/18273645 or ISBN/Patent Ref"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/publications")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 font-heading font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next: Authors
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
