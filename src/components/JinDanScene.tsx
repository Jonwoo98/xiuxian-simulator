/**
 * 金丹期3D场景组件
 * 核心功能：3D球状经络网络可视化，自动路径演示动画
 * 使用React Three Fiber实现3D渲染
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmConfig } from '../data/realmConfigs';
import type { AcupointNode, JinDanSceneProps } from '../types';

/**
 * 3D经络节点组件
 */
interface Node3DProps {
  node: AcupointNode;
  isActive: boolean;
  isAnimating: boolean;
  animationProgress: number;
  onClick: (nodeId: string) => void;
}

const Node3D: React.FC<Node3DProps> = ({ 
  node, 
  isActive, 
  isAnimating, 
  animationProgress, 
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // 节点动画效果
  useFrame((state) => {
    if (meshRef.current) {
      // 基础旋转
      meshRef.current.rotation.y += 0.01;
      
      // 激活状态的脉动效果
      if (isActive) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
        meshRef.current.scale.setScalar(pulse);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }

    // 光晕效果
    if (glowRef.current) {
      glowRef.current.rotation.x += 0.02;
      glowRef.current.rotation.z += 0.01;
      
      if (isActive) {
        const glowPulse = Math.sin(state.clock.elapsedTime * 6) * 0.3 + 0.7;
        glowRef.current.scale.setScalar(glowPulse * 2);
      }
    }
  });

  // 根据节点类型确定颜色
  const getNodeColor = () => {
    if (isActive) return '#FFD700'; // 金色
    switch (node.type) {
      case 'major': return '#FF6B6B'; // 红色 - 主要穴位
      case 'minor': return '#4ECDC4'; // 青色 - 次要穴位
      case 'special': return '#45B7D1'; // 蓝色 - 特殊穴位
      default: return '#95A5A6'; // 灰色
    }
  };

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* 主节点 */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(node.id)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[node.size || 0.3, 16, 16]} />
        <meshPhongMaterial 
          color={getNodeColor()}
          emissive={isActive ? '#FFD700' : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
          shininess={100}
        />
      </mesh>

      {/* 激活状态的光晕效果 */}
      {isActive && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshBasicMaterial 
            color="#FFD700"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 节点标签 */}
      <Text
        position={[0, node.size ? node.size + 0.5 : 0.8, 0]}
        fontSize={0.2}
        color={isActive ? '#FFD700' : '#FFFFFF'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/chinese-font.woff"
      >
        {node.name}
      </Text>
    </group>
  );
};

/**
 * 3D经络连接线组件
 */
interface Connection3DProps {
  start: AcupointNode;
  end: AcupointNode;
  isActive: boolean;
  animationProgress: number;
}

const Connection3D: React.FC<Connection3DProps> = ({ 
  start, 
  end, 
  isActive, 
  animationProgress 
}) => {
  const lineRef = useRef<THREE.Group>(null);
  
  // 创建连接线的点
  const points = useMemo(() => {
    const startPoint = new THREE.Vector3(start.x, start.y, start.z);
    const endPoint = new THREE.Vector3(end.x, end.y, end.z);
    
    // 创建贝塞尔曲线以模拟经络的自然弯曲
    const midPoint = startPoint.clone().lerp(endPoint, 0.5);
    midPoint.y += Math.random() * 2 - 1; // 添加随机高度变化
    
    const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
    return curve.getPoints(20);
  }, [start, end]);

  // 动画效果
  useFrame(() => {
    if (lineRef.current && isActive) {
      // 简单的旋转动画效果
      lineRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={lineRef}>
      <Line
        points={points}
        color={isActive ? '#FFD700' : '#4A90E2'}
        lineWidth={isActive ? 3 : 1}
        transparent
        opacity={isActive ? 0.8 : 0.4}
      />
    </group>
  );
};

/**
 * 金丹核心组件
 */
const JinDanCore: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const { isAnimating } = useAnimationState();

  useFrame((state) => {
    if (coreRef.current) {
      // 金丹核心的旋转
      coreRef.current.rotation.x += 0.005;
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.z += 0.003;
      
      // 修真时的特殊效果
      if (isAnimating) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 1;
        coreRef.current.scale.setScalar(pulse);
      } else {
        coreRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 金丹核心 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial 
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.2}
          shininess={100}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* 外层能量环 */}
      {[2.5, 3.5, 4.5].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.1, 8, 32]} />
          <meshBasicMaterial 
            color={isAnimating ? '#FFD700' : '#FFA500'}
            transparent
            opacity={0.3 - index * 0.1}
          />
        </mesh>
      ))}
      
      {/* 金丹标识 */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.5}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/chinese-font.woff"
      >
        金丹
      </Text>
    </group>
  );
};

