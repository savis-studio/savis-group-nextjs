# Changelog

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
