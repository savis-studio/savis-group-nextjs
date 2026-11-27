# Triển khai SAVIS lên VPS

Website chạy trong Docker sau Cloudflare Tunnel. Image được build trên GitHub Actions (`.github/workflows/build.yml`) và lưu ở GHCR. VPS chỉ kéo image về chạy, không build.

```
Cloudflare (DNS, WAF, Access) → Tunnel → cloudflared → app (Next.js + Payload) → postgres
```

Không cổng nào của SAVIS được publish ra host. `/admin` và `/api` đi qua Cloudflare Access, và app kiểm tra lại JWT của Access (`src/proxy.ts`). Ảnh và PDF công khai ở `/media/<tên-file>`.

## Biến môi trường (`~/savis/.env`)

Mẫu ở `.env.example`. Không commit file này.

| Biến | Ý nghĩa |
|---|---|
| `PAYLOAD_SECRET` | `openssl rand -hex 32`. Mất thì mọi phiên đăng nhập hết hiệu lực. Backup riêng. |
| `POSTGRES_PASSWORD` | Chỉ chữ và số (`openssl rand -hex 24`), vì được đặt trong URL. |
| `SERVER_URL` | Địa chỉ công khai, hiện là `https://savis-group.com`. Dùng cho CSRF và CORS. |
| `ALLOWED_ORIGINS` | Origin bổ sung, cách nhau bằng dấu phẩy. Thường để trống hoặc trùng `SERVER_URL`. |
| `INDEXABLE_HOST` | `savis-group.com`. Host khác (hostname tạm) tự nhận `X-Robots-Tag: noindex`. |
| `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD` | Của Access application. Thiếu thì production từ chối `/admin` và `/api` (503). |
| `CF_ACCESS_MCP_AUD` | Tùy chọn. AUD của Access application riêng cho `/api/mcp` (xem mục MCP). Chỉ mở được đường dẫn đó. |
| `TUNNEL_TOKEN` | Từ Cloudflare Zero Trust → Tunnels. |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | Tùy chọn. Có cả hai thì tin nhắn từ form liên hệ được gửi thêm sang form HubSpot (xem cột `hubspot` trong Leads → Inquiries: sent hoặc failed). Bỏ trống thì chỉ lưu trong Payload. |
| `CLOUDFLARED_TAG` | Phiên bản `cloudflared` cố định, lấy ở trang releases của cloudflared. |
| `SAVIS_IMAGE_TAG` | Do `deploy.sh` ghi. Không sửa tay. |

## Lần đầu

1. Trên VPS: `mkdir -p ~/savis && cd ~/savis`, chép `docker-compose.yml`, `deploy.sh`, `backup.sh` vào, `chmod +x deploy.sh backup.sh`, tạo `.env`.
2. Đăng nhập GHCR (token classic chỉ có `read:packages`, tự nhập, không lưu vào repo): `docker login ghcr.io -u <tên-github>`.
3. Lấy mã commit (7 ký tự) trên `main` có run GitHub Actions xanh, rồi: `./deploy.sh <mã-commit>`.
4. Nạp dữ liệu mẫu một lần: `docker compose run --rm tools npm run seed`.
5. Mở `<SERVER_URL>/admin`, đăng nhập Access, tạo tài khoản đầu tiên. Tài khoản này tự thành admin.

## Phát hành

`main` được bảo vệ: mọi thay đổi đi qua pull request, kể cả của tài khoản admin. Không push thẳng, không force push. Chỉ dùng squash merge, nhánh tự xoá sau khi merge.

1. Tạo nhánh từ `main` mới nhất, sửa và thử ở máy (mục "Dev và test trước khi lên prod").
2. Push nhánh, mở pull request (`gh pr create`).
3. Hai check bắt buộc phải xanh:
   - `check`: kiểm tra kiểu (`tsc`) và `npm run check`.
   - `audit`: build hai image, migrate một Postgres trống, khởi động, gọi API đọc database, quét các trang trong sitemap.