/**
 * 主要的金丹期场景组件
 */
const JinDanScene: React.FC<JinDanSceneProps> = ({ onNodeClick }) => {
  const realmState = useCurrentRealmState();
  const { isAnimating, currentStep, animationProgress } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 获取金丹期配置
  const config = getRealmConfig('jindan');
  
  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    activateNode(nodeId);
    onNodeClick?.(nodeId);
  };

  // 生成3D球状分布的节点
  const nodes3D = useMemo(() => {
    if (!config.nodes3D) return [];
    
    return config.nodes3D.map(node => ({
      ...node,
      isActive: realmState.activeNodes.includes(node.id)
    }));
  }, [config.nodes3D, realmState.activeNodes]);

  // 生成连接线
  const connections = useMemo(() => {
    const result: Array<{ start: AcupointNode; end: AcupointNode; isActive: boolean }> = [];
    
    nodes3D.forEach((node, i) => {
      nodes3D.forEach((otherNode, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) +
            Math.pow(node.y - otherNode.y, 2) +
            Math.pow(node.z - otherNode.z, 2)
          );
          
          // 只连接距离适中的节点，形成网络结构
          if (distance < 6 && distance > 2) {
            result.push({
              start: node,
              end: otherNode,
              isActive: node.isActive && otherNode.isActive
            });
          }
        }
      });
    });
    
    return result;
  }, [nodes3D]);

  // 自动动画效果
  useEffect(() => {
    if (isAnimating && currentStep < nodes3D.length) {
      const timer = setTimeout(() => {
        const nextNode = nodes3D[currentStep];
        if (nextNode) {
          handleNodeClick(nextNode.id);
        }
      }, 1000); // 每秒激活一个节点
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, nodes3D]);

  return (
    <group>
      {/* 环境光效 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#FFD700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
      
      {/* 金丹核心 */}
      <JinDanCore />
      
      {/* 3D节点 */}
      {nodes3D.map((node) => (
        <Node3D
          key={node.id}
          node={node}
          isActive={node.isActive}
          isAnimating={isAnimating}
          animationProgress={animationProgress}
          onClick={handleNodeClick}
        />
      ))}
      
      {/* 连接线 */}
      {connections.map((connection, index) => (
        <Connection3D
          key={`connection-${index}`}
          start={connection.start}
          end={connection.end}
          isActive={connection.isActive}
          animationProgress={animationProgress}
        />
      ))}
      
      {/* 背景粒子效果 */}
      <group>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 50;
          const y = (Math.random() - 0.5) * 50;
          const z = (Math.random() - 0.5) * 50;
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.05, 4, 4]} />
              <meshBasicMaterial 
                color="#4A90E2"
                transparent
                opacity={0.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* 境界说明文字 */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.8}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        font="/fonts/chinese-font.woff"
      >
        金丹期 - 三维经络网络
      </Text>
      
      <Text
        position={[0, 7, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/chinese-font.woff"
      >
        凝聚金丹，经络立体化运行
      </Text>
    </group>
  );
};

export default JinDanScene;