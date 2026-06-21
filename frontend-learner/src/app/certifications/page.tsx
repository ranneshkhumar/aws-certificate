"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { certificationsService, careerPathwaysService } from "@/services/api";
import { CertificationListItem, CareerPathwayDetail } from "@/lib/types";
import {
  Clock,
  DollarSign,
  Loader2,
  User,
  FileText,
  Monitor,
  ArrowRight,
  Briefcase,
  Check,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const ROLES = [
  { id: "cloud-architect", label: "Architect" },
  { id: "devops-engineer", label: "DevOps" },
  { id: "security-engineer", label: "Security" },
  { id: "data-engineer", label: "Data" },
  { id: "ml-engineer", label: "ML" },
  { id: "ai-engineer", label: "AI" },
  { id: "cloud-developer", label: "Developer" },
  { id: "networking-engineer", label: "Networking" },
];

const getTierColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "foundational": return "#FF9900";
    case "associate": return "#2563EB";
    case "professional": return "#0EA5A4";
    case "specialty": return "#7C3AED";
    default: return "#94A3B8";
  }
};

const getTierLabel = (level: string) => {
  switch (level.toLowerCase()) {
    case "foundational": return "Foundational";
    case "associate": return "Associate";
    case "professional": return "Professional";
    case "specialty": return "Specialty";
    default: return level;
  }
};

const shortenName = (name: string) => {
  return name.replace("AWS Certified ", "");
};

const LEVELS = ["Foundational", "Associate", "Professional", "Specialty"];

const easeOut = [0.16, 1, 0.3, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const certItemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      delay: 0.4 + i * 0.3,
    },
  }),
};

const connectorVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scaleX: 1,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 14,
      delay: 0.3 + i * 0.3,
    },
  }),
};

const arrowVariants = {
  hidden: { x: -12, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.45 + i * 0.3, duration: 0.3, ease: easeOut },
  }),
};

const careerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 160, damping: 22, delay: 0.7 },
  },
};

const oppVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.8 + i * 0.1, duration: 0.4, ease: easeOut },
  }),
};

