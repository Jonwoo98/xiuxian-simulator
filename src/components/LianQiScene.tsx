/**
 * 练气期场景组件
 * 功能：2D穴位图可视化，基础经络连接，简单交互
 * 这是修真的入门境界，复杂度最低
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmConfig } from '../data/realmConfigs';
import type { AcupointNode2D, LianQiSceneProps } from '../types';

/**
 * 2D穴位节点组件
 */
interface AcupointNode2DComponentProps {
  node: AcupointNode2D;
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
    const size = isHovered ? baseSize * 1.2 : baseSize;
    
    let color = '#94A3B8'; // 默认灰色
    let glowColor = '#94A3B8';
    
    if (isActive) {
      color = '#F59E0B'; // 激活时金色
      glowColor = '#F59E0B';
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
      boxShadow: isActive 
        ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}` 
        : isHovered 
        ? `0 0 10px ${glowColor}` 
        : 'none',
      transform: pulseAnimation ? 'scale(1.5)' : 'scale(1)'
    };
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 rounded-full border-2 border-white/30 hover:border-white/60"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
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
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10">
          {node.name}
        </div>
      )}
      
      {/* 激活状态的内部光点 */}
      {isActive && (
        <div className="absolute inset-1 rounded-full bg-white/50 animate-ping" />
      )}
    </div>
  );
};

/**
 * 经络连接线组件
 */
interface MeridianConnectionProps {
  start: AcupointNode2D;
  end: AcupointNode2D;
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
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;
    
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
const LianQiScene: React.FC<LianQiSceneProps> = ({ onNodeClick }) => {
  const realmState = useCurrentRealmState();
  const { isAnimating, currentStep, animationProgress } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 获取练气期配置
  const config = getRealmConfig('lianqi');
  
  // 灵气粒子状态
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  
  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    activateNode(nodeId);
    onNodeClick?.(nodeId);
  }, [activateNode, onNodeClick]);

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
    if (isAnimating && currentStep < (config?.nodes?.length || 0)) {
      const timer = setTimeout(() => {
        const nextNode = config?.nodes?.[currentStep];
        if (nextNode) {
          handleNodeClick(nextNode.id);
        }
      }, 1500); // 练气期节奏较慢
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, config?.nodes, handleNodeClick]);

  // 获取激活的节点
  const activeNodes = (config?.nodes || []).filter(node => 
    realmState?.activeNodes?.includes(node.id) || false
  );

  // 生成经络连接
  const connections = [];
  for (let i = 0; i < activeNodes.length - 1; i++) {
    connections.push({
      start: activeNodes[i],
      end: activeNodes[i + 1],
      isActive: true
    });
  }

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
      
      {/* 经络连接线 */}
      <div className="absolute inset-0">
        {connections.map((connection, index) => (
          <MeridianConnection
            key={`connection-${index}`}
            start={connection.start}
            end={connection.end}
            isActive={connection.isActive}
            animationProgress={animationProgress}
          />
        ))}
      </div>
      
      {/* 穴位节点 */}
      <div className="absolute inset-0">
        {(config?.nodes || []).map((node) => (
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
          <div>已激活穴位: {realmState?.activeNodes?.length || 0}/{config?.nodes?.length || 0}</div>
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
      
      {/* 修真完成提示 */}
      {(realmState?.progress || 0) >= 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg border border-green-500 text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 练气期圆满</h2>
            <p className="text-lg mb-4">恭喜！您已成功感知天地灵气</p>
            <p className="text-sm text-green-200">可以进入下一境界：筑基期</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LianQiScene;