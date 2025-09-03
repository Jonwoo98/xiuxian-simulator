/**
 * 化神期场景组件
 * 功能：高维几何体3D可视化，复杂空间变换，终极修真境界
 * 这是修真的最高境界，展示空间、时间和维度的奥秘
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmConfig } from '../data/realmConfigs';
import type { HuaShenSceneProps, GeometryType } from '../types';

/**
 * 高维几何体组件
 */
interface HighDimensionalGeometryProps {
  geometryType: GeometryType;
  position: [number, number, number];
  isActive: boolean;
  animationPhase: number;
  onClick: () => void;
}

const HighDimensionalGeometry: React.FC<HighDimensionalGeometryProps> = ({
  geometryType,
  position,
  isActive,
  animationPhase,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // 动画效果
  useFrame((state) => {
    if (meshRef.current) {
      // 基础旋转
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.z += 0.005;
      
      // 激活状态的特殊动画
      if (isActive) {
        const time = state.clock.getElapsedTime();
        meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
        meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.5;
        
        // 高维变换效果
        const phase = animationPhase * Math.PI * 2;
        meshRef.current.rotation.x += Math.sin(phase) * 0.02;
        meshRef.current.rotation.y += Math.cos(phase) * 0.02;
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
        meshRef.current.position.y = position[1];
      }
    }
  });

  // 根据几何类型获取材质
  const getMaterial = () => {
    const baseColor = isActive ? '#FFD700' : hovered ? '#FF6B6B' : '#4ECDC4';
    const emissive = isActive ? '#FF4500' : hovered ? '#FF1744' : '#006064';
    
    return (
      <meshStandardMaterial
        color={baseColor}
        emissive={emissive}
        emissiveIntensity={isActive ? 0.5 : hovered ? 0.3 : 0.1}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={isActive ? 0.9 : 0.7}
      />
    );
  };

  // 根据几何类型渲染不同的几何体
  const renderGeometry = () => {
    const size = isActive ? 1.5 : 1;
    
    switch (geometryType) {
      case 'sphere':
        return (
          <>
            <sphereGeometry args={[size, 32, 32]} />
            {getMaterial()}
          </>
        );
      case 'cube':
        return (
          <>
            <boxGeometry args={[size, size, size]} />
            {getMaterial()}
          </>
        );
      case 'octahedron':
        return (
          <>
            <octahedronGeometry args={[size]} />
            {getMaterial()}
          </>
        );
      case 'icosahedron':
        return (
          <>
            <icosahedronGeometry args={[size]} />
            {getMaterial()}
          </>
        );
      case 'dodecahedron':
        return (
          <>
            <dodecahedronGeometry args={[size]} />
            {getMaterial()}
          </>
        );
      default:
        return (
          <>
            <sphereGeometry args={[size, 32, 32]} />
            {getMaterial()}
          </>
        );
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {renderGeometry()}
      </mesh>
      
      {/* 能量光环 */}
      {isActive && (
        <group>
          {[1.5, 2, 2.5].map((radius, index) => (
            <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.05, 8, 32]} />
              <meshBasicMaterial
                color={`hsl(${60 + index * 30}, 100%, 50%)`}
                transparent
                opacity={0.6 - index * 0.15}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* 几何体标签 - 移除Text组件以避免drei依赖 */}
    </group>
  );
};

/**
 * 维度连接线组件
 */
interface DimensionalConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
  animationProgress: number;
}

const DimensionalConnection: React.FC<DimensionalConnectionProps> = ({
  start,
  end,
  isActive,
  animationProgress
}) => {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  
  // 创建连接线的点
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 2,
        (start[2] + end[2]) / 2
      ),
      endVec
    );
    return curve.getPoints(50);
  }, [start, end]);

  useFrame(() => {
    if (lineRef.current && isActive) {
      // 动态更新连接线的可见部分
      const visiblePoints = Math.floor(points.length * animationProgress);
      const positions = new Float32Array(visiblePoints * 3);
      
      for (let i = 0; i < visiblePoints; i++) {
        positions[i * 3] = points[i].x;
        positions[i * 3 + 1] = points[i].y;
        positions[i * 3 + 2] = points[i].z;
      }
      
      lineRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  });

  return (
    <line>
      <bufferGeometry ref={lineRef}>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={isActive ? '#FFD700' : '#4ECDC4'}
        transparent
        opacity={isActive ? 0.8 : 0.3}
      />
    </line>
  );
};

