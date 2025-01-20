# x-admin

✨ **x-admin** 是一个基于 Vue 3 生态的后台管理模版，结合 Ant Design Vue 组件库，旨在帮助开发者快速搭建中台系统。

---

## 🎯 核心特点

- **⚡ 极速开发**  
  借助 [Vue 3](https://github.com/vuejs/core)、[Vite 5](https://github.com/vitejs/vite) 和 [pnpm](https://pnpm.io/)，开发效率大幅提升。  

- **🖌️ 企业级组件支持**  
  集成 [Ant Design Vue](https://next.antdv.com/components/overview)，快速构建复杂表单、表格、图表等功能。  

- **🍍 灵活状态管理**  
  采用 [Pinia](https://pinia.vuejs.org/)，简洁的 API，天然支持 TypeScript，轻量而灵活。  

- **🎨 原子化 CSS**  
  借助 [Tailwind CSS](https://tailwindcss.com/docs/installation)，高效完成界面样式设计，支持深色模式。  

- **🔥 现代开发工具**  
  支持 TSX 语法、Eslint、Prettier 等工具，提供完整的类型检查和代码规范保障。  

- **💾 数据模拟支持**  
  内置 [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server)，便于开发过程中构建本地数据。

---

## 📦 依赖项

### 核心依赖

- **[Vue 3](https://github.com/vuejs/core)**：现代化的响应式框架。  
- **[Ant Design Vue](https://next.antdv.com/components/overview)**：专业后台组件库。  
- **[Pinia](https://pinia.vuejs.org/)**：高效灵活的状态管理方案。  
- **[Vue Router](https://router.vuejs.org/)**：用于管理路由和导航逻辑。  
- **[Axios](https://axios-http.com/)**：轻量化 HTTP 客户端。  

### 辅助依赖

- **[Day.js](https://day.js.org/)**：日期时间处理工具，体积小巧且高效。  
- **[NProgress](https://ricostacruz.com/nprogress/)**：顶部加载条，提升页面加载体验。  
- **[qs](https://github.com/ljharb/qs)**：处理 URL 查询参数。  
- **[Mitt](https://github.com/developit/mitt)**：事件总线库。  

### 开发依赖

- **[Vite](https://vitejs.dev/)**：现代化前端构建工具，支持热更新。  
- **[TypeScript](https://www.typescriptlang.org/)**：静态类型检查，提升代码健壮性。  
- **[ESLint](https://eslint.org/)**：代码规范检查工具。  
- **[Prettier](https://prettier.io/)**：代码格式化工具。  
- **[Tailwind CSS](https://tailwindcss.com/docs/installation)**：快速构建美观且响应式的 UI。  

---

## 🛠️ 开发指南

### 克隆仓库

```bash
git clone https://github.com/yangtianxia/x-admin.git
cd x-admin
```

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 代码检查和格式化

```bash
pnpm lint    # 代码静态检查
pnpm format  # 格式化代码
```

### 构建生产版本

```bash
pnpm build
```

打包文件位于 `dist/` 目录下。

---

## 🚦 开发规范

- 使用 [ESLint](https://eslint.org/) 和 [Prettier](https://prettier.io/) 统一代码风格。  
- 使用 [Stylelint](https://stylelint.io/) 检查样式问题。  
- 配置 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 和 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)，提升开发效率。  

---

## 📜 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT)。欢迎自由使用、修改和分发。

如有问题或建议，请通过 [GitHub Issues](https://github.com/yangtianxia/x-admin/issues) 提交！ 😊

---
