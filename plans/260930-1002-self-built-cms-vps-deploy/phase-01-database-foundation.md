---
phase: 1
title: "Phase 1: Nền tảng database"
status: todo
priority: P1
effort: "1.5d"
dependencies: []
---

# Phase 1: Nền tảng database

<!-- Updated: Red Team 2026-09-30 - khởi tạo db lười, thêm position/source_key/submitted_by/updated_by, credit tuỳ chọn, sửa script lint -->
<!-- Updated: Validation 2026-09-30 - ảnh lưu trên đĩa, bỏ biến S3 -->

## Overview

Dựng Postgres chạy local, Drizzle ORM, schema nội dung, migration đầu tiên và bộ zod schema dùng chung. Kết thúc phase này, database có đủ bảng rỗng đúng thiết kế, còn site vẫn chạy trên dữ liệu `src/data/*.ts` như cũ.

## Bối cảnh

- Kiểu dữ liệu hiện có nằm ở ba file:
  - `src/data/types.ts`: `Article`, `ArticleBlock`, `SpecRow`, `ClientLogo`.
  - `src/data/company.ts`: `Certificate`, `Warehouse`, và các mảng `TRUST_STATS`, `CAPABILITIES`, `TIMELINE`, `COMPLIANCE`, `CONTACT_TOPICS`.
  - `src/data/images.ts`: `SiteImage`, `ImageCredit`.
- Dự án dùng `zod/mini` với import theo tên để bundle client nhỏ (chú thích đầu `src/lib/rfq.ts`). Schema dùng chung theo cùng quy ước.
- `npm run lint` đang gọi `next lint`. Next 16 đã gỡ lệnh này, và báo cáo `plans/reports/scout-260924-1543-chuan-bi-host.md` mục 7 đã ghi nhận.
- Máy phát triển **chưa có Docker** (`docker: command not found`). Phải cài Docker Desktop hoặc OrbStack trước. Node v24 đã có sẵn.

## Requirements

- [ ] Postgres chạy local bằng `compose.dev.yaml`, bind `127.0.0.1:5433` (cổng cố định cho dự án).
- [ ] Drizzle ORM với driver `pg` (node-postgres, `Pool`), thư mục migration `drizzle/`.
- [ ] **Khởi tạo lười:** không mở pool và không đọc env lúc import. `getDb()` tạo `Pool` ở lần gọi đầu, giữ trên `globalThis`, `connectionTimeoutMillis` khoảng 10 giây. Nhờ vậy `next build` không cần `DATABASE_URL`.
- [ ] `serverEnv()` parse `process.env` bằng zod ở lần gọi đầu và ghi nhớ kết quả. Không parse ở top-level.
- [ ] Bảng `articles`, `media`, `site_settings` đúng mục Schema.
- [ ] Zod schema dùng chung cho khối bài viết, snapshot bài viết và ảnh. `SiteSettings` định nghĩa ở phase 3.
- [ ] `SiteImage.credit` đổi thành **tuỳ chọn**, vì ảnh do khách tự chụp không cần ghi công. `/nguon-anh` bỏ qua ảnh không có `credit`.
- [ ] Sửa script `lint` thành `eslint src`. CI (phase 9) gọi `npm run lint`.
- [ ] Vitest cho các module thuần (không cần DB).

## Schema

Các cột tham chiếu người dùng (`created_by`, `updated_by`, `submitted_by`, `reviewed_by`, `uploaded_by`) để **nullable, chưa có khoá ngoại** trong phase này. Phase 5 thêm khoá ngoại tới bảng user của Better Auth với `ON DELETE SET NULL`. Dữ liệu seed nhận `NULL`.

```sql
CREATE TABLE media (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_key     text NOT NULL UNIQUE,     -- media/<yyyy>/<mm>/<uuid>.webp (đường dẫn tương đối trong MEDIA_DIR)
  source_key     text UNIQUE,              -- chỉ seed dùng: sha256 của file nguồn, để seed chạy lại không tải trùng
  mime           text NOT NULL,
  width          int  NOT NULL,
  height         int  NOT NULL,
  size_bytes     int  NOT NULL,
  alt            text NOT NULL,
  position       text,                     -- object-position, ví dụ '50% 75%'; null = giữa
  credit         jsonb,                    -- ImageCredit | null (null = ảnh của khách, không hiện ở /nguon-anh)
  uploaded_by    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text NOT NULL UNIQUE,
  status                text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','in_review','published')),
  -- Bản đang soạn
  title                 text NOT NULL,
  summary               text NOT NULL,
  category              text NOT NULL,          -- một trong ARTICLE_CATEGORIES (code)
  blocks                jsonb NOT NULL,         -- ArticleBlock[] (bản nháp: heading được phép chưa có id)
  references_list       jsonb NOT NULL DEFAULT '[]',
  related_product_slugs text[] NOT NULL DEFAULT '{}',
  cover_media_id        uuid REFERENCES media(id) ON DELETE SET NULL,
  author_name           text NOT NULL,
  author_role           text NOT NULL,
  featured              boolean NOT NULL DEFAULT false,
  -- Bản đang hiển thị trên site (null = chưa lên site)
  published_snapshot    jsonb,                  -- đúng hình dạng Article công khai
  first_published_at    timestamptz,
  -- Luồng duyệt và dấu vết
  created_by            text,
  updated_by            text,
  submitted_by          text,
  submitted_at          timestamptz,
  reviewed_by           text,
  review_note           text,
  -- Khoá lạc quan chống ghi đè khi hai người sửa cùng lúc
  version               int NOT NULL DEFAULT 1,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_idx ON articles (status, updated_at DESC);
CREATE INDEX articles_live_idx ON articles (first_published_at DESC)
  WHERE published_snapshot IS NOT NULL;

CREATE TABLE site_settings (
  id          int PRIMARY KEY CHECK (id = 1),
  data        jsonb NOT NULL,                   -- SiteSettings (phase 3), ảnh đã phân giải sẵn
  version     int NOT NULL DEFAULT 1,
  updated_by  text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

Viết schema bằng Drizzle (`pgTable`, `jsonb().$type<T>()`, `text().array()`), rồi dùng `drizzle-kit generate` để sinh SQL. Không viết SQL tay, và không bao giờ dùng `drizzle-kit push` ngoài máy dev.

## Architecture

- `src/server/db/schema.ts` khai báo bảng. `src/server/db/client.ts` export `getDb()` (lười, singleton) và import `server-only`.
- `src/server/env.ts` export `serverEnv()`. Biến gồm:
  - `DATABASE_URL`, `SITE_URL`, `MEDIA_DIR`: bắt buộc khi chạy;
  - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`: phase 5 thêm.
