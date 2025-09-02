# 修真模拟器：心智进化

一个交互式3D可视化Web应用，通过演示修真各个境界的经络运行复杂度，让用户直观体验认知跃迁的艰难过程。

![修真模拟器](https://img.shields.io/badge/修真模拟器-心智进化-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.170.0-000000?style=flat&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat&logo=vite)

## ✨ 功能特性

### 🌟 五大修真境界
- **练气期** - SVG 2D经络图，简单穴位连接演示
- **筑基期** - 复杂2D蜘蛛网络图，增强路径复杂度
- **金丹期** - React Three Fiber 3D球状经络网络（核心亮点）
- **元婴期** - HTML/CSS Grid细胞自动机，生命游戏演化
- **化神期** - 3D克莱因瓶动画，高维几何体特效

### 🎮 交互功能
- **境界导航** - 一键切换五个修真境界
- **双模式操作** - 手动点击穴位 / 自动演示动画
- **3D场景交互** - 鼠标旋转、缩放、相机动画
- **实时反馈** - 节点发光、流光动画、进度提示

### 🎨 视觉设计
- **主题色彩** - 深蓝色(#1e3a8a) + 金色(#fbbf24)修真风格
- **动画效果** - 节点发光、路径流光、3D材质特效
- **响应式布局** - 桌面优先，支持移动端基本适配
- **现代UI** - Tailwind CSS + 圆角设计 + 悬停效果

## 🚀 技术栈

### 前端框架
- **React 18.3.1** - 现代React Hooks + 函数组件
- **TypeScript 5.8.3** - 类型安全的JavaScript超集
- **Vite 6.3.5** - 快速构建工具和开发服务器

### 3D渲染引擎
- **@react-three/fiber 8.17.10** - React的Three.js渲染器
- **@react-three/drei 9.114.3** - Three.js实用组件库
- **Three.js 0.170.0** - 强大的3D图形库
- **@react-spring/three 9.7.5** - 3D动画库

### 样式和状态
- **Tailwind CSS 3.4.17** - 原子化CSS框架
- **Zustand 5.0.3** - 轻量级状态管理
- **Lucide React 0.511.0** - 现代图标库

## 📦 安装步骤

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0

### 克隆项目
```bash
git clone https://github.com/your-username/xiuxian-simulator.git
cd xiuxian-simulator
```

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

### 构建生产版本
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

## 🎯 使用说明

### 基本操作
1. **境界切换** - 点击顶部导航栏的境界按钮切换不同场景
2. **模式选择** - 在控制面板选择手动模式或自动模式
3. **手动模式** - 按正确顺序点击穴位/节点完成修真
4. **自动模式** - 观看系统自动演示完整修真过程

### 3D场景交互（金丹期/化神期）
- **旋转** - 鼠标左键拖拽旋转视角
- **缩放** - 鼠标滚轮缩放场景
- **平移** - 鼠标右键拖拽平移视角
- **重置** - 双击重置相机位置

### 境界特色功能
- **练气期** - 简单2D经络图，适合初学者
- **筑基期** - 复杂网络图，增加挑战难度
- **金丹期** - 3D球状网络，支持自动相机动画
- **元婴期** - 细胞自动机，观察生命演化规律
- **化神期** - 高维几何体，体验超越三维的境界

## 📁 项目结构

```
xiuxian-simulator/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React组件
│   │   ├── JinDanScene.tsx    # 金丹期3D场景（核心组件）
│   │   ├── LianQiScene.tsx    # 练气期2D场景
│   │   ├── ZhuJiScene.tsx     # 筑基期2D场景
│   │   ├── YuanYingScene.tsx  # 元婴期细胞自动机
│   │   ├── HuaShenScene.tsx   # 化神期3D场景
│   │   ├── RealmNavigation.tsx # 境界导航栏
│   │   └── ControlPanel.tsx   # 控制面板
│   ├── hooks/              # 自定义Hooks
│   ├── store/              # Zustand状态管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── data/               # 静态数据配置
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── .trae/
│   └── documents/          # 项目文档
│       ├── 修真模拟器产品需求文档.md
│       └── 修真模拟器技术架构文档.md
├── package.json            # 项目依赖配置
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
└── README.md               # 项目说明文档
```

## 🎨 核心组件说明

### JinDanScene.tsx（金丹期3D场景）
项目的核心亮点组件，使用React Three Fiber创建3D球状经络网络：
- 3D球形节点分布，支持鼠标交互
- 自动相机动画，展示不同视角
- 节点发光效果和连接线流光动画
- "一键修真"自动演示功能

### 状态管理架构
使用Zustand进行轻量级状态管理：
- 当前境界状态
- 交互模式（手动/自动）
- 节点激活状态
- 动画进度控制

## 🔧 开发命令

```bash
# 开发服务器
pnpm dev

# 类型检查
pnpm check

# 代码检查
pnpm lint

# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

## 🌐 在线演示

🚀 [在线体验地址](https://traexiuxian2psv3-cuizhengwu-cuizhengwus-projects.vercel.app)

## 📸 项目截图

### 金丹期3D场景
![金丹期3D场景](./screenshots/jindan-3d.png)
*3D球状经络网络，支持鼠标交互和自动演示*

### 境界导航界面
![境界导航](./screenshots/navigation.png)
*五个修真境界一键切换，直观展示复杂度递增*

### 元婴期细胞自动机
![元婴期场景](./screenshots/yuanying-automata.png)
*生命游戏演化，体验复杂系统的涌现特性*

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - 强大的React 3D渲染库
- [Three.js](https://threejs.org/) - 优秀的3D图形库
- [Tailwind CSS](https://tailwindcss.com/) - 高效的CSS框架
- [Zustand](https://github.com/pmndrs/zustand) - 简洁的状态管理库

---

**修真路漫漫，代码亦修行** 🧘‍♂️✨

> 通过可视化技术展现修真境界的复杂性递增，帮助理解认知进化的困难性。每一个境界的跃迁，都是心智模式的根本性重构。