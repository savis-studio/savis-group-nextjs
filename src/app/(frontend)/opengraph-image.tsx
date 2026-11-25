import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page that does not define its own. Rendered once at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          color: "#fff",
          background: "linear-gradient(135deg, #0A3BB0 0%, #0D4FE0 58%, #1257EA 100%)",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, color: "#C4F3FF", textTransform: "uppercase" }}>{SITE_NAME}</div>
        <div style={{ marginTop: 28, fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{SITE_TAGLINE}</div>
        <div style={{ marginTop: 36, height: 6, width: 160, background: "#00D4FF", borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
