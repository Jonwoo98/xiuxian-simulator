/**
 * 练气期场景组件
 * 功能：2D穴位图可视化，基础经络连接，简单交互
 * 这是修真的入门境界，复杂度最低
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore, useCurrentRealmState, useAnimationState, useRealmNodes, useRealmPaths, useAnimationProgress } from '../store/useAppStore';
import type { AcupointNode, LianQiSceneProps } from '../types';

/**
 * 2D穴位节点组件
 */
interface AcupointNode2DComponentProps {
  node: AcupointNode;
  isActive: boolean;
  isAnimating: boolean;
  onClick: (nodeId: string) => void;
}

const AcupointNode2DComponent: React.FC<AcupointNode2DComponentProps> = ({
  node,
  isActive,
  isAnimating,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // 激活时的脉动效果
  useEffect(() => {
    if (isActive) {
      setPulseAnimation(true);
      const timer = setTimeout(() => setPulseAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // 根据节点类型获取样式
  const getNodeStyle = () => {
    const baseSize = node.size || 12;
    const size = isHovered ? baseSize * 1.2 : (isActive ? baseSize * 1.3 : baseSize);
    
    let color = '#94A3B8'; // 默认灰色
    let glowColor = '#94A3B8';
    let borderColor = '#FFFFFF30';
    
    if (isActive) {
      color = '#F59E0B'; // 激活时金色
      glowColor = '#F59E0B';
      borderColor = '#F59E0B';
    } else if (node.type === 'major') {
      color = '#EF4444'; // 主要穴位红色
      glowColor = '#EF4444';
    } else if (node.type === 'minor') {
      color = '#3B82F6'; // 次要穴位蓝色
      glowColor = '#3B82F6';
    }
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderColor: borderColor,
      borderWidth: isActive ? '3px' : '2px',
      boxShadow: isActive 
        ? `0 0 25px ${glowColor}, 0 0 50px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.3)` 
        : isHovered 
        ? `0 0 15px ${glowColor}` 
        : 'none',
      transform: pulseAnimation ? 'scale(1.8)' : (isActive ? 'scale(1.1)' : 'scale(1)'),
      opacity: isActive ? 1 : 0.8
    };
  };

  // 将绝对坐标转换为百分比坐标（假设容器尺寸为800x600）
  const containerWidth = 800;
  const containerHeight = 600;
  const xPercent = (node.x / containerWidth) * 100;
  const yPercent = (node.y / containerHeight) * 100;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 rounded-full border-2 ${
        isActive 
          ? 'border-yellow-400 hover:border-yellow-300' 
          : 'border-white/30 hover:border-white/60'
      }`}
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: 'translate(-50%, -50%)',
        ...getNodeStyle()
      }}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={node.name}
    >
      {/* 节点标签 */}
      {(isHovered || isActive) && (
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 ${
          isActive ? 'bg-yellow-600/90 text-white' : 'bg-black/80 text-white'
        } text-xs rounded whitespace-nowrap z-10`}>
          {node.name}
        </div>
      )}
      
      {/* 激活状态的内部光点 */}
      {isActive && (
        <>
          <div className="absolute inset-1 rounded-full bg-white/60 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-yellow-200/80 animate-pulse" />
        </>
      )}
      
      {/* 激活状态的外部光环 */}
      {isActive && (
        <div className="absolute -inset-2 rounded-full border border-yellow-400/50 animate-pulse" />
      )}
    </div>
  );
};

/**
 * 金色连接线组件 - 用于连接已激活的相邻穴位
 */
interface GoldenConnectionProps {
  start: AcupointNode;
  end: AcupointNode;
}

