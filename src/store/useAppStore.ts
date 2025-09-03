/**
 * 修真模拟器全局状态管理
 * 使用Zustand实现状态管理，包含境界切换、动画控制、节点激活等功能
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AppStore,
  RealmType,
  InteractionMode,
  RealmState,
  AcupointNode,
  MeridianPath
} from '../types';
import { getRealmInitialData } from '../data/realmConfigs';

// 初始状态
const initialRealmState: RealmState = {
  currentRealm: 'lianqi',
  mode: 'manual',
  isAnimating: false,
  currentStep: 0,
  totalSteps: 0,
  animationProgress: 0,
  progress: 0,
  activeNodes: [],
  completedPaths: [],
  nodes: [],
  paths: []
};

/**
 * 创建应用状态管理store
 */
export const useAppStore = create<AppStore>()(devtools(
  (set, get) => ({
    // 状态
    realmState: initialRealmState,

    /**
     * 设置当前境界
     * @param realm 目标境界
     */
    setCurrentRealm: (realm: RealmType) => {
      set((state) => {
        const newState = {
          ...state,
          realmState: {
            ...state.realmState,
            currentRealm: realm,
            isAnimating: false,
            currentStep: 0
          }
        };
        return newState;
      }, false, 'setCurrentRealm');
      
      // 初始化新境界的数据
      get().initializeRealm(realm);
    },

    /**
     * 设置交互模式
     * @param mode 交互模式（手动/自动）
     */
    setMode: (mode: InteractionMode) => {
      set((state) => ({
        ...state,
        realmState: {
          ...state.realmState,
          mode,
          isAnimating: false
        }
      }), false, 'setMode');
    },

    /**
     * 激活节点
     * @param nodeId 节点ID
     */
    activateNode: (nodeId: string) => {
      set((state) => {
        // 检查节点是否已经激活，防止重复激活
        const targetNode = state.realmState.nodes.find(node => node.id === nodeId);
        if (!targetNode || state.realmState.activeNodes.includes(nodeId)) {
          console.log(`节点 ${nodeId} 已经激活或不存在，跳过激活`);
          return state; // 返回原状态，不做任何修改
        }

        // 更新activeNodes数组
        const updatedActiveNodes = [...state.realmState.activeNodes, nodeId];
        
        const updatedNodes = state.realmState.nodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              isActive: true,
              isCompleted: true
            };
          }
          return node;
        });

        // 检查是否有路径需要激活
        const updatedPaths = state.realmState.paths.map(path => {
          const nodeIndex = path.nodes?.indexOf(nodeId) ?? -1;
          if (nodeIndex !== -1) {
            return {
              ...path,
              isActive: true,
              progress: Math.min(1, (nodeIndex + 1) / (path.nodes?.length || 1))
            };
          }
          return path;
        });

        // 计算总体进度
        const totalNodes = state.realmState.nodes.length;
        const activatedNodes = updatedActiveNodes.length;
        const newProgress = totalNodes > 0 ? (activatedNodes / totalNodes) * 100 : 0;

        console.log(`成功激活节点 ${nodeId}，当前步骤: ${state.realmState.currentStep + 1}，进度: ${newProgress.toFixed(1)}%`);

        return {
          ...state,
          realmState: {
            ...state.realmState,
            nodes: updatedNodes,
            paths: updatedPaths,
            activeNodes: updatedActiveNodes,
            progress: newProgress,
            currentStep: state.realmState.currentStep + 1
          }
        };
      }, false, 'activateNode');
    },

    /**
     * 重置进度
     */
    resetProgress: () => {
      set((state) => {
        const resetNodes = state.realmState.nodes.map(node => ({
          ...node,
          isActive: false,
          isCompleted: false
        }));

        const resetPaths = state.realmState.paths.map(path => ({
          ...path,
          isActive: false,
          progress: 0
        }));

        return {
          ...state,
          realmState: {
            ...state.realmState,
            nodes: resetNodes,
            paths: resetPaths,
            currentStep: 0,
            isAnimating: false,
            // 重置所有相关状态
            activeNodes: [],
            progress: 0,
            completedPaths: [],
            animationProgress: 0
          }
        };
      }, false, 'resetProgress');
    },

    /**
     * 开始自动动画
     */
    startAutoAnimation: () => {
      const state = get();
      if (state.realmState.isAnimating) return;

      set((state) => ({
        ...state,
        realmState: {
          ...state.realmState,
          isAnimating: true,
          mode: 'auto'
        }
      }), false, 'startAutoAnimation');

      // 执行自动动画逻辑
      const animateNodes = () => {
        const currentState = get();
        const { nodes, currentStep, totalSteps } = currentState.realmState;
        
        if (currentStep >= totalSteps || !currentState.realmState.isAnimating) {
          get().stopAnimation();
          return;
        }

        // 激活下一个节点
        const nextNode = nodes[currentStep];
        if (nextNode) {
          get().activateNode(nextNode.id);
          
          // 继续下一步动画
          setTimeout(animateNodes, 1000); // 1秒间隔
        }
      };

      // 开始动画
      setTimeout(animateNodes, 500);
    },

    /**
     * 停止动画
     */
    stopAnimation: () => {
      set((state) => ({
        ...state,
        realmState: {
          ...state.realmState,
          isAnimating: false
        }
      }), false, 'stopAnimation');
    },

    /**
     * 更新动画进度
     * @param progress 进度值 (0-1)
     */
    updateAnimationProgress: (progress: number) => {
      set((state) => {
        const updatedPaths = state.realmState.paths.map(path => ({
          ...path,
          progress: path.isActive ? progress : 0
        }));

        return {
          ...state,
          realmState: {
            ...state.realmState,
            paths: updatedPaths
          }
        };
      }, false, 'updateAnimationProgress');
    },

    /**
     * 初始化境界数据
     * @param realm 境界类型
     */
    initializeRealm: (realm: RealmType) => {
      const realmData = getRealmInitialData(realm);
      
      set((state) => ({
        ...state,
        realmState: {
          ...state.realmState,
          currentRealm: realm,
          nodes: realmData.nodes,
          paths: realmData.paths,
          totalSteps: realmData.nodes.length,
          currentStep: 0,
          isAnimating: false,
          // 重置所有状态，确保每个境界都是全新开始
          activeNodes: [],
          progress: 0,
          completedPaths: [],
          animationProgress: 0
        }
      }), false, 'initializeRealm');
    }
  }),
  {
    name: 'xiuxian-simulator-store',
    enabled: process.env.NODE_ENV === 'development'
  }
));

