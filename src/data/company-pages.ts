/**
 * Copy for the company pages (services, about, culture, ESG, integrity, innovation, careers, investors, trust center),
 * taken from the mockup. Kept as typed data so Payload globals can replace it later without touching the pages.
 */

export type Pair = [title: string, text: string];

/* ----------------------------- Services ----------------------------- */
export const SERVICE_STAGES: Array<{ n: string; title: string; text: string; items: string[] }> = [
  { n: "01 · Advise", title: "Advise", text: "Strategy, regulation and readiness — before you build.", items: ["Consulting & Advisory", "Readiness Programs"] },
  { n: "02 · Build", title: "Build", text: "Integration and engineering by the team that makes the technology.", items: ["System Integration", "Software Engineering", "Digitization & Data Services"] },
  { n: "03 · Operate", title: "Operate", text: "Cloud, managed services and trust services, 24/7.", items: ["Cloud Transformation & Infrastructure", "Managed Services", "Trust Services"] },
];

export const PROJECT_STEPS: Pair[] = [
  ["Assess", "Regulation, risks and readiness, before you build."],
  ["Design", "Architecture shaped around your systems and rules."],
  ["Build & integrate", "Engineering by the team that makes the technology."],
  ["Operate 24/7", "Managed services, trust services and support."],
  ["Improve", "Audits, upgrades and new capabilities over time."],
];

export const PROFESSIONAL_SERVICES: Array<[name: string, text: string, bullets: string[]]> = [
  ["Consulting & Advisory", "Strategy, architecture and regulation for digital trust programs.", ["Digital identity and trust strategy", "Regulatory compliance: eIDAS 2.0, NIS2, PCI DSS, data protection", "Security and PKI architecture review"]],
  ["Readiness Programs", "Assess, close the gaps and pass the audit.", ["WebTrust Readiness for certification authorities", "eIDAS 2.0 Readiness for trust services and wallets", "Quantum Readiness for post-quantum migration"]],
  ["System Integration", "Networks, security, systems and cloud, integrated with what you already run.", ["Network and security integration", "Core banking, government and ERP integration", "HSM, CA and signing infrastructure deployment", "Private and hybrid cloud"]],
  ["Software Engineering", "Platforms and apps built on SAVIS technology.", ["Mobile and web applications", "Cloud-native microservices and Open API", "Localization for national requirements"]],
  ["Digitization & Data Services", "Turn paper archives into searchable, trusted digital records.", ["Document digitization and data entry", "Data extraction and recognition", "Data conversion and migration", "Cloud storage", "Data security and encryption", "Scanner and equipment rental", "Certified data destruction"]],
  ["Cloud Transformation & Infrastructure", "From cloud strategy to daily operation of your infrastructure.", ["Cloud and data center consulting and design", "Cloud migration and modernization", "Hybrid and private cloud build", "Infrastructure operation", "Network infrastructure and integration", "Information system transformation", "Warranty and technical support"]],
  ["Managed Services", "Operate critical trust services around the clock.", ["24/7 SOC monitoring and incident response", "PKI, HSM and key management operations", "Application management under agreed SLAs"]],
  ["Trust Services", "Signing and timestamping operated by TrustCA.", ["TrustCA Timestamp Signing", "TrustCA Remote Signing as a service", "HSM as a Service"]],
  ["Solution architecture & design", "Target architecture, sizing and security design for your SAVIS deployment, aligned with your regulations.", ["Architecture workshops", "Sizing and high availability design", "Security and key ceremony design"]],
  ["Implementation & integration", "Install, configure and connect SAVIS products to your core systems, channels and identity providers.", ["Installation and configuration", "Integration with core and channel systems", "Testing and go-live support"]],
  ["Migration & upgrades", "Move from legacy PKI, HSM or authentication platforms and keep SAVIS products current.", ["Legacy platform migration", "Version upgrades", "Crypto-agility and PQC migration planning"]],
  ["Health checks & optimization", "Review a running deployment for security, performance and compliance gaps.", ["Configuration and security review", "Performance tuning", "Audit preparation"]],
  ["Training & knowledge transfer", "Hands-on training so your teams can operate and extend the platform with confidence.", ["Administrator training", "Developer and API training", "Operating procedures handover"]],
];

export const SUPPORT_SERVICES: Array<[string, string, string[]]> = [
  ["Service desk", "A single point of contact for incidents, requests and questions about your SAVIS products.", ["Ticket portal, email and phone", "Severity-based response targets", "Named contacts for your organization"]],
  ["Incident & problem management", "Restore service fast, then find and remove the root cause.", ["Remote diagnostics", "Root-cause analysis", "On-site support where required"]],
  ["Updates & security patches", "Keep products secure and compliant with tested updates and advisories.", ["Security advisories", "Tested patches and releases", "Upgrade guidance"]],
  ["Documentation & knowledge base", "Guides, API references and how-tos for administrators and developers.", ["Product documentation", "API references", "How-to articles"]],
];

