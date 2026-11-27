/* Header and footer content, taken from the final savis.vn V3 mockup.
   Every href is a "#" placeholder until the real routes exist. */
export interface Link { label: string; href: string }
export interface FeatureCard { photo?: string; /** Shows a play button on the picture. */ video?: boolean; tag: string; title: string; cta: string; href: string; art?: { cls: string; icon: string; lbl?: string } }

export const utilityLinks: Link[] = [
  { label: "Who are you?", href: "#who" },
  { label: "Investors", href: "#investors" },
  { label: "Partner Portal", href: "#partner-portal" },
  { label: "Careers", href: "#careers" },
  { label: "Trust Center", href: "#trust-center" },
];

export type MenuId = "solutions" | "services" | "insights" | "resources" | "company";
export const mainNav: Array<{ id: MenuId; label: string }> = [
  { id: "solutions", label: "Solutions & Products" },
  { id: "services", label: "Services" },
  { id: "insights", label: "Insights" },
  { id: "resources", label: "Resources" },
  { id: "company", label: "Company" },
];

/** A document shown beside the Solutions menu. `pal` is the color family of its cover (see layout.css). */
/** `slug` is the report in the CMS; the card leads to its page once it is published. */
export interface MenuDoc { kind: "Report" | "Whitepaper"; slug: string; title: string; series?: string; pal: string }

const digitalTrust: MenuDoc = { kind: "Report", slug: "digital-trust-2026", title: "Digital Trust Report 2026", pal: "identity" };

export const solutionsMenu = {
  tabs: [
    { id: "products", title: "By products", text: "Products and platforms across five solution pillars", heading: "Products by solution", all: { label: "All solutions & products →", href: "#solutions" } },
    { id: "industry", title: "By industry", text: "Solutions for your sector, from government to banking", heading: "Industries by sector", all: { label: "All industries →", href: "#industries" } },
  ] as const,
  overview: { label: "Solutions & Products overview →", href: "#solutions" },
  /** Where the card of an unpublished document leads: a copy is asked for through the contact form. */
  request: "#contact",
  /** Keyed by what is open: a tab, a pillar id, or a sector name from INDUSTRY_GROUPS. */
  docs: {
    products: digitalTrust,
    identity: { kind: "Whitepaper", slug: "nd-case-2026", title: "Digital trust as economic infrastructure: the case, the gaps and the models", series: "National Digital Identity Playbook", pal: "nd" },
    cyber: { kind: "Report", slug: "pqc-readiness-2026", title: "Post-Quantum Readiness Report 2026", pal: "cyber" },
    gov: { kind: "Whitepaper", slug: "zt-architecture-2026", title: "One control plane, three enforcement planes: zero trust for digital public services", series: "Zero Trust for Digital Public Services", pal: "zt" },
    finance: { kind: "Whitepaper", slug: "fr-decisioning-2026", title: "Know the device, understand the context, decide the risk", series: "AI Fraud Decisioning Series", pal: "fr" },
    ai: { kind: "Report", slug: "secure-ai-2026", title: "Secure AI in regulated organizations", pal: "ai" },
    industry: digitalTrust,
    "Government & public sector": { kind: "Whitepaper", slug: "tp-platform-2026", title: "Designing a national-grade digital identity and trust platform", series: "TrustPass & TrustSign Developer Series", pal: "tp" },
    "Financial services": { kind: "Whitepaper", slug: "pp-channels-2026", title: "One authentication layer for every channel: transaction signing and dynamic linking with FIDO2", series: "Passkeys Across Every Banking Channel", pal: "pp" },
    "Telco & enterprise": { kind: "Whitepaper", slug: "dt-chain-2026", title: "Beyond app shielding: securing the whole digital trust chain", series: "The Digital Trust Chain", pal: "dt" },
    "Mobility & infrastructure": { kind: "Whitepaper", slug: "wallet-architecture-2026", title: "Digital ID wallets: architecture and standards", series: "Digital ID Wallet series", pal: "wallet" },
  } as Record<string, MenuDoc>,
};

