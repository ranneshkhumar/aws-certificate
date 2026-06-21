"use client";

import Link from "next/link";
import { CareerRoleListItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, Award, Briefcase } from "lucide-react";

interface PathwayCardProps {
  role: CareerRoleListItem;
}

export function PathwayCard({ role }: PathwayCardProps) {
  return (
    <Link href={`/career-pathways/${role.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Route className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
              {role.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {role.description}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              {role._count.certifications} certs
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {role._count.opportunities} opportunities
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
