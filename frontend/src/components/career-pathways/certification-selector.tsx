"use client";

import { LevelGroup } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CertificationSelectorProps {
  levels: LevelGroup[];
  selectedIds: string[];
  getOrder: (certId: string) => number | null;
  onToggle: (certId: string) => void;
}

const levelBadgeColors: Record<string, string> = {
  Foundational: "bg-blue-100 text-blue-800 border-blue-200",
  Associate: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Professional: "bg-purple-100 text-purple-800 border-purple-200",
  Specialty: "bg-amber-100 text-amber-800 border-amber-200",
};

export function CertificationSelector({
  levels,
  selectedIds,
  getOrder,
  onToggle,
}: CertificationSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Select Certifications
      </h3>
      {levels.map((level) => (
        <Card key={level.levelName}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {level.levelName}
              </CardTitle>
              <Badge
                variant="outline"
                className={levelBadgeColors[level.levelName] ?? ""}
              >
                {level.certifications.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {level.certifications.map((cert) => {
                const order = getOrder(cert.id);
                const isSelected = order !== null;

                return (
                  <button
                    key={cert.id}
                    onClick={() => onToggle(cert.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                      isSelected
                        ? "bg-primary/10 border border-primary/30 text-foreground"
                        : "border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected ? (
                        order
                      ) : (
                        <Check className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{cert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {cert.examCode}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
