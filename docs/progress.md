# SaaSPro Progress

## 2026-06-01 — Full Refactor (Maestro → SaaSPro)

- [x] 项目审计完成
- [x] 安全: .env 确认未被 git 追踪
- [x] 清理: 删除 3 个备份残留文件
- [x] 修复: proxy.ts 重命名为 middleware.ts (i18n middleware 之前未生效)
- [x] 创建: docs/ (architecture.md, progress.md, decisions.md)
- [x] Monorepo 重构: src/ → apps/web/src/, 新增 turbo.json + tsconfig.base.json
- [x] 翻译文件: apps/web/src/messages/ → shared/messages/
- [x] 业务逻辑: prisma.ts + stripe.ts → shared/api/
- [x] CI/CD: .github/workflows/ci.yml
- [x] 脚本: scripts/setup.sh, check.sh, deploy.sh
- [x] README: 从默认模板改为项目文档
- [x] 语言切换: 添加 cookie 持久化 (NEXT_LOCALE)
- [x] 错误处理: 4 个 dashboard 页面修复 .catch(() => {})
- [x] @shared/ 路径别名: apps/web/tsconfig.json 添加 @shared/* → ../../shared/*
- [x] Build 验证: 0 错误, 26/26 页面通过

## 2026-06-04 — Generic SaaS Branding Refactor

- [x] Rebrand from music-teacher-specific (Maestro) to generic SaaS (SaaSPro)
- [x] Rename package from `@maestro/web` to `@saas-starter/web`
- [x] Update README.md with generic SaaS project description
- [x] Update CLAUDE.md with generic project context
- [x] Update docs/architecture.md with generic models (Organization, Client, Event, Invoice)
- [x] Update docs/decisions.md ADRs: Teacher→Organization, Student→Client, Lesson→Event
- [x] Update docs/progress.md with new entry for the refactor
- [x] Update scripts/deploy.sh, setup.sh, check.sh with SaaS branding
- [x] Update .env.example comment
- [x] Data model: User→Organization→{Client, Event, Invoice}
