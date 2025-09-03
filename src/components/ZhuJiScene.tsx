/**
 * 筑基期场景组件
 * 功能：多层次经络网络，复杂穴位系统，进阶交互
 * 相比练气期，筑基期的经络更加复杂，有主次经络之分
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmConfig, getRealmInitialData } from '../data/realmConfigs';
import type { AcupointNode, ZhuJiSceneProps } from '../types';

/**
 * 筑基期穴位节点组件（增强版）
 */
interface ZhuJiAcupointProps {
  node: AcupointNode;
  isActive: boolean;
  isAnimating: boolean;
  connectionLevel: number; // 连接层级
  onClick: (nodeId: string) => void;
}

const ZhuJiAcupoint: React.FC<ZhuJiAcupointProps> = ({
  node,
  isActive,
  isAnimating,
  connectionLevel,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(0);

  // 能量等级动画
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setEnergyLevel(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setEnergyLevel(0);
    }
  }, [isActive]);

  // 根据节点类型和状态获取样式
  const getNodeStyle = () => {
    const baseSize = node.size || 14;
    const sizeMultiplier = isHovered ? 1.3 : 1;
    const size = baseSize * sizeMultiplier * (1 + connectionLevel * 0.2);
    
    let color = '#64748B'; // 默认灰色
    let glowColor = '#64748B';
    let borderColor = '#94A3B8';
    
    if (isActive) {
      // 根据能量等级变化颜色
      const energyColors = [
        '#F59E0B', // 金色
        '#EF4444', // 红色
        '#8B5CF6', // 紫色
        '#06B6D4'  // 青色
      ];
      color = energyColors[energyLevel];
      glowColor = color;
      borderColor = '#FBBF24';
    } else if (node.type === 'major') {
      color = '#DC2626'; // 主要穴位深红色
      glowColor = '#DC2626';
      borderColor = '#FCA5A5';
    } else if (node.type === 'minor') {
      color = '#2563EB'; // 次要穴位深蓝色
      glowColor = '#2563EB';
      borderColor = '#93C5FD';
    }
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderColor: borderColor,
      boxShadow: isActive 
        ? `0 0 ${20 + energyLevel * 10}px ${glowColor}, 0 0 ${40 + energyLevel * 20}px ${glowColor}` 
        : isHovered 
        ? `0 0 15px ${glowColor}` 
        : `0 0 5px ${glowColor}`,
      transform: isActive ? `scale(${1 + energyLevel * 0.1})` : 'scale(1)'
    };
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 rounded-full border-2 hover:border-opacity-80"
      style={{
        left: `${(node.x / 800) * 100}%`,
        top: `${(node.y / 600) * 100}%`,
        transform: 'translate(-50%, -50%)',
        ...getNodeStyle(),
        zIndex: isActive ? 20 : 10
      }}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${node.name} (${node.type})`}
    >
      {/* 节点标签 */}
      {(isHovered || isActive) && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-30 border border-gray-600">
          <div className="font-semibold">{node.name}</div>
          <div className="text-gray-300 text-xs">连接层级: {connectionLevel}</div>
        </div>
      )}
      
      {/* 多层能量环 */}
      {isActive && (
        <>
          <div className="absolute inset-1 rounded-full bg-white/30 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-yellow-300/50 animate-pulse" />
          <div className="absolute inset-3 rounded-full bg-orange-400/40" style={{
            animation: `spin ${2 - energyLevel * 0.3}s linear infinite`
          }} />
        </>
      )}
      
      {/* 连接层级指示器 */}
      {connectionLevel > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {connectionLevel}
        </div>
      )}
    </div>
  );
};

/**
 * 筑基期金色连接线组件
 */
interface ZhuJiGoldenConnectionProps {
  start: AcupointNode;
  end: AcupointNode;
}

const ZhuJiGoldenConnection: React.FC<ZhuJiGoldenConnectionProps> = ({ start, end }) => {
  // 将像素坐标转换为百分比坐标（假设容器为800x600）
  const containerWidth = 800;
  const containerHeight = 600;
  
  const startXPercent = (start.x / containerWidth) * 100;
  const startYPercent = (start.y / containerHeight) * 100;
  const endXPercent = (end.x / containerWidth) * 100;
  const endYPercent = (end.y / containerHeight) * 100;
  
  const deltaX = endXPercent - startXPercent;
  const deltaY = endYPercent - startYPercent;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
  return (
    <div
      className="absolute origin-left"
      style={{
        left: `${startXPercent}%`,
        top: `${startYPercent}%`,
        width: `${length}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        boxShadow: '0 0 12px #fbbf24, 0 0 24px #f59e0b',
        zIndex: 15,
        opacity: 0.9
      }}
    />
  );
};