/* ----------------------------- About ----------------------------- */
export const ABOUT_STATS: Pair[] = [["22+", "years of digital trust"], ["200+", "international partners"], ["5,000+", "customers"]];

export const TRACK_RECORD: Pair[] = [
  ["Central bank modernization", "World Bank-funded program to modernize Vietnam’s central bank, the State Bank of Vietnam."],
  ["Banking & financial services in Vietnam", "Core trust, security and transaction systems for banks and financial institutions."],
  ["ICT for government and major cities", "ICT programs for the Ministry of Information and Communications and Vietnam’s largest cities."],
];

export const MEMBER_COMPANIES = ["SAVIS Technology", "SAVIS Global", "SAVIS Digital", "SAVIS Semiconductor Inc", "Media-X Group"];
export const RESEARCH_LABS = ["AIoT Lab", "Quantum Lab"];
export const SECTORS_SERVED = ["Government", "Telco", "Banking & FSI", "Media & Television", "Enterprise", "Healthcare", "Education"];

export const STORY_INTRO = [
  "Founded in Hanoi in 2004, SAVIS Group has been at the forefront of Vietnam’s technology development, with a longstanding track record in deploying national Public Key Infrastructure (PKI) since 2006. Over more than 22 years of innovation and growth, SAVIS has developed a strong foundation in core technologies spanning Digital Identity, Trust Services, Secure Payments, National Root of Trust, Cybersecurity, Open Finance, and AI platforms.",
  "SAVIS has successfully delivered nearly 1,000 ICT projects across Vietnam and Southeast Asia, serving government agencies and public institutions, telecommunications, media and broadcasting, enterprises, healthcare, education, and banking and financial services.",
  "Today, with a team of more than 700 engineers, technology experts, and researchers operating across ten offices on four continents, SAVIS Group continues to deliver innovative, secure, and scalable technology solutions, empowering governments, businesses, and communities in their digital transformation journeys.",
];

export const STORY_ERAS: Array<{ years: string; title: string; text: string }> = [
  { years: "2004 – 2015", title: "The nation’s root of trust", text: "Founded in Hanoi in 2004, SAVIS began deploying national PKI in 2006 — the root CAs, time-stamping and validation services that anchor digital signatures for a whole country. From 2012, our Trusted Identity & Transaction Signing secured high-value payment channels and interbank transfers for State Bank of Vietnam units and credit institutions." },
  { years: "2016 – 2025", title: "Trust services, identity and platforms", text: "Ranked among Vietnam’s Top 10 IT companies for ten consecutive years since 2016. TrustCA was licensed by NEAC (Ministry of Information and Communications) in 2019 for remote digital signatures and is the first in Vietnam certified against EU eIDAS for qualified remote signing (QTSP), timestamp and eSeal services. Alongside it, SAVIS delivers mobile PKI, eKYC, open banking and digital government platforms for leading banks, ministries and provinces." },
  { years: "2026", title: "A global digital trust company", text: "On our 22nd anniversary, 4 November 2026, SAVIS set its course: own the core technology and take it to the world. TrustCA Qualified Remote Signing, QTSA and eSeal are certified against eIDAS 2.0 and NIS2, the SAVIS SuperApp platform won the ASOCIO Smart City Awards 2026, and ten offices now serve Asia-Pacific, the Middle East, Africa and the Americas." },
];

export const MISSION = "Build the trusted digital infrastructure that lets nations and enterprises serve people securely.";
export const SIGNATURE = "National-grade trust since 2006 — the same infrastructure that secures a country’s signatures, identities and payments, delivered to governments and enterprises worldwide.";
export const VALUES: Pair[] = [
  ["Trust first", "Security and integrity in every decision."],
  ["Mastery", "We own and understand our technology."],
  ["Customer outcomes", "We stay until it works."],
  ["Openness", "Standards, partners and honest advice."],
  ["Global ambition", "World-class standards in everything we build, for every market we serve."],
];

export const STRATEGY_DIRECTIONS: Pair[] = [
  ["Product-led", "Grow SAVIS-owned IP — SAM Appliance, Quantum Security Appliance, TrustPass and the SAVIS SuperApp platform — certified to international standards."],
  ["As a service", "Offer Digital Trust as a Service alongside on-premise delivery, so customers can start small and scale."],
  ["One core, national profiles", "Build once on ISO, ETSI, FIDO, W3C and NIST standards; configure profiles for eIDAS, NIST SP 800-63-4, Australia’s Digital ID Act and national frameworks."],
  ["Quantum-safe by design", "Crypto-agility and NIST post-quantum algorithms across products and services."],
  ["Global with partners", "Serve customers from ten offices on four continents, with technology and channel partners in each region."],
];