4. Nhánh phải cập nhật theo `main` mới merge được (`gh pr update-branch`, chờ check chạy lại). Rồi squash merge.
5. Chờ run trên `main` xanh: `check` và `audit` chạy lại, sau đó job `images` đẩy image lên GHCR.
6. Nếu bản này đổi `docker-compose.yml`, `deploy.sh` hoặc `backup.sh`: chép file mới lên `~/savis`.
7. Trên VPS: `./deploy.sh <mã-commit>`, với mã là 7 ký tự đầu của commit **trên `main`** (không phải commit của nhánh). Mỗi lúc chỉ một người deploy.
8. Nếu bản này mang theo bài viết: làm mục "Bài viết và ảnh đi kèm bản phát hành". Nếu đổi cách viết trong `src/lib/wording.ts` và nội dung trong CMS cũng phải đổi: `./backup.sh`, `docker compose run --rm tools npm run wording:cms` để xem trước, rồi chạy lại với `-e WRITE=1`.
9. Mở website và `/admin`. Ở máy dev chạy `npm run audit -- https://savis-group.com`.

Audit trong CI chỉ thấy nội dung đóng gói sẵn trong mã: không kiểm tra nội dung trên CMS, form, `/admin` hay giao diện.

`deploy.sh` làm theo thứ tự: chụp `pg_dump` vào `backups/` → kéo image → chạy migration → khởi động lại → chờ `healthy` → ghi tag đang chạy (`.deploy-current`) và tag trước đó (`.deploy-previous`). Giữ 14 bản backup gần nhất.

### Khi khẩn cấp

Website lỗi sau khi deploy: rollback trên VPS (mục Rollback), không cần đụng GitHub.

Nếu buộc phải đưa thay đổi vào `main` khi check chưa xanh, tài khoản admin tạm bỏ áp dụng cho admin, làm xong bật lại ngay:

```
gh api -X DELETE repos/savis-studio/savis-group-nextjs/branches/main/protection/enforce_admins   # tạm tắt
gh api -X POST   repos/savis-studio/savis-group-nextjs/branches/main/protection/enforce_admins   # bật lại
```

Việc này không tạo ra image: job `images` vẫn chờ `check` và `audit` đạt. Check báo sai thì sửa check đó trong một pull request.

## Thêm hoặc đổi schema

Payload production không tự đồng bộ schema. Khi sửa collection hoặc field, tạo migration trên máy dev với Postgres và commit:

```
DATABASE_URL=postgres://... npx payload migrate:create <tên>
```

`deploy.sh` sẽ chạy migration mới khi phát hành.

## Bài viết và ảnh đi kèm bản phát hành

Bài viết và ảnh nằm trong Payload (database và volume `media`), nên deploy code không tự thêm bài. Khi bản phát hành mang theo bài mới trong `src/data/mockup/news.json`:

1. Ảnh không nằm trong git. Trên máy dev chúng ở `src/data/insight-media/` (danh sách trong `src/data/mockup/news-media.json`). Chép lên VPS:

```
scp -r src/data/insight-media <vps>:~/savis/
```

2. Trên VPS, sau `deploy.sh` (cần `docker-compose.yml` bản mới để container `tools` thấy ảnh và ghi được vào volume `media`):

```
./backup.sh
docker compose run --rm -e DRY=1 -e UPDATE=press tools npm run import:insights  # xem trước
docker compose run --rm -e UPDATE=press tools npm run import:insights           # tạo bài chưa có, ghi đè các bài press
rm -rf ~/savis/insight-media                                                    # ảnh đã nằm trong Payload
```

Không đặt `UPDATE` thì chỉ tạo bài chưa có. `UPDATE` nhận danh sách slug, `press` hoặc `all`. Bài đã được sửa hoặc xoá trong admin (theo audit log) được bỏ qua; `FORCE=1` bỏ qua bảo vệ này. Thiếu file ảnh thì bài được nhập không kèm ảnh đó; chạy lại với `UPDATE` sau khi bổ sung. Trang tự làm mới sau khoảng 1 phút.

`npm run staging:seed` ở máy dev tự lấy ảnh trong thư mục trên nếu có.

## Rollback

- **Chỉ code:** `./deploy.sh "$(cat .deploy-previous)"`.
- **Bản lỗi đã chạy migration:** đổi code là không đủ. Khôi phục từ file `backups/pre-<tag-lỗi>-*.dump` chụp ngay trước lần đó. Bài viết và tin nhắn liên hệ tạo sau thời điểm đó sẽ mất, nên chụp thêm một bản trước:
  ```
  ./backup.sh
  docker compose stop app
  docker compose exec -T postgres dropdb -U savis --force savis
  docker compose exec -T postgres createdb -U savis savis
  docker compose exec -T postgres pg_restore -U savis -d savis --no-owner --exit-on-error < backups/<file>.dump
  ./deploy.sh "$(cat .deploy-previous)"
  ```

