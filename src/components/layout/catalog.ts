/* Generated from the savis.vn V3 mockup (final header/footer state). Links are placeholders (#) until routes exist. */
export interface CatalogGroup { name: string; items: string[] }
export interface CatalogPillar { id: string; n: string; name: string; short: string; pitch: string; groups: CatalogGroup[] }

export const pillars: CatalogPillar[] = [
  {
    "id": "identity",
    "n": "01",
    "name": "Digital Identity & Trust",
    "short": "Digital Identity & Trust",
    "pitch": "Verify people, authenticate access and sign with legal certainty — from onboarding to qualified signatures.",
    "groups": [
      {
        "name": "Digital Identity & Verification",
        "items": [
          "National eID Trust",
          "SAVIS IDMS",
          "SAVIS IDVS",
          "ID Verification",
          "SAVIS TrustOnboard",
          "VNeID Integration",
          "Digital ID Wallet",
          "Decentralized Identity (DID)",
          "Mobile Identity PKI"
        ]
      },
      {
        "name": "Biometrics",
        "items": [
          "SAVIS ABIS",
          "SAVIS Touchless Fingerprint",
          "SAVIS Face Biometrics",
          "SAVIS Palm Biometrics",
          "SAVIS Enrollment Station",
          "SAVIS Enrollment Suite",
          "SAVIS MOSIP Integration",
          "SAVIS Liveness & Deepfake Defense",
          "SAVIS CryptoID"
        ]
      },
      {
        "name": "Authentication & Access",
        "items": [
          "FIDO2 Passwordless Identity",
          "SAM Auth Server",
          "TrustSign Mobile",
          "Mobile Identity SCA",
          "SmartOTP+",
          "IAM & CIAM",
          "Credential Management",
          "TrustPass Authentication"
        ]
      },
      {
        "name": "Secure Credentials & Tokens",
        "items": [
          "PKI Token",
          "Smart Card PIV",
          "Crypto Bio Token",
          "Smart Virtual Card"
        ]
      },
      {
        "name": "PKI Infrastructure",
        "items": [
          "National PKI",
          "PKI in a Box",
          "Timestamp Authority (TSA)",
          "Signing Gateway",
          "SAVIS Signing Server"
        ]
      },
      {
        "name": "Trust Services · TrustCA QTSP eIDAS 2.0",
        "items": [
          "TrustCA Remote Signing",
          "TrustCA Timestamp",
          "TrustCA eKYC Biometric",
          "SAVIS Paperless",
          "TrustCA VA/RA",
          "SAVIS eCertify"
        ]
      },
      {
        "name": "Trust Compliance & Readiness",
        "items": [
          "WebTrust Readiness",
          "eIDAS 2.0 Readiness"
        ]
      },
      {
        "name": "Fraud & App Protection",
        "items": [
          "Fraud Prevention & Risk Management",
          "Device Intelligence",
          "Device Fingerprint SDK",
          "RASP+",
          "TrustShield"
        ]
      }
    ]
  },
  {
    "id": "cyber",
    "n": "02",
    "name": "Cybersecurity & Quantum-Safe Infrastructure",
    "short": "Cybersecurity & Quantum-Safe",
    "pitch": "Monitor threats, protect keys and data, and prepare cryptography for the post-quantum era.",
    "groups": [
      {
        "name": "Security Operations",
        "items": [
          "SAVIS AI SOC",
          "SAVIS Cyber Security"
        ]
      },
      {
        "name": "Cryptography & Key Management",
        "items": [
          "SAM Appliance",
          "GP HSM",
          "Key Management System (KMS)",
          "HSM as a Service"
        ]
      },
      {
        "name": "Zero Trust & Network Security",
        "items": [
          "Zero Trust Gateway Appliance",
          "Secure Enterprise Browser"
        ]
      },
      {
        "name": "Quantum-Safe Security",
        "items": [
          "Quantum Safe Gateway",
          "Quantum Vault",
          "Quantum Safe Storage",
          "Crypto Agility",
          "Quantum Readiness Program",
          "PQC Suite",
          "QKD",
          "Quantum Communication"
        ]
      },
      {
        "name": "Data Security",
        "items": [
          "Data Encryption & Protection"
        ]
      }
    ]
  },
  {
    "id": "gov",
    "n": "03",
    "name": "Digital Government & Smart Infrastructure",
    "short": "Digital Government",
    "pitch": "One-stop public services, citizen touchpoints and connected city infrastructure.",
    "groups": [
      {
        "name": "Digital Government Platforms",
        "items": [
          "SAVIS CRVS",
          "SAVIS eGate",
          "SAVIS Digital Integration Platform",
          "SAVIS SuperApp platform",
          "One-Stop-Shop"
        ]
      },
      {
        "name": "Citizen Service Touchpoints",
        "items": [
          "Smart Kiosk"
        ]
      },
      {
        "name": "Smart City",
        "items": [
          "Smart City Solution",
          "AI Camera Security"
        ]
      },
      {
        "name": "IoT, Mobility & Connected Devices",
        "items": [
          "IoT Devices",
          "IoT Device Security",
          "Digital Car Key"
        ]
      }
    ]
  },
  {
    "id": "finance",
    "n": "04",
    "name": "Open Finance & Secure Digital Transactions",
    "short": "Open Finance & Transactions",
    "pitch": "Open APIs, customer consent and payment security for banks and financial institutions.",
    "groups": [
      {
        "name": "Open Banking Suite",
        "items": [
          "Open Banking Suite",
          "SAVIS Open API",
          "Open Finance API",
          "Open Banking Portal",
          "Consent Management",
          "TPP Manager"
        ]
      },
      {
        "name": "Payment & Transaction Security",
        "items": [
          "API Security & Transaction Signing",
          "3D Secure 2.0",
          "Tokenization",
          "Payment HSM",
          "Palm Biometric Payment"
        ]
      },
      {
        "name": "Digital Banking",
        "items": [
          "Digital Banking Platform",
          "Mobile eWallet"
        ]
      },
      {
        "name": "Digital Agreements",
        "items": [
          "Smart eContract",
          "SAVIS eInvoice"
        ]
      },
      {
        "name": "Digital Assets",
        "items": [
          "Blockchain Framework",
          "Stablecoin Platform",
          "CBDC Platform",
          "RWA Tokenization",
          "Crypto Wallet & Custody"
        ]
      }
    ]
  },
  {
    "id": "ai",
    "n": "05",
    "name": "AI, Data & Digital Platforms",
    "short": "AI, Data & Platforms",
    "pitch": "Data platforms, trusted archives, intelligent documents and AI-native media operations.",
    "groups": [
      {
        "name": "Data & Analytics",
        "items": [
          "SAVIS Data Lake & BI",
          "SAVIS AI KPI",
          "CDP 360 Big Data",
          "SAVIS MDM"
        ]
      },
      {
        "name": "Records & Archiving",
        "items": [
          "Trusted Archive 2.0",
          "eArchive Box"
        ]
      },
      {
        "name": "Intelligent Documents",
        "items": [
          "Smart OCR",
          "SAVIS BPM Paperless",
          "Smart eForm",
          "AI & Intelligent Automation"
        ]
      },
      {
        "name": "Media Platforms",
        "items": [
          "SAVIS MRP AI",
          "CMS AI Hub",
          "MAM Intelligent Automation",
          "Converged Newsroom",
          "Playout & CG",
          "SAVIS Media Hub",
          "Forensic Watermarking & Multi-DRM"
        ]
      },
      {
        "name": "Digital Health",
        "items": [
          "SAVIS OpenHealth Platform"
        ]
      }
    ]
  }
];

export const industries: Array<{ id: string; name: string }> = [
  {
    "id": "government",
    "name": "Government & Public Sector"
  },
  {
    "id": "bfsi",
    "name": "Banking, Financial Services & Insurance"
  },
  {
    "id": "trust-providers",
    "name": "Trust Service Providers & CAs"
  },
  {
    "id": "payments",
    "name": "Payments & Fintech"
  },
  {
    "id": "telco",
    "name": "Telecommunications"
  },
  {
    "id": "enterprise",
    "name": "Enterprise"
  },
  {
    "id": "energy-utilities",
    "name": "Energy & Utilities"
  },
  {
    "id": "automotive",
    "name": "Automotive & Mobility"
  },
  {
    "id": "transport",
    "name": "Transport & Logistics"
  },
  {
    "id": "retail",
    "name": "Retail & eCommerce"
  },
  {
    "id": "education",
    "name": "Education"
  },
  {
    "id": "healthcare",
    "name": "Healthcare"
  },
  {
    "id": "media",
    "name": "Media & Broadcasting"
  }
];
