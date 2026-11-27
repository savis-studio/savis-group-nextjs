import { Button, Section } from "@/components/ui";

export const MEDIA_EMAIL = "info@savis-group.com";

/** Press contact that closes the news tabs. */
export function MediaEnquiries() {
  return (
    <Section tone="surface" className="sv-media">
      <div className="sv-media__in">
        <div>
          <span className="sv-eyebrow">Media</span>
          <h2>Media enquiries</h2>
          <p>Journalists and analysts can reach our communications team for interviews, executive commentary and brand assets.</p>
        </div>
        <div className="sv-media__actions">
          <Button href={`mailto:${MEDIA_EMAIL}`}>{MEDIA_EMAIL}</Button>
          <Button href="/contact" variant="ghost">Contact form</Button>
        </div>
      </div>
    </Section>
  );
}
