/* Header and footer content, taken from the final savis.vn V3 mockup.
   Every href is a "#" placeholder until the real routes exist. */
export interface Link { label: string; href: string }
export interface FeatureCard { tag: string; title: string; cta: string; href: string; art?: { cls: string; icon: string; lbl?: string } }

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

export const solutionsMenu = {
  tabs: [
    { id: "products", title: "By products", text: "Products and platforms across five solution pillars" },
    { id: "industry", title: "By industry", text: "Solutions for your sector, from government to banking" },
  ],
  overview: { label: "Solutions & Products overview →", href: "#solutions" },
  all: { label: "All solutions & products →", href: "#solutions" },
  promo: { tag: "Featured report", kicker: "SAVIS Report · 2026", title: "Digital Trust Report 2026", cta: "Read the report →", href: "#report-digital-trust-2026" },
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
    { tag: "Video", title: "Assess, design, deploy and operate.", cta: "Watch the film →", href: "#services", art: { cls: "ai", icon: "mega", lbl: "Assess · Design · Deploy|mx-film-services" } },
    { tag: "Professional Services", title: "Advisory, integration, engineering, cloud, managed and trust services.", cta: "See professional services →", href: "#services-pro", art: { cls: "ai", icon: "compass", lbl: "~mx-pro" } },
    { tag: "Customer Support", title: "One support team for every SAVIS product, from first ticket to root cause.", cta: "See customer support →", href: "#services-support", art: { cls: "finance", icon: "headset", lbl: "~mx-support" } },
  ] as FeatureCard[],
};

export const insightsMenu = {
  latest: [
    { tag: "Press release", date: "22 November 2026", title: "What TrustCA's eIDAS certification means for customers in Vietnam and ASEAN", href: "#news-trustca-eidas-certification-what-it-means" },
    { tag: "Award", date: "6 November 2026", title: "SAVIS SuperApp platform wins the ASOCIO Smart City Awards 2026", href: "#news-asocio-smart-city-2026" },
  ],
  all: { label: "All insights →", href: "#insights" },
  links: [
    { label: "News", href: "#insights-news" },
    { label: "Press Releases", href: "#insights-press" },
    { label: "Regulation & Policy", href: "#insights-regulation" },
    { label: "Case Study", href: "#customers-stories" },
    { label: "Tech bulletins", href: "#tech-bulletins" },
  ] as Link[],
  overview: { label: "Insights overview →", href: "#insights" },
};

export const resourcesMenu = {
  heading: "Resources",
  links: [
    { label: "Reports", href: "#resources-reports" },
    { label: "Datasheets", href: "#resources-datasheets" },
    { label: "Solution brochures", href: "#resources-brochures" },
    { label: "Solution briefs", href: "#resources-briefs" },
    { label: "Videos", href: "#resources-videos" },
    { label: "Blog", href: "#resources-blog" },
  ] as Link[],
  all: { label: "Resource library →", href: "#resources" },
  cards: [
    { tag: "Video", title: "Our history, vision, growth and global reach", cta: "Watch the film →", href: "#resources-videos", art: { cls: "identity", icon: "mega", lbl: "SAVIS · Brand film|mx-film-brand" } },
    { tag: "Datasheet", title: "SAVIS TrustOnboard", cta: "View datasheet →", href: "#ds-trustonboard", art: { cls: "identity", icon: "face", lbl: "~mx-ds-trustonboard" } },
    { tag: "Brochure", title: "Cybersecurity & Quantum-Safe Infrastructure", cta: "Read the brochure →", href: "#pillar-cyber", art: { cls: "cyber", icon: "shield", lbl: "~mx-br-cyber" } },
  ] as FeatureCard[],
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
    { tag: "About SAVIS", title: "22 years of digital trust, made in Vietnam and trusted worldwide.", cta: "Our story →", href: "#about", art: { cls: "identity", icon: "root", lbl: "~mx-about" } },
    { tag: "Careers", title: "Join our team of engineers, experts and researchers.", cta: "See careers at SAVIS →", href: "#careers", art: { cls: "ai", icon: "chip", lbl: "~mx-careers" } },
    { tag: "Events", title: "Find us at industry events around the world.", cta: "SAVIS at SICW 2026 →", href: "#news-sicw-2026", art: { cls: "gov", icon: "gov", lbl: "~mx-events" } },
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
