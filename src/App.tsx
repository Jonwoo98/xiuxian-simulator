/**
 * 修真模拟器主应用组件
 * 包含境界切换、场景渲染、控制面板等核心功能
 */

import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore, useCurrentRealm, useInteractionMode, useAnimationState, useRealmState, useCurrentStep, useTotalSteps } from './store/useAppStore';
import { getRealmInfo } from './data/realmConfigs';
import type { RealmType, InteractionMode } from './types';

// 懒加载组件
const RealmNavigation = React.lazy(() => import('./components/RealmNavigation'));
const LianQiScene = React.lazy(() => import('./components/LianQiScene'));
const ZhuJiScene = React.lazy(() => import('./components/ZhuJiScene'));
const JinDanScene = React.lazy(() => import('./components/JinDanScene'));
const YuanYingScene = React.lazy(() => import('./components/YuanYingScene'));
const HuaShenScene = React.lazy(() => import('./components/HuaShenScene'));
const ErrorBoundary = React.lazy(() => import('./components/ErrorBoundary'));

/**
 * 控制面板组件
 */
interface ControlPanelProps {
  currentRealm: RealmType;
  mode: InteractionMode;
  isAnimating: boolean;
  onModeChange: (mode: InteractionMode) => void;
  onAutoPlay: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentRealm,
  mode,
  isAnimating,
  onModeChange,
  onAutoPlay,
  onReset
}) => {
  const realmInfo = getRealmInfo(currentRealm);
  const currentStep = useCurrentStep();
  const totalSteps = useTotalSteps();

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm text-white p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-center">{realmInfo.name}</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2">{realmInfo.description}</p>
        <p className="text-xs text-gray-400">
          {mode === 'manual' ? realmInfo.instructions.manual : realmInfo.instructions.auto}
        </p>
      </div>

      {/* 进度显示 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>进度</span>
          <span>{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 模式切换 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">交互模式</label>
        <div className="flex space-x-2">
          <button
            onClick={() => onModeChange('manual')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              mode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            手动
          </button>
          <button
            onClick={() => onModeChange('auto')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              mode === 'auto'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            自动
          </button>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="space-y-2">
        <button
          onClick={onAutoPlay}
          disabled={isAnimating}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-2 px-4 rounded transition-all duration-200 font-medium"
        >
          {isAnimating ? '修真中...' : '一键修真'}
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-2 px-4 rounded transition-all duration-200 font-medium"
        >
          重置境界
        </button>
      </div>

      {/* 境界说明 */}
      <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
        <h4 className="text-sm font-semibold mb-1">修真要诀</h4>
        <p className="text-xs text-gray-400">
          {currentRealm === 'lianqi' && '感知天地灵气，开启经络之门'}
          {currentRealm === 'zhuji' && '筑建根基，经络贯通成环'}
          {currentRealm === 'jindan' && '凝聚金丹，三维经络网络'}
          {currentRealm === 'yuanying' && '元婴诞生，生命演化奥秘'}
          {currentRealm === 'huashen' && '神识化形，超越三维束缚'}
        </p>
      </div>
    </div>
  );
};

/**
 * 场景渲染组件
 */
interface SceneRendererProps {
  realm: RealmType;
}

const SceneRenderer: React.FC<SceneRendererProps> = ({ realm }) => {
  const { activateNode } = useAppStore();
  const { isAnimating, currentStep, animationProgress } = useAnimationState();

  const renderScene = () => {
    switch (realm) {
      case 'lianqi':
        return <LianQiScene 
          isAnimating={isAnimating}
          currentStep={currentStep}
          animationProgress={animationProgress}
          onNodeClick={activateNode} 
        />;
      case 'zhuji':
        return <ZhuJiScene 
          isAnimating={isAnimating}
          currentStep={currentStep}
          animationProgress={animationProgress}
          onNodeClick={activateNode} 
        />;
      case 'jindan':
        return <JinDanScene 
          isAnimating={isAnimating}
          currentStep={currentStep}
          animationProgress={animationProgress}
          onNodeClick={activateNode} 
        />;
      case 'yuanying':
        return <YuanYingScene 
          isAnimating={isAnimating}
          onCellClick={(x, y) => activateNode(`cell_${x}_${y}`)} 
        />;
      case 'huashen':
        return <HuaShenScene 
          isAnimating={isAnimating}
          animationProgress={animationProgress}
          geometryType="klein_bottle"
          onGeometryClick={activateNode} 
        />;
      default:
        return null;
    }
  };

  // 3D场景需要Canvas包装（但HuaShenScene已经有自己的Canvas）
  if (realm === 'jindan') {
    return (
      <div className="w-full h-full">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">加载中...</div>
          </div>
        }>
          <ErrorBoundary>
            <Canvas
              camera={{ position: [10, 10, 10], fov: 60 }}
              className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
              gl={{ antialias: true, alpha: false, preserveDrawingBuffer: false }}
              dpr={[1, 2]}
              performance={{ min: 0.5 }}
              frameloop="always"
            >
              <Suspense fallback={null}>
                {renderScene()}
              </Suspense>
            </Canvas>
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  }
  
  // HuaShenScene有自己的Canvas，不需要额外包装
  if (realm === 'huashen') {
    return (
      <div className="w-full h-full">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-lg">加载中...</div>
          </div>
        }>
          <ErrorBoundary>
            {renderScene()}
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  }

  // 2D场景直接渲染
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">加载中...</div>
        </div>
      }>
        {renderScene()}
      </Suspense>
    </div>
  );
};

/**
 * 主应用组件
 */