function RoleSection({
  path,
  dbBadgeMap,
}: {
  path: CareerPathwayDetail;
  dbBadgeMap: Record<string, string>;
}) {
  const certs = path.pathway;

  return (
    <motion.section
      className="flex flex-col items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={sectionVariants}
    >
      <div className="text-center mb-8 w-full">
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
          {path.name}
        </h3>
        <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          {path.description}
        </p>
      </div>

      <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 w-full overflow-x-auto sm:overflow-x-visible py-2">
        {certs.map((pathItem, i) => {
          const cert = pathItem.certification;
          const tierColor = getTierColor(cert.level.name);
          const badgeUrl = cert.badgeImageUrl || dbBadgeMap[cert.slug];
          return (
            <React.Fragment key={cert.id}>
              {i > 0 && (
                <motion.div
                  className="flex items-center justify-center w-6 sm:w-8 shrink-0 select-none"
                  variants={connectorVariants}
                  custom={i}
                  style={{ "--arrow-color": getTierColor(certs[i - 1].certification.level.name) } as React.CSSProperties}
                >
                  <motion.span
                    className="text-lg sm:text-xl text-slate-300 font-semibold leading-none"
                    variants={arrowVariants}
                    custom={i}
                  >
                    →
                  </motion.span>
                </motion.div>
              )}
              
              <Link href={`/certifications/${cert.slug}`} className="group/cert w-full max-w-[100px] sm:max-w-[120px] flex flex-col items-center gap-2 text-center no-underline text-inherit shrink-0">
                <motion.div
                  className="w-full flex flex-col items-center gap-2"
                  variants={certItemVariants}
                  custom={i}
                >
                  <div
                    className="w-full aspect-square rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer shadow-sm relative group-hover/cert:border-[var(--tier-color)] group-hover/cert:-translate-y-0.5 group-hover/cert:scale-[1.02] group-hover/cert:shadow-[0_0_0_2px_color-mix(in_srgb,var(--tier-color)_20%,transparent),0_0_16px_color-mix(in_srgb,var(--tier-color)_25%,transparent),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                    style={{ "--tier-color": tierColor } as React.CSSProperties}
                  >
                    <div className="w-[75%] h-[75%] flex items-center justify-center">
                      {badgeUrl ? (
                        <img
                          src={badgeUrl}
                          alt={cert.title}
                          className="w-full h-full object-contain block transition-transform duration-300 group-hover/cert:scale-[1.08]"
                        />
                      ) : (
                        <Award size={32} style={{ color: tierColor }} />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 w-full">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-snug line-clamp-2 min-h-[32px] flex items-center justify-center">
                      {shortenName(cert.title)}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: tierColor }}>
                      {getTierLabel(cert.level.name)}
                    </span>
                  </div>
                </motion.div>
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      <motion.div
        className="w-full max-w-md mt-6"
        variants={careerVariants}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase size={14} className="text-[#ff9900]" />
            <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">Career Opportunities</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[11px] font-extrabold text-slate-600">
            {path.opportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                className="flex items-center gap-1.5 whitespace-nowrap"
                variants={oppVariants}
                custom={i}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{opp.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// Formatting helpers
function formatDuration(duration?: string): string {
  if (!duration) return "90 min";
  return duration.replace(" minutes", " min").replace(" minute", " min");
}

// Format the mode to match the reference picture
function formatMode(mode?: string): string {
  if (!mode) return "Online or Pearson VUE";
  const m = mode.toLowerCase();
  if (m.includes("online proctored") || m.includes("pearson vue") || m.includes("online or pearson vue")) {
    return "Online or Pearson VUE";
  }
  return mode;
}

// Target roles for certifications
function getTargetRoles(slug: string): string {
  const roles: Record<string, string> = {
    "aws-cloud-practitioner": "Sales, marketing, finance, project managers, managers",
    "aws-ai-practitioner": "Business analyst, IT support, marketing, product/project manager",
    "aws-machine-learning-engineer-associate": "Machine learning engineer, data scientist, software engineer",
    "aws-solutions-architect-associate": "Solutions architect, cloud engineer, systems administrator",
    "aws-developer-associate": "Software developer, application engineer, cloud developer",
    "aws-data-engineer-associate": "Data engineer, data architect, business intelligence developer",
    "aws-cloudops-engineer-associate": "SysOps administrator, DevOps engineer, systems architect",
    "aws-generative-ai-developer-professional": "GenAI developer, software developer, AI research engineer",
    "aws-solutions-architect-professional": "Senior solutions architect, principal cloud designer",
    "aws-devops-engineer-professional": "DevOps engineer, cloud infrastructure manager, SRE",
    "aws-advanced-networking-specialty": "Network architect, cloud network engineer, systems engineer",
    "aws-security-specialty": "Security analyst, security engineer, compliance specialist",
  };
  return roles[slug] ?? "Cloud professionals, IT specialists";
}

// Styling/theme config mapping based on level or examCode
function getCertTheme(examCode: string, level: string) {
  const code = examCode.toUpperCase();
  const lvl = level.toLowerCase();
  
  if (code.startsWith("AIF") || code.startsWith("AIP") || code.startsWith("MLA")) {
    // AI / ML Theme (Purple)
    return {
      accent: "from-purple-500 to-indigo-500",
      progress: "bg-purple-500",
      pillBg: "bg-purple-50 text-purple-700 border-purple-100",
      badgeClass: "bg-[#f3f0ff] text-[#5b21b6] border-[#e8e0ff]",
      hoverBorder: "hover:border-purple-300"
    };
  }
  
  if (code.startsWith("CLF")) {
    // Cloud Practitioner (Amber / Orange)
    return {
      accent: "from-amber-400 to-orange-500",
      progress: "bg-amber-500",
      pillBg: "bg-amber-50 text-amber-800 border-amber-100",
      badgeClass: "bg-[#fff6e6] text-[#c97d02] border-[#ffe6cc]",
      hoverBorder: "hover:border-amber-300"
    };
  }
  
  if (lvl === "foundational") {
    return {
      accent: "from-amber-400 to-orange-500",
      progress: "bg-amber-500",
      pillBg: "bg-amber-50 text-amber-800 border-amber-100",
      badgeClass: "bg-[#fff6e6] text-[#c97d02] border-[#ffe6cc]",
      hoverBorder: "hover:border-amber-300"
    };
  }

  if (lvl === "associate") {
    // Associate (Teal / Emerald / Blue)
    return {
      accent: "from-blue-500 to-teal-500",
      progress: "bg-teal-500",
      pillBg: "bg-teal-50 text-teal-800 border-teal-100",
      badgeClass: "bg-[#e6fcf5] text-[#0ca678] border-[#c3fae8]",
      hoverBorder: "hover:border-teal-300"
    };
  }

  if (lvl === "professional") {
    // Professional (Purple / Indigo / Gold)
    return {
      accent: "from-indigo-600 to-purple-600",
      progress: "bg-indigo-600",
      pillBg: "bg-indigo-50 text-indigo-800 border-indigo-100",
      badgeClass: "bg-[#f3f0ff] text-[#5b21b6] border-[#e8e0ff]",
      hoverBorder: "hover:border-indigo-300"
    };
  }

  // Specialty (Red / Rose)
  return {
    accent: "from-rose-500 to-red-600",
    progress: "bg-rose-500",
    pillBg: "bg-rose-50 text-rose-800 border-rose-100",
    badgeClass: "bg-[#fff0f6] text-[#c2255c] border-[#ffdeeb]",
    hoverBorder: "hover:border-rose-300"
  };
}

function CertCard({ cert }: { cert: CertificationListItem }) {
  const level = cert.level as string;
  const theme = getCertTheme(cert.examCode, level);
  const targetRoles = getTargetRoles(cert.slug);
  const domains = (cert.domains || []).slice(0, 2);

  return (
    <Link href={`/certifications/${cert.slug}`} className="group block">
      <div className={`relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 pt-7 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px] ${theme.hoverBorder} overflow-hidden h-full`}>
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.accent} rounded-t-2xl`} />

        <div className="flex items-center">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider border ${theme.badgeClass}`}
          >
            {level.toUpperCase()}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#ff9900] transition-colors">
          {cert.title}
        </h3>

        <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
          <User className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{targetRoles}</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-1.5">
          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">DURATION</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700 whitespace-nowrap">
              {formatDuration(cert.examDuration)}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">QUESTIONS</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700">
              {cert.totalQuestions ?? 65}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">COST</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700">
              ${cert.examCost ?? 100}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <Monitor className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">MODE</span>
            <span className="mt-0.5 text-[9px] font-bold text-slate-700 leading-tight w-full truncate" title={formatMode(cert.examMode)}>
              {formatMode(cert.examMode)}
            </span>
          </div>
        </div>

        {domains.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-3">
                EXAM DOMAINS
              </div>

              <div className="space-y-4">
                {domains.map((dom) => (
                  <div key={dom.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                      <span className="truncate pr-2">{dom.name}</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold border ${theme.pillBg}`}>
                        {dom.weightage}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${theme.progress} rounded-full transition-all duration-500`}
                        style={{ width: `${dom.weightage}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {dom.topics.map((topic) => (
                        <span
                          key={topic.id}
                          className="rounded-full bg-slate-50 border border-slate-100/80 px-2 py-0.5 text-[9px] text-slate-500 font-semibold whitespace-nowrap"
                        >
                          {topic.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-1 text-[11px] font-bold text-slate-400 hover:text-[#ff9900] transition-colors">
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function CertificationsPage() {
  const { data: certifications, isLoading, error } = useQuery({
    queryKey: ["certifications"],
    queryFn: certificationsService.list,
  });

  const { data: dbPathways, isLoading: pathwaysLoading } = useQuery({
    queryKey: ["career-pathways"],
    queryFn: careerPathwaysService.list,
  });

  const [selectedLevel, setSelectedLevel] = useState("Foundational");

  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Foundational: 0,
      Associate: 0,
      Professional: 0,
      Specialty: 0,
    };
    if (certifications) {
      for (const cert of certifications) {
        const lvl = cert.level;
        if (lvl && lvl in counts) {
          counts[lvl]++;
        }
      }
    }
    return counts;
  }, [certifications]);

  const levelOrder: Record<string, number> = {
    Foundational: 1,
    Associate: 2,
    Professional: 3,
    Specialty: 4,
  };

  const sortedCertifications = certifications
    ? [...certifications].sort((a, b) => {
        const orderA = levelOrder[a.level] ?? 99;
        const orderB = levelOrder[b.level] ?? 99;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.displayOrder - b.displayOrder;
      })
    : [];

  const filteredCertifications = useMemo(() => {
    return sortedCertifications.filter(
      (cert) => cert.level.toLowerCase() === selectedLevel.toLowerCase()
    );
  }, [sortedCertifications, selectedLevel]);

  const dbBadgeMap = useMemo(() => {
    if (!certifications) return {};
    const map: Record<string, string> = {};
    for (const c of certifications) {
      if (c.badgeImageUrl) {
        map[c.slug] = c.badgeImageUrl;
      }
    }
    return map;
  }, [certifications]);

  const sortedPaths = useMemo(() => {
    if (!dbPathways) return [];
    return [...dbPathways].sort((a, b) => {
      const idxA = ROLES.findIndex(r => r.id === a.slug);
      const idxB = ROLES.findIndex(r => r.id === b.slug);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [dbPathways]);

  return (
    <div className="bg-slate-50/30 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="mx-auto max-w-[1440px] px-4 pt-12 sm:px-6 lg:px-8">
        <div 
          className="rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-[#FFF0E0]/50"
          style={{
            background: "linear-gradient(90deg, rgba(255, 153, 0, 0.08) 0%, rgba(255, 153, 0, 0.02) 50%, rgba(255, 255, 255, 0) 100%)"
          }}
        >
          {/* Subtle glowing amber effect in background */}
          <div className="absolute right-0 top-0 w-[400px] h-full bg-gradient-to-l from-[#FFF8F2] to-transparent pointer-events-none opacity-80" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                All AWS Certifications
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">
                Select a level tab to browse certifications. Each card shows full exam details, domains, and percentages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Row */}
      <section className="mx-auto max-w-[1440px] px-4 pt-8 pb-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {LEVELS.map((level) => {
            const count = levelCounts[level] ?? 0;
            const isActive = selectedLevel.toLowerCase() === level.toLowerCase();
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold border transition-all cursor-pointer shadow-sm",
                  isActive
                    ? "border-[#ff9900] text-slate-800 bg-white ring-1 ring-[#ff9900]/25 font-black"
                    : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <span>{level}</span>
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-black min-w-[20px]",
                    isActive
                      ? "bg-[#FFF8F2] text-[#ff9900]"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Cert Grid */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
            <p className="mt-4 text-sm text-muted-foreground">Loading certifications...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Failed to load certifications. Please try again later.
          </div>
        ) : filteredCertifications.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No certifications available for this level.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCertifications.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </div>
        )}
      </section>

      {/* Career Pathways Section */}
      <section id="career-pathways" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            AWS Career Pathways
          </h2>
          <p className="mt-3 text-base text-slate-500 max-w-md mx-auto">
            See how AWS certifications stack up to guide your path to high-demand cloud roles.
          </p>
        </div>

        {pathwaysLoading ? (
          <div className="flex flex-col items-center justify-center py-20 w-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff9900]" />
            <p className="mt-4 text-sm text-muted-foreground">Loading pathways...</p>
          </div>
        ) : sortedPaths.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground w-full">
            No pathways available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
            {sortedPaths.map((path) => (
              <RoleSection key={path.id} path={path} dbBadgeMap={dbBadgeMap} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
