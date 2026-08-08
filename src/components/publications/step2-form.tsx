"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Trash2, Plus, Check, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  step2PublicationAuthorsSchema,
  type Step2PublicationAuthorsInput,
} from "@/lib/validations/publication";
import { savePublicationAuthors } from "@/actions/publications";

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
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Faculty = {
  id: number;
  name: string;
  department: {
    id: number;
    name: string;
  };
};

type ExternalAuthor = {
  id: number;
  name: string;
  affiliation: string | null;
};

export function Step2Form({
  publicationId,
  facultyList,
  externalAuthorsList,
  initialAuthors = [],
  isEditing = false,
}: {
  publicationId: number;
  facultyList: Faculty[];
  externalAuthorsList: ExternalAuthor[];
  initialAuthors?: {
    facultyId?: number;
    externalAuthorId?: number;
    newExternalAuthor?: { name: string; affiliation?: string | null };
  }[];
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [openFaculty, setOpenFaculty] = useState(false);
  const [openExternal, setOpenExternal] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // External Author creation state
  const [extSearch, setExtSearch] = useState("");
  const [isCreatingExt, setIsCreatingExt] = useState(false);
  const [newExtName, setNewExtName] = useState("");
  const [newExtAffiliation, setNewExtAffiliation] = useState("");

  const form = useForm<Step2PublicationAuthorsInput>({
    resolver: zodResolver(step2PublicationAuthorsSchema),
    defaultValues: {
      publicationId,
      authors: initialAuthors,
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    name: "authors",
    control: form.control,
  });

  const hasFaculty = fields.some((f) => f.facultyId);
  const hasExternal = fields.some((f) => f.externalAuthorId || f.newExternalAuthor);

  async function onSubmit(data: Step2PublicationAuthorsInput) {
    setIsPending(true);
    setGlobalError(null);
    try {
      const result = await savePublicationAuthors(data);

      if (result.success) {
        toast.success("Authors saved successfully.");
        if (isEditing) {
          router.push(`/publications/${publicationId}/edit/evidence`);
        } else {
          router.push(`/publications/new/${publicationId}/evidence`);
        }
      } else {
        setGlobalError(result.error || "An error occurred.");
        toast.error(result.error || "Failed to save authors.");
      }
    } catch (err) {
      setGlobalError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  const handleSelectFaculty = (facultyId: number) => {
    const isDuplicate = fields.some((f) => f.facultyId === facultyId);
    if (isDuplicate) {
      toast.error("This faculty member is already added.");
      return;
    }
    append({ facultyId });
    setOpenFaculty(false);
  };

  const handleSelectExternal = (externalId: number) => {
    const isDuplicate = fields.some((f) => f.externalAuthorId === externalId);
    if (isDuplicate) {
      toast.error("This external author is already added.");
      return;
    }
    append({ externalAuthorId: externalId });
    setOpenExternal(false);
    resetExtForm();
  };

  const handleCreateExternal = () => {
    if (!newExtName.trim()) {
      toast.error("Name is required");
      return;
    }
    append({
      newExternalAuthor: {
        name: newExtName.trim(),
        affiliation: newExtAffiliation.trim() || undefined,
      },
    });
    setOpenExternal(false);
    resetExtForm();
  };

  const resetExtForm = () => {
    setIsCreatingExt(false);
    setExtSearch("");
    setNewExtName("");
    setNewExtAffiliation("");
  };

  const filteredExternalAuthors = externalAuthorsList.filter((ea) =>
    ea.name.toLowerCase().includes(extSearch.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Step 2 of 3
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Authors</h1>
        <p className="text-muted-foreground mt-2">
          Add internal and external authors to this publication.
        </p>
      </div>

      {globalError && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6 text-sm">
          {globalError}
        </div>
      )}

      {fields.length > 0 && !hasExternal && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-md mb-6 text-sm flex items-start gap-3 border border-blue-200 dark:border-blue-800">
          <div className="mt-0.5"><Check className="h-4 w-4" /></div>
          <div>
            <strong>Tip:</strong> This publication currently has zero external authors. The acceptance test requires at least one external author.
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col space-y-2">
                <FormLabel>Author List</FormLabel>
                <FormDescription>
                  Authors will be listed in the order they appear here. Use the
                  arrows to reorder. Must include at least one internal faculty author.
                </FormDescription>

                {fields.length === 0 && (
                  <div className="py-8 text-center border-2 border-dashed rounded-lg border-muted">
                    <p className="text-muted-foreground text-sm">
                      No authors added yet.
                    </p>
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  {fields.map((field, index) => {
                    let displayName = "";
                    let displayAffiliation = "";
                    let isExternal = false;

                    if (field.facultyId) {
                      const faculty = facultyList.find((f) => f.id === field.facultyId);
                      displayName = faculty?.name || "Unknown Faculty";
                      displayAffiliation = faculty?.department.name || "Unknown Dept";
                    } else if (field.externalAuthorId) {
                      const ext = externalAuthorsList.find((e) => e.id === field.externalAuthorId);
                      displayName = ext?.name || "Unknown External";
                      displayAffiliation = ext?.affiliation || "External";
                      isExternal = true;
                    } else if (field.newExternalAuthor) {
                      displayName = field.newExternalAuthor.name;
                      displayAffiliation = field.newExternalAuthor.affiliation || "External";
                      isExternal = true;
                    }

                    return (
                      <div
                        key={field.id}
                        className={cn(
                          "flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm",
                          isExternal && "border-l-4 border-l-amber-500/50"
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === 0}
                            onClick={() => swap(index, index - 1)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === fields.length - 1}
                            onClick={() => swap(index, index + 1)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className={cn(
                            "text-lg select-none",
                            isExternal ? "text-amber-500" : "text-primary"
                          )}>
                            {isExternal ? "◇" : "⦿"}
                          </span>
                          <span className="font-medium truncate">
                            {displayName}
                          </span>
                          <Badge variant={isExternal ? "outline" : "secondary"} className="ml-2 font-normal">
                            {displayAffiliation}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {form.formState.errors.authors && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.authors.message}
                </p>
              )}

              <div className="pt-4 flex flex-wrap items-center gap-4">
                {/* Faculty Popover */}
                <Popover open={openFaculty} onOpenChange={setOpenFaculty}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFaculty}
                        className="w-[280px] justify-between"
                      >
                        <span className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Add internal faculty author
                        </span>
                      </Button>
                    }
                  />
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search faculty..." />
                      <CommandList>
                        <CommandEmpty>No faculty found.</CommandEmpty>
                        <CommandGroup>
                          {facultyList.map((faculty) => {
                            const isAdded = fields.some(
                              (f) => f.facultyId === faculty.id
                            );
                            return (
                              <CommandItem
                                key={faculty.id}
                                value={`${faculty.name} ${faculty.department.name}`}
                                onSelect={() => handleSelectFaculty(faculty.id)}
                                disabled={isAdded}
                                className={cn(
                                  isAdded ? "opacity-50" : ""
                                )}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isAdded ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{faculty.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {faculty.department.name}
                                  </span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* External Author Popover */}
                <Popover open={openExternal} onOpenChange={(val) => {
                  setOpenExternal(val);
                  if (!val) resetExtForm();
                }}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openExternal}
                        className="w-[280px] justify-between border-dashed"
                      >
                        <span className="flex items-center">
                          <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                          Add external author
                        </span>
                      </Button>
                    }
                  />
                  <PopoverContent className="w-[300px] p-0" align="start">
                    {isCreatingExt ? (
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none text-sm">New External Author</h4>
                          <p className="text-xs text-muted-foreground">
                            Add a new external collaborator.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="ext-name" className="text-xs">Full Name <span className="text-destructive">*</span></Label>
                            <Input
                              id="ext-name"
                              size={1}
                              className="h-8 text-sm"
                              placeholder="e.g. Dr. Jane Smith"
                              value={newExtName}
                              onChange={(e) => setNewExtName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="ext-affil" className="text-xs">Affiliation <span className="text-muted-foreground">(Optional)</span></Label>
                            <Input
                              id="ext-affil"
                              size={1}
                              className="h-8 text-sm"
                              placeholder="e.g. MIT"
                              value={newExtAffiliation}
                              onChange={(e) => setNewExtAffiliation(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setIsCreatingExt(false)}>
                            Cancel
                          </Button>
                          <Button size="sm" className="h-8 text-xs" onClick={handleCreateExternal}>
                            Add Author
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center border-b px-3">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search external authors..."
                            value={extSearch}
                            onChange={(e) => setExtSearch(e.target.value)}
                          />
                        </div>
                        
                        <div className="max-h-[200px] overflow-y-auto p-1">
                          {filteredExternalAuthors.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No authors found.
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredExternalAuthors.map((ext) => {
                                const isAdded = fields.some((f) => f.externalAuthorId === ext.id);
                                return (
                                  <div
                                    key={ext.id}
                                    className={cn(
                                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                      isAdded && "opacity-50 pointer-events-none"
                                    )}
                                    onClick={() => !isAdded && handleSelectExternal(ext.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 shrink-0",
                                        isAdded ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span>{ext.name}</span>
                                      {ext.affiliation && (
                                        <span className="text-xs text-muted-foreground">
                                          {ext.affiliation}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t p-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-sm h-9"
                            onClick={() => {
                              setNewExtName(extSearch);
                              setIsCreatingExt(true);
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create new author {extSearch ? `"${extSearch}"` : ""}
                          </Button>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

              </div>
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
              {isPending ? "Saving..." : "Next: Evidence"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
