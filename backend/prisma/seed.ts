import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function seedCertificationLevels() {
  const levels = [
    { name: "Foundational", displayOrder: 1 },
    { name: "Associate", displayOrder: 2 },
    { name: "Professional", displayOrder: 3 },
    { name: "Specialty", displayOrder: 4 },
  ];

  for (const level of levels) {
    await prisma.certificationLevel.upsert({
      where: { name: level.name },
      update: { displayOrder: level.displayOrder },
      create: level,
    });
  }

  console.log("✅ Certification levels seeded");
}

async function seedCertifications() {
  const levels = await prisma.certificationLevel.findMany();
  const levelMap = new Map(levels.map((l) => [l.name, l.id]));

  const certifications = [
    // ─── FOUNDATIONAL ──────────────────────────────────────
    {
      title: "AWS Certified Cloud Practitioner",
      slug: "aws-cloud-practitioner",
      examCode: "CLF-C02",
      examDuration: "90 minutes",
      totalQuestions: 65,
      examCost: 100,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 1,
      levelName: "Foundational",
    },
    {
      title: "AWS Certified AI Practitioner",
      slug: "aws-ai-practitioner",
      examCode: "AIF-C01",
      examDuration: "90 minutes",
      totalQuestions: 65,
      examCost: 100,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 2,
      levelName: "Foundational",
    },

    // ─── ASSOCIATE ─────────────────────────────────────────
    {
      title: "AWS Certified Machine Learning Engineer – Associate",
      slug: "aws-machine-learning-engineer-associate",
      examCode: "MLA-C01",
      examDuration: "130 minutes",
      totalQuestions: 65,
      examCost: 150,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 1,
      levelName: "Associate",
    },
    {
      title: "AWS Certified Solutions Architect – Associate",
      slug: "aws-solutions-architect-associate",
      examCode: "SAA-C03",
      examDuration: "130 minutes",
      totalQuestions: 65,
      examCost: 150,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 2,
      levelName: "Associate",
    },
    {
      title: "AWS Certified Developer – Associate",
      slug: "aws-developer-associate",
      examCode: "DVA-C02",
      examDuration: "130 minutes",
      totalQuestions: 65,
      examCost: 150,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 3,
      levelName: "Associate",
    },
    {
      title: "AWS Certified Data Engineer – Associate",
      slug: "aws-data-engineer-associate",
      examCode: "DEA-C01",
      examDuration: "130 minutes",
      totalQuestions: 65,
      examCost: 150,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 4,
      levelName: "Associate",
    },
    {
      title: "AWS Certified CloudOps Engineer – Associate",
      slug: "aws-cloudops-engineer-associate",
      examCode: "SOA-C03",
      examDuration: "130 minutes",
      totalQuestions: 65,
      examCost: 150,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 5,
      levelName: "Associate",
    },

    // ─── PROFESSIONAL ──────────────────────────────────────
    {
      title: "AWS Certified Generative AI Developer – Professional",
      slug: "aws-generative-ai-developer-professional",
      examCode: "AIP-C01",
      examDuration: "180 minutes",
      totalQuestions: 75,
      examCost: 300,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 1,
      levelName: "Professional",
    },
    {
      title: "AWS Certified Solutions Architect – Professional",
      slug: "aws-solutions-architect-professional",
      examCode: "SAP-C02",
      examDuration: "180 minutes",
      totalQuestions: 75,
      examCost: 300,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 2,
      levelName: "Professional",
    },
    {
      title: "AWS Certified DevOps Engineer – Professional",
      slug: "aws-devops-engineer-professional",
      examCode: "DOP-C02",
      examDuration: "180 minutes",
      totalQuestions: 75,
      examCost: 300,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 3,
      levelName: "Professional",
    },

    // ─── SPECIALTY ─────────────────────────────────────────
    {
      title: "AWS Certified Advanced Networking – Specialty",
      slug: "aws-advanced-networking-specialty",
      examCode: "ANS-C01",
      examDuration: "170 minutes",
      totalQuestions: 65,
      examCost: 300,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 1,
      levelName: "Specialty",
    },
    {
      title: "AWS Certified Security – Specialty",
      slug: "aws-security-specialty",
      examCode: "SCS-C02",
      examDuration: "170 minutes",
      totalQuestions: 65,
      examCost: 300,
      examMode: "Online proctored / Pearson VUE",
      displayOrder: 2,
      levelName: "Specialty",
    },
  ];

  let created = 0;
  let updated = 0;

  for (const cert of certifications) {
    const levelId = levelMap.get(cert.levelName);
    if (!levelId) {
      console.error(`❌ Level "${cert.levelName}" not found for ${cert.examCode}`);
      continue;
    }

    const result = await prisma.certification.upsert({
      where: { slug: cert.slug },
      update: {
        title: cert.title,
        examCode: cert.examCode,
        examDuration: cert.examDuration,
        totalQuestions: cert.totalQuestions,
        examCost: cert.examCost,
        examMode: cert.examMode,
        displayOrder: cert.displayOrder,
        levelId,
      },
      create: {
        title: cert.title,
        slug: cert.slug,
        examCode: cert.examCode,
        examDuration: cert.examDuration,
        totalQuestions: cert.totalQuestions,
        examCost: cert.examCost,
        examMode: cert.examMode,
        displayOrder: cert.displayOrder,
        levelId,
      },
    });

    const operation = result.createdAt.getTime() === result.updatedAt.getTime()
      ? "created"
      : "updated";

    if (operation === "created") created++;
    else updated++;
  }

  console.log(`✅ Certifications seeded: ${created} created, ${updated} updated`);
}

