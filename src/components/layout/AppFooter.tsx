import { Logo, SmartLink } from "@/components/ui";
import type { Catalog } from "@/lib/cms";
import {
  certifications, footerCompany, footerOffices, footerRegions, footerSolutions, hotline, legalLinks,
} from "./nav-data";

const social = [
  { label: "Facebook", href: "https://www.facebook.com/savisgroup1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/savis-technology-group/" },
];

export function AppFooter({ pillars, industries }: Catalog) {
  return (
    <footer className="sv-footer">
      <div className="sv-wrap">
        <div className="sv-footer__top">
          <div className="sv-footer__brand">
            <Logo onDark />
            <p>Trusted Digital Infrastructure for a Smarter World.</p>
          </div>
          <nav className="sv-footer__cols sv-footer__cols--5" aria-label="Footer">
            <div>
              <h4>Solutions &amp; Products</h4>
              <ul>
                {pillars.map((p) => <li key={p.id}><SmartLink href={`#pillar-${p.id}`}>{p.name}</SmartLink></li>)}
                {footerSolutions.map((l) => <li key={l.label}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
              </ul>
            </div>
            <div>
              <h4>Industries</h4>
              <ul>{industries.map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`}>{i.name.split(",")[0]}</SmartLink></li>)}</ul>
            </div>
            <div>
              <h4>Global offices</h4>
              <ul>{footerOffices.map((o) => <li key={o}><span>{o}</span></li>)}</ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>{footerCompany.map((l) => <li key={l.label}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}</ul>
            </div>
          </nav>
        </div>
        <div className="sv-footer__base">
          <span>
            © {new Date().getFullYear()} SAVIS GROUP · {footerRegions} · <SmartLink href={hotline.href}>{hotline.label}</SmartLink>
          </span>
          <span>
            {social.map((s) => <span key={s.label}><SmartLink href={s.href}>{s.label}</SmartLink> · </span>)}
            YouTube · {certifications.join(" · ")} ·{" "}
            {legalLinks.map((l, i) => <span key={l.label}>{i > 0 && " · "}<SmartLink href={l.href}>{l.label}</SmartLink></span>)}
          </span>
        </div>
      </div>
    </footer>
  );
}
