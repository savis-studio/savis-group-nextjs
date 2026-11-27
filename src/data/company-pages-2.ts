/** Copy for innovation, PQC lab, careers, investors and the trust center (from the mockup). See company-pages.ts. */
import type { Pair } from "./company-pages";

/* ----------------------------- Innovation & PQC Lab ----------------------------- */
export const INNOVATION_LABS: Array<{ tag: string; title: string; text: string; href?: string }> = [
  { tag: "ML-KEM · ML-DSA · QKD", title: "Quantum PQC Lab", text: "Post-quantum algorithms, hybrid certificates and migration pilots.", href: "/innovation/pqc-lab" },
  { tag: "AI · OCR", title: "Applied AI", text: "AI for fraud detection, intelligent documents and media production." },
  { tag: "Device PKI · Secure boot · OTA", title: "AI & IoT Lab", text: "Edge and IoT gateways with AI inference for smart operations." },
];

export const FOCUS_AREAS: Array<[tag: string, title: string, text: string, href?: string]> = [
  ["Quantum-safe", "Quantum PQC Lab", "Test post-quantum algorithms, hybrid certificates and migrations before production.", "/innovation/pqc-lab"],
  ["Quantum-safe", "Quantum Readiness", "A structured program to inventory cryptography and plan migration.", "/products/quantum-readiness"],
  ["Identity", "Digital Trust", "Remote signing, QTSA and eSeal certified against eIDAS 2.0 and NIS2; national PKI and digital ID.", "/trust-center"],
  ["AI", "AI & IoT Lab", "AI hub for training and inference (vision, NLP, speech), edge/IoT gateway and IoT receiver boxes for remote control."],
  ["AI & data", "AI & Semiconductor", "Applied AI for fraud detection, intelligent documents and media production, and semiconductor development with SAVIS Semiconductor Inc."],
];

export const RND_PRINCIPLES = [
  "Standards first: NIST post-quantum algorithms, eIDAS 2.0, FIDO2, CSC API",
  "Pilots with customers in the Quantum PQC Lab before rollout",
  "Engineering teams that own products from design to operations",
];

export const LAB_STEPS: Pair[] = [
  ["Discover", "Inventory the algorithms, keys and certificates in your systems."],
  ["Test", "Run ML-KEM, ML-DSA and SLH-DSA against your workloads and HSMs."],
  ["Pilot", "Deploy hybrid certificates and TLS on one system, side by side."],
  ["Plan", "Prioritize systems and set a migration roadmap with your team."],
];

export const LAB_STANDARDS = ["NIST FIPS 203 · ML-KEM", "NIST FIPS 204 · ML-DSA", "NIST FIPS 205 · SLH-DSA", "Hybrid TLS 1.3", "Hybrid X.509 certificates", "Crypto-agility"];

export const LAB_CAPABILITIES: Array<[tag: string, title: string, text: string, product: string, href: string]> = [
  ["Compliance", "Algorithm testing", "NIST ML-KEM, ML-DSA and SLH-DSA tested against your workloads.", "PQC Suite", "/products/pqc-suite"],
  ["PKI", "Hybrid certificates", "Classical + post-quantum certificates and TLS, side by side.", "PQC Suite", "/products/pqc-suite"],
  ["HSM", "HSM & performance", "Benchmark signing and key exchange on HSMs and gateways.", "General Purpose HSM", "/products/gp-hsm"],
  ["Migration", "Migration pilots", "Run a controlled pilot on one system before scaling.", "Post-quantum migration", "/products/crypto-agility"],
];

export const QUANTUM_TESTBED: Pair[] = [
  ["Encrypted link", "400 Gbit/s OTN over 200 km"],
  ["Client signals", "10 GbE at each end"],
  ["Data encryption", "AES-256 GCM, keys refreshed by QKD"],
  ["Key delivery", "ETSI GS QKD 014 API"],
  ["QKD protocol", "Decoy-state BB84, time-bin encoding"],
  ["Quantum channel", "200 km, 20 dB channel loss"],
];

