"use client";

import { useState, useEffect, useRef } from "react";
import { CertificationDetail, CertificationLevel } from "@/lib/types";
import { api } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";

interface CertificationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    examCode: string;
    examDuration: string;
    totalQuestions: number;
    examCost: number;
    examMode: string;
    displayOrder: number;
    levelId: string;
    badgeImageUrl?: string;
    isActive?: boolean;
  }) => void;
  initialData?: CertificationDetail;
  levels: CertificationLevel[];
  isLoading?: boolean;
}

export function CertificationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  levels,
  isLoading,
}: CertificationFormDialogProps) {
  const isEdit = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [examCode, setExamCode] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [examCost, setExamCost] = useState("");
  const [examMode, setExamMode] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [levelId, setLevelId] = useState("");
  const [badgeImageUrl, setBadgeImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setExamCode(initialData.examCode);
        setExamDuration(initialData.examDuration);
        setTotalQuestions(initialData.totalQuestions.toString());
        setExamCost(initialData.examCost.toString());
        setExamMode(initialData.examMode);
        setDisplayOrder(initialData.displayOrder.toString());
        setLevelId(initialData.level.id);
        setBadgeImageUrl(initialData.badgeImageUrl ?? "");
        setIsActive(true);
      } else {
        setTitle("");
        setExamCode("");
        setExamDuration("");
        setTotalQuestions("");
        setExamCost("");
        setExamMode("");
        setDisplayOrder("");
        setLevelId("");
        setBadgeImageUrl("");
        setIsActive(true);
      }
      setUploadError("");
    }
  }, [open, initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const result = await api.upload<{ url: string }>(
        "/upload/image",
        file
      );
      setBadgeImageUrl(result.url);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setBadgeImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      examCode,
      examDuration,
      totalQuestions: parseInt(totalQuestions, 10),
      examCost: parseFloat(examCost),
      examMode,
      displayOrder: parseInt(displayOrder || "1", 10),
      levelId,
      badgeImageUrl: badgeImageUrl || undefined,
      isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cert-title">Title</Label>
            <Input
              id="cert-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AWS Certified Cloud Practitioner"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-examCode">Exam Code</Label>
              <Input
                id="cert-examCode"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                placeholder="e.g., CLF-C02"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-level">Level</Label>
              <Select value={levelId} onValueChange={(v) => v && setLevelId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-duration">Exam Duration</Label>
              <Input
                id="cert-duration"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
                placeholder="e.g., 90 minutes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-questions">Total Questions</Label>
              <Input
                id="cert-questions"
                type="number"
                min="1"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                placeholder="e.g., 65"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-cost">Exam Cost ($)</Label>
              <Input
                id="cert-cost"
                type="number"
                min="0"
                step="0.01"
                value={examCost}
                onChange={(e) => setExamCost(e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-mode">Exam Mode</Label>
              <Input
                id="cert-mode"
                value={examMode}
                onChange={(e) => setExamMode(e.target.value)}
                placeholder="e.g., online or in-person"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-order">Display Order</Label>
            <Input
              id="cert-order"
              type="number"
              min="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="e.g., 1"
              required
            />
          </div>

          {/* Badge Image Upload */}
          <div className="space-y-2">
            <Label>Badge Image</Label>
            {badgeImageUrl ? (
              <div className="relative flex items-center gap-4 rounded-lg border p-4">
                <img
                  src={badgeImageUrl}
                  alt="Badge preview"
                  className="h-16 w-16 rounded-lg object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Badge image uploaded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click remove to clear
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:opacity-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isUploading ? "Uploading..." : "Click to upload badge image"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, SVG up to 5MB
                    </p>
                  </div>
                </button>
                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
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
            <Button type="submit" disabled={isLoading || isUploading}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
