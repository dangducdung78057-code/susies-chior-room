# StageOS 艺演助手｜静态产品总览站 v1

本仓库当前提供一个可直接静态部署的 StageOS 艺演助手产品总览站，用于集中展示产品定位、页面结构、核心接口、部署方式与已实现范围，便于演示、沟通与二次开发落地。

## 页面内容

- 首页概览
- 页面结构总览
- 核心 API 总览
- 本地运行说明
- Docker 部署说明
- 生产部署注意事项
- StageOS 内置资料清单
- 已实现 / 未默认启用能力说明

## 本地预览

直接打开 `/home/runner/work/susies-chior-room/susies-chior-room/index.html`，或使用任意静态文件服务器托管仓库根目录。

## 页面结构

```txt
/
首页

/museum
艺演展馆

/cases
艺案集

/cases/:id
成案详情

/about
关于我们

/favorites
我的收藏

/workspace
StageOS 工作台

/workspace/clone/:caseId
一键同款工作台

/workspace/preview/:projectId
2D / 3D / 插画 / 写实 / 导出预览页
```

## 核心接口

```txt
GET  /api/health
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/cases
GET  /api/cases/:id
GET  /api/favorites
POST /api/favorites
DELETE /api/favorites
GET  /api/projects
POST /api/projects
GET  /api/projects/:id
PATCH /api/projects/:id
POST /api/uploads
POST /api/stageos/cases/:caseId/clone-context
POST /api/stageos/generate-plan
POST /api/stageos/render-context
POST /api/stageos/render-preview
GET  /api/previews/:id/svg
```

## 本地运行（目标工程约定）

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

默认种子账号：

```txt
admin@stageos.local
StageOS123!
```

## Docker 部署（目标工程约定）

```bash
cp .env.example .env
docker compose up --build
```

首次启动后进入容器执行数据库迁移和种子：

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

访问：

```txt
http://localhost:3000
```

## 生产部署注意

1. 必须修改 `.env` 中的 `AUTH_SECRET`。
2. 单机部署可使用本地上传目录；多实例部署建议把 `/public/uploads` 替换为对象存储。
3. 若使用 OpenAI 文本增强，设置：

   ```txt
   AI_PROVIDER=openai
   OPENAI_API_KEY=你的key
   OPENAI_TEXT_MODEL=gpt-5.5
   ```

4. 图片生成没有默认开启；插画/写实模式目前输出受约束提示词，可继续接入外部图像服务。

## 已封入的 StageOS 资料

- 语言类节目研究报告
- 群体朗诵按学段分析
- 啦啦操视觉分析
- 群舞反面案例 / 避坑硬约束
- StageOS 总控封版文件
- 新增资料提示词契约 v2
- Negative Guard 提示词契约 v1

## 真实落地范围

已实现：

- 用户注册 / 登录 / 退出
- 数据库存储用户、案例、收藏、项目、素材、预览
- 艺案集案例展示与一键同款
- 工作台分步填写真实数据
- 上传服装、配饰、场地、大屏、队形、身高表文件记录
- 规则路由 + 本地方案生成
- 输出前 Negative Guard 风险审查
- 2D 数字人 SVG 预览
- 3D 数字人交互预览
- 插画风 / 写实风受约束提示词
- 项目 JSON 导出

未默认启用：

- 真正外部图像生成服务
- 短视频生成服务
- 第三方支付
- 短信登录
- 多人协作权限系统