Sau khi rollback, `.deploy-previous` trỏ vào bản lỗi: đừng chạy lại lệnh rollback.

## Bản nháp và MCP

**Bản nháp.** Bài viết có `Save Draft` và `Publish changes`. Website chỉ đọc bài đã xuất bản. Migration `drafts_mcp` đánh dấu mọi bài đang có là đã xuất bản. Rollback qua migration này phải khôi phục database (mục Rollback): code cũ không biết trạng thái nháp nên sẽ hiện cả bài nháp.

**MCP** (`/api/mcp`) cho trợ lý AI tìm, tạo và sửa bài viết. Mọi thứ AI lưu là bản nháp, kể cả khi sửa bài đang đăng; AI không xoá, không xuất bản, không ghi đè bài đang có người mở sửa. Chưa có API key thì endpoint từ chối mọi yêu cầu.
AI cũng không thêm hoặc sửa khối **HTML** và **Diagram (HTML)**; khối có sẵn thì gửi lại nguyên văn hoặc bỏ đi.

**Khối HTML** (của cả người và AI) được lọc khi hiển thị: chỉ thẻ chữ và hình vẽ SVG trong `src/lib/sanitize.ts` lên được trang. Script, mã sự kiện, iframe (kể cả video nhúng), form, thẻ `<style>` và liên kết `javascript:` bị bỏ. Cần thêm thẻ nào thì bổ sung vào file đó.

Bật sau khi triển khai:

1. Cloudflare Zero Trust → Access → Service Auth: tạo service token (ví dụ `savis-mcp`). Client Secret chỉ hiện một lần.
2. Access → Applications: tạo application **riêng** cho `savis-group.com/api/mcp`, một policy hành động **Service Auth** chứa đúng token đó. Không thêm token vào application của `/admin` và `/api`.
3. Ghi AUD của application mới vào `CF_ACCESS_MCP_AUD` trong `~/savis/.env`, chép `docker-compose.yml` mới lên VPS, chạy `docker compose up -d app`.
4. Trong admin, bằng tài khoản Admin: tạo user vai trò **Editor** chỉ dùng cho AI, rồi **MCP → API Keys → Create New**: chọn user đó, bấm **Generate new API key** và chép key ngay (không hiện lại), tick Find, Create, Update, **Save**.
5. Kết nối (khoá đặt trong biến môi trường, không ghi vào repo):

```
claude mcp add --transport http savis-payload https://savis-group.com/api/mcp   --header "Authorization: Bearer $SAVIS_MCP_KEY"   --header "CF-Access-Client-Id: $CF_ACCESS_CLIENT_ID"   --header "CF-Access-Client-Secret: $CF_ACCESS_CLIENT_SECRET"
```

Thu hồi: **Revoke API key** hoặc xoá key trong admin, và thu hồi service token ở Cloudflare. Xoá user của AI thì xoá key của user đó trước.

Plugin MCP dựng schema bằng API JavaScript của TypeScript, nên giữ `typescript` dưới phiên bản 7 và để trong `dependencies`. Phiên bản `@payloadcms/plugin-mcp` phải trùng với `payload`.

## Việc thường xuyên

- Backup hằng ngày chạy tự động và đẩy lên Google Drive (mục Backup định kỳ). Chưa có cảnh báo khi lỗi: xem `~/savis/backups/backup.log`. Thử khôi phục định kỳ.
- `docker image prune` đã nằm trong `deploy.sh`. Theo dõi dung lượng đĩa.
- Tunnel đứt: `docker compose restart cloudflared`.
- Bị khoá khỏi admin: thêm email vào policy Access. Mất toàn bộ admin: đặt lại bằng Local API từ container `tools`.

## Dev và test trước khi lên prod

Máy Windows dùng Docker Engine trong WSL (distro `Ubuntu-24.04`, đổi bằng biến `SAVIS_WSL_DISTRO`). Không cần Docker Desktop. File dùng ở máy là `docker-compose.local.yml`; VPS vẫn chỉ dùng `docker-compose.yml`. Các cổng chỉ mở trên `127.0.0.1`.

