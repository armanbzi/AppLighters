// The six capability areas — the single source of truth for the whole site.
// Consumed directly (client-side) by Navigation, the homepage capability grid,
// the footer, and the dynamic service pages. Icons are real MUI components, so
// only import this from client/rendered code — never serialize a service object
// through getStaticProps (pass the slug and resolve it in the component instead;
// see pages/services/[slug].js).
//
// Positioning: AppLighters does NOT build apps from scratch here — every service
// is about enhancing, optimizing and extending an app the client already runs.
// "Lighting your app" = boosting it. Keep copy in that voice.

import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ForumRounded from "@mui/icons-material/ForumRounded";
import RecommendRounded from "@mui/icons-material/RecommendRounded";
import DocumentScannerRounded from "@mui/icons-material/DocumentScannerRounded";
import RecordVoiceOverRounded from "@mui/icons-material/RecordVoiceOverRounded";
import SmartToyRounded from "@mui/icons-material/SmartToyRounded";
import ManageSearchRounded from "@mui/icons-material/ManageSearchRounded";

import StorageRounded from "@mui/icons-material/StorageRounded";
import QueryStatsRounded from "@mui/icons-material/QueryStatsRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import SdStorageRounded from "@mui/icons-material/SdStorageRounded";
import AccountTreeRounded from "@mui/icons-material/AccountTreeRounded";
import SchemaRounded from "@mui/icons-material/SchemaRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";

import SavingsRounded from "@mui/icons-material/SavingsRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import AutoModeRounded from "@mui/icons-material/AutoModeRounded";
import CleaningServicesRounded from "@mui/icons-material/CleaningServicesRounded";
import NotificationsActiveRounded from "@mui/icons-material/NotificationsActiveRounded";

import SettingsSuggestRounded from "@mui/icons-material/SettingsSuggestRounded";
import PublishedWithChangesRounded from "@mui/icons-material/PublishedWithChangesRounded";
import FactCheckRounded from "@mui/icons-material/FactCheckRounded";
import TerminalRounded from "@mui/icons-material/TerminalRounded";
import MonitorHeartRounded from "@mui/icons-material/MonitorHeartRounded";
import RocketLaunchRounded from "@mui/icons-material/RocketLaunchRounded";

import CloudRounded from "@mui/icons-material/CloudRounded";
import CloudSyncRounded from "@mui/icons-material/CloudSyncRounded";
import ArchitectureRounded from "@mui/icons-material/ArchitectureRounded";
import HubRounded from "@mui/icons-material/HubRounded";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";

import ShieldRounded from "@mui/icons-material/ShieldRounded";
import GppGoodRounded from "@mui/icons-material/GppGoodRounded";
import BugReportRounded from "@mui/icons-material/BugReportRounded";
import BackupRounded from "@mui/icons-material/BackupRounded";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import PolicyRounded from "@mui/icons-material/PolicyRounded";

