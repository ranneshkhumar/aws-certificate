"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { careerPathwaysService } from "@/services/api";
import {
  ArrowLeft,
  Award,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Loader2,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const levelConfig: Record<string, { badgeClass: string; color: string }> = {
  Foundational: { badgeClass: "bg-blue-100 text-blue-800 border-blue-200", color: "#2563eb" },
  Associate: { badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200", color: "#059669" },
  Professional: { badgeClass: "bg-purple-100 text-purple-800 border-purple-200", color: "#9333ea" },
  Specialty: { badgeClass: "bg-amber-100 text-amber-800 border-amber-200", color: "#d97706" },
};

export default function CareerPathwayDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: pathway, isLoading, error } = useQuery({
    queryKey: ["career-pathway", slug],
    queryFn: () => careerPathwaysService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
        <p className="mt-4 text-sm text-muted-foreground">Loading pathway...</p>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <p className="text-muted-foreground">Career pathway not found.</p>
        <Link href="/certifications#career-pathways" className="mt-4 inline-block text-sm font-medium text-[#ff9900] hover:underline">
          Back to pathways
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#232f3e] via-[#2c3e50] to-[#1a252f] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/certifications#career-pathways"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Pathways
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff9900]/20">
              <Compass className="h-5 w-5 text-[#ff9900]" />
            </div>
            <span className="text-sm font-medium text-[#ff9900]">Career Pathway</span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{pathway.name}</h1>
          <p className="mt-2 max-w-2xl text-white/60">{pathway.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Pathway Progression */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold">Certification Pathway</h2>
            {pathway.pathway.length === 0 ? (
              <div className="rounded-2xl border bg-white p-8 text-center text-sm text-muted-foreground">
                No certifications in this pathway yet.
              </div>
            ) : (
              <div className="relative space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ff9900] via-[#232f3e] to-muted" />

                {pathway.pathway
                  .sort((a, b) => a.pathOrder - b.pathOrder)
                  .map((item, idx) => {
                    const levelName = item.certification.level?.name ?? "Foundational";
                    const config = levelConfig[levelName] ?? levelConfig.Foundational;
                    const isLast = idx === pathway.pathway.length - 1;

                    return (
                      <div key={item.certification.id} className="relative flex gap-5">
                        {/* Step indicator */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-sm font-bold shadow-sm"
                            style={{ borderColor: config.color, color: config.color }}
                          >
                            {idx + 1}
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-muted" />}
                        </div>

                        {/* Card */}
                        <div className="flex-1 pb-8">
                          <Link
                            href={`/certifications/${item.certification.slug}`}
                            className="group block rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#ff9900]/30"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#232f3e] to-[#37475a] p-2.5 overflow-hidden">
                                  {item.certification.badgeImageUrl ? (
                                    <img
                                      src={item.certification.badgeImageUrl}
                                      alt={item.certification.title}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Award className="h-6 w-6 text-[#ff9900]" />
                                  )}
                                </div>
                                <div>
                                  <Badge variant="outline" className={`mb-1.5 text-[10px] ${config.badgeClass}`}>
                                    {levelName}
                                  </Badge>
                                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#ff9900] transition-colors">
                                    {item.certification.title}
                                  </h3>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {item.certification.examCode}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#ff9900]" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Opportunities Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#ff9900]" />
                <h2 className="text-lg font-bold">Career Opportunities</h2>
              </div>
              {pathway.opportunities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No opportunities listed yet.</p>
              ) : (
                <ul className="space-y-3">
                  {pathway.opportunities
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((opp) => (
                      <li key={opp.id} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-sm font-medium text-foreground">{opp.title}</span>
                      </li>
                    ))}
                </ul>
              )}
              <Separator className="my-5" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Complete all {pathway.pathway.length} certifications to qualify for these roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
