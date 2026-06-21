"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificationsService } from "@/services/certifications";
import { CertificationCard } from "@/components/certifications/certification-card";
import { CertificationFormDialog } from "@/components/certifications/certification-form-dialog";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Award, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CertificationLevel, CertificationListItem } from "@/lib/types";
import { cn } from "@/lib/utils";
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

const LEVELS = ["Foundational", "Associate", "Professional", "Specialty"];

export default function CertificationsPage() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("Foundational");
  const [deleteTarget, setDeleteTarget] = useState<CertificationListItem | null>(null);

  const {
    data: certifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: certificationsService.adminList,
  });

  // Known levels for create form
  const levels: CertificationLevel[] = [
    { id: "420c7078-1da5-4b25-8664-5cc95e74d9bb", name: "Foundational", displayOrder: 1 },
    { id: "5e610d7a-2cc2-4d58-900a-a99aa02ec842", name: "Associate", displayOrder: 2 },
    { id: "f7c48608-4a7c-4bec-a081-ae344a9f3a9f", name: "Professional", displayOrder: 3 },
    { id: "73da091e-5042-4b93-acb0-8ce56fe826e2", name: "Specialty", displayOrder: 4 },
  ];

  const createMutation = useMutation({
    mutationFn: certificationsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certification created");
      setAddOpen(false);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to create certification");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certificationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certification deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete certification");
    },
  });

  // Extract count of certifications for each level
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Foundational: 0,
      Associate: 0,
      Professional: 0,
      Specialty: 0,
    };
    if (certifications) {
      for (const cert of certifications) {
        const lvlName = typeof cert.level === "string" ? cert.level : cert.level.name;
        if (lvlName && lvlName in counts) {
          counts[lvlName]++;
        }
      }
    }
    return counts;
  }, [certifications]);

  // Filter certifications by selected level
  const filteredCertifications = useMemo(() => {
    if (!certifications) return [];
    return certifications.filter((cert) => {
      const lvlName = typeof cert.level === "string" ? cert.level : cert.level.name;
      return lvlName.toLowerCase() === selectedLevel.toLowerCase();
    });
  }, [certifications, selectedLevel]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section>
        <div 
          className="rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-[#FFF0E0]/50"
          style={{
            background: "linear-gradient(90deg, rgba(255, 153, 0, 0.08) 0%, rgba(255, 153, 0, 0.02) 50%, rgba(255, 255, 255, 0) 100%)"
          }}
        >
          {/* Subtle glowing amber effect in background */}
          <div className="absolute right-0 top-0 w-[400px] h-full bg-gradient-to-l from-[#FFF8F2] to-transparent pointer-events-none opacity-80" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F2] border border-[#ff9900]/20 px-3 py-1 text-xs font-semibold text-slate-700 mb-3">
                <span className="h-2 w-2 rounded-full bg-[#ff9900]" />
                <span>ADMIN • CERTIFICATIONS</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                All AWS Certifications
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">
                Select a level tab to browse certifications. Each card shows full exam details, domains, and percentages.
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col gap-3">
              <Button 
                onClick={() => setAddOpen(true)}
                className="bg-[#0B0F19] hover:bg-[#1E293B] text-white px-5 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#1e293b]/50 w-full"
              >
                <Plus className="h-4 w-4 text-white" />
                Add Certification
              </Button>
              <Link href="/career-pathways/new" className="w-full">
                <Button 
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-5 py-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full"
                >
                  <Plus className="h-4 w-4 text-slate-600" />
                  Add Career Path
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Row */}
      <section>
        <div className="flex flex-wrap gap-3">
          {LEVELS.map((level) => {
            const count = levelCounts[level] ?? 0;
            const isActive = selectedLevel.toLowerCase() === level.toLowerCase();
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold border transition-all cursor-pointer shadow-sm",
                  isActive
                    ? "border-[#ff9900] text-slate-800 bg-white ring-1 ring-[#ff9900]/25 font-black"
                    : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <span>{level}</span>
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-black min-w-[20px]",
                    isActive
                      ? "bg-[#FFF8F2] text-[#ff9900]"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Certifications Grid */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
            <p className="mt-4 text-sm text-slate-500 font-semibold">Loading certifications...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive font-medium">
            Failed to load certifications. Please try again.
          </div>
        ) : filteredCertifications.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certifications"
            description="Add your first certification to get started under this level."
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add Certification
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCertifications.map((cert) => (
              <CertificationCard 
                key={cert.id} 
                certification={cert} 
                onDelete={() => setDeleteTarget(cert)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add Certification Dialog */}
      <CertificationFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        levels={levels}
        isLoading={createMutation.isPending}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &ldquo;{deleteTarget?.title}&rdquo;? 
              This will remove all associated domains and topics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
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
