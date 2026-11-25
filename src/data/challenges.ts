/** "What do you need to solve?" picker on /solutions: each challenge points at a use case and the products behind it. */
export const CHALLENGES: Array<{ useCase: string; title: string; products: string[] }> = [
  { useCase: "remote-onboarding", title: "Stop fraud at onboarding", products: ["trustonboard", "liveness-deepfake", "id-verification"] },
  { useCase: "passwordless-sca", title: "Replace passwords and OTPs", products: ["passwordless", "mobile-identity-sca", "trustpass"] },
  { useCase: "remote-signing", title: "Sign documents remotely, legally", products: ["remote-signing", "signing-gateway", "econtract"] },
  { useCase: "secure-payment", title: "Secure every online payment", products: ["3d-secure", "tokenization", "api-security-transaction-signing"] },
  { useCase: "national-abis-deduplication", title: "Build a national digital identity", products: ["national-eid-trust", "savis-abis", "digital-id-wallet"] },
  { useCase: "open-banking", title: "Open banking APIs, safely", products: ["open-banking-suite", "consent-management", "tpp-manager"] },
  { useCase: "public-services", title: "One app for public services", products: ["superapp-mgov", "lgsp", "egate"] },
  { useCase: "pqc-migration", title: "Get ready for quantum computers", products: ["quantum-safe-gateway", "quantum-readiness", "kms"] },
];
