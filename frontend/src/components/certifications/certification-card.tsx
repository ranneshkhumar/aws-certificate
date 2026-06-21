"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CertificationListItem } from "@/lib/types";
import {
  Clock,
  DollarSign,
  FileText,
  Monitor,
  User,
  Trash2,
  ArrowRight,
  Award,
} from "lucide-react";

// Formatting helpers
function formatDuration(duration?: string): string {
  if (!duration) return "90 min";
  return duration.replace(" minutes", " min").replace(" minute", " min");
}

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

function getSecondaryBadge(title: string, examCode: string, levelName: string): string {
  const code = examCode.toUpperCase();
  const t = title.toLowerCase();
  if (code.startsWith("AIF") || code.startsWith("AIP") || t.includes("ai")) return "AI";
  if (code.startsWith("MLA") || t.includes("machine learning") || t.includes("ml")) return "ML";
  if (t.includes("developer") || t.includes("dev")) return "DEV";
  if (t.includes("architect")) return "ARCHITECT";
  if (t.includes("data")) return "DATA";
  if (t.includes("security")) return "SECURITY";
  if (t.includes("networking")) return "NETWORKING";
  if (t.includes("cloudops") || t.includes("sysops") || t.includes("devops")) return "OPS";
  return levelName.toUpperCase();
}

interface CertificationCardProps {
  certification: CertificationListItem;
  onDelete?: () => void;
}

export function CertificationCard({ certification, onDelete }: CertificationCardProps) {
  const levelName = typeof certification.level === "string" ? certification.level : certification.level.name;
  const theme = getCertTheme(certification.examCode, levelName);
  const targetRoles = getTargetRoles(certification.slug);
  const secondaryBadge = getSecondaryBadge(certification.title, certification.examCode, levelName);
  const domains = (certification.domains || []).slice(0, 2);

  return (
    <Link href={`/certifications/${certification.slug}`} className="group block">
      <div className={cn(
        "relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 pt-8 shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px] overflow-hidden h-full",
        theme.hoverBorder
      )}>
        {/* Top colored border */}
        <div className={cn("absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r", theme.accent)} />

        {/* Delete button (trash icon) */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100 cursor-pointer"
            title="Delete Certification"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        {/* Badges Row */}
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider border", theme.badgeClass)}>
            {levelName.toUpperCase()}
          </span>
          <span className="rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider border bg-slate-50 text-slate-500 border-slate-200">
            {secondaryBadge}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#ff9900] transition-colors pr-8">
          {certification.title}
        </h3>

        {/* Target Roles */}
        <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
          <User className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed">{targetRoles}</span>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">DURATION</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700 whitespace-nowrap">
              {formatDuration(certification.examDuration)}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">QUESTIONS</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700">
              {certification.totalQuestions ?? 65}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">COST</span>
            <span className="mt-0.5 text-[11px] font-bold text-slate-700">
              ${certification.examCost ?? 100}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-slate-100/50 border border-slate-100 p-2 text-center">
            <Monitor className="h-4 w-4 text-slate-400" />
            <span className="mt-1 text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">MODE</span>
            <span className="mt-0.5 text-[9px] font-bold text-slate-700 leading-tight w-full truncate" title={formatMode(certification.examMode)}>
              {formatMode(certification.examMode)}
            </span>
          </div>
        </div>

        {/* Domains Section */}
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
                      <span className={cn("rounded-full px-1.5 py-0.2 text-[9px] font-extrabold border", theme.pillBg)}>
                        {dom.weightage}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", theme.progress)}
                        style={{ width: `${dom.weightage}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(dom.topics || []).map((topic) => (
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

            <div className="mt-4 flex items-center justify-end gap-1 text-[11px] font-bold text-slate-400 group-hover:text-[#ff9900] transition-colors">
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 animate-none group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
