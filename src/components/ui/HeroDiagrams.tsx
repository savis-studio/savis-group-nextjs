/** Decorative diagrams for page heroes (industries and innovation), drawn as SVG so they scale and need no images. */

const chip = (x: number, y: number, w: number, t: string, key: string) => (
  <g key={key}>
    <rect x={x} y={y} width={w} height={22} rx={11} fill="rgba(8,24,70,.6)" stroke="rgba(255,255,255,.4)" />
    <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#fff">{t}</text>
  </g>
);

/** A hub linked to six sector nodes. */
export function HubDiagram() {
  const nodes: Array<[number, number]> = [[70, 110], [95, 215], [190, 255], [290, 215], [315, 110], [190, 55]];
  return (
    <svg className="sv-diagram" viewBox="0 0 380 300" fill="none" aria-hidden="true">
      {nodes.map(([x, y], i) => <line key={i} x1="190" y1="150" x2={x} y2={y} stroke="rgba(255,255,255,.35)" strokeDasharray="3 5" />)}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 16} y={y - 16} width="32" height="32" rx="8" fill="rgba(8,24,70,.75)" stroke="#6fe3ff" strokeOpacity=".8" />
          <rect x={x - 5} y={y - 5} width="10" height="10" rx="2.5" fill="#8feaff" />
        </g>
      ))}
      <circle cx="190" cy="150" r="30" fill="rgba(8,24,70,.8)" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" />
      <text x="190" y="154" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" letterSpacing="1">HUB</text>
      {chip(50, 18, 78, "Device PKI", "a")}
      {chip(146, 4, 86, "Secure boot", "b")}
      {chip(262, 18, 44, "OTA", "c")}
    </svg>
  );
}

/** An atom: three orbits around a glowing core, with the post-quantum algorithms named around it. */
export function AtomDiagram() {
  return (
    <svg className="sv-diagram" viewBox="0 0 380 300" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="atom-core" cx=".4" cy=".35"><stop offset="0" stopColor="#c8f6ff" /><stop offset="1" stopColor="#1d8bff" /></radialGradient>
      </defs>
      {[0, 60, 120].map((r) => <ellipse key={r} cx="190" cy="150" rx="118" ry="38" transform={`rotate(${r} 190 150)`} stroke="rgba(255,255,255,.4)" />)}
      <circle cx="190" cy="150" r="22" fill="url(#atom-core)" />
      <circle cx="190" cy="150" r="34" fill="#4aa8ff" fillOpacity=".18" />
      {[[300, 150], [130, 252], [118, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#8feaff" />)}
      {chip(40, 14, 62, "ML-KEM", "a")}
      {chip(112, 14, 62, "ML-DSA", "b")}
      {chip(184, 14, 42, "QKD", "c")}
      {chip(250, 266, 62, "ML-KEM", "d")}
      {chip(322, 266, 56, "ML-DSA", "e")}
    </svg>
  );
}

/** A ring of themes around the SAVIS name (careers). */
export function OrbitDiagram() {
  const nodes: Array<[number, number, string]> = [[130, 70, "AI"], [262, 62, "Identity"], [318, 170, "Trust"], [250, 252, "Security"], [92, 214, "Finance"]];
  return (
    <svg className="sv-diagram" viewBox="0 0 380 300" fill="none" aria-hidden="true">
      <circle cx="190" cy="150" r="108" stroke="rgba(255,255,255,.3)" strokeDasharray="3 6" />
      <circle cx="190" cy="150" r="46" fill="rgba(8,24,70,.7)" stroke="rgba(143,234,255,.7)" strokeWidth="1.5" />
      <text x="190" y="155" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" letterSpacing="1.5">SAVIS</text>
      {nodes.map(([x, y, t]) => chip(x - 30, y - 11, 60, t, t))}
    </svg>
  );
}

/** A root CA with two sub-CAs and the end certificates below them (trust center). */
export function TreeDiagram() {
  return (
    <svg className="sv-diagram" viewBox="0 0 380 300" fill="none" aria-hidden="true">
      {[[190, 90, 110, 160], [190, 90, 270, 160]].map(([x1, y1, x2, y2]) => <line key={x2} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.4)" />)}
      {[[110, 160, 60], [110, 160, 160], [270, 160, 220], [270, 160, 320]].map(([x1, y1, x2], i) => <line key={i} x1={x1} y1={y1 + 18} x2={x2} y2={228} stroke="rgba(255,255,255,.4)" />)}
      <circle cx="190" cy="76" r="26" fill="rgba(8,24,70,.85)" stroke="#fff" strokeOpacity=".8" strokeWidth="1.5" />
      <text x="190" y="80" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff">ROOT</text>
      {[110, 270].map((x) => (
        <g key={x}>
          <circle cx={x} cy="160" r="22" fill="rgba(8,24,70,.85)" stroke="#6fe3ff" strokeWidth="1.5" />
          <text x={x} y="164" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">SUB-CA</text>
        </g>
      ))}
      {[60, 160, 220, 320].map((x) => <rect key={x} x={x - 20} y="228" width="40" height="22" rx="5" fill="rgba(8,24,70,.75)" stroke="#8feaff" strokeOpacity=".8" />)}
      {chip(40, 14, 52, "Root CA", "a")}
      {chip(100, 14, 46, "OCSP", "b")}
      {chip(154, 14, 46, "X.509", "c")}
    </svg>
  );
}
