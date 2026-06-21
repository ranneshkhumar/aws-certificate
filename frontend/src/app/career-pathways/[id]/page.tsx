"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerPathwaysService } from "@/services/career-pathways";
import { certificationsService } from "@/services/certifications";
import { usePathwayBuilder } from "@/hooks/use-pathway-builder";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { CertificationSelector } from "@/components/career-pathways/certification-selector";
import { SelectedPathwayList } from "@/components/career-pathways/selected-pathway-list";
import { OpportunitySection } from "@/components/career-pathways/opportunity-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Save, Loader2, Pencil, Trash2, Route } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { LevelGroup } from "@/lib/types";

export default function PathwayBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditingRole, setIsEditingRole] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch career role
  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["career-role-detail", id],
    queryFn: () => careerPathwaysService.getRoleById(id),
  });

  // Fetch all certifications (use admin endpoint, always refetch fresh)
  const { data: allCerts, isLoading: certsLoading } = useQuery({
    queryKey: ["admin-certifications-for-pathway"],
    queryFn: certificationsService.adminList,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Group certifications by level (admin endpoint returns level as object)
  const levels: LevelGroup[] = useMemo(() => {
    if (!allCerts) return [];
    const grouped = new Map<string, LevelGroup>();
    for (const cert of allCerts) {
      const levelName =
        typeof cert.level === "string" ? cert.level : cert.level.name;
      if (!grouped.has(levelName)) {
        grouped.set(levelName, {
          levelName,
          certifications: [],
        });
      }
      grouped.get(levelName)!.certifications.push(cert);
    }
    return Array.from(grouped.values());
  }, [allCerts]);

  // Pathway builder hook
  const pathway = usePathwayBuilder({
    initialPathway: role?.certifications ?? [],
  });

  // Save pathway mutation
  const savePathwayMutation = useMutation({
    mutationFn: () => careerPathwaysService.updatePathway(id, pathway.selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-role-detail", id] });
      toast.success("Pathway saved successfully");
    },
    onError: () => toast.error("Failed to save pathway"),
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string }) =>
      careerPathwaysService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-role-detail", id] });
      toast.success("Role updated");
      setIsEditingRole(false);
    },
    onError: () => toast.error("Failed to update role"),
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: careerPathwaysService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-career-roles"] });
      toast.success("Role deleted");
      router.push("/career-pathways");
    },
    onError: () => toast.error("Failed to delete role"),
  });

  const isLoading = roleLoading || certsLoading;

  if (isLoading) return <LoadingSpinner text="Loading pathway builder..." />;

  if (!role) {
    return (
      <div>
        <Link
          href="/career-pathways"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Career Pathways
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Career role not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/career-pathways"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Career Pathways
      </Link>

      <PageHeader
        title={role.name}
        description="Configure the certification pathway and career opportunities"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditName(role.name);
                setEditDescription(role.description);
                setIsEditingRole(true);
              }}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit Role
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: Role Info + Opportunities + Selected Pathway */}
        <div className="lg:col-span-5 space-y-6">
          {/* Role Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Role Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{role.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Slug</p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {role.slug}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm">{role.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Pathway */}
          <SelectedPathwayList
            selectedIds={pathway.selectedIds}
            onRemove={pathway.deselectCertification}
            onClear={pathway.clearSelection}
          />

          {/* Save Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!pathway.hasChanges() || savePathwayMutation.isPending}
            onClick={() => savePathwayMutation.mutate()}
          >
            {savePathwayMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {pathway.hasChanges() ? "Save Pathway" : "No Changes"}
          </Button>

          {/* Opportunities */}
          <OpportunitySection
            roleId={id}
            opportunities={role.opportunities}
          />
        </div>

        {/* RIGHT: Certification Selector */}
        <div className="lg:col-span-7">
          <CertificationSelector
            levels={levels}
            selectedIds={pathway.selectedIds}
            getOrder={pathway.getOrder}
            onToggle={pathway.toggleCertification}
          />
        </div>
      </div>

      {/* Edit Role Dialog */}
      <AlertDialog open={isEditingRole} onOpenChange={setIsEditingRole}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Career Role</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                updateRoleMutation.mutate({
                  id,
                  name: editName,
                  description: editDescription,
                })
              }
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Career Role</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{role.name}&rdquo; and all its
              pathway links and opportunities. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteRoleMutation.mutate(id)}
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