const GoldenConnection: React.FC<GoldenConnectionProps> = ({ start, end }) => {
  // 计算连接线的位置和角度
  const calculateLineStyle = () => {
    // 将绝对坐标转换为百分比坐标
    const containerWidth = 800;
    const containerHeight = 600;
    
    const startX = (start.x / containerWidth) * 100;
    const startY = (start.y / containerHeight) * 100;
    const endX = (end.x / containerWidth) * 100;
    const endY = (end.y / containerHeight) * 100;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    return {
      left: `${startX}%`,
      top: `${startY}%`,
      width: `${distance}%`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%'
    };
  };

  return (
    <div
      className="absolute h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg animate-pulse"
      style={{
        ...calculateLineStyle(),
        opacity: 1,
        boxShadow: '0 0 15px #F59E0B, 0 0 30px #F59E0B'
      }}
    >
      {/* 金色能量流动效果 */}
      <div className="absolute top-0 left-0 h-full w-6 bg-white/90 rounded-full animate-ping" />
      <div className="absolute top-0 left-0 h-full w-4 bg-yellow-200/80 rounded-full animate-pulse" />
    </div>
  );
};

/**
 * 经络连接线组件
 */
interface MeridianConnectionProps {
  start: AcupointNode;
  end: AcupointNode;
  isActive: boolean;
  animationProgress: number;
}

const MeridianConnection: React.FC<MeridianConnectionProps> = ({
  start,
  end,
  isActive,
  animationProgress
}) => {
  // 计算连接线的位置和角度
  const calculateLineStyle = () => {
    // 将绝对坐标转换为百分比坐标
    const containerWidth = 800;
    const containerHeight = 600;
    
    const startX = (start.x / containerWidth) * 100;
    const startY = (start.y / containerHeight) * 100;
    const endX = (end.x / containerWidth) * 100;
    const endY = (end.y / containerHeight) * 100;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    return {
      left: `${startX}%`,
      top: `${startY}%`,
      width: `${distance}%`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%'
    };
  };

  return (
    <div
      className={`absolute h-0.5 transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg' 
          : 'bg-blue-400/50'
      }`}
      style={{
        ...calculateLineStyle(),
        opacity: isActive ? 1 : 0.3,
        boxShadow: isActive ? '0 0 10px currentColor' : 'none'
      }}
    >
      {/* 能量流动效果 */}
      {isActive && (
        <div 
          className="absolute top-0 left-0 h-full w-4 bg-white/80 rounded-full animate-pulse"
          style={{
            left: `${animationProgress * 100}%`,
            transition: 'left 0.5s ease-in-out'
          }}
        />
      )}
    </div>
  );
};

/**
 * 人体经脉图组件 - 当所有穴位激活后显示
 */
interface MeridianMapProps {
  isVisible: boolean;
}

const MeridianMap: React.FC<MeridianMapProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 主要经脉网络 */}
      <div className="absolute inset-0 opacity-80">
        {/* 任脉 - 身体前面中线 */}
        <div className="absolute left-1/2 top-[12%] w-1 h-[76%] bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 transform -translate-x-1/2 animate-pulse shadow-lg" 
             style={{ boxShadow: '0 0 20px #F59E0B' }} />
        
        {/* 督脉 - 身体后面中线 */}
        <div className="absolute left-[62%] top-[12%] w-1 h-[76%] bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500 transform -translate-x-1/2 animate-pulse shadow-lg" 
             style={{ boxShadow: '0 0 20px #EA580C' }} />
        
        {/* 左右对称的经脉 */}
        {/* 左侧经脉 */}
        <div className="absolute left-[35%] top-[20%] w-0.5 h-[60%] bg-gradient-to-b from-blue-300 to-blue-500 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #3B82F6' }} />
        <div className="absolute left-[30%] top-[25%] w-0.5 h-[50%] bg-gradient-to-b from-green-300 to-green-500 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #10B981' }} />
        
        {/* 右侧经脉 */}
        <div className="absolute left-[65%] top-[20%] w-0.5 h-[60%] bg-gradient-to-b from-blue-300 to-blue-500 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #3B82F6' }} />
        <div className="absolute left-[70%] top-[25%] w-0.5 h-[50%] bg-gradient-to-b from-green-300 to-green-500 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #10B981' }} />
        
        {/* 横向连接经脉 */}
        <div className="absolute left-[30%] top-[30%] w-[40%] h-0.5 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #8B5CF6' }} />
        <div className="absolute left-[30%] top-[50%] w-[40%] h-0.5 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #8B5CF6' }} />
        <div className="absolute left-[30%] top-[70%] w-[40%] h-0.5 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 animate-pulse shadow-md" 
             style={{ boxShadow: '0 0 15px #8B5CF6' }} />
      </div>
      
      {/* 能量流动效果 */}
      <div className="absolute inset-0">
        {/* 中心能量核心 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 bg-yellow-400/30 rounded-full animate-spin" />
          <div className="absolute inset-4 bg-yellow-300/40 rounded-full animate-ping" />
          <div className="absolute inset-8 bg-yellow-200/60 rounded-full animate-pulse" />
        </div>
        
        {/* 能量光环 */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-orange-500/10 to-transparent animate-pulse" />
      </div>
      
      {/* 经脉图标题 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2 animate-pulse">✨ 经脉贯通 ✨</h3>
        <p className="text-lg text-yellow-300">天地灵气在体内自由流转</p>
      </div>
    </div>
  );
};

/**
 * 灵气粒子效果组件
 */
interface SpiritualParticleProps {
  x: number;
  y: number;
  delay: number;
}

const SpiritualParticle: React.FC<SpiritualParticleProps> = ({ x, y, delay }) => {
  return (
    <div
      className="absolute w-1 h-1 bg-blue-300 rounded-full animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: '2s'
      }}
    />
  );
};

