/**
 * 元婴期场景组件
 * 功能：细胞自动机生命游戏，模拟元婴生命演化
 * 这是修真的高级境界，展示生命的复杂性和自组织特性
 */

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useAppStore, useCurrentRealmState, useAnimationState } from '../store/useAppStore';
import { getRealmConfig } from '../data/realmConfigs';
import type { YuanYingSceneProps, LifeGameCell, LifeGamePreset } from '../types';

/**
 * 生命游戏细胞组件
 */
interface LifeCellProps {
  cell: LifeGameCell;
  size: number;
  isHighlighted: boolean;
  onClick: (x: number, y: number) => void;
}

const LifeCell: React.FC<LifeCellProps> = ({ cell, size, isHighlighted, onClick }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // 细胞生命周期动画
  useEffect(() => {
    if (cell.isAlive) {
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [cell.isAlive]);

  // 获取细胞样式
  const getCellStyle = () => {
    let backgroundColor = '#1E293B'; // 死细胞深灰色
    let boxShadow = 'none';
    let transform = 'scale(1)';
    
    if (cell.isAlive) {
      // 根据年龄和能量等级变化颜色
      const ageRatio = Math.min(cell.age / 10, 1);
      const energyColors = [
        '#22D3EE', // 青色 - 新生
        '#06B6D4', // 蓝绿色 - 成长
        '#8B5CF6', // 紫色 - 成熟
        '#F59E0B'  // 金色 - 巅峰
      ];
      
      backgroundColor = energyColors[Math.min(Math.floor(ageRatio * 4), 3)];
      boxShadow = `0 0 ${8 + animationPhase * 2}px ${backgroundColor}`;
      transform = `scale(${0.8 + animationPhase * 0.05})`;
    }
    
    if (isHighlighted) {
      boxShadow += ', 0 0 15px #FBBF24';
      transform = 'scale(1.2)';
    }
    
    return {
      backgroundColor,
      boxShadow,
      transform,
      width: `${size}px`,
      height: `${size}px`
    };
  };

  return (
    <div
      className="transition-all duration-200 cursor-pointer border border-gray-600/30 hover:border-gray-400/50"
      style={getCellStyle()}
      onClick={() => onClick(cell.x, cell.y)}
      title={`位置: (${cell.x}, ${cell.y})\n状态: ${cell.isAlive ? '存活' : '死亡'}\n年龄: ${cell.age}\n邻居: ${cell.neighbors}`}
    >
      {/* 细胞核心 */}
      {cell.isAlive && (
        <div className="w-full h-full flex items-center justify-center">
          <div 
            className="w-1/2 h-1/2 bg-white/60 rounded-full animate-pulse"
            style={{
              animationDelay: `${animationPhase * 100}ms`
            }}
          />
        </div>
      )}
      
      {/* 年龄指示器 */}
      {cell.isAlive && cell.age > 5 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center font-bold">
          {Math.min(cell.age, 9)}
        </div>
      )}
    </div>
  );
};

/**
 * 生命统计面板组件
 */
interface LifeStatsProps {
  grid: LifeGameCell[][];
  generation: number;
  isRunning: boolean;
  speed: number;
}

const LifeStats: React.FC<LifeStatsProps> = ({ grid, generation, isRunning, speed }) => {
  const stats = useMemo(() => {
    let aliveCells = 0;
    let totalAge = 0;
    let maxAge = 0;
    let energyLevel = 0;
    
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.isAlive) {
          aliveCells++;
          totalAge += cell.age;
          maxAge = Math.max(maxAge, cell.age);
          energyLevel += Math.min(cell.age / 10, 1);
        }
      });
    });
    
    const avgAge = aliveCells > 0 ? totalAge / aliveCells : 0;
    const stability = aliveCells > 0 ? (energyLevel / aliveCells) * 100 : 0;
    
    return {
      aliveCells,
      avgAge: avgAge.toFixed(1),
      maxAge,
      stability: stability.toFixed(1)
    };
  }, [grid]);

  return (
    <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/40">
      <h4 className="text-sm font-semibold mb-3 text-cyan-300">元婴生命统计</h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-300">世代:</span>
          <span className="text-cyan-200 font-mono">{generation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">存活细胞:</span>
          <span className="text-green-300 font-mono">{stats.aliveCells}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">平均年龄:</span>
          <span className="text-yellow-300 font-mono">{stats.avgAge}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">最高年龄:</span>
          <span className="text-orange-300 font-mono">{stats.maxAge}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">稳定性:</span>
          <span className="text-purple-300 font-mono">{stats.stability}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">演化速度:</span>
          <span className="text-blue-300 font-mono">{speed}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">状态:</span>
          <span className={`font-mono ${isRunning ? 'text-green-400' : 'text-red-400'}`}>
            {isRunning ? '演化中' : '暂停'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 预设模式选择器
 */
interface PresetSelectorProps {
  presets: LifeGamePreset[];
  onSelectPreset: (preset: LifeGamePreset) => void;
  currentPreset: string | null;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ presets, onSelectPreset, currentPreset }) => {
  return (
    <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-purple-500/40">
      <h4 className="text-sm font-semibold mb-3 text-purple-300">元婴形态预设</h4>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelectPreset(preset)}
            className={`px-3 py-2 text-xs rounded border transition-all duration-200 ${
              currentPreset === preset.name
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
            }`}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 元婴期主场景组件
 */
const YuanYingScene: React.FC<YuanYingSceneProps> = ({ onCellClick }) => {
  const realmState = useCurrentRealmState();
  const { isAnimating } = useAnimationState();
  const { activateNode } = useAppStore();
  
  // 获取元婴期配置
  const config = getRealmConfig('yuanying');
  
  // 生命游戏状态
  const [grid, setGrid] = useState<LifeGameCell[][]>([]);
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [currentPreset, setCurrentPreset] = useState<string | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gridSize = typeof config.gridSize === 'object' ? Math.min(config.gridSize.width, config.gridSize.height) : (config.gridSize || 30);
  const cellSize = Math.floor(Math.min(600 / gridSize, 20));

  // 初始化网格
  const initializeGrid = useCallback(() => {
    const newGrid: LifeGameCell[][] = [];
    for (let x = 0; x < gridSize; x++) {
      newGrid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        newGrid[x][y] = {
          x,
          y,
          alive: false,
          isAlive: false,
          age: 0,
          neighbors: 0
        };
      }
    }
    setGrid(newGrid);
    setGeneration(0);
  }, [gridSize]);

  // 计算邻居数量
  const countNeighbors = useCallback((grid: LifeGameCell[][], x: number, y: number) => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          if (grid[nx][ny].isAlive) count++;
        }
      }
    }
    return count;
  }, [gridSize]);

  // 生命游戏规则
  const nextGeneration = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      
      // 计算所有细胞的邻居数量
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          newGrid[x][y].neighbors = countNeighbors(prevGrid, x, y);
        }
      }
      
      // 应用生命游戏规则
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const cell = newGrid[x][y];
          const neighbors = cell.neighbors;
          
          if (cell.isAlive) {
            // 存活细胞规则
            if (neighbors < 2 || neighbors > 3) {
              cell.alive = false;
              cell.isAlive = false;
              cell.age = 0;
            } else {
              cell.age++;
            }
          } else {
            // 死细胞规则
            if (neighbors === 3) {
              cell.alive = true;
              cell.isAlive = true;
              cell.age = 1;
            }
          }
        }
      }
      
      return newGrid;
    });
    
    setGeneration(prev => prev + 1);
  }, [gridSize, countNeighbors]);

  // 处理细胞点击
  const handleCellClick = useCallback((x: number, y: number) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      newGrid[x][y].alive = !newGrid[x][y].alive;
      newGrid[x][y].isAlive = !newGrid[x][y].isAlive;
      newGrid[x][y].age = newGrid[x][y].isAlive ? 1 : 0;
      return newGrid;
    });
    
    onCellClick?.(x, y);
    activateNode(`cell-${x}-${y}`);
  }, [onCellClick, activateNode]);

  // 应用预设
  const applyPreset = useCallback((preset: LifeGamePreset) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell, alive: false, isAlive: false, age: 0 })));
      
      const centerX = Math.floor(gridSize / 2);
      const centerY = Math.floor(gridSize / 2);
      
      preset.pattern.forEach(([dx, dy]) => {
        const x = centerX + dx;
        const y = centerY + dy;
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
          newGrid[x][y].alive = true;
          newGrid[x][y].isAlive = true;
          newGrid[x][y].age = 1;
        }
      });
      
      return newGrid;
    });
    
    setCurrentPreset(preset.name);
    setGeneration(0);
  }, [gridSize]);

  // 控制动画
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(nextGeneration, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, nextGeneration]);

  // 自动动画效果
  useEffect(() => {
    if (isAnimating) {
      setIsRunning(true);
      setSpeed(200);
    }
  }, [isAnimating]);

  // 初始化
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // 高亮活跃区域
  useEffect(() => {
    const newHighlighted = new Set<string>();
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.isAlive && cell.age > 3) {
          newHighlighted.add(`${cell.x}-${cell.y}`);
        }
      });
    });
    setHighlightedCells(newHighlighted);
  }, [grid]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900" />
      
      {/* 宇宙背景效果 */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* 主要内容区域 */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* 控制面板 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded border transition-all duration-200 ${
                isRunning
                  ? 'bg-red-600 border-red-500 text-white hover:bg-red-700'
                  : 'bg-green-600 border-green-500 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? '暂停演化' : '开始演化'}
            </button>
            
            <button
              onClick={initializeGrid}
              className="px-4 py-2 bg-gray-600 border border-gray-500 text-white rounded hover:bg-gray-700 transition-all duration-200"
            >
              重置
            </button>
            
            <button
              onClick={nextGeneration}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 border border-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              单步演化
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-white text-sm">速度:</label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-white text-sm w-12">{speed}ms</span>
          </div>
        </div>
        
        {/* 主要布局 */}
        <div className="flex-1 flex gap-4">
          {/* 生命游戏网格 */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              className="grid gap-0.5 p-4 bg-black/50 rounded-lg border border-cyan-500/30"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
              }}
            >
              {grid.map((row, x) =>
                row.map((cell, y) => (
                  <LifeCell
                    key={`${x}-${y}`}
                    cell={cell}
                    size={cellSize}
                    isHighlighted={highlightedCells.has(`${x}-${y}`)}
                    onClick={handleCellClick}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="w-64 space-y-4">
            {/* 统计面板 */}
            <LifeStats
              grid={grid}
              generation={generation}
              isRunning={isRunning}
              speed={speed}
            />
            
            {/* 预设选择器 */}
            <PresetSelector
              presets={config.presets ? Object.entries(config.presets).map(([name, pattern]) => ({
                name,
                pattern,
                description: `${name}形态`
              })) : []}
              onSelectPreset={applyPreset}
              currentPreset={currentPreset}
            />
            
            {/* 境界信息 */}
            <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-yellow-500/40">
              <h3 className="text-lg font-bold mb-2 text-yellow-300">元婴期</h3>
              <p className="text-sm text-gray-300 mb-3">
                孕育元婴，掌控生命奥秘
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>当前世代: {generation}</div>
                <div>修真进度: {realmState.progress.toFixed(1)}%</div>
                <div>生命复杂度: {highlightedCells.size > 10 ? '高' : highlightedCells.size > 5 ? '中' : '低'}</div>
              </div>
            </div>
            
            {/* 修真指导 */}
            <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-500/40">
              <h4 className="text-sm font-semibold mb-2 text-cyan-300">元婴要诀</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isRunning 
                  ? '元婴正在演化，观察生命的自组织过程...' 
                  : '元婴期需要理解生命的本质。点击细胞创造生命，选择预设观察不同的生命形态，让元婴在演化中成长。'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 元婴完成提示 */}
      {realmState.progress >= 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-8 rounded-lg border border-cyan-500 text-center">
            <h2 className="text-2xl font-bold mb-4">👶 元婴期圆满</h2>
            <p className="text-lg mb-4">恭喜！您已成功孕育元婴</p>
            <p className="text-sm text-cyan-200">掌握了生命奥秘，可进入化神期</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YuanYingScene;