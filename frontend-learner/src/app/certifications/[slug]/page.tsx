"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { certificationsService } from "@/services/api";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  DollarSign,
  Monitor,
  Award,
  ChevronRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const levelConfig: Record<string, { badgeClass: string }> = {
  Foundational: { badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
  Associate: { badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  Professional: { badgeClass: "bg-purple-100 text-purple-800 border-purple-200" },
  Specialty: { badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
};

export default function CertificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: cert, isLoading, error } = useQuery({
    queryKey: ["certification", slug],
    queryFn: () => certificationsService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
        <p className="mt-4 text-sm text-muted-foreground">Loading certification...</p>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <p className="text-muted-foreground">Certification not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-[#ff9900] hover:underline">
          Back to certifications
        </Link>
      </div>
    );
  }

  const levelName = typeof cert.level === "string" ? cert.level : cert.level.name;
  const config = levelConfig[levelName] ?? levelConfig.Foundational;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#232f3e] via-[#2c3e50] to-[#1a252f] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Certifications
          </Link>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              {cert.badgeImageUrl ? (
                <img src={cert.badgeImageUrl} alt={cert.title} className="h-full w-full object-contain" />
              ) : (
                <Award className="h-12 w-12 text-[#ff9900]" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <Badge variant="outline" className={`mb-2 text-xs ${config.badgeClass}`}>
                {levelName}
              </Badge>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{cert.title}</h1>
              <p className="mt-1 text-sm text-white/50">{cert.examCode}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Exam Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Exam Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e]/5">
                    <Clock className="h-5 w-5 text-[#232f3e]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">{cert.examDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e]/5">
                    <HelpCircle className="h-5 w-5 text-[#232f3e]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p className="text-sm font-medium">{cert.totalQuestions} questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e]/5">
                    <DollarSign className="h-5 w-5 text-[#232f3e]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="text-sm font-medium">${cert.examCost}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232f3e]/5">
                    <Monitor className="h-5 w-5 text-[#232f3e]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mode</p>
                    <p className="text-sm font-medium">{cert.examMode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domains */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold">Exam Domains</h2>
            {cert.domains.length === 0 ? (
              <p className="text-sm text-muted-foreground">No domains added yet.</p>
            ) : (
              <div className="space-y-4">
                {cert.domains
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((domain, idx) => (
                    <div
                      key={domain.id}
                      className="group rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#232f3e] text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-foreground">{domain.name}</h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Weightage: {domain.weightage}%
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {domain.weightage}%
                        </Badge>
                      </div>

                      {domain.topics.length > 0 && (
                        <>
                          <Separator className="my-4" />
                          <div className="ml-11">
                            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Topics
                            </p>
                            <ul className="space-y-1.5">
                              {domain.topics
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((topic) => (
                                  <li key={topic.id} className="flex items-center gap-2 text-sm text-foreground/80">
                                    <BookOpen className="h-3 w-3 shrink-0 text-muted-foreground" />
                                    {topic.name}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