/**
 * 选择器函数 - 获取当前境界状态
 */
export const useRealmState = () => useAppStore(state => state.realmState);

/**
 * 选择器函数 - 获取当前境界
 */
export const useCurrentRealm = () => useAppStore(state => state.realmState.currentRealm);

/**
 * 选择器函数 - 获取交互模式
 */
export const useInteractionMode = () => useAppStore(state => state.realmState.mode);

/**
 * 选择器函数 - 获取动画状态
 */
export const useAnimationState = () => {
  const isAnimating = useAppStore(state => state.realmState.isAnimating);
  const currentStep = useAppStore(state => state.realmState.currentStep);
  const animationProgress = useAppStore(state => state.realmState.animationProgress);
  
  return {
    isAnimating,
    currentStep,
    animationProgress
  };
};

/**
 * 选择器函数 - 获取当前步骤
 */
export const useCurrentStep = () => useAppStore(state => state.realmState.currentStep);

/**
 * 选择器函数 - 获取总步骤数
 */
export const useTotalSteps = () => useAppStore(state => state.realmState.totalSteps);

/**
 * 选择器函数 - 获取节点数据
 */
export const useRealmNodes = () => useAppStore(state => state.realmState.nodes);

/**
 * 选择器函数 - 获取路径数据
 */
export const useRealmPaths = () => useAppStore(state => state.realmState.paths);

/**
 * 选择器函数 - 获取当前境界状态（别名）
 */
export const useCurrentRealmState = () => useAppStore(state => state.realmState);

/**
 * 选择器函数 - 获取动画进度
 */
export const useAnimationProgress = () => useAppStore(state => {
  const activePaths = state.realmState.paths.filter(path => path.isActive);
  if (activePaths.length === 0) return 0;
  return activePaths.reduce((sum, path) => sum + path.progress, 0) / activePaths.length;
});