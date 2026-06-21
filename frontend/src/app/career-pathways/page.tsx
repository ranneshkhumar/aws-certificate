"use client";

import { useQuery } from "@tanstack/react-query";
import { careerPathwaysService } from "@/services/career-pathways";
import { PageHeader } from "@/components/page-header";
import { PathwayCard } from "@/components/career-pathways/pathway-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Route, Plus } from "lucide-react";
import Link from "next/link";

export default function CareerPathwaysPage() {
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ["admin-career-roles"],
    queryFn: careerPathwaysService.listRoles,
  });

  return (
    <div>
      <PageHeader
        title="Career Pathways"
        description="Manage career roles and their certification pathways"
        action={
          <Link href="/career-pathways/new">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Pathway
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingSpinner text="Loading career pathways..." />
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load career pathways. Please try again.
        </div>
      ) : !roles?.length ? (
        <EmptyState
          icon={Route}
          title="No career pathways"
          description="Create your first career role to get started."
          action={
            <Link href="/career-pathways/new">
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                Create Pathway
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <PathwayCard key={role.id} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