function App() {
  const {
    setCurrentRealm,
    setMode,
    startAutoAnimation,
    resetProgress,
    initializeRealm
  } = useAppStore();
  
  const currentRealm = useCurrentRealm();
  const mode = useInteractionMode();
  const { isAnimating } = useAnimationState();
  const realmState = useRealmState();
  const currentStep = useCurrentStep();
  const totalSteps = useTotalSteps();

  // 初始化应用
  useEffect(() => {
    initializeRealm('lianqi');
  }, [initializeRealm]);

  const handleRealmChange = (realm: RealmType) => {
    setCurrentRealm(realm);
    initializeRealm(realm);
  };

  const handleModeChange = (newMode: InteractionMode) => {
    setMode(newMode);
  };

  const handleAutoPlay = () => {
    startAutoAnimation();
  };

  const handleReset = () => {
    resetProgress();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* 标题栏 */}
      <header className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-4 shadow-lg border-b border-gray-700">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              修真模拟器：心智进化
            </h1>
            <p className="text-center text-gray-300 mt-2 text-sm">
              体验修真境界的经络运行复杂度，感受心智进化的奥妙
            </p>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-160px)]">
        {/* 左侧导航栏 - 增加宽度以更好展示境界选择 */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700 p-4 overflow-y-auto scrollbar-hide">
          <Suspense fallback={
            <div className="text-center text-gray-400">加载导航...</div>
          }>
            <RealmNavigation
              currentRealm={currentRealm}
              onRealmChange={handleRealmChange}
            />
          </Suspense>
        </div>

        {/* 中央场景区域 */}
        <div className="flex-1 relative">
          <SceneRenderer realm={currentRealm} />
          
          {/* 境界信息覆盖层 */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-600">
            <h3 className="font-semibold">{getRealmInfo(currentRealm).name}</h3>
            <p className="text-sm text-gray-300 mt-1">
              复杂度等级: {['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'][currentRealm === 'lianqi' ? 0 : currentRealm === 'zhuji' ? 1 : currentRealm === 'jindan' ? 2 : currentRealm === 'yuanying' ? 3 : 4]}
            </p>
          </div>
        </div>

        {/* 右侧控制面板 - 减少宽度以平衡布局 */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-700 p-4 overflow-y-auto scrollbar-hide">
          <ControlPanel
            currentRealm={currentRealm}
            mode={mode}
            isAnimating={isAnimating}
            onModeChange={handleModeChange}
            onAutoPlay={handleAutoPlay}
            onReset={handleReset}
          />
          
          {/* 境界感悟 */}
          <div className="mt-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-3 border border-indigo-600">
            <h4 className="text-white font-semibold mb-2 text-center text-sm">境界感悟</h4>
            <p className="text-xs text-indigo-100 text-center leading-relaxed">
              {currentRealm === 'lianqi' && '练气如种子萌芽，感知天地灵气，开启修真之门。'}
              {currentRealm === 'zhuji' && '筑基如建高楼，稳固根基，经络贯通成环。'}
              {currentRealm === 'jindan' && '金丹如明珠，凝聚精气神，三维网络立体运行。'}
              {currentRealm === 'yuanying' && '元婴如新生，生命演化，复杂系统自组织。'}
              {currentRealm === 'huashen' && '化神如蝶变，超越形体，高维空间自由遨游。'}
            </p>
          </div>
          
          {/* 修真要诀 */}
          <div className="mt-3 bg-gray-800 rounded-lg p-3 border border-gray-600">
            <h4 className="text-white font-semibold mb-2 text-center text-sm">修真要诀</h4>
            <ul className="space-y-1">
              {currentRealm === 'lianqi' && [
                '静心凝神，感知灵气',
                '调息吐纳，循环往复',
                '经络疏通，气血调和'
              ].map((tip, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {tip}
                </li>
              ))}
              {currentRealm === 'zhuji' && [
                '筑基炼体，强化根基',
                '内视观想，凝聚真元',
                '周天运转，贯通经脉'
              ].map((tip, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {tip}
                </li>
              ))}
              {currentRealm === 'jindan' && [
                '三花聚顶，五气朝元',
                '金丹凝结，神识外放',
                '天人合一，道法自然'
              ].map((tip, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                  {tip}
                </li>
              ))}
              {currentRealm === 'yuanying' && [
                '元婴出窍，神游太虚',
                '法则感悟，天地共鸣',
                '生死轮回，超脱束缚'
              ].map((tip, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  {tip}
                </li>
              ))}
              {currentRealm === 'huashen' && [
                '化神通玄，万法归一',
                '空间折叠，时间静止',
                '创世灭世，掌控乾坤'
              ].map((tip, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          {/* 修真统计 */}
          <div className="mt-3 bg-gray-800 rounded-lg p-3 border border-gray-600">
            <h4 className="text-white font-semibold mb-2 text-center text-sm">修真统计</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">当前境界:</span>
                <span className="text-xs text-white font-medium">{getRealmInfo(currentRealm).name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">修炼进度:</span>
                <span className="text-xs text-green-400">{Math.round(realmState.progress)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">激活节点:</span>
                <span className="text-xs text-blue-400">{realmState.activeNodes.length}/{totalSteps}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">当前步骤:</span>
                <span className="text-xs text-purple-400">{currentStep}/{totalSteps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-2">
        <div className="container mx-auto flex justify-between items-center text-sm text-gray-400">
          <span>当前境界: {getRealmInfo(currentRealm).name}</span>
          <span>模式: {mode === 'manual' ? '手动修真' : '自动修真'}</span>
          <span className={`${isAnimating ? 'text-green-400' : 'text-gray-400'}`}>
            {isAnimating ? '修真进行中...' : '等待修真'}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
