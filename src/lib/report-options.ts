/** Fixed choices of the report library (collection "reports"). */
export const REPORT_KINDS = [
  { value: "report", label: "Report" },
  { value: "whitepaper", label: "Whitepaper" },
] as const;

/** Cover colours of the design, one per series: [value, name shown in the admin]. */
const PALETTES: Array<[string, string]> = [
  ["identity", "Digital identity"], ["cyber", "Cybersecurity and quantum"], ["ai", "AI"], ["wallet", "ID wallets"],
  ["mea", "Africa and Middle East"], ["bank", "Digital banking"], ["corp", "Corporate banking"], ["app", "Super app"],
  ["pwl", "Passwordless"], ["tp", "Developer series"], ["qt", "Quantum-safe trust"], ["ng", "Nigeria"],
  ["fr", "Fraud decisioning"], ["sg", "National baselines"], ["zt", "Zero Trust"], ["dt", "Digital trust chain"],
  ["pk", "PKI selection"], ["ip", "Identity proofing"], ["mp", "Mobile app protection"], ["ta", "Mobile fraud outlook"],
  ["hs", "HSM infrastructure"], ["nd", "National identity"], ["pp", "Passkey payments"], ["eu", "eIDAS"], ["gg", "Worldwide"],
];
export const REPORT_PALETTES = PALETTES.map(([value, label]) => ({ value, label }));
