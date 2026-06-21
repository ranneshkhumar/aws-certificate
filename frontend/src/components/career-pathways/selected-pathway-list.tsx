"use client";

import { useQuery } from "@tanstack/react-query";
import { certificationsService } from "@/services/certifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Route, GripVertical } from "lucide-react";

interface SelectedPathwayListProps {
  selectedIds: string[];
  onRemove: (certId: string) => void;
  onClear: () => void;
}

const levelBadgeColors: Record<string, string> = {
  Foundational: "bg-blue-50 text-blue-700",
  Associate: "bg-emerald-50 text-emerald-700",
  Professional: "bg-purple-50 text-purple-700",
  Specialty: "bg-amber-50 text-amber-700",
};

function getLevelName(level: string | { name: string }): string {
  return typeof level === "string" ? level : level.name;
}

export function SelectedPathwayList({
  selectedIds,
  onRemove,
  onClear,
}: SelectedPathwayListProps) {
  const { data: allCerts } = useQuery({
    queryKey: ["admin-certifications-for-pathway"],
    queryFn: certificationsService.adminList,
    refetchOnMount: true,
    staleTime: 0,
  });

  const selectedCerts = selectedIds
    .map((id, index) => {
      const cert = allCerts?.find((c) => c.id === id);
      return cert ? { ...cert, order: index + 1 } : null;
    })
    .filter(Boolean);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Route className="h-4 w-4" />
          Selected Pathway
          {selectedIds.length > 0 && (
            <Badge variant="secondary">{selectedIds.length}</Badge>
          )}
        </CardTitle>
        {selectedIds.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {selectedCerts.length === 0 ? (
          <div className="py-8 text-center">
            <Route className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click certifications on the right to build the pathway
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedCerts.map(
              (cert) =>
                cert && (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-all"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {cert.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {cert.title}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        levelBadgeColors[getLevelName(cert.level)] ?? ""
                      }`}
                    >
                      {getLevelName(cert.level)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(cert.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