| Lệnh | Việc làm |
|---|---|
| `npm run dev` | Dev nhanh với SQLite, không cần Docker. |
| `npm run dev:pg` | Dev với Postgres (cổng 5433). Payload tự đồng bộ schema vào database dev. |
| `npm run db:migration -- <tên>` | Tạo migration Postgres sau khi sửa collection hoặc field. Commit file được tạo. |
| `npm run staging` | Build image production từ mã đang có trên máy, chạy migration, khởi động tại http://localhost:3100. |
| `npm run staging:seed` | Nạp dữ liệu mẫu và bài viết. |
| `npm run staging:check` | Quét các trang trên bản staging. |
| `npm run staging:restore -- <file.dump>` | Thay database staging bằng bản dump rồi migrate: diễn tập đổi schema trên dữ liệu thật. |
| `npm run staging:logs` | Xem log app. |
| `npm run staging:down` / `staging:reset` | Dừng staging (giữ dữ liệu) / xoá luôn dữ liệu staging. |
| `npm run docker:stop` | Dừng mọi container ở máy và cho WSL tắt. |

Trước khi mở pull request: sửa mã → `npm run dev` hoặc `dev:pg` → nếu đổi schema thì `db:migration` → `npm run lint` và `npm run check` → thay đổi lớn thì thêm `npm run staging` và `staging:check`. Các bước sau đó ở mục Phát hành.

Khác với prod: không có Cloudflare Tunnel và Access (`CF_ACCESS_ENFORCE=off`), không gửi HubSpot, image được build ở máy thay vì lấy từ GHCR. Mật khẩu staging nằm trong `.env.staging.local`, tự tạo, không commit. Lần đầu mở `/admin` của staging thì tạo tài khoản admin riêng cho máy.

Bản dump lấy từ prod chứa thông tin khách (Inquiries) và tài khoản: chỉ lấy khi cần, xoá sau khi thử, rồi `npm run staging:reset`.

`next build` cần `PAYLOAD_SECRET` khi `NODE_ENV=production`. Dockerfile đặt giá trị giả chỉ cho bước build, không đưa vào image. Build không cần database: trang được dựng sẵn từ dữ liệu đóng gói trong mã, rồi lấy nội dung CMS ở lần làm mới đầu tiên (khoảng 1 phút). Database lỗi thì trang vẫn hiện dữ liệu đóng gói, nên trang mở được chưa chắc database ổn.

## Backup định kỳ

`backup.sh` (chép lên `~/savis`) chạy bằng cron lúc 02:30 mỗi ngày: `pg_dump` database, nén volume `media`, sao `.env` và `docker-compose.yml` vào `backups/scheduled/<thời-gian>/`, kiểm tra dump đọc được, giữ 7 bản gần nhất. Log ở `backups/backup.log`. Chạy tay: `./backup.sh`.

Bản sao ngoài VPS: tạo `~/savis/.backup.conf` với `BACKUP_REMOTE="<remote-rclone>:<thư-mục>"` (và `~/savis/.backup-pass` chứa mật khẩu mã hoá, chmod 600) rồi script sẽ đẩy lên remote và giữ 14 bản. `.env` chứa bí mật nên không bao giờ được tải lên dạng thô. VPS hiện tại đã cấu hình đích `savis_crypt:daily` trên Google Drive (mục "Khôi phục từ Google Drive").

Khôi phục thử (không đụng database thật):

```
docker compose exec -T postgres psql -U savis -d postgres -c "create database restore_test"
docker compose exec -T postgres pg_restore -U savis -d restore_test --no-owner < backups/scheduled/<thời-gian>/db.dump
docker compose exec -T postgres psql -U savis -d postgres -c "drop database restore_test"
```

## Khôi phục từ Google Drive

Từ 27/11/2026, `backup.sh` trên VPS đẩy bản sao lên Drive qua `savis_crypt`, một remote mã hoá của `rclone` nằm trên `gdrive_backup:SAVIS-VPS-Backups`. Mỗi bản ở `daily/<thời-gian>/` gồm `db.dump`, `media.tar.gz`, `env.gpg`, `docker-compose.yml`, `SHA256SUMS`. Nội dung file được mã hoá (trên Drive có đuôi `.bin`), tên thì đọc được.

