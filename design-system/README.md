Design system của SAVIS Group cho website savis.vn (V3): hạ tầng số tin cậy cho chính phủ, ngân hàng, doanh nghiệp. Một theme sáng duy nhất, nhấn xanh hoàng gia, các dải band xanh đậm cho hero và CTA. Website chỉ dùng tiếng Anh.

Nguồn sự thật: `tokens.json` (token) và bộ TSX trong `nextjs-kit/` (component). Bundle preview ở đây được build từ chính bộ TSX đó. Hướng dẫn tích hợp Next.js nằm ở section **Next.js kit**, lịch sử thay đổi ở **Changelog**.

## Content fundamentals

- Mọi nội dung hiển thị viết bằng tiếng Anh (en-GB cho ngày: "17 Nov 2026"; chính tả "organisation", "programme" theo bản gốc). `<html lang="en">`.
- Tiêu đề ngắn, khẳng định, không chấm than, không emoji. Tagline: "Trusted Digital Infrastructure for a Smarter World". Hero mẫu: "Identity, trust and secure platforms for nations."
- Eyebrow viết HOA, giãn 0.14em: "TRUSTED DIGITAL INFRASTRUCTURE FOR A SMARTER WORLD".
- CTA là động từ 1–3 từ: "Contact us", "Explore Solutions", "Talk to an Expert". Link phụ kết thúc bằng " →".
- Nhãn vai trò sản phẩm viết HOA trong Chip: `SAVIS`, `CORE TECHNOLOGY`, `PARTNER · VERIFY`.
- Thông báo lỗi nói điều cần làm: "Enter your organisation name.", không "Invalid input".
- Chỉ đăng số liệu đã duyệt (Stat); không bịa số.

## Visual foundations

- **Token hai tầng.** Tầng palette (`blue-500`, `gray-600`…) chỉ để định nghĩa; component và trang chỉ dùng tầng semantic (`bg`, `surface`, `raised`, `ink`, `text`, `muted`, `line`, `line-strong`, `brand`, `band`…). Preset Tailwind chỉ xuất tầng semantic.
- **Màu.** Nền `bg`, section xen kẽ `surface`, card `raised` + viền `line`. Heading `ink`, body `text`, phụ `muted`. Hành động chính `brand`. Band, hero, mega-menu feature: gradient `band-deep` → `band-mid` (58%) → `band-light` 135°, chữ `on-band` / `on-band-muted`, eyebrow `band-eyebrow`. Footer: gradient `footer-top` → `footer-bottom`. `glow` và `accent` chỉ để trang trí, không bao giờ làm chữ trên nền sáng.
- **Trạng thái.** `info`, `success`, `warn`, `error` cùng nền `*-bg`; luôn đi kèm chữ hoặc icon.
- **Viền.** `line` cho viền trang trí (card, bảng, divider). `line-strong` (3.4:1+) cho mọi viền mang nghĩa: input, select, search, FilterChip.
- **Chữ.** Heading Sora 700, letter-spacing -0.01 đến -0.02em, `text-wrap: balance`. Body Inter 16px/1.6. Cỡ co giãn dùng `fs-display-1`, `fs-h2`, `fs-stat`, `fs-lead`. Số liệu `tabular-nums`. Mỗi trang một `h1` (trong Hero).
- **Hình khối.** Nút và chip là pill (`radius-pill`). Card `radius-card`, pillar `radius-pillar`, tile sản phẩm `radius-lg`, CTA/tin `radius-feature`, bảng/alert `radius-table`, input `radius-md`.
- **Bóng và hover.** Card nghỉ: `shadow-card`. Card dạng link khi hover: viền `brand`, `shadow-card-hover`, nhấc 4px (`shadow-lift` cho pillar). Nút primary `shadow-cta` và vệt sáng quét ngang.
- **Focus.** Một quy tắc cho mọi control: outline 3px `focus`, offset 2px. Trên band, hero, footer, CTA: outline `on-band`.
- **Vùng chạm.** Mọi control tối thiểu `touch-min` (44px); nút `btn-h` (46px); input `input-h`.
- **Layout.** `.sv-wrap` tối đa `wrap-max`, lề `gutter`. Section padding dọc `space-72`. Lưới `repeat(auto-fit, minmax(min(100%, 240–300px), 1fr))`, gap `space-18`. Header chuyển sang drawer dưới 1100px.
- **Ảnh.** Ảnh thật dùng MediaFigure `photo` (chú thích phủ gradient navy); sơ đồ dùng `diagram`. Thông số kèm theo dùng KeyValueList.
- **Chuyển động.** 0.2–0.35s; `prefers-reduced-motion` tắt vệt sáng nút và hiệu ứng nhấc card.

## Iconography

Mockup dùng SVG inline nét đơn (`stroke="currentColor"`, 2px) và mũi tên "→". Component trong hệ thống tự mang icon nét 2px cùng kiểu. Khi trang cần thêm icon, dùng `lucide-react` (stroke 2, `currentColor`) như bộ thay thế gần nhất; đây là thay thế, không phải bộ icon gốc của SAVIS. Không dùng emoji, không icon font.

## Logo

Nhóm Logos: `logo-mark.svg` (biểu tượng, 40–54px), `logo-word.svg` (chữ navy cho nền sáng), `logo-word-white.svg` (chữ trắng cho band, hero, footer). Ghép: mark 48px + wordmark 34px, cách 12px (component `Logo`). Không vẽ lại, đổi màu, kéo giãn. `<img>` không kế thừa `currentColor`, nên chọn đúng bản sáng/tối theo nền.

## Bổ sung có chủ đích (không có trong mockup)

`gray-400`/`line-strong` (viền control đạt 3:1), bộ màu `success`/`error` và `info-bg`, component TextField, Alert, NewsCard, Section. Kiểu chữ nav cấp 1 và cột footer lấy theo ảnh chụp vì CSS gốc chưa đọc được; cần đối chiếu lại với mockup.