/**
 * 空间扭曲效果组件
 */
const SpaceDistortion: React.FC<{ intensity: number }> = ({ intensity }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  // 创建粒子系统
  const particleCount = 1000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // 空间扭曲效果
        const distortion = intensity * Math.sin(time + x * 0.1 + y * 0.1 + z * 0.1);
        positions[i3 + 1] += distortion * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.001 * intensity;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFFFFF"
        size={0.05}
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

/**
 * 化神期3D场景内容
 */
const HuaShenSceneContent: React.FC<{
  onGeometryClick: (geometryType: GeometryType) => void;
  activeGeometries: GeometryType[];
  animationProgress: number;
}> = ({ onGeometryClick, activeGeometries, animationProgress }) => {
  const { camera } = useThree();
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // 几何体配置
  const geometries: Array<{
    type: GeometryType;
    position: [number, number, number];
  }> = [
    { type: 'sphere', position: [0, 0, 0] },
    { type: 'cube', position: [4, 2, 0] },
    { type: 'octahedron', position: [-4, 2, 0] },
    { type: 'icosahedron', position: [2, -2, 3] },
    { type: 'dodecahedron', position: [-2, -2, 3] }
  ];

  // 动画相位更新
  useFrame(() => {
    setAnimationPhase(prev => (prev + 0.01) % 1);
  });

  // 相机动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.1) * 10;
    camera.position.z = Math.cos(time * 0.1) * 10;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5} 
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[0, 10, 0]} 
        intensity={0.8} 
        color="#9333ea"
        decay={2}
      />
      
      {/* 空间扭曲效果 */}
      <SpaceDistortion intensity={activeGeometries.length} />
      
      {/* 几何体 */}
      {geometries.map((geometry, index) => (
        <HighDimensionalGeometry
          key={geometry.type}
          geometryType={geometry.type}
          position={geometry.position}
          isActive={activeGeometries.includes(geometry.type)}
          animationPhase={animationPhase}
          onClick={() => onGeometryClick(geometry.type)}
        />
      ))}
      
      {/* 维度连接线 */}
      {activeGeometries.length > 1 && (
        <>
          {geometries.slice(0, activeGeometries.length - 1).map((geometry, index) => {
            const nextGeometry = geometries[index + 1];
            return (
              <DimensionalConnection
                key={`connection-${index}`}
                start={geometry.position}
                end={nextGeometry.position}
                isActive={true}
                animationProgress={animationProgress}
              />
            );
          })}
        </>
      )}
      
      {/* 中心能量核心 - 移除Text和OrbitControls组件以避免drei依赖 */}
      {activeGeometries.length >= 3 && (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </group>
      )}
    </>
  );
};

/**
 * 哲学文本显示组件
 */
interface PhilosophyTextProps {
  texts: string[];
  currentIndex: number;
}

