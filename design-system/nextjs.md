# Next.js kit

Bộ `nextjs-kit/` là code nguồn của mọi component trong hệ thống này (React 18 + TypeScript, App Router). Preview ở đây được build từ chính các file đó, nên code chép vào dự án luôn khớp với những gì thấy trên trang.

## Cấu trúc

```
design-system/tokens.json          ← tải từ hệ thống này, không sửa tay trong dự án
scripts/build-tokens.mjs           ← sinh CSS / Tailwind / TS từ tokens.json
scripts/build-preview.mjs          ← build lại bundle preview cho hệ thống này
src/styles/generated/              ← output của build-tokens (không sửa tay)
  tokens.css  tailwind.preset.js  tailwind-v4.css  tokens.ts
src/styles/savis.css               ← style component, chỉ dùng biến token
src/styles/vx.css                  ← tranh minh hoạ và sơ đồ hero
src/lib/thumbs.ts  vx-art.ts       ← chọn tranh cho từng loại thẻ, vẽ SVG
src/components/ui/*.tsx            ← component (gồm Logo, SmartLink, cn)
public/brand/*.png                 ← savis-logo.png, savis-logo-white.png, savis-logo-alt.png, savis-mark.png
```

## Cài đặt

1. Chép `nextjs-kit/` vào dự án (hoặc giải nén `savis-ui.zip`), đặt 4 file PNG logo vào `public/brand/`; dùng `savis-mark.png` làm favicon/apple-touch-icon trong `app/layout.tsx` (`metadata.icons`).
2. Thêm script: `"tokens": "node scripts/build-tokens.mjs design-system/tokens.json src/styles/generated"` và chạy `npm run tokens`.
3. Font và CSS trong `app/layout.tsx`:

```tsx
import { Sora, Inter } from "next/font/google";
import "@/styles/generated/tokens.css";
import "@/styles/savis.css";
import "@/styles/vx.css";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)", font: "400 16px/1.6 var(--font-body)" }}>{children}</body>
    </html>
  );
}
```

Trang dùng `Thumb` hoặc `HeroMosaic` thì thêm `<VxActivate />` (từ `@/components/ui`) một lần trong `<body>`.

`tokens.css` đã nối `--font-display` và `--font-body` với `--font-sora` / `--font-inter` của next/font.

4. Tailwind v3: `presets: [require("./src/styles/generated/tailwind.preset.js")]`. Tailwind v4: `@import "./generated/tailwind-v4.css";` sau `tokens.css`. Preset chỉ xuất token semantic: `bg-surface`, `text-ink`, `rounded-card`, `shadow-card`, `p-sv-26`, `text-display-1`.

## Quy tắc khi vibe code

- Dùng component trong `@/components/ui` trước; chỉ viết markup mới khi không có component phù hợp, và khi đó chỉ dùng token semantic, không hex, không giá trị px ngoài thang.
- Khung trang: `SiteHeader` → `Hero` (h1 duy nhất) → `Section` xen kẽ `default`/`surface` (mỗi section mở bằng `SectionHead`) → `CtaBanner` → `SiteFooter`.
- Server Component là mặc định. `SiteHeader` đã có `"use client"`; trang dùng `FilterChip` có state thì đặt phần đó vào client component riêng.
- Link nội bộ đi qua `href` của component (dùng `next/link`); link ngoài tự mở tab mới.
- Ảnh trong `public/`: dùng `next/image` bên trong `MediaFigure`/`NewsCard` giữ nguyên class; luôn có `alt`.
- Nội dung tiếng Anh; ngày en-GB.

Prompt mẫu: "Use the SAVIS Group design system (README, tokens, components in `@/components/ui`). Build `/solutions` with the standard page frame: Hero, a grid of PillarCards (first one `lead`), ProductCards grouped by pillar, a Stat strip on band, CtaBanner. Use only existing components and semantic tokens."

## Đổi token hoặc component

1. Sửa token trên trang Design System (hoặc `tokens.json`), tăng `version`, ghi vào Changelog.
2. Trong dự án: tải `tokens.json` mới về `design-system/`, chạy `npm run tokens`.
3. Sửa component trong `src/components/ui`, rồi `node scripts/build-preview.mjs out/` và đưa `bundle.js`, `bundle.css` vào `components/` của hệ thống này để preview khớp code.
4. Đổi phiên bản theo semver: đổi tên/xoá token hoặc prop là major; thêm token/component là minor; sửa giá trị là patch.
