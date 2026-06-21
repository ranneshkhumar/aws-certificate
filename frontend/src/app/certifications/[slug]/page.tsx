"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificationsService } from "@/services/certifications";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { DomainCard } from "@/components/certifications/domain-card";
import { DomainFormDialog } from "@/components/certifications/domain-form-dialog";
import { CertificationFormDialog } from "@/components/certifications/certification-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  ArrowLeft,
  Clock,
  HelpCircle,
  DollarSign,
  Monitor,
  Pencil,
  Trash2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CertificationLevel } from "@/lib/types";

const levelColors: Record<string, string> = {
  Foundational: "bg-blue-100 text-blue-800 border-blue-200",
  Associate: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Professional: "bg-purple-100 text-purple-800 border-purple-200",
  Specialty: "bg-amber-100 text-amber-800 border-amber-200",
};

const levels: CertificationLevel[] = [
  { id: "420c7078-1da5-4b25-8664-5cc95e74d9bb", name: "Foundational", displayOrder: 1 },
  { id: "5e610d7a-2cc2-4d58-900a-a99aa02ec842", name: "Associate", displayOrder: 2 },
  { id: "f7c48608-4a7c-4bec-a081-ae344a9f3a9f", name: "Professional", displayOrder: 3 },
  { id: "73da091e-5042-4b93-acb0-8ce56fe826e2", name: "Specialty", displayOrder: 4 },
];

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: certification,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["certification-detail", slug],
    queryFn: () => certificationsService.getBySlug(slug),
  });

  const createDomainMutation = useMutation({
    mutationFn: (data: { name: string; weightage: number; displayOrder: number }) =>
      certificationsService.createDomain(certification!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certification-detail", slug] });
      toast.success("Domain added");
      setAddDomainOpen(false);
    },
    onError: () => toast.error("Failed to add domain"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof certificationsService.update>[1]) =>
      certificationsService.update(certification!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certification-detail", slug] });
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certification updated");
      setEditOpen(false);
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? "Failed to update certification");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => certificationsService.delete(certification!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certification deleted");
      router.push("/certifications");
    },
    onError: () => toast.error("Failed to delete certification"),
  });

  if (isLoading) return <LoadingSpinner text="Loading certification..." />;

  if (error || !certification) {
    return (
      <div>
        <Link
          href="/certifications"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Certifications
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          Failed to load certification details.
        </div>
      </div>
    );
  }

  const infoItems = [
    { icon: Clock, label: "Duration", value: certification.examDuration },
    { icon: HelpCircle, label: "Questions", value: `${certification.totalQuestions} questions` },
    { icon: DollarSign, label: "Cost", value: `$${certification.examCost}` },
    { icon: Monitor, label: "Mode", value: certification.examMode },
  ];

  const levelName = certification.level.name;
  const badgeStyle = levelColors[levelName] ?? levelColors.Foundational;

  return (
    <div className="-mx-8 -mt-8">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#232f3e] via-[#2c3e50] to-[#1a252f] px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/certifications"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Certifications
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                {certification.badgeImageUrl ? (
                  <img src={certification.badgeImageUrl} alt={certification.title} className="h-full w-full object-contain" />
                ) : (
                  <Award className="h-12 w-12 text-[#ff9900]" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <Badge variant="outline" className={`mb-2 text-xs ${badgeStyle}`}>
                  {levelName}
                </Badge>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{certification.title}</h1>
                <p className="mt-1 text-sm text-white/50">{certification.examCode}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-center sm:self-end">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:text-red-300 font-semibold cursor-pointer"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Exam Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">Exam Details</h2>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e]/5">
                      <item.icon className="h-5 w-5 text-[#232f3e]" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domains */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Exam Domains ({certification.domains.length})
              </h2>
              <Button 
                size="sm" 
                onClick={() => setAddDomainOpen(true)}
                className="bg-[#0B0F19] hover:bg-[#1E293B] text-white cursor-pointer"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Domain
              </Button>
            </div>

            {certification.domains.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No domains"
                description="Add domains to organize the certification content."
                action={
                  <Button size="sm" onClick={() => setAddDomainOpen(true)}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Domain
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {certification.domains
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((domain, index) => (
                    <DomainCard
                      key={domain.id}
                      domain={domain}
                      certificationId={certification.id}
                      index={index}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Domain Dialog */}
      <DomainFormDialog
        open={addDomainOpen}
        onOpenChange={setAddDomainOpen}
        onSubmit={(data) => createDomainMutation.mutate(data)}
        isLoading={createDomainMutation.isPending}
      />

      {/* Edit Certification Dialog */}
      <CertificationFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={(data) => updateMutation.mutate(data)}
        initialData={certification}
        levels={levels}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Certification Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{certification.title}&rdquo;
              and all its domains and topics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
