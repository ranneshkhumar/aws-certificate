"use client";

import { useState } from "react";
import { CareerOpportunity } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OpportunityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; displayOrder: number }) => void;
  initialData?: CareerOpportunity;
  isLoading?: boolean;
}

export function OpportunityFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: OpportunityFormDialogProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder?.toString() ?? ""
  );

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      displayOrder: parseInt(displayOrder, 10),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Opportunity" : "Add Opportunity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="opp-title">Job Title</Label>
            <Input
              id="opp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cloud Architect"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="opp-order">Display Order</Label>
            <Input
              id="opp-order"
              type="number"
              min="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="e.g., 1"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
