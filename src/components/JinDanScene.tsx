/**
 * 金丹期3D场景组件
 * 使用最基础的Three.js实现，避免所有primitive组件错误
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmInitialData, getRealmConfig } from '../data/realmConfigs';
import type { AcupointNode, JinDanSceneProps } from '../types';

// 简化的错误边界组件 - 只返回空的3D组件
class JinDanErrorBoundary extends React.Component<any, any> {
  private DEBUG = import.meta.env.DEV && import.meta.env.VITE_DEBUG_LOGS === 'true';
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (this.DEBUG) {
      console.error('JinDan Scene Error:', error, errorInfo);
    }
  }

  render() {
    if ((this.state as any).hasError) {
      // 返回空的3D组件，避免HTML元素在Canvas内部
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#666666" transparent opacity={0.3} />
          </mesh>
        </group>
      );
    }

    return (this.props as any).children;
  }
}

/**
 * 简单的3D节点组件 - 使用基础mesh
 */
interface SimpleNodeProps {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const SimpleNode: React.FC<SimpleNodeProps> = ({ position, color, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const m = meshRef.current;
    if (m) {
      m.rotation.y += 0.01;
      if (isActive) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
        m.scale.setScalar(pulse);
      } else {
        m.scale.setScalar(1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color={isActive ? '#FFD700' : color} />
    </mesh>
  );
};

/**
 * 简单的连接线组件
 */
interface SimpleLineProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
}

const SimpleLine: React.FC<SimpleLineProps> = ({ start, end, isActive }) => {
  const lineRef = useRef<THREE.Mesh>(null);
  
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];
  
  return (
    <mesh ref={lineRef} position={midPoint}>
      <boxGeometry args={[0.1, 0.1, 2]} />
      <meshBasicMaterial 
        color={isActive ? '#FFD700' : '#4A90E2'}
        transparent
        opacity={isActive ? 0.8 : 0.4}
      />
    </mesh>
  );
};

/**
 * 金丹核心组件 - 简化版本
 */
const SimpleCore: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const { isAnimating } = useAnimationState();

  useFrame((state) => {
    const m = coreRef.current;
    if (m) {
      m.rotation.x += 0.005;
      m.rotation.y += 0.01;
      
      if (isAnimating) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 1;
        m.scale.setScalar(pulse);
      } else {
        m.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

/**
 * 主要的金丹期场景组件内容
 */
function JinDanSceneContent({ onNodeClick }: JinDanSceneProps) {
  const realmState = useCurrentRealmState();
  const { isAnimating, animationProgress } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 生成简单的节点数据
  const nodes = useMemo(() => {
    const nodeData: Array<{ id: string; position: [number, number, number]; color: string; isActive: boolean; }> = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 5;
      nodeData.push({
        id: `node-${i}`,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 4
        ],
        color: '#4ECDC4',
        isActive: realmState.activeNodes.includes(`node-${i}`)
      });
    }
    return nodeData;
  }, [realmState.activeNodes]);
  
  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    activateNode(nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <group>
      {/* 基础光照 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* 金丹核心 */}
      <SimpleCore />
      
      {/* 简单节点 */}
      {nodes.map((node) => (
        <SimpleNode
          key={node.id}
          position={node.position}
          color={node.color}
          isActive={node.isActive}
          onClick={() => handleNodeClick(node.id)}
        />
      ))}
      
      {/* 简单连接线 */}
      {nodes.map((node, i) => 
        nodes.slice(i + 1).map((otherNode, j) => (
          <SimpleLine
            key={`line-${i}-${j}`}
            start={node.position}
            end={otherNode.position}
            isActive={node.isActive && otherNode.isActive}
          />
        ))
      )}
    </group>
  );
}

export default function JinDanScene(props: JinDanSceneProps) {
  return (
    <JinDanErrorBoundary>
      <JinDanSceneContent {...props} />
    </JinDanErrorBoundary>
  );
}