export const servicesMenu = {
  heading: "Services",
  links: [
    { label: "Professional Services", href: "#services-pro" },
    { label: "Customer Support", href: "#services-support" },
    { label: "Developers", href: "#developers" },
  ] as Link[],
  all: { label: "Explore all services →", href: "#services" },
  talk: { label: "Talk to an expert →", href: "#contact" },
  cards: [
    { tag: "Video", title: "Assess, design, deploy and operate.", cta: "Watch the film →", href: "#services-watch", photo: "/images/company/film-services.jpg", video: true },
    { tag: "Professional Services", title: "Advisory, integration, engineering, cloud, managed and trust services.", cta: "See professional services →", href: "#services-pro", art: { cls: "ai", icon: "compass", lbl: "~mx-pro" } },
    { tag: "Customer Support", title: "One support team for every SAVIS product, from first ticket to root cause.", cta: "See customer support →", href: "#services-support", art: { cls: "finance", icon: "headset", lbl: "~mx-support" } },
  ] as FeatureCard[],
  /** Panel of each service group; its list of services is filled in by the layout. */
  groups: [
    {
      id: "pro", name: "Professional Services", href: "/services#professional", explore: "Explore professional services →",
      lead: "Advisory, integration, engineering, cloud, managed and trust services, delivered by the team that makes the technology.",
      card: { tag: "Professional Services", title: "Tell us your project and get the right specialists.", cta: "Talk to an expert →", href: "/contact", art: { cls: "ai", icon: "compass", lbl: "mx-side-pro" } },
    },
    {
      id: "support", name: "Customer Support", href: "/services#support", explore: "Explore customer support →",
      lead: "One support team for every SAVIS product - from first ticket to root cause.",
      card: { tag: "Customer Support", title: "Talk to our support team about your SAVIS products.", cta: "Contact support →", href: "/contact", art: { cls: "finance", icon: "headset", lbl: "mx-side-support" } },
    },
    {
      id: "developers", name: "Developers", href: "/services/developers", explore: "Explore developers →",
      lead: "APIs and SDKs for partners who build Digital Trust as a Service on TrustCA QTSP and SAVIS Paperless.",
      card: { tag: "Developers", title: "Standards-based APIs and SDKs for signing, identity and open finance.", cta: "Explore the APIs →", href: "/services/developers#dev-apis", art: { cls: "cyber", icon: "api", lbl: "mx-side-dev" } },
    },
  ],
};

export const insightsMenu = {
  all: { label: "All insights →", href: "#insights" },
  links: [
    { label: "News", href: "#insights-news" },
    { label: "Press Releases", href: "#insights-press" },
    { label: "Regulation & Policy", href: "#insights-regulation" },
    { label: "Case Study", href: "#customers-stories" },
    { label: "Blog", href: "#resources-blog" },
    { label: "Tech bulletins", href: "#tech-bulletins" },
  ] as Link[],
  overview: { label: "Insights overview →", href: "#insights" },
};

export type ResourceKind = "reports" | "datasheets" | "brochures" | "briefs" | "videos" | "blog";