async function seedDomainsAndTopics() {
  const certs = await prisma.certification.findMany();
  const certMap = new Map(certs.map((c) => [c.slug, c.id]));

  const domainsData: Record<
    string,
    { name: string; weightage: number; displayOrder: number; topics: string[] }[]
  > = {
    "aws-cloud-practitioner": [
      {
        name: "Cloud Concepts",
        weightage: 24,
        displayOrder: 1,
        topics: [
          "Benefits of cloud",
          "AWS value proposition",
          "Global infrastructure",
          "Cloud migration",
          "Cloud economics",
        ],
      },
      {
        name: "Security & Compliance",
        weightage: 30,
        displayOrder: 2,
        topics: ["Shared responsibility model", "IAM", "Security services", "Compliance"],
      },
      {
        name: "Cloud Technology and Services",
        weightage: 34,
        displayOrder: 3,
        topics: ["Compute services", "Database services", "Storage services", "Network services"],
      },
      {
        name: "Billing, Pricing, and Support",
        weightage: 12,
        displayOrder: 4,
        topics: ["Billing and pricing tools", "Cost management", "Support plans"],
      },
    ],
    "aws-ai-practitioner": [
      {
        name: "Fundamentals of AI and ML",
        weightage: 20,
        displayOrder: 1,
        topics: ["AI concepts", "ML lifecycle", "AWS AI/ML services", "Data concepts"],
      },
      {
        name: "Fundamentals of Generative AI",
        weightage: 24,
        displayOrder: 2,
        topics: ["Generative AI concepts", "Foundation models", "Use cases & capabilities"],
      },
      {
        name: "Applications of Foundation Models",
        weightage: 28,
        displayOrder: 3,
        topics: ["Prompt engineering", "Fine-tuning", "Agentic workflows", "Model evaluation"],
      },
      {
        name: "Responsible AI",
        weightage: 12,
        displayOrder: 4,
        topics: ["Bias & fairness", "Safety & guardrails", "Privacy & security"],
      },
      {
        name: "Security and Compliance for AI",
        weightage: 16,
        displayOrder: 5,
        topics: ["Infrastructure security", "Governance & compliance", "Threat detection"],
      },
    ],
    "aws-machine-learning-engineer-associate": [
      {
        name: "Data Engineering",
        weightage: 30,
        displayOrder: 1,
        topics: ["Data ingestion", "Data transformation", "Data pipelines"],
      },
      {
        name: "ML Model Development",
        weightage: 40,
        displayOrder: 2,
        topics: ["Model training", "Hyperparameter tuning", "Feature engineering"],
      },
    ],
    "aws-solutions-architect-associate": [
      {
        name: "Design Resilient Architectures",
        weightage: 30,
        displayOrder: 1,
        topics: ["Multi-tier architectures", "High availability", "Decoupling services"],
      },
      {
        name: "Design High-Performing Architectures",
        weightage: 26,
        displayOrder: 2,
        topics: ["Compute scaling", "Database performance", "Caching strategies"],
      },
    ],
    "aws-developer-associate": [
      {
        name: "Development with AWS Services",
        weightage: 32,
        displayOrder: 1,
        topics: ["APIs & serverless", "Database integration", "State management"],
      },
      {
        name: "Deployment & CI/CD",
        weightage: 26,
        displayOrder: 2,
        topics: ["CICD pipelines", "Application configuration", "Serverless deployment"],
      },
    ],
    "aws-data-engineer-associate": [
      {
        name: "Data Ingestion and Pipeline",
        weightage: 35,
        displayOrder: 1,
        topics: ["Kinesis & Firehose", "AWS Glue ETL", "Data validation"],
      },
      {
        name: "Data Storage and Management",
        weightage: 30,
        displayOrder: 2,
        topics: ["S3 storage classes", "Redshift data warehousing", "Lake Formation security"],
      },
    ],
    "aws-cloudops-engineer-associate": [
      {
        name: "Monitoring and Logging",
        weightage: 20,
        displayOrder: 1,
        topics: ["CloudWatch metrics", "CloudTrail auditing", "Alarms and notifications"],
      },
      {
        name: "Reliability and Business Continuity",
        weightage: 24,
        displayOrder: 2,
        topics: ["Multi-AZ databases", "Backup and restore", "Auto Scaling groups"],
      },
    ],
    "aws-generative-ai-developer-professional": [
      {
        name: "GenAI Architectures",
        weightage: 35,
        displayOrder: 1,
        topics: ["RAG patterns", "Vector databases", "Agent orchestration"],
      },
      {
        name: "Model Adaptation & Tuning",
        weightage: 30,
        displayOrder: 2,
        topics: ["Fine-tuning techniques", "RLHF", "Embedding optimization"],
      },
    ],
    "aws-solutions-architect-professional": [
      {
        name: "Design for Organizational Complexity",
        weightage: 26,
        displayOrder: 1,
        topics: ["Multi-account strategy", "AWS Organizations", "Cross-account access"],
      },
      {
        name: "Design for New Solutions",
        weightage: 29,
        displayOrder: 2,
        topics: ["Hybrid cloud", "Modernization roadmap", "Cost optimization"],
      },
    ],
    "aws-devops-engineer-professional": [
      {
        name: "SDLC Automation",
        weightage: 22,
        displayOrder: 1,
        topics: ["Advanced CI/CD", "Infrastructure as Code", "Artifact management"],
      },
      {
        name: "Configuration Management and IaC",
        weightage: 30,
        displayOrder: 2,
        topics: ["CloudFormation templates", "AWS CDK", "Systems Manager"],
      },
    ],
    "aws-advanced-networking-specialty": [
      {
        name: "Network Design",
        weightage: 30,
        displayOrder: 1,
        topics: ["Direct Connect", "Transit Gateway", "Hybrid DNS"],
      },
      {
        name: "Network Security",
        weightage: 22,
        displayOrder: 2,
        topics: ["Network Firewall", "WAF rules", "VPC Flow Logs"],
      },
    ],
    "aws-security-specialty": [
      {
        name: "Incident Response",
        weightage: 20,
        displayOrder: 1,
        topics: ["Security Hub", "GuardDuty alerts", "AWS Config automation"],
      },
      {
        name: "Infrastructure Security",
        weightage: 26,
        displayOrder: 2,
        topics: ["KMS keys", "VPC Peering security", "WAF web ACLs"],
      },
    ],
  };

  // Clear existing domains for clean re-seed
  await prisma.certificationDomain.deleteMany({});

  for (const [slug, domains] of Object.entries(domainsData)) {
    const certId = certMap.get(slug);
    if (!certId) {
      console.warn(`⚠️ Certification slug "${slug}" not found in DB`);
      continue;
    }
    for (const dom of domains) {
      const createdDomain = await prisma.certificationDomain.create({
        data: {
          certificationId: certId,
          name: dom.name,
          weightage: dom.weightage,
          displayOrder: dom.displayOrder,
        },
      });
      for (let i = 0; i < dom.topics.length; i++) {
        await prisma.certificationTopic.create({
          data: {
            domainId: createdDomain.id,
            name: dom.topics[i],
            displayOrder: i + 1,
          },
        });
      }
    }
  }
  console.log("✅ Certification domains and topics seeded");
}