- `src/lib/content-schemas.ts` (dùng được cả client lẫn server) gồm:
  - `imageCreditSchema`: `sourceUrl` và `licenseUrl` chỉ nhận URL `http:` hoặc `https:`.
  - `siteImageSchema`: `credit` tuỳ chọn, `position` tuỳ chọn.
  - `draftBlockSchema`: discriminated union theo `type`, mỗi loại bắt buộc đúng trường của nó. `heading` cần `text`; `id` tuỳ chọn.
  - `publishedBlockSchema`: giống bản nháp nhưng `heading.id` bắt buộc.
  - `articleSnapshotSchema`: hình dạng `Article` công khai, thêm `cover?: SiteImage`. `publishedAt` và `updatedAt` khớp `^\d{4}-\d{2}-\d{2}$` (định dạng mà `formatDate` trong `src/lib/utils.ts` và phép sắp xếp `localeCompare` đang dựa vào).
  - Kiểm tra lúc compile (`satisfies` hoặc type test) rằng output zod gán được vào kiểu trong `src/data/types.ts` và `src/data/images.ts`.

## Related Code Files

- Create: `compose.dev.yaml`, `drizzle.config.ts`, `.env.example`, `src/server/env.ts`, `src/server/db/schema.ts`, `src/server/db/client.ts`, `src/lib/content-schemas.ts`, `src/lib/content-schemas.test.ts`, `vitest.config.ts`, `drizzle/0000_*.sql` (sinh tự động)
- Modify:
  - `package.json`: dependencies; scripts `lint`, `test`, `db:*`.
  - `.gitignore`: `.data/`.
  - `src/data/types.ts`: thêm `cover?: SiteImage` vào `Article`; nhận `Certificate`, `Warehouse` chuyển từ `company.ts`.
  - `src/data/company.ts`: import lại hai kiểu trên.
  - `src/components/certificate-card.tsx`: đổi import `Certificate` sang `@/data/types`.
  - `src/data/images.ts`: `credit` tuỳ chọn.
  - `src/app/nguon-anh/page.tsx`: bỏ qua ảnh không có `credit`.

## Implementation Steps

1. Cài Docker Desktop hoặc OrbStack (việc làm trên máy, ngoài repo).
2. `npm i drizzle-orm pg server-only` và `npm i -D @types/pg drizzle-kit tsx vitest`.
3. Viết `compose.dev.yaml` với service `db`: image `postgres:17.x-alpine` (ghim bản vá), volume có tên, `127.0.0.1:5433:5432`.
4. Viết `.env.example` gồm `DATABASE_URL`, `SITE_URL`, `MEDIA_DIR` (dev: `./.data/media`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Không có biến `NEXT_PUBLIC_*` nào, vì chúng bị chốt lúc build.
5. Viết `env.ts`, `schema.ts`, `client.ts`.
6. Thêm script: `lint` (`eslint src`), `test` (`vitest run`), `db:up`, `db:generate`, `db:migrate`, `db:studio`.
7. Viết `content-schemas.ts` và test cho từng loại khối hợp lệ/không hợp lệ, snapshot sai định dạng ngày, và `credit.sourceUrl` dạng `javascript:`/`data:` bị từ chối.
8. Chuyển kiểu `Certificate`, `Warehouse`; cho `credit` tuỳ chọn và sửa `/nguon-anh`.
9. `npm run db:generate` rồi `npm run db:migrate` trên DB local.

## Todo

- [ ] Cài Docker trên máy phát triển
- [ ] Cài dependency; sửa `lint`, thêm các script
- [ ] `compose.dev.yaml` và `.env.example`
- [ ] `env.ts` và `getDb()` khởi tạo lười
- [ ] Drizzle schema và migration đầu tiên
- [ ] `content-schemas.ts` và test
- [ ] Chuyển kiểu `Certificate`/`Warehouse` (kèm `certificate-card.tsx`); `credit` tuỳ chọn (kèm `/nguon-anh`)

## Success Criteria

- `npm run db:up && npm run db:migrate` chạy thành công; `psql` trên cổng 5433 thấy đủ 3 bảng và các index.
- `npm test` xanh, có ít nhất một test từ chối cho mỗi loại khối thiếu trường.
- `npm run typecheck` và `npm run lint` sạch.
- `npm run build` thành công khi **không có** `DATABASE_URL`, và site hiển thị y như trước.

## Risk Assessment

- **Hai nguồn kiểu lệch nhau** (zod và `types.ts`): chặn bằng kiểm tra lúc compile.
- **Import `getDb()` vô tình mở kết nối lúc build:** pool chỉ tạo khi gọi, không tạo khi import.

## Security Considerations

- `.env*` đã nằm trong `.gitignore` (trừ `.env.example`). Không commit giá trị thật.
- Postgres dev chỉ bind `127.0.0.1`.