export const LAB_WHY_NOW: Array<[title: string, text: string, href: string, cta: string]> = [
  ["The quantum threat", "Data captured today can be decrypted once large quantum computers exist (“harvest now, decrypt later”).", "/insights/pqc-harvest-now", "Read the insight"],
  ["Crypto-agility", "Swap algorithms without rebuilding applications.", "/products/crypto-agility", "See the product"],
  ["Quantum-safe networks", "Protect links with post-quantum gateways.", "/products/quantum-safe-gateway", "See the product"],
];

/* ----------------------------- Careers ----------------------------- */
export const CAREER_BUILD: Array<[title: string, text: string, href: string]> = [
  ["Trust infrastructure", "National PKI, qualified signatures and HSM-backed trust services.", "/solutions/cyber"],
  ["Identity & biometrics", "National eID, ABIS and deepfake-resistant liveness.", "/solutions/identity"],
  ["Quantum-safe security", "Post-quantum cryptography, Zero Trust and 24/7 SOC.", "/innovation/pqc-lab"],
];

export const CAREER_TEAMS: Array<[tag: string, title: string, text: string, href: string]> = [
  ["PKI", "Cryptography & PKI", "HSM, CA, signing and post-quantum engineering.", "/solutions/cyber"],
  ["Identity", "Identity & Security", "eKYC, authentication, SOC and application security.", "/solutions/identity"],
  ["AI", "AI & Data", "AI for fraud, documents and media platforms.", "/solutions/ai"],
  ["Delivery", "Delivery & Consulting", "Project management, integration and advisory.", "/services"],
  ["Partners", "Sales & Partnerships", "Grow SAVIS in new markets with our regional teams.", "/partners"],
];

export const CAREER_PERKS = [
  "Real ownership of core technology, not only integration",
  "Learning budget and international certifications",
  "Projects for governments and banks across four continents",
  "A team culture built on trust and mastery",
];

export const CAREERS_URL = "https://career.savis.vn";

/* ----------------------------- Investors ----------------------------- */
export const INVESTOR_HIGHLIGHTS: Array<[tag: string, title: string, text: string, href: string, cta: string]> = [
  ["Government", "National-grade track record", "More than two decades building the digital identity, PKI and signing infrastructure that government agencies and banks rely on.", "/customers", "Case studies"],
  ["Innovation", "Proprietary technology, Make in Vietnam", "Products designed and built in-house across five solution pillars, from digital identity to quantum-safe security.", "/solutions", "Solutions & Products"],
  ["Certified", "International certification", "TrustCA is the first in Vietnam to be EU eIDAS-certified for remote signing (QTSP), Timestamp and eSeal, and has been licensed by NEAC–MIC since 2019.", "/trust-center", "Trust Center"],
  ["Quantum-safe", "Quantum-safe by design", "Crypto-agility and NIST post-quantum algorithms across products and services, ahead of regulatory deadlines.", "/innovation/pqc-lab", "Quantum PQC Lab"],
  ["As a service", "Recurring service model", "Digital Trust as a Service alongside on-premise delivery, so customers can start small and scale.", "/services", "Services"],
  ["Global", "Global with partners", "Ten offices on four continents, with technology and channel partners in each region.", "/about#presence", "Global presence"],
];

export const INVESTOR_GOVERNANCE: Array<[tag: string, title: string, text: string, href: string]> = [
  ["People", "Leadership", "The team accountable for strategy and delivery.", "/about#leadership"],
  ["Compliance", "Integrity & Compliance", "How we do business: ethics, anti-corruption and compliance.", "/about/integrity"],
  ["Security", "Security & certifications", "Independent assurance for our trust services, keys and data.", "/trust-center"],
  ["Sustainability", "ESG & Sustainability", "Our commitments to people and planet.", "/about/esg"],
];

export const INVESTOR_EMAIL = "investor@savis-group.com";