async function seedCareerRoles() {
  const certs = await prisma.certification.findMany();
  const certMap = new Map(certs.map((c) => [c.slug, c.id]));

  const rolesData = [
    {
      name: "Cloud Architect",
      slug: "cloud-architect",
      description: "Design and guide structural blueprints for cloud deployment.",
      certifications: ["aws-cloud-practitioner", "aws-solutions-architect-associate", "aws-solutions-architect-professional"],
      opportunities: ["Cloud Architect", "Solutions Architect", "Cloud Consultant", "Enterprise Architect"],
    },
    {
      name: "DevOps Engineer",
      slug: "devops-engineer",
      description: "Automate build, deployment, and operation pipelines.",
      certifications: ["aws-cloud-practitioner", "aws-cloudops-engineer-associate", "aws-devops-engineer-professional"],
      opportunities: ["DevOps Engineer", "Site Reliability Engineer", "Platform Engineer", "Release Engineer"],
    },
    {
      name: "Security Specialist",
      slug: "security-engineer",
      description: "Harden cloud security, access control, and compliance.",
      certifications: ["aws-cloud-practitioner", "aws-solutions-architect-associate", "aws-security-specialty"],
      opportunities: ["Cloud Security Engineer", "Security Consultant", "Security Analyst", "DevSecOps Engineer"],
    },
    {
      name: "Data Engineer",
      slug: "data-engineer",
      description: "Orchestrate high-throughput cloud pipelines and lakes.",
      certifications: ["aws-cloud-practitioner", "aws-data-engineer-associate"],
      opportunities: ["Data Engineer", "Analytics Engineer", "Data Platform Engineer", "Big Data Engineer"],
    },
    {
      name: "ML Engineer",
      slug: "ml-engineer",
      description: "Train, tune, and deploy machine learning models.",
      certifications: ["aws-cloud-practitioner", "aws-machine-learning-engineer-associate"],
      opportunities: ["ML Engineer", "MLOps Engineer", "AI Engineer", "Data Scientist"],
    },
    {
      name: "AI Engineer",
      slug: "ai-engineer",
      description: "Build, tune, and deploy generative AI applications on AWS.",
      certifications: ["aws-ai-practitioner", "aws-machine-learning-engineer-associate", "aws-generative-ai-developer-professional"],
      opportunities: ["AI Applications Engineer", "Generative AI Developer", "Cognitive Systems Engineer", "Prompt Engineer / Architect"],
    },
    {
      name: "Cloud Developer",
      slug: "cloud-developer",
      description: "Write, deploy, and maintain serverless cloud applications.",
      certifications: ["aws-cloud-practitioner", "aws-developer-associate", "aws-generative-ai-developer-professional"],
      opportunities: ["Cloud Developer", "Backend Developer", "Application Developer", "Cloud Software Engineer"],
    },
    {
      name: "Networking Engineer",
      slug: "networking-engineer",
      description: "Design and deploy robust hybrid cloud networks and routing.",
      certifications: ["aws-cloud-practitioner", "aws-solutions-architect-associate", "aws-advanced-networking-specialty"],
      opportunities: ["Cloud Network Architect", "Network Security Specialist", "Infrastructure Engineer", "Hybrid Connectivity Engineer"],
    },
  ];

  await prisma.roleCertification.deleteMany({});
  await prisma.careerOpportunity.deleteMany({});
  await prisma.careerRole.deleteMany({});

  for (const role of rolesData) {
    const createdRole = await prisma.careerRole.create({
      data: {
        name: role.name,
        slug: role.slug,
        description: role.description,
      },
    });

    for (let i = 0; i < role.certifications.length; i++) {
      const certSlug = role.certifications[i];
      const certId = certMap.get(certSlug);
      if (!certId) {
        console.warn(`⚠️ Certification "${certSlug}" not found in database for role "${role.name}"`);
        continue;
      }
      await prisma.roleCertification.create({
        data: {
          roleId: createdRole.id,
          certificationId: certId,
          pathOrder: i + 1,
        },
      });
    }

    for (let i = 0; i < role.opportunities.length; i++) {
      await prisma.careerOpportunity.create({
        data: {
          roleId: createdRole.id,
          title: role.opportunities[i],
          displayOrder: i + 1,
        },
      });
    }
  }

  console.log("✅ Career roles, pathways, and opportunities seeded");
}

async function main() {
  await seedCertificationLevels();
  await seedCertifications();
  await seedDomainsAndTopics();
  await seedCareerRoles();
  console.log("\n🎉 Seed completed successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
