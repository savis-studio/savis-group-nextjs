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
| `TUNNEL_TOKEN` | Từ Cloudflare Zero Trust → Tunnels. |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_ID` | Tùy chọn. Có cả hai thì tin nhắn từ form liên hệ được gửi thêm sang form HubSpot (xem cột `hubspot` trong Leads → Inquiries: sent hoặc failed). Bỏ trống thì chỉ lưu trong Payload. |
| `CLOUDFLARED_TAG` | Phiên bản `cloudflared` cố định, lấy ở trang releases của cloudflared. |
| `SAVIS_IMAGE_TAG` | Do `deploy.sh` ghi. Không sửa tay. |

## Lần đầu

1. Trên VPS: `mkdir -p ~/savis && cd ~/savis`, chép `docker-compose.yml` và `deploy.sh` vào, `chmod +x deploy.sh`, tạo `.env`.
2. Đăng nhập GHCR (token classic chỉ có `read:packages`, tự nhập, không lưu vào repo): `docker login ghcr.io -u <tên-github>`.
3. Lấy mã commit (7 ký tự) của bản build xanh trong GitHub Actions, rồi: `./deploy.sh <mã-commit>`.
4. Nạp dữ liệu mẫu một lần: `docker compose run --rm tools npm run seed`.
5. Mở `<SERVER_URL>/admin`, đăng nhập Access, tạo tài khoản đầu tiên. Tài khoản này tự thành admin.

## Phát hành

Push lên `main`, chờ Actions xanh, rồi trên VPS: `./deploy.sh <mã-commit>`.

Script làm theo thứ tự: chụp `pg_dump` vào `backups/` → kéo image → chạy migration → khởi động lại → chờ `healthy` → ghi tag đang chạy (`.deploy-current`) và tag trước đó (`.deploy-previous`). Giữ 14 bản backup gần nhất.

## Thêm hoặc đổi schema

Payload production không tự đồng bộ schema. Khi sửa collection hoặc field, tạo migration trên máy dev với Postgres và commit:

```
DATABASE_URL=postgres://... npx payload migrate:create <tên>
```

`deploy.sh` sẽ chạy migration mới khi phát hành.

## Rollback

- **Chỉ code:** `./deploy.sh "$(cat .deploy-previous)"`.
- **Bản lỗi đã chạy migration:** đổi code là không đủ. Khôi phục từ file `backups/pre-<tag>-*.dump` chụp ngay trước lần đó:
  ```
  docker compose stop app
  docker compose exec -T postgres pg_restore -U savis -d savis --clean --if-exists < backups/<file>.dump
  ./deploy.sh "$(cat .deploy-previous)"
  ```

## Việc thường xuyên

- Backup hằng ngày ra ngoài VPS (database và volume `media`), thử khôi phục định kỳ. `deploy.sh` chỉ chụp bản trước khi migrate.
- `docker image prune` đã nằm trong `deploy.sh`. Theo dõi dung lượng đĩa.
- Tunnel đứt: `docker compose restart cloudflared`.
- Bị khoá khỏi admin: thêm email vào policy Access. Mất toàn bộ admin: đặt lại bằng Local API từ container `tools`.

## Kiểm thử cục bộ

`next build` cần `PAYLOAD_SECRET` khi `NODE_ENV=production`. Dockerfile đặt giá trị giả chỉ cho bước build, không đưa vào image. Build không cần database vì trang `(frontend)` được render theo từng request.

## Backup định kỳ

`backup.sh` (chép lên `~/savis`) chạy bằng cron lúc 02:30 mỗi ngày: `pg_dump` database, nén volume `media`, sao `.env` và `docker-compose.yml` vào `backups/scheduled/<thời-gian>/`, kiểm tra dump đọc được, giữ 7 bản gần nhất. Log ở `backups/backup.log`. Chạy tay: `./backup.sh`.

Bản sao ngoài VPS: tạo `~/savis/.backup.conf` với `BACKUP_REMOTE="<remote-rclone>:<thư-mục>"` (và `~/savis/.backup-pass` chứa mật khẩu mã hoá, chmod 600) rồi script sẽ đẩy lên remote và giữ 14 bản. `.env` chứa bí mật nên không bao giờ được tải lên dạng thô.

Khôi phục thử (không đụng database thật):

```
docker compose exec -T postgres psql -U savis -d postgres -c "create database restore_test"
docker compose exec -T postgres pg_restore -U savis -d restore_test --no-owner < backups/scheduled/<thời-gian>/db.dump
docker compose exec -T postgres psql -U savis -d postgres -c "drop database restore_test"
```