/* ----------------------------- Trust Center ----------------------------- */
export const TRUST_FEATURED = {
  label: "Certified · 2026 · First in Vietnam",
  title: "TrustCA Qualified Remote Signing, QTSA and eSeal (Legal)",
  text: "Certified by TAYLLORCOX PCEB as in accordance with the requirements for qualified trust service providers under eIDAS - Regulation (EU) 910/2014 as amended by Regulation (EU) 2024/1183 - and with Article 21 of the NIS2 Directive (EU) 2022/2555.",
  facts: [
    ["Certification body", "TAYLLORCOX PCEB · TAYLLORCOX s.r.o., Prague"],
    ["Certificate No.", "PCEB 26/08/10"],
    ["Certificate holder", "SAVIS Technology Group"],
    ["Services", "Qualified remote signing · Qualified timestamping (QTSA) · Electronic seal for legal persons"],
    ["Standards", "ETSI EN 319 401 · ETSI TS 119 431-1 · ETSI EN 319 411-1 · ETSI EN 319 421 · ETSI EN 319 422 · ETSI TS 119 312 · ETSI EN 319 102-1"],
    ["Certification scheme", "ETSI EN 319 403"],
    ["Issued", "10 August 2026"],
    ["Valid until", "9 August 2028"],
  ] as Pair[],
  verify: "Verify with the certification body: tayllorcox.com · +420 222 553 101 · audit@tayllorcox.com",
};

export const TRUST_CERTS: Array<[tag: string, title: string, text: string]> = [
  ["Signing · Licensed · 2019", "Public digital signature certification", "TrustCA licensed by NEAC, Ministry of Information and Communications, for remote digital signature services since 2019."],
  ["Compliance · Delivered", "PCI DSS programs", "Readiness delivered for banks with ControlCase (QSA)."],
  ["Compliance · Certified", "ISO/IEC 27001:2022", "Information security management system."],
  ["Compliance · Certified", "ISO 9001:2015", "Quality management system."],
  ["Compliance · Certified", "ISO 14001:2015", "Environmental management system."],
  ["Compliance · Service", "WebTrust for CAs", "Readiness service and WebTrust-grade CA delivery for the National Electronic Authentication Centre of Vietnam."],
  ["Identity · Supported", "FIDO2 / CSC API", "Open standards supported across products."],
  ["Compliance · Certified · 2026", "FIDO2 Certified Server", "SAM FIDO2 Identity Server - full FIDO Server Certification from the FIDO Alliance, covering conformance and interoperability. Program: FIDO Server Certification · Class: FIDO2 · Full Certification · Specification: FIDO2 CTAP v2.1 PS · policy 1.3.9 · Certificate No. FA001202600030 · Issued 2 October 2026."],
  ["Compliance · Certified", "eKYC PAD Level 2", "Biometric eKYC presentation-attack detection certified by FIME (ISO/IEC 30107-3)."],
];

export const SECURITY_PRACTICES = [
  "Keys generated and stored in certified HSMs",
  "Dual control and key ceremonies for CA operations",
  "24/7 monitoring by SAVIS AI SOC",
  "Secure development lifecycle and penetration testing",
  "Business continuity and disaster recovery sites",
];

export const OPEN_STANDARDS: Array<[layer: string, standards: string, products: string]> = [
  ["Authentication", "FIDO2: WebAuthn L3, CTAP 2.1–2.3 · OIDC, OAuth 2.0, FAPI · SAML 2.0", "FIDO2 Passwordless, Identity, IAM & CIAM"],
  ["Payments", "EMV 3DS 2.3.1 · W3C SPC · PSD2 RTS dynamic linking", "3D Secure 2.0, API Security & Transaction Signing"],
  ["Wallets & credentials", "OpenID4VCI/VP · SD-JWT VC · ISO 18013-5/-7 · W3C VC 2.0", "Digital ID Wallet"],
  ["Signing & trust", "ETSI EN 419 241, EN 419 221-5 · CSC API · Trusted Lists · RFC 5280, 3647", "SAM Appliance, TrustCA"],
  ["Cards & devices", "ICAO 9303 · ISO/IEC 7816, 14443 · Key Attestation, App Attest", "TrustPass, TrustShield"],
  ["Biometrics & assurance", "ISO/IEC 30107-3 (PAD) · ISO/IEC 29115 · NIST 800-63", "SAVIS TrustOnboard, Mobile Identity"],
  ["PKI Cryptography", "FIPS 140-3 L3 · NIST FIPS 203, 204 (ML-KEM, ML-DSA)", "GP HSM, Quantum Safe Gateway"],
];
