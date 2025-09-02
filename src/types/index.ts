/**
 * 修真模拟器核心类型定义
 * 定义了应用中使用的所有TypeScript接口和类型
 */

// 修真境界枚举
export type RealmType = 'lianqi' | 'zhuji' | 'jindan' | 'yuanying' | 'huashen';

// 交互模式枚举
export type InteractionMode = 'manual' | 'auto';

// 穴位节点接口
export interface AcupointNode {
  id: string;
  name: string;
  position: [number, number, number]; // x, y, z 坐标
  x: number;
  y: number;
  z: number;
  size: number;
  type: string;
  isActive: boolean;
  isCompleted: boolean;
}

// 2D穴位节点接口（用于练气期和筑基期）
export interface AcupointNode2D {
  id: string;
  name: string;
  position: [number, number]; // x, y 坐标
  x: number;
  y: number;
  size: number;
  type: string;
  isActive: boolean;
  isCompleted: boolean;
}

// 经络路径接口
export interface MeridianPath {
  id: string;
  nodes: string[]; // 穴位节点ID序列
  isActive: boolean;
  progress: number; // 0-1，动画进度
}

// 相机位置接口（用于3D场景）
export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

// 境界状态接口
export interface RealmState {
  currentRealm: RealmType;
  mode: InteractionMode;
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
  animationProgress: number;
  progress: number;
  activeNodes: string[];
  completedPaths: string[];
  nodes: AcupointNode[];
  paths: MeridianPath[];
}

// 应用状态管理接口
export interface AppStore {
  // 状态
  realmState: RealmState;
  
  // 操作方法
  setCurrentRealm: (realm: RealmType) => void;
  setMode: (mode: InteractionMode) => void;
  activateNode: (nodeId: string) => void;
  resetProgress: () => void;
  startAutoAnimation: () => void;
  stopAnimation: () => void;
  updateAnimationProgress: (progress: number) => void;
  initializeRealm: (realm: RealmType) => void;
}

// 境界配置接口
export interface RealmConfig {
  id: RealmType;
  name: string;
  description: string;
  complexityLevel: number;
  visualizationType: '2d' | '3d' | 'grid';
  nodes?: AcupointNode2D[] | AcupointNode[];
  nodes3D?: AcupointNode[];
  gridSize?: { width: number; height: number };
  presets?: { [key: string]: [number, number][] };
  philosophyTexts?: string[];
}

// 练气期配置
export interface LianQiConfig {
  nodes: AcupointNode2D[];
  paths: MeridianPath[];
}

// 筑基期配置
export interface ZhuJiConfig {
  nodes: AcupointNode2D[];
  paths: MeridianPath[];
}

// 金丹期配置
export interface JinDanConfig {
  nodes: AcupointNode[];
  paths: MeridianPath[];
  cameraPositions: CameraPosition[];
}

// 元婴期配置（生命游戏）
export interface YuanYingConfig {
  gridSize: {
    width: number;
    height: number;
  };
  presets: {
    [key: string]: [number, number][];
  };
}

// 化神期配置
export interface HuaShenConfig {
  geometryType: 'klein_bottle' | 'tesseract';
  shaderUniforms: {
    time: number;
    complexity: number;
    morphFactor: number;
  };
  philosophyTexts: string[];
}

// 生命游戏单元格状态
export type CellState = 'alive' | 'dead';

// 生命游戏网格
export type GameGrid = CellState[][];

// 境界信息
export interface RealmInfo {
  id: RealmType;
  name: string;
  description: string;
  shortDescription: string;
  instructions: {
    manual: string;
    auto: string;
  };
}

// 动画状态
export interface AnimationState {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  speed: number;
}

// 3D场景属性
export interface Scene3DProps {
  nodes: AcupointNode[];
  paths: MeridianPath[];
  isAnimating: boolean;
  onNodeClick: (nodeId: string) => void;
  animationProgress: number;
}

// 2D场景属性
export interface Scene2DProps {
  nodes: AcupointNode2D[];
  paths: MeridianPath[];
  isAnimating: boolean;
  onNodeClick: (nodeId: string) => void;
  animationProgress: number;
}

// 控制面板属性
export interface ControlPanelProps {
  currentRealm: RealmType;
  mode: InteractionMode;
  isAnimating: boolean;
  onModeChange: (mode: InteractionMode) => void;
  onAutoPlay: () => void;
  onReset: () => void;
}

// 导航栏属性
export interface RealmNavigationProps {
  currentRealm: RealmType;
  onRealmChange: (realm: RealmType) => void;
}

// 错误状态
export interface ErrorState {
  hasError: boolean;
  message: string;
}

// 加载状态
export interface LoadingState {
  isLoading: boolean;
  message: string;
}

// 几何体类型
export type GeometryType = 'klein_bottle' | 'tesseract' | 'sphere' | 'torus' | 'cube' | 'octahedron' | 'icosahedron' | 'dodecahedron';

// 生命游戏单元格
export interface LifeGameCell {
  x: number;
  y: number;
  alive: boolean;
  isAlive: boolean;
  age: number;
  neighbors?: number;
}

// 生命游戏预设
export interface LifeGamePreset {
  name: string;
  pattern: [number, number][];
  description: string;
}

export type LifeGamePresets = {
  [key: string]: [number, number][];
}

// 组件Props类型定义
export interface LianQiSceneProps {
  isAnimating: boolean;
  currentStep: number;
  animationProgress: number;
  onNodeClick?: (nodeId: string) => void;
}

export interface ZhuJiSceneProps {
  isAnimating: boolean;
  currentStep: number;
  animationProgress: number;
  onNodeClick?: (nodeId: string) => void;
}

export interface JinDanSceneProps {
  isAnimating: boolean;
  currentStep: number;
  animationProgress: number;
  onNodeClick?: (nodeId: string) => void;
}

export interface YuanYingSceneProps {
  isAnimating: boolean;
  onCellClick?: (x: number, y: number) => void;
}

export interface HuaShenSceneProps {
  isAnimating: boolean;
  animationProgress: number;
  geometryType: GeometryType;
  onGeometryClick?: (geometryId: string) => void;
}