Cần **mật khẩu mã hoá** (nội dung `~/savis/.backup-pass`) và giữ một bản ngoài VPS. Mất cả VPS lẫn mật khẩu thì không mở được bản nào.

### 1. Lấy bản sao và giải mã

VPS còn chạy:

```
cd ~/savis
rclone lsf --dirs-only savis_crypt:daily                 # chọn bản
rclone copy savis_crypt:daily/<thời-gian> restore/
```

Mất VPS: mở Google Drive trên web, tải thư mục `SAVIS-VPS-Backups/daily/<thời-gian>` rồi giải nén. Trên máy có `rclone` và `gpg` (Windows dùng Git Bash):

```
read -rs PASS        # dán mật khẩu mã hoá rồi Enter
rclone config create savis_local crypt remote=<thư-mục-đã-giải-nén> \
  filename_encryption=off directory_name_encryption=false password="$PASS" --obscure
rclone copy savis_local: restore/
rclone config delete savis_local; unset PASS
```

Dùng trang web vì kết nối có quyền `drive.file`: `rclone` với client ID khác không thấy các file cũ.

### 2. Kiểm tra

```
(cd restore && grep -v ' env$' SHA256SUMS | sha256sum -c -)             # mọi dòng phải OK
gpg --pinentry-mode loopback -o restore/env -d restore/env.gpg          # hỏi mật khẩu mã hoá
```

`restore/` chứa bí mật và thông tin khách. Xong việc thì xoá: `rm -rf restore`.

### 3. Chuẩn bị VPS mới (bỏ qua nếu VPS còn chạy)

1. Cài Docker. Tạo `~/savis`, chép `docker-compose.yml`, `deploy.sh`, `backup.sh` từ repo, `chmod +x deploy.sh backup.sh`.
2. Chép thư mục `restore/` vào `~/savis`, rồi `install -m 600 restore/env .env`.
3. `docker login ghcr.io` như mục "Lần đầu".
4. Nếu VPS cũ còn chạy `cloudflared`, dừng nó trước: hai máy dùng chung `TUNNEL_TOKEN` thì khách truy cập bị chia cho cả hai.

### 4. Nạp database và tệp

**Bước này xoá database đang chạy.** Chạy trong `~/savis`:

```
./backup.sh                      # chỉ khi VPS còn chạy: giữ lại trạng thái hiện tại
docker compose up -d --wait postgres
docker compose create app        # tạo volume media nếu chưa có
docker compose stop app
docker compose exec -T postgres dropdb -U savis --force savis
docker compose exec -T postgres createdb -U savis savis
docker compose exec -T postgres pg_restore -U savis -d savis --no-owner --exit-on-error < restore/db.dump
docker run --rm -v savis_media:/data -v "$PWD/restore":/in:ro postgres:16-alpine tar -C /data -xzf /in/media.tar.gz
./deploy.sh "$(grep '^SAVIS_IMAGE_TAG=' .env | cut -d= -f2)"
```

`deploy.sh` chạy các migration còn thiếu rồi khởi động app và tunnel. Sau đó mở website, vài bài có ảnh và `/admin` để kiểm tra.

### 5. Bật lại backup trên VPS mới

1. Cài `rclone`, chạy `rclone config` để tạo remote Google Drive tên `gdrive_backup` (quyền `drive.file`, [client ID riêng](https://rclone.org/drive/#making-your-own-client-id)).
2. Dán mật khẩu mã hoá cũ vào `~/savis/.backup-pass`, `chmod 600`.
3. Tạo lại remote mã hoá và cấu hình:

```
cd ~/savis
rclone config create savis_crypt crypt remote=gdrive_backup:SAVIS-VPS-Backups \
  filename_encryption=off directory_name_encryption=false password="$(head -n1 .backup-pass | tr -d '\n')" --obscure
(umask 077; echo 'BACKUP_REMOTE="savis_crypt:daily"' > .backup.conf)
./backup.sh
```

4. `crontab -e`, thêm: `30 2 * * * /root/savis/backup.sh >> /root/savis/backups/backup.log 2>&1`

### Diễn tập

Thử khôi phục định kỳ. Trên máy dev, `npm run staging:restore -- <đường-dẫn>/db.dump` nạp database vào bản staging; xong thì xoá bản dump và chạy `npm run staging:reset`.