export const resourcesMenu = {
  heading: "Resources",
  /** Each category previews three of its items beside the list; `panel` is the heading above them. */
  categories: [
    // Until a report is published, the category and its cards ask for a copy through the contact form (see lib/resources).
    { id: "reports", label: "Reports", href: "#resources-reports", panel: "Reports and whitepapers", more: { label: "Request a report →", href: "#contact" } },
    { id: "datasheets", label: "Datasheets", href: "#resources-datasheets", panel: "Featured datasheets", more: { label: "All datasheets →", href: "#resources-datasheets" } },
    { id: "brochures", label: "Solution brochures", href: "#resources-brochures", panel: "Solution brochures", more: { label: "All brochures →", href: "#resources-brochures" } },
    { id: "briefs", label: "Solution briefs", href: "#resources-briefs", panel: "Featured solution briefs", more: { label: "All solution briefs →", href: "#resources-briefs" } },
    { id: "videos", label: "Videos", href: "#resources-videos", panel: "Featured videos", more: { label: "All videos →", href: "#resources-videos" } },
    { id: "blog", label: "Blog", href: "#resources-blog", panel: "Latest from the blog", more: { label: "All blog posts →", href: "#resources-blog" } },
  ] as Array<Link & { id: ResourceKind; panel: string; more: Link }>,
  all: { label: "Resource library →", href: "#resources" },
  /** Shown until a category is pointed at: the brand video, then this datasheet and this pillar's brochure. */
  featured: { panel: "Featured resources", datasheet: "trustonboard", brochure: "cyber" },
  datasheets: ["trustonboard", "kms", "open-banking-suite"],
  reports: [
    { kind: "Whitepaper", slug: "wallet-architecture-2026", tag: "Digital identity", pal: "wallet", title: "Digital ID wallets: architecture and standards", text: "The seven layers of a wallet ecosystem, the standards that have converged, and the design decisions to make early" },
    { kind: "Report", slug: "secure-ai-2026", tag: "AI security", pal: "ai", title: "Secure AI in regulated organizations", text: "A 2026 playbook for banks, governments and telecom operators" },
    { kind: "Report", slug: "pqc-readiness-2026", tag: "Quantum", pal: "cyber", title: "Post-Quantum Readiness Report 2026", text: "Timelines, priorities and a migration plan for banks, governments and telecom operators" },
  ],
};

export const companyMenu = {
  heading: "Company",
  links: [
    { label: "Who we are", href: "#about" },
    { label: "Innovation", href: "#innovation" },
    { label: "Responsibility", href: "#esg" },
    { label: "Join us", href: "#careers" },
  ] as Link[],
  contact: { label: "Contact us →", href: "#contact" },
  partner: { label: "Partner Portal →", href: "#partner-portal" },
  all: { label: "About SAVIS Group →", href: "#about" },
  cards: [
    { photo: "/images/company/anniversary.jpg", tag: "About SAVIS", title: "22 years of digital trust, made in Vietnam and trusted worldwide.", cta: "Our story →", href: "#about", art: { cls: "identity", icon: "root", lbl: "~mx-about" } },
    { photo: "/images/company/team-meeting.jpg", tag: "Careers", title: "Join our team of engineers, experts and researchers.", cta: "See careers at SAVIS →", href: "#careers", art: { cls: "ai", icon: "chip", lbl: "~mx-careers" } },
    { photo: "/images/company/sicw-2026.jpg", tag: "Events", title: "Find us at industry events around the world.", cta: "SAVIS at SICW 2026 →", href: "#news-sicw-2026", art: { cls: "gov", icon: "gov", lbl: "~mx-events" } },
  ] as FeatureCard[],
};

export const footerSolutions: Link[] = [
  { label: "Services", href: "#services" },
  { label: "Customers", href: "#customers" },
  { label: "Use cases", href: "#use-cases" },
];

export const footerOffices: string[] = ["Hanoi · HQ", "Ho Chi Minh City", "Asia-Pacific", "Middle East", "Africa", "Americas"];

export const footerCompany: Link[] = [
  { label: "About SAVIS", href: "#about" },
  { label: "Investors", href: "#investors" },
  { label: "Innovation & R&D", href: "#innovation" },
  { label: "Quantum PQC Lab", href: "#pqc-lab" },
  { label: "Quantum Readiness", href: "#p-quantum-readiness" },
  { label: "ESG & Sustainability", href: "#esg" },
  { label: "Integrity & Compliance", href: "#integrity" },
  { label: "Trust Center", href: "#trust-center" },
  { label: "Culture", href: "#culture" },
  { label: "Careers", href: "#careers" },
  { label: "Partners", href: "#partners" },
  { label: "Partner Portal", href: "#partner-portal" },
  { label: "Contact", href: "#contact" },
  { label: "Tech bulletins", href: "#tech-bulletins" },
];

export const footerRegions = "Vietnam · Singapore · Philippines · Australia & New Zealand · UAE · Nigeria · Algeria · Brazil · USA";
export const hotline = { label: "Hotline 1900 636156", href: "tel:1900636156" };
export const certifications = ["ISO 9001", "ISO 14001", "ISO/IEC 27001"];
export const legalLinks: Link[] = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Cookies", href: "#cookies" },
];