export const services = [
    {
        slug: "ai-integration",
        name: "AI Integration",
        navLabel: "AI Integration",
        icon: AutoAwesomeRounded,
        // Two-stop ambient accent for AuroraBg. UI accent stays brand-purple.
        accent: { a: "#C15BEE", b: "#7E2BD8" },
        tagline: "Add AI to the app you already run.",
        overview:
            "Your product already has users and data — that's the perfect foundation for AI. We layer intelligent features onto your existing app without a rebuild: chat and copilots, recommendations, document understanding, voice, and autonomous agents that actually move your numbers.",
        included: [
            { icon: ForumRounded, title: "Chat & copilots", blurb: "In-product assistants and support bots grounded in your own content." },
            { icon: ManageSearchRounded, title: "RAG & smart search", blurb: "Answer questions over your data with retrieval-augmented generation." },
            { icon: RecommendRounded, title: "Recommendations", blurb: "Personalized feeds, next-best-action and ranking tuned to your users." },
            { icon: DocumentScannerRounded, title: "Vision & documents", blurb: "Extract, classify and summarize images, PDFs and scanned files." },
            { icon: RecordVoiceOverRounded, title: "Voice & speech", blurb: "Transcription, voice interfaces and natural text-to-speech." },
            { icon: SmartToyRounded, title: "AI agents", blurb: "Task automation and workflows powered by tool-using agents." },
        ],
        outcomes: [
            { stat: "2–4 wks", label: "to ship a first AI feature" },
            { stat: "Live", label: "on iOS, Android & web" },
            { stat: "Your data", label: "kept private & in your stack" },
        ],
    },
    {
        slug: "data-storage",
        name: "Data & Storage Optimization",
        navLabel: "Data & Storage",
        icon: StorageRounded,
        accent: { a: "#7C6BF5", b: "#4F46E5" },
        tagline: "Faster queries, leaner storage.",
        overview:
            "As an app grows, its data slows it down and quietly inflates the bill. We profile the hot paths, fix the queries and indexes, add the right caching, and reshape storage so your app feels instant again — and stays that way as you scale.",
        included: [
            { icon: QueryStatsRounded, title: "Query & index tuning", blurb: "Find and fix the slow queries dragging down every screen." },
            { icon: BoltRounded, title: "Caching layers", blurb: "Redis/edge caching that cuts response times and database load." },
            { icon: SdStorageRounded, title: "Storage right-sizing", blurb: "Tiering, compression and cleanup to shrink what you pay to store." },
            { icon: AccountTreeRounded, title: "Data pipelines", blurb: "Reliable ETL/ELT so data lands where it's needed, on time." },
            { icon: SchemaRounded, title: "Schema & migrations", blurb: "Safe, zero-downtime schema changes and modeling." },
            { icon: InsightsRounded, title: "Analytics-ready data", blurb: "Clean, queryable data your team and dashboards can trust." },
        ],
        outcomes: [
            { stat: "Up to 10×", label: "faster key queries" },
            { stat: "Lower", label: "database & storage cost" },
            { stat: "Zero", label: "downtime migrations" },
        ],
    },
    {
        slug: "cost-optimization",
        name: "Cost Optimization",
        navLabel: "Cost",
        icon: SavingsRounded,
        accent: { a: "#A855F7", b: "#22C1A6" },
        tagline: "Cut the cloud bill, keep the performance.",
        overview:
            "Cloud bills creep up on idle resources, oversized instances and forgotten services. We audit exactly where the money goes, right-size and automate, and put guardrails in place so spend stays predictable — without slowing anything down.",
        included: [
            { icon: ReceiptLongRounded, title: "Cloud spend audit", blurb: "A clear, itemized picture of where every dollar goes." },
            { icon: TuneRounded, title: "Right-sizing compute", blurb: "Match instances and services to real, measured demand." },
            { icon: AutoModeRounded, title: "Autoscaling & scheduling", blurb: "Scale to zero off-hours; pay only for what you use." },
            { icon: CleaningServicesRounded, title: "Waste removal", blurb: "Kill idle resources, orphaned volumes and duplicate services." },
            { icon: SavingsRounded, title: "Commitments & savings plans", blurb: "Reserved and committed-use discounts, correctly sized." },
            { icon: NotificationsActiveRounded, title: "Budgets & alerts", blurb: "Cost monitoring that warns you before the bill surprises you." },
        ],
        outcomes: [
            { stat: "20–40%", label: "typical bill reduction" },
            { stat: "Same", label: "or better performance" },
            { stat: "Ongoing", label: "cost visibility & alerts" },
        ],
    },
    {
        slug: "automation",
        name: "Automation & DevOps",
        navLabel: "Automation",
        icon: SettingsSuggestRounded,
        accent: { a: "#6366F1", b: "#3B82F6" },
        tagline: "Ship faster, break less.",
        overview:
            "Manual deploys and flaky processes cost you speed and confidence. We automate the path from commit to production — pipelines, tests, infrastructure as code and monitoring — so your team ships more often with far less risk.",
        included: [
            { icon: PublishedWithChangesRounded, title: "CI/CD pipelines", blurb: "Automated build, test and deploy on every merge." },
            { icon: FactCheckRounded, title: "Automated testing", blurb: "Unit, integration and end-to-end coverage that catches regressions." },
            { icon: TerminalRounded, title: "Infrastructure as code", blurb: "Reproducible environments with Terraform / Pulumi." },
            { icon: RocketLaunchRounded, title: "Safe releases", blurb: "Blue-green, canary and one-click rollback." },
            { icon: MonitorHeartRounded, title: "Monitoring & alerting", blurb: "Know about issues before your users do." },
            { icon: AccountTreeRounded, title: "Workflow automation", blurb: "Automate the repetitive glue work between your tools." },
        ],
        outcomes: [
            { stat: "Minutes", label: "not hours, to deploy" },
            { stat: "Fewer", label: "production incidents" },
            { stat: "One-click", label: "rollback & recovery" },
        ],
    },
    {
        slug: "cloud-scaling",
        name: "Cloud & Scalability",
        navLabel: "Cloud",
        icon: CloudRounded,
        accent: { a: "#818CF8", b: "#38BDF8" },
        tagline: "Built to handle your next 10× in users.",
        overview:
            "Growth shouldn't mean downtime. We migrate, re-architect and scale your app so it stays fast and available under load — from a smoother cloud setup to serverless, containers and high-availability designs that grow with you.",
        included: [
            { icon: CloudSyncRounded, title: "Cloud migration", blurb: "Move to (or between) AWS, GCP or Azure with no drama." },
            { icon: ArchitectureRounded, title: "Architecture review", blurb: "Find the bottlenecks and single points of failure." },
            { icon: HubRounded, title: "Load balancing & scaling", blurb: "Horizontal scaling and load balancing that just works." },
            { icon: ViewInArRounded, title: "Serverless & containers", blurb: "Right-fit compute with Kubernetes, ECS or serverless." },
            { icon: SpeedRounded, title: "Performance tuning", blurb: "Latency and throughput work across the whole stack." },
            { icon: TrendingUpRounded, title: "High availability", blurb: "Multi-zone, resilient setups with graceful failover." },
        ],
        outcomes: [
            { stat: "99.9%+", label: "uptime targets" },
            { stat: "10×", label: "headroom for growth" },
            { stat: "Global", label: "low-latency delivery" },
        ],
    },
    {
        slug: "security-reliability",
        name: "Security & Reliability",
        navLabel: "Security",
        icon: ShieldRounded,
        accent: { a: "#8B5CF6", b: "#10B981" },
        tagline: "Harden the app you depend on.",
        overview:
            "The bigger your app gets, the more there is to protect. We harden it against real-world threats, add the monitoring and backups that let you sleep at night, and get you ready for the compliance your customers ask about.",
        included: [
            { icon: GppGoodRounded, title: "Security hardening", blurb: "Fix auth, access control and the OWASP-class risks." },
            { icon: BugReportRounded, title: "Vulnerability scanning", blurb: "Automated scanning of code, dependencies and infra." },
            { icon: MonitorHeartRounded, title: "Observability", blurb: "Logs, metrics and traces so nothing fails silently." },
            { icon: BackupRounded, title: "Backups & recovery", blurb: "Tested backups and a disaster-recovery plan that works." },
            { icon: VerifiedUserRounded, title: "Uptime & SLAs", blurb: "Reliability engineering to hit and hold your targets." },
            { icon: PolicyRounded, title: "Compliance readiness", blurb: "Groundwork for SOC 2, GDPR, HIPAA and friends." },
        ],
        outcomes: [
            { stat: "Hardened", label: "against common attacks" },
            { stat: "Tested", label: "backups & recovery" },
            { stat: "Audit-ready", label: "compliance foundations" },
        ],
    },
];

// Convenience lookups.
export const serviceSlugs = services.map((s) => s.slug);
export const getService = (slug) => services.find((s) => s.slug === slug) || null;

export default services;