const PhilosophyText: React.FC<PhilosophyTextProps> = ({ texts, currentIndex }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  
  // 打字机效果
  useEffect(() => {
    if (currentIndex < texts.length) {
      const text = texts[currentIndex];
      if (charIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(text.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [texts, currentIndex, charIndex]);
  
  // 重置文本
  useEffect(() => {
    setDisplayText('');
    setCharIndex(0);
  }, [currentIndex]);

  return (
    <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-gold-500/40 max-w-md">
      <h4 className="text-sm font-semibold mb-2 text-gold-300">化神感悟</h4>
      <p className="text-xs text-gray-300 leading-relaxed min-h-[4rem]">
        {displayText}
        <span className="animate-pulse">|</span>
      </p>
      <div className="text-xs text-gray-500 mt-2">
        {currentIndex + 1} / {texts.length}
      </div>
    </div>
  );
};

/**
 * 化神期主场景组件
 */
const HuaShenScene: React.FC<HuaShenSceneProps> = ({ onGeometryClick }) => {
  const realmState = useCurrentRealmState();
  const { isAnimating, animationProgress } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 获取化神期配置
  const config = getRealmConfig('huashen');
  
  // 激活的几何体
  const [activeGeometries, setActiveGeometries] = useState<GeometryType[]>([]);
  const [philosophyIndex, setPhilosophyIndex] = useState(0);
  
  // 处理几何体点击
  const handleGeometryClick = useCallback((geometryType: GeometryType) => {
    if (!activeGeometries.includes(geometryType)) {
      setActiveGeometries(prev => [...prev, geometryType]);
      activateNode(`geometry-${geometryType}`);
      onGeometryClick?.(geometryType);
    }
  }, [activeGeometries, activateNode, onGeometryClick]);

  // 自动动画效果
  useEffect(() => {
    if (isAnimating) {
      const geometryTypes: GeometryType[] = ['sphere', 'cube', 'octahedron', 'icosahedron', 'dodecahedron'];
      const timer = setTimeout(() => {
        if (activeGeometries.length < geometryTypes.length) {
          const nextGeometry = geometryTypes[activeGeometries.length];
          handleGeometryClick(nextGeometry);
        }
      }, 2000); // 化神期节奏最慢，需要深度思考
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, activeGeometries.length, handleGeometryClick]);

  // 哲学文本切换
  useEffect(() => {
    if (activeGeometries.length > 0) {
      const interval = setInterval(() => {
        setPhilosophyIndex(prev => (prev + 1) % (config.philosophyTexts?.length || 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeGeometries.length, config.philosophyTexts]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 8, 8], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0F0F23, #1A1A2E, #16213E)' }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
        <HuaShenSceneContent
          onGeometryClick={handleGeometryClick}
          activeGeometries={activeGeometries}
          animationProgress={animationProgress}
        />
      </Canvas>
      
      {/* UI 覆盖层 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 境界信息 */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/40 max-w-xs pointer-events-auto">
          <h3 className="text-lg font-bold mb-2 text-purple-300">化神期</h3>
          <p className="text-sm text-gray-300 mb-3">
            超越形体，掌控空间维度
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <div>已激活几何体: {activeGeometries.length}/5</div>
            <div>修真进度: {realmState.progress.toFixed(1)}%</div>
            <div>维度理解: {activeGeometries.length >= 3 ? '高维' : activeGeometries.length >= 2 ? '三维' : '二维'}</div>
            <div>空间掌控: {(activeGeometries.length * 20).toFixed(0)}%</div>
          </div>
        </div>
        
        {/* 哲学文本 */}
        {activeGeometries.length > 0 && config.philosophyTexts && (
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <PhilosophyText
              texts={config.philosophyTexts}
              currentIndex={philosophyIndex}
            />
          </div>
        )}
        
        {/* 几何体状态指示器 */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/40 pointer-events-auto">
          <h4 className="text-sm font-semibold mb-2 text-cyan-300">几何体状态</h4>
          <div className="space-y-1 text-xs">
            {['sphere', 'cube', 'octahedron', 'icosahedron', 'dodecahedron'].map((type) => (
              <div key={type} className="flex justify-between">
                <span className="text-gray-300 capitalize">{type}:</span>
                <span className={`font-mono ${
                  activeGeometries.includes(type as GeometryType) 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {activeGeometries.includes(type as GeometryType) ? '已激活' : '未激活'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 操作提示 */}
        {activeGeometries.length === 0 && (
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-yellow-500/40 pointer-events-auto">
            <h4 className="text-sm font-semibold mb-2 text-yellow-300">化神指引</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              点击3D空间中的几何体来激活它们。每个几何体代表不同的空间维度理解。
              使用鼠标拖拽旋转视角，滚轮缩放。
            </p>
          </div>
        )}
      </div>
      
      {/* 化神完成提示 */}
      {realmState.progress >= 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-purple-600 via-gold-500 to-cyan-600 text-white p-8 rounded-lg border border-gold-500 text-center">
            <h2 className="text-3xl font-bold mb-4">🌟 化神期圆满</h2>
            <p className="text-xl mb-4">恭喜！您已超越形体，掌控空间维度</p>
            <p className="text-lg text-gold-200 mb-2">修真之路已达巅峰</p>
            <p className="text-sm text-purple-200">您已成为真正的修真大能</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HuaShenScene;