export const NAME_MEANING = {
  text: "SAVIS evokes the English word “savvy” — deep understanding and mastery of technology — and the Latin root sapere, “to be wise”. The name SAVIS carries the sound of wisdom and technological mastery. Each letter, S-A-V-I-S, traces a journey from Smart to Agile, Visionary, Innovative and Secure — affirming the confidence of a leading group that masters its own technology.",
  letters: [["S", "Smart"], ["A", "Agile"], ["V", "Visionary"], ["I", "Innovative"], ["S", "Secure"]] as Pair[],
};

export const MILESTONES: Pair[] = [
  ["2004", "SAVIS Group founded in Hanoi on 4 November 2004."],
  ["2006", "Began deploying national PKI — the root of trust for Vietnam’s digital signatures."],
  ["2012", "Trusted Identity & Transaction Signing for State Bank of Vietnam units and credit institutions: authentication for high-value payment channels and signing of interbank transfers."],
  ["2016", "Ranked among Vietnam’s Top 10 IT companies — ten consecutive years since 2016."],
  ["2019", "TrustCA licensed by NEAC, Ministry of Information and Communications, to provide remote digital signature services."],
  ["2021", "SAVIS was officially licensed to provide Remote Signing services and the first electronic authentication service for timestamping in Vietnam — TrustCA Qualified Timestamp."],
  ["2026", "TrustCA becomes the first in Vietnam certified against EU eIDAS for qualified remote signing (QTSP), timestamp and eSeal services, with NIS2, by TAYLLORCOX PCEB; Zero Trust partnership with Soliton. SAVIS SuperApp platform wins the ASOCIO Smart City Awards 2026; iBacNinh launched in Bac Ninh; SAVIS MRP AI wins a Sao Khuê Award. 22nd anniversary on 4 November: ten offices on four continents and a course set to become a global digital trust company."],
  ["2030", "Vision 2030 — from the nation’s root of trust to the quantum era."],
];

export const LEADERS: Array<{ group: string; people: Array<[name: string, role: string, focus: string]> }> = [
  {
    group: "Board of Management",
    people: [
      ["Steve Huang", "Executive Chairman, Group Holding", "Vision"],
      ["John Pham", "CEO & Founder", "Founder"],
      ["Tat Hoang Nguyen", "CEO & President", "Leadership"],
      ["Nathan Nguyen", "Chief Global Strategy Officer", "Strategy"],
      ["Dr Diego Vu", "Chief External Relations Officer · Member of the Strategy Council", "Partnerships"],
      ["Thomas Minh", "EVP, Chief Technology Officer", "Technology"],
    ],
  },
  {
    group: "Global sales leadership",
    people: [
      ["Steve Palmer", "EVP Global Sales, APAC", "APAC"],
      ["Andy Nguyen", "Regional Sales Director, ANZ", "ANZ"],
      ["Martin Lee", "EVP Global Sales, LATAM", "LATAM"],
      ["Dhaki Khan", "EVP Global Sales, MENA", "MENA"],
    ],
  },
];

/* ----------------------------- Culture ----------------------------- */
export const CULTURE_HOW: Pair[] = [
  ["Decisive", "We commit and deliver."],
  ["Creative", "We look for the better way."],
  ["Strong", "We stand behind what we build."],
  ["Agile", "We adapt fast, together."],
];

export const CULTURE_LIFE: Array<[label: string, title: string, text: string]> = [
  ["Growth", "Learn and grow", "Full onboarding and training for every new S-er — technical and soft skills — taught by senior engineers. Leaders mentor hands-on, every idea for a better process is welcome, and checkpoints every six months open the path to Leader and Manager roles."],
  ["Recognition", "Recognition", "S-Awards each year for Star of the Year, Outstanding Employee and Rising Star, and long-service honours at 5, 10 and 15 years. Colleagues who make an exceptional contribution can share in the company’s success."],
  ["Well-being", "Well-being", "S-Health Care Day for every employee each year, support for birthdays, weddings, illness and maternity, and holiday and year-end bonuses."],
  ["People", "Together", "Work hard, play hard: S-Teambuilding, the founding-day Olympics and SAVIS Run, the Year End Party, MasterChef on 8 March, 20 October, Mid-Autumn and monthly birthdays."],
];