/**
 * 练气期主场景组件
 */
const LianQiScene: React.FC<LianQiSceneProps> = ({ isAnimating: propIsAnimating, currentStep: propCurrentStep, animationProgress: propAnimationProgress, onNodeClick }) => {
  const realmState = useCurrentRealmState();
  const { activateNode } = useAppStore();
  const nodes = useRealmNodes();
  const paths = useRealmPaths();
  
  // 优先使用props传入的动画状态，如果没有则使用store中的状态
  const { isAnimating: storeIsAnimating, currentStep: storeCurrentStep } = useAnimationState();
  const storeAnimationProgress = useAnimationProgress();
  
  const isAnimating = propIsAnimating ?? storeIsAnimating;
  const currentStep = propCurrentStep ?? storeCurrentStep;
  const animationProgress = propAnimationProgress ?? storeAnimationProgress;
  
  // 灵气粒子状态
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  
  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    // 检查是否按顺序激活
    const currentActiveCount = realmState?.activeNodes?.length || 0;
    const targetNodeIndex = nodes.findIndex(node => node.id === nodeId);
    
    // 只允许激活下一个应该激活的节点
    if (targetNodeIndex !== currentActiveCount) {
      console.log(`节点 ${nodeId} 不能激活，当前应该激活第 ${currentActiveCount + 1} 个节点`);
      return;
    }
    
    // 检查节点是否已经激活
    if (realmState?.activeNodes?.includes(nodeId)) {
      console.log(`节点 ${nodeId} 已经激活`);
      return;
    }
    
    activateNode(nodeId);
    onNodeClick?.(nodeId);
  }, [activateNode, onNodeClick, realmState?.activeNodes, nodes]);

  // 生成灵气粒子
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };
    
    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // 自动动画效果
  useEffect(() => {
    if (isAnimating && currentStep < nodes.length) {
      const timer = setTimeout(() => {
        const nextNode = nodes[currentStep];
        if (nextNode) {
          handleNodeClick(nextNode.id);
        }
      }, 1500); // 练气期节奏较慢
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, nodes, handleNodeClick]);

  // 计算激活的节点
  const activeNodes = realmState?.activeNodes || [];
  const currentActiveCount = activeNodes.filter(Boolean).length;
  const allNodesActivated = currentActiveCount === nodes.length;
  const showMeridianMap = allNodesActivated;
  
  // 延迟显示完成弹窗，让用户先看到经脉图效果
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  
  useEffect(() => {
    if (allNodesActivated && !showCompletionPrompt) {
      // 延迟3秒显示完成弹窗，让用户先欣赏经脉图
      const timer = setTimeout(() => {
        setShowCompletionPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [allNodesActivated, showCompletionPrompt]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* 灵气粒子背景 */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <SpiritualParticle
            key={index}
            x={particle.x}
            y={particle.y}
            delay={particle.delay}
          />
        ))}
      </div>
      
      {/* 人体轮廓背景 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-64 h-96 border border-white/30 rounded-full" />
      </div>
      
      {/* 人体经脉图 - 当所有穴位激活后显示 */}
      <MeridianMap isVisible={showMeridianMap} />
      
      {/* 金色连接线 - 连接已激活的相邻穴位 */}
      <div className="absolute inset-0">
        {nodes.map((node, index) => {
          if (index === 0) return null; // 第一个节点没有前一个节点
          
          const prevNode = nodes[index - 1];
          const currentNodeActive = realmState?.activeNodes?.includes(node.id) || false;
          const prevNodeActive = realmState?.activeNodes?.includes(prevNode.id) || false;
          
          // 只有当前节点和前一个节点都激活时才显示金色连线
          if (!currentNodeActive || !prevNodeActive) return null;
          
          return (
            <GoldenConnection
              key={`golden-${prevNode.id}-${node.id}`}
              start={prevNode}
              end={node}
            />
          );
        })}
      </div>

      {/* 经络连接线：按照每条路径的节点序列，绘制相邻节点之间的连接段 */}
      <div className="absolute inset-0">
        {paths.flatMap((path) => {
          const segments: JSX.Element[] = [];
          for (let i = 1; i < (path.nodes?.length || 0); i++) {
            const fromId = path.nodes[i - 1];
            const toId = path.nodes[i];
            const startNode = nodes.find(n => n.id === fromId);
            const endNode = nodes.find(n => n.id === toId);
            if (!startNode || !endNode) continue;
            segments.push(
              <MeridianConnection
                key={`${path.id}-${fromId}-${toId}`}
                start={startNode}
                end={endNode}
                isActive={(realmState?.activeNodes?.includes(fromId) || false) && (realmState?.activeNodes?.includes(toId) || false)}
                animationProgress={animationProgress}
              />
            );
          }
          return segments;
        })}
      </div>
      
      {/* 穴位节点 */}
      <div className="absolute inset-0">
        {(nodes || []).map((node) => (
          <AcupointNode2DComponent
            key={node.id}
            node={node}
            isActive={realmState?.activeNodes?.includes(node.id) || false}
            isAnimating={isAnimating}
            onClick={handleNodeClick}
          />
        ))}
      </div>
      
      {/* 境界信息覆盖层 */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white p-4 rounded-lg border border-blue-500/30 max-w-xs">
        <h3 className="text-lg font-bold mb-2 text-blue-300">练气期</h3>
        <p className="text-sm text-gray-300 mb-2">
          感知天地灵气，开启修真之门
        </p>
        <div className="text-xs text-gray-400">
          <div>已激活穴位: {realmState?.activeNodes?.length || 0}/{nodes?.length || 0}</div>
          <div>修真进度: {(realmState?.progress || 0).toFixed(1)}%</div>
        </div>
      </div>
      
      {/* 修真指导 */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white p-4 rounded-lg border border-green-500/30 max-w-sm">
        <h4 className="text-sm font-semibold mb-2 text-green-300">修真要诀</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          {isAnimating 
            ? '灵气正在体内流转，感受经络的开启...' 
            : '点击穴位感知灵气，按顺序激活经络，观察能量在体内的流动。练气期是修真的基础，需要耐心感知天地间的灵气。'
          }
        </p>
      </div>
      
      {/* 能量流动效果 */}
      {(realmState?.activeNodes?.length || 0) > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 整体能量光晕 */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse" />
          
          {/* 中心能量核心 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-blue-400/30 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-blue-300/40 rounded-full animate-ping" />
          </div>
        </div>
      )}
      
      {/* 完成提示 - 延迟显示 */}
      {showCompletionPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4">练气期圆满！</h3>
            <p className="text-lg text-yellow-100 mb-6">
              感知天地灵气，踏入修真门径！
              <br />灵气初聚丹田，经络略有感应，
              <br />可以进入下一个修炼阶段了！
            </p>
            <div className="text-4xl animate-bounce">✨</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LianQiScene;