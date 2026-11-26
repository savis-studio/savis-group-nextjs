# Changelog

## 3.1.0 — 26 Nov 2026

Gộp phần website đã làm sau 2.0.0 vào hệ thống.

- Cỡ tiêu đề nhỏ lại theo website: `fs-display-1` 36–60px → 34–46px, `fs-h2` 28–42px → 26–34px; style `display-1` 46/50px, `h2` 34/40px.
- Thêm tranh minh hoạ: `Thumb`, `IndustryThumb`, `VxActivate`, `HeroMosaic`, `HeroCard`, `HubDiagram`, `AtomDiagram`, `OrbitDiagram`, `TreeDiagram`; kèm `src/styles/vx.css`, `src/lib/thumbs.ts`, `src/lib/vx-art.ts`.
- Thêm prop `thumb` cho Card và ProductCard, `art` cho PillarCard.
- Header: nút Search vẫn hiện dưới 560px (3.0.0 ẩn).
- Footer: nhận thêm tiêu đề cột dạng `.sv-footer__h` và danh sách `ul`, cho trang cần đúng thứ bậc heading.
- `build-preview.mjs` gộp `vx.css` vào `bundle.css`.

## 3.0.0 — 26 Nov 2026

Đồng bộ header, footer, logo với mockup savis.vn v6.6.

- **Breaking:** Logo là một lockup PNG (`savis-logo.png` / `savis-logo-white.png`); `LogoSources` đổi từ `{mark, word, wordWhite}` sang `{light, dark}`; `Logo` nhận `href={null}` để không thành link.
- **Breaking:** SiteFooter: `columns[].links` đổi thành `columns[].items` (`label`, `href?`, `strong?`); cột thương hiệu nằm chung lưới; tiêu đề cột 14px không viết HOA.
- **Breaking:** SiteHeader: `NavItem.href` bắt buộc; thêm `rail`, `categories` (drill-down), `allLabel`, `defaultOpen`; bỏ `intro`.
- Header: thanh cao 80px (`header-h`), nav 16px/600 với gạch chân 3px cao `nav-h` 72px, Search chỉ có icon, header mờ khi cuộn, breakpoint 1080px, drawer toàn màn hình.
- Footer: nền gradient, link 44px trên mobile, link pháp lý gạch chân.
- Token mới: `gray-700`, `blue-25`, `menu-link`, `menu-heading`, `menu-hover`, `shadow-mega`, `nav-h`, `logo-h`, `logo-h-sm`, `logo-h-footer`. `header-h` 72 → 80px.
- Nav cấp 1: Solutions & Products · Services · Insights · Resources · Company; utility bar: Who are you? · Investors · Partner Portal · Careers · Trust Center.

## 2.0.0 — 21 Nov 2026

- **Breaking:** bỏ theme dark; chỉ còn một theme sáng.
- **Breaking:** token hai tầng: thêm palette (`white`, `gray-*`, `navy-900`, `blue-*`, `cyan-*`, `amber-*`, `green-*`, `red-*`); semantic trỏ về palette. Đổi tên `navy` → `surface-inverse`, `cyan` → `accent`, `cyan-glow` → `glow`; bỏ `success-glow`.
- **Breaking:** spacing đặt tên theo giá trị (`space-6` … `space-72`); Tailwind dùng tiền tố `sv-` (`p-sv-26`).
- **Breaking:** Chip bỏ `interactive`/`active`; dùng `FilterChip`. PillarCard `subtitle` là mô tả tiếng Anh.
- Thêm token: `line-strong`, `focus`, `info`/`success`/`warn`/`error` + `*-bg`, `footer-top`/`footer-bottom`, `shadow-on-band`, `shadow-header`, `shadow-media`, nhóm `fluid` (`fs-*`, `gutter`), `touch-min`.
- Thêm component: SiteHeader (mega-menu + drawer), SiteFooter, Section, TextField, Alert, NewsCard; Logo, SmartLink dùng nội bộ.
- Sửa a11y: viền control đạt 3:1 (`line-strong`), FilterChip cao 44px, focus thống nhất, DataTable có caption và vùng cuộn focus được.
- Bộ TSX `nextjs-kit/` là nguồn của component; `components/bundle.js` được build từ đó. Script `build-tokens.mjs` sinh `tokens.css`, preset Tailwind v3/v4, `tokens.ts`.
- Website chỉ dùng tiếng Anh: bỏ hướng dẫn dòng phụ tiếng Việt, font chỉ cần subset `latin`.

## 1.1.0 — 21 Nov 2026

- Thêm MediaFigure, KeyValueList từ section Quantum Lab của mockup cập nhật.

## 1.0.0 — 21 Nov 2026

- Bản đầu: token từ mockup savis.vn V3, 10 component, logo.