export const CULTURE_STORIES: Array<{ tag: string; date: string; title: string; text: string; quote: string }> = [
  { tag: "Teambuilding", date: "July 2026", title: "S-Teambuilding 2026: Ride the Infinite Wave", text: "At Lăng Cô Bay in Hue, three teams — All-in-one, Visilead and Long Phung Sum Vay — competed in relay, ball-collection and “magic flying carpet” challenges built on coordination and trust. At the gala dinner, Chairman Steve Huang set out the group’s direction: platform growth, AI security and a wider partner ecosystem across Asia-Pacific and beyond. S-Award 2026 honoured colleagues with 5, 10 and 15 years at SAVIS.", quote: "One Team – One Dream" },
  { tag: "Well-being", date: "October 2025", title: "S-Health Care Day 2025: 100% Strong", text: "Every year SAVIS invites all employees to a full health check — general, imaging and laboratory screening with a partner clinic. The Board of Management sees physical and mental well-being as the foundation of sustainable growth, not a perk.", quote: "Healthy people, strong company" },
  { tag: "Year End Party", date: "January 2025", title: "S-Revolution: Fire It Up", text: "The 2024 Year End Party marked SAVIS’s 20-year milestone. The S-Awards recognized the Star of the Year — an engineer behind open banking, e-signature, remote signing and bank PKI projects — together with Outstanding Employee and Rising Star awards, before teams took the stage in the S-Talent Show.", quote: "Creative yet determined, agile yet powerful" },
  { tag: "Anniversary", date: "November 2023", title: "19 years: Shaping Digital Future Together", text: "On SAVIS’s 19th birthday, colleagues with more than ten years of service received certificates and medals, standout project teams were honoured, and prizes went to the winners of the SAVIS Run Challenge, the Team Unleashed photo contest and the “SAVIS in me” story contest.", quote: "Shaping Digital Future Together" },
  { tag: "Workplace", date: "Every day", title: "Small corners, big ideas", text: "Our Hanoi office mixes focus and fun: green corners, a teamwork corner, a “chill” zone for coffee after deep work, monthly birthday parties and seasonal celebrations from Mid-Autumn to Christmas.", quote: "A place you want to come back to" },
];

/* ----------------------------- ESG & Integrity ----------------------------- */
export const ESG_PILLARS: Array<{ letter: string; title: string; points: string[] }> = [
  { letter: "E", title: "Environment", points: ["ISO 14001:2015 certified environmental management system.", "Paperless by design: e-contracts, remote signing, trusted archives and digital government services replace paper, printing, couriers and travel for our customers.", "Efficient delivery: shared platforms and cloud or appliance options sized to each deployment."] },
  { letter: "S", title: "Social", points: ["Digital inclusion: national digital identity, civil registration and one-app public services bring government to every phone.", "Digital public goods: SAVIS CRVS is built on OpenCRVS, and we work with the MOSIP open-source identity platform.", "Our people: more than 700 engineers, experts and researchers who learn, grow and celebrate together.", "Education: open labs and student visits share our technology with the next generation."] },
  { letter: "G", title: "Governance", points: ["ISO/IEC 27001:2022 information security and ISO 9001:2015 quality management.", "Standards first: products built to eIDAS 2.0, NIS2, FIDO2, PSD2 and Vietnam’s regulation.", "Integrity & compliance principles for how we work with customers, partners and suppliers."] },
];

export const ESG_IMPACT: Array<[sdg: string, title: string, text: string]> = [
  ["SDG 16.9", "Legal identity for all", "Birth registration, national ID and digital identity that let people prove who they are."],
  ["SDG 16.6", "Effective public institutions", "Digital public services and integration from central to local government."],
  ["SDG 8.10", "Access to financial services", "Remote onboarding and secure digital banking for more people."],
  ["SDG 12", "Responsible consumption", "Paperless contracts, signatures and archives."],
];

export const INTEGRITY_PRINCIPLES: Pair[] = [
  ["Code of conduct", "Honesty, fairness and respect in how we work with customers, partners, colleagues and communities."],
  ["Anti-bribery & anti-corruption", "No bribes, kickbacks or improper payments — directly or through third parties — in any market."],
  ["Data protection & privacy", "Personal data handled lawfully and minimally, in line with Vietnam’s personal data protection law and GDPR where it applies."],
  ["Information security", "An ISO/IEC 27001:2022 information security management system and security-by-design products."],
  ["Export control & sanctions", "Cryptographic products and services supplied in line with applicable export-control and sanctions rules."],
  ["Fair competition", "We compete on the quality of our technology and service, and respect competition law."],
  ["Responsible AI", "AI that is explainable, privacy-preserving and overseen by people, especially in identity and fraud decisions."],
  ["Responsible supply chain", "We expect partners and suppliers to share our standards on ethics, security and labor."],
  ["Conflicts of interest", "Business decisions are made in the interest of customers and the company, never for personal gain."],
];

export const MANAGEMENT_SYSTEMS: Pair[] = [
  ["eIDAS 2.0 · NIS2", "TrustCA Qualified Remote Signing, QTSA and eSeal — TAYLLORCOX PCEB 26/08/10, valid to 9 Aug 2028"],
  ["ISO/IEC 27001:2022", "Information security management"],
  ["ISO 9001:2015", "Quality management"],
  ["ISO 14001:2015", "Environmental management"],
];
