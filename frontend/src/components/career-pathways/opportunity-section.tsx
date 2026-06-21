"use client";

import { useState } from "react";
import { CareerOpportunity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { OpportunityFormDialog } from "./opportunity-form-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { careerPathwaysService } from "@/services/career-pathways";
import { toast } from "sonner";

interface OpportunitySectionProps {
  roleId: string;
  opportunities: CareerOpportunity[];
}

export function OpportunitySection({
  roleId,
  opportunities,
}: OpportunitySectionProps) {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpp, setEditOpp] = useState<CareerOpportunity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...opportunities].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const createMutation = useMutation({
    mutationFn: (data: { title: string; displayOrder: number }) =>
      careerPathwaysService.createOpportunity(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-role-detail", roleId] });
      toast.success("Opportunity added");
      setAddOpen(false);
    },
    onError: () => toast.error("Failed to add opportunity"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string; displayOrder?: number }) =>
      careerPathwaysService.updateOpportunity(editOpp!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-role-detail", roleId] });
      toast.success("Opportunity updated");
      setEditOpp(null);
    },
    onError: () => toast.error("Failed to update opportunity"),
  });

  const deleteMutation = useMutation({
    mutationFn: careerPathwaysService.deleteOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-role-detail", roleId] });
      toast.success("Opportunity deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete opportunity"),
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Career Opportunities
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No opportunities added yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {sorted.map((opp) => (
                <li
                  key={opp.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {opp.displayOrder}.
                    </span>
                    {opp.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setEditOpp(opp)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(opp.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Opportunity */}
      <OpportunityFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Opportunity */}
      <OpportunityFormDialog
        open={!!editOpp}
        onOpenChange={(open) => !open && setEditOpp(null)}
        onSubmit={(data) => updateMutation.mutate(data)}
        initialData={editOpp ?? undefined}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