/**
 * 筑基期经络连接组件（增强版）
 */
interface ZhuJiMeridianProps {
  start: AcupointNode;
  end: AcupointNode;
  isActive: boolean;
  isPrimary: boolean; // 是否为主经络
  animationProgress: number;
  energyFlow: number; // 能量流动强度
}

const ZhuJiMeridian: React.FC<ZhuJiMeridianProps> = ({
  start,
  end,
  isActive,
  isPrimary,
  animationProgress,
  energyFlow
}) => {
  // 计算连接线的位置和角度
  const lineStyle = useMemo(() => {
    // 将像素坐标转换为百分比坐标（假设容器为800x600）
    const containerWidth = 800;
    const containerHeight = 600;
    
    const startXPercent = (start.x / containerWidth) * 100;
    const startYPercent = (start.y / containerHeight) * 100;
    const endXPercent = (end.x / containerWidth) * 100;
    const endYPercent = (end.y / containerHeight) * 100;
    
    const deltaX = endXPercent - startXPercent;
    const deltaY = endYPercent - startYPercent;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    return {
      left: `${startXPercent}%`,
      top: `${startYPercent}%`,
      width: `${distance}%`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 50%'
    };
  }, [start, end]);

  // 获取经络样式
  const getMeridianStyle = () => {
    const thickness = isPrimary ? 3 : 2;
    let gradient = 'bg-blue-400/40';
    
    if (isActive) {
      gradient = isPrimary 
        ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
        : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500';
    }
    
    return {
      height: `${thickness}px`,
      opacity: isActive ? 1 : 0.4,
      boxShadow: isActive 
        ? `0 0 ${10 + energyFlow * 5}px currentColor` 
        : 'none'
    };
  };

  return (
    <div
      className={`absolute transition-all duration-500 rounded-full ${
        isActive 
          ? (isPrimary 
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' 
            : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'
          )
          : 'bg-blue-400/40'
      }`}
      style={{
        ...lineStyle,
        ...getMeridianStyle()
      }}
    >
      {/* 能量流动粒子 */}
      {isActive && (
        <>
          {/* 主要能量流 */}
          <div 
            className={`absolute top-0 h-full w-6 rounded-full ${
              isPrimary ? 'bg-white/90' : 'bg-cyan-300/80'
            } animate-pulse`}
            style={{
              left: `${animationProgress * 100}%`,
              transition: 'left 0.8s ease-in-out'
            }}
          />
          
          {/* 次要能量流 */}
          <div 
            className="absolute top-0 h-full w-3 bg-yellow-200/60 rounded-full"
            style={{
              left: `${(animationProgress * 100 + 20) % 100}%`,
              transition: 'left 1s ease-in-out'
            }}
          />
          
          {/* 能量尾迹 */}
          {isPrimary && (
            <div 
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
              style={{
                left: `${(animationProgress * 100 - 10) % 100}%`,
                transition: 'left 0.6s ease-in-out'
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

/**
 * 筑基期能量场组件
 */
interface EnergyFieldProps {
  activeNodes: string[];
  totalNodes: number;
}

const EnergyField: React.FC<EnergyFieldProps> = ({ activeNodes, totalNodes }) => {
  const intensity = totalNodes > 0 && activeNodes.length > 0 ? Math.min(activeNodes.length / totalNodes, 1) : 0;
  const safeIntensity = isNaN(intensity) ? 0 : intensity;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 基础能量场 */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent"
        style={{
          opacity: safeIntensity,
          animation: `pulse ${Math.max(1, 3 - safeIntensity * 2)}s ease-in-out infinite`
        }}
      />
      
      {/* 高级能量场 */}
      {safeIntensity > 0.5 && (
        <div 
          className="absolute inset-0 bg-gradient-radial from-yellow-400/15 via-orange-500/10 to-transparent"
          style={{
            animation: `spin ${Math.max(1, 10 - safeIntensity * 5)}s linear infinite`
          }}
        />
      )}
      
      {/* 筑基完成能量场 */}
      {safeIntensity > 0.8 && (
        <div className="absolute inset-0 bg-gradient-radial from-gold-400/20 via-amber-500/15 to-transparent animate-pulse" />
      )}
    </div>
  );
};

/**
 * 筑基期主场景组件
 */
const ZhuJiScene: React.FC<ZhuJiSceneProps> = ({ onNodeClick }) => {
  const realmState = useCurrentRealmState();
  const { isAnimating, currentStep, animationProgress } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 获取筑基期配置
  const config = getRealmInitialData('zhuji');
  
  // 能量流动状态
  const [energyFlow, setEnergyFlow] = useState(0);
  
  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    console.log(`尝试激活节点: ${nodeId}`);
    console.log('当前境界状态:', {
      currentRealm: realmState?.currentRealm,
      activeNodes: realmState?.activeNodes,
      totalNodes: config?.nodes?.length || 0,
      progress: realmState?.progress
    });
    
    // 检查节点是否已经激活
    if (realmState?.activeNodes?.includes(nodeId)) {
      console.log(`节点 ${nodeId} 已经激活`);
      return;
    }
    
    // 检查是否按顺序激活
    const currentActiveCount = realmState?.activeNodes?.length || 0;
    const targetNodeIndex = (config?.nodes || []).findIndex(node => node.id === nodeId);
    
    console.log(`当前激活节点数: ${currentActiveCount}, 目标节点索引: ${targetNodeIndex}`);
    
    // 只允许激活下一个应该激活的节点且节点未被激活
    if (targetNodeIndex !== currentActiveCount) {
      console.log(`节点 ${nodeId} 不能激活，当前应该激活第 ${currentActiveCount + 1} 个节点`);
      return;
    }
    
    console.log(`激活节点: ${nodeId}`);
    activateNode(nodeId);
    onNodeClick?.(nodeId);
  }, [activateNode, onNodeClick, realmState?.activeNodes, config?.nodes]);

  // 移除重复的handleNodeClick函数，使用上面的useCallback版本

  // 能量流动动画
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyFlow(prev => (prev + 1) % 5);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  // 自动动画效果
  useEffect(() => {
    if (isAnimating && config?.nodes && currentStep < config.nodes.length) {
      const timer = setTimeout(() => {
        const nextNode = config.nodes[currentStep];
        if (nextNode) {
          handleNodeClick(nextNode.id);
        }
      }, 1200); // 筑基期节奏适中
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, config.nodes, handleNodeClick]);

  // 计算节点连接层级
  const getConnectionLevel = useCallback((nodeId: string) => {
    const activeIndex = (realmState?.activeNodes || []).indexOf(nodeId);
    return activeIndex >= 0 ? Math.floor(activeIndex / 3) : 0;
  }, [realmState?.activeNodes]);

  // 计算激活的节点
  const activeNodes = realmState?.activeNodes || [];
  const currentActiveCount = activeNodes.filter(Boolean).length;
  const totalNodes = config?.nodes?.length || 0;
  // 修复自动弹窗问题：只有当总节点数大于0且所有节点都激活时才认为完成
  const allNodesActivated = totalNodes > 0 && currentActiveCount === totalNodes && currentActiveCount > 0;
  
  // 调试信息
  console.log('筑基期渲染状态:', {
    currentActiveCount,
    totalNodes,
    allNodesActivated,
    activeNodes: realmState?.activeNodes,
    progress: realmState?.progress,
    currentRealm: realmState?.currentRealm
  });
  
  // 调试日志
  console.log('筑基期状态调试:', {
    activeNodes,
    currentActiveCount,
    totalNodes,
    allNodesActivated,
    configNodes: config?.nodes?.map(n => ({ id: n.id, name: n.name, x: n.x, y: n.y }))
  });
  
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

  // 生成经络连接
  const connections = useMemo(() => {
    const activeNodes = (config?.nodes || []).filter(node => 
      (realmState?.activeNodes || []).includes(node.id)
    );
    
    const connections = [];
    
    // 主经络连接（顺序连接）
    for (let i = 0; i < activeNodes.length - 1; i++) {
      connections.push({
        start: activeNodes[i],
        end: activeNodes[i + 1],
        isActive: true,
        isPrimary: true
      });
    }
    
    // 次经络连接（跨越连接）
    if (activeNodes.length >= 4) {
      for (let i = 0; i < activeNodes.length - 3; i += 2) {
        connections.push({
          start: activeNodes[i],
          end: activeNodes[i + 3],
          isActive: true,
          isPrimary: false
        });
      }
    }
    
    // 调试经络连接
    console.log('经络连接调试:', {
      activeNodesCount: activeNodes.length,
      connectionsCount: connections.length,
      activeNodes: activeNodes.map(n => ({ id: n.id, name: n.name, x: n.x, y: n.y })),
      connections: connections.map(c => ({
        start: { id: c.start.id, x: c.start.x, y: c.start.y },
        end: { id: c.end.id, x: c.end.x, y: c.end.y },
        isPrimary: c.isPrimary
      }))
    });
    
    return connections;
  }, [config?.nodes, realmState?.activeNodes]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900" />
      
      {/* 能量场效果 */}
      <EnergyField 
        activeNodes={realmState?.activeNodes || []} 
        totalNodes={config?.nodes?.length || 0} 
      />
      
      {/* 人体轮廓（更详细） */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        <div className="relative">
          {/* 主体轮廓 */}
          <div className="w-72 h-96 border-2 border-white/40 rounded-full" />
          {/* 经络主干 */}
          <div className="absolute top-8 left-1/2 w-0.5 h-80 bg-white/30 transform -translate-x-1/2" />
          <div className="absolute top-1/2 left-8 w-56 h-0.5 bg-white/30 transform -translate-y-1/2" />
        </div>
      </div>
      
      {/* 金色连接线 - 连接已激活的相邻穴位 */}
      <div className="absolute inset-0">
        {(config?.nodes || []).map((node, index) => {
          if (index === 0) return null; // 第一个节点没有前一个节点
          
          const prevNode = (config?.nodes || [])[index - 1];
          const currentNodeActive = realmState?.activeNodes?.includes(node.id) || false;
          const prevNodeActive = realmState?.activeNodes?.includes(prevNode.id) || false;
          
          // 只有当前节点和前一个节点都激活时才显示金色连线
          if (!currentNodeActive || !prevNodeActive) return null;
          
          return (
            <ZhuJiGoldenConnection
              key={`golden-${prevNode.id}-${node.id}`}
              start={prevNode}
              end={node}
            />
          );
        })}
      </div>

      {/* 经络连接线 */}
      <div className="absolute inset-0">
        {connections.map((connection, index) => (
          <ZhuJiMeridian
            key={`connection-${index}`}
            start={connection.start}
            end={connection.end}
            isActive={connection.isActive}
            isPrimary={connection.isPrimary}
            animationProgress={animationProgress}
            energyFlow={energyFlow}
          />
        ))}
      </div>
      
      {/* 穴位节点 */}
      <div className="absolute inset-0">
        {(config?.nodes || []).map((node) => (
          <ZhuJiAcupoint
            key={node.id}
            node={node}
            isActive={(realmState?.activeNodes || []).includes(node.id)}
            isAnimating={isAnimating}
            connectionLevel={getConnectionLevel(node.id)}
            onClick={handleNodeClick}
          />
        ))}
      </div>
      
      {/* 境界信息覆盖层 */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/40 max-w-xs z-20">
        <h3 className="text-lg font-bold mb-2 text-purple-300">筑基期</h3>
        <p className="text-sm text-gray-300 mb-3">
          构筑灵力根基，形成稳固经络网络
        </p>
        <div className="text-xs text-gray-400 space-y-1">
          <div>已激活穴位: {currentActiveCount}/{totalNodes}</div>
          <div>修真进度: {totalNodes > 0 ? ((currentActiveCount / totalNodes) * 100).toFixed(1) : 0.0}%</div>
          <div>经络层级: {currentActiveCount > 0 ? Math.max(...(realmState?.activeNodes || []).map(getConnectionLevel)) + 1 : 0}</div>
          <div>能量强度: {totalNodes > 0 ? ((currentActiveCount / totalNodes) * 100).toFixed(0) : 0}%</div>
        </div>
      </div>
      
      {/* 修真指导 */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-amber-500/40 max-w-sm">
        <h4 className="text-sm font-semibold mb-2 text-amber-300">筑基要诀</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          {isAnimating 
            ? '灵力正在构筑根基，感受经络网络的形成...' 
            : '筑基期需要构建稳固的灵力根基。按顺序激活穴位，观察主次经络的形成。当经络网络足够复杂时，将产生质的飞跃。'
          }
        </p>
      </div>
      
      {/* 筑基期经脉图 - 当所有穴位激活后显示 */}
      {allNodesActivated && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* 整体能量光晕 */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-amber-500/10 to-transparent animate-pulse" />
          
          {/* 中心能量核心 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 bg-purple-400/40 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-amber-300/50 rounded-full animate-ping" />
          </div>
          
          {/* 经络网络光效 */}
          <div className="absolute inset-0">
            {(config?.nodes || []).map((node, index) => (
              <div
                key={`energy-${node.id}`}
                className="absolute w-4 h-4 bg-amber-400/60 rounded-full animate-pulse"
                style={{
                  left: `${(node.x / 800) * 100}%`,
                  top: `${(node.y / 600) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 筑基完成提示 - 延迟显示 */}
      {showCompletionPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-purple-600 to-amber-600 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold text-white mb-4">筑基期圆满！</h3>
            <p className="text-lg text-purple-100 mb-6">
              恭喜！您已成功构筑灵力根基<br />
              经络网络已成型，灵力循环稳固，<br />
              可以进入下一个修炼阶段了！
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZhuJiScene;