/**
 * 境界导航组件
 * 功能：境界切换、进度显示、境界信息展示
 */

import React from 'react';
import { getRealmInfo } from '../data/realmConfigs';
import { useCurrentRealmState } from '../store/useAppStore';
import type { RealmType, RealmNavigationProps } from '../types';

/**
 * 境界卡片组件
 */
interface RealmCardProps {
  realm: RealmType;
  isActive: boolean;
  progress: number;
  onClick: (realm: RealmType) => void;
}

const RealmCard: React.FC<RealmCardProps> = ({ 
  realm, 
  isActive, 
  progress, 
  onClick 
}) => {
  const realmInfo = getRealmInfo(realm);
  
  // 根据境界类型获取对应的图标和颜色
  const getRealmStyle = () => {
    switch (realm) {
      case 'lianqi':
        return {
          icon: '🌱',
          bgGradient: 'from-green-600 to-emerald-700',
          borderColor: 'border-green-500',
          textColor: 'text-green-100'
        };
      case 'zhuji':
        return {
          icon: '🏗️',
          bgGradient: 'from-blue-600 to-cyan-700',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-100'
        };
      case 'jindan':
        return {
          icon: '⚡',
          bgGradient: 'from-yellow-600 to-orange-700',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-100'
        };
      case 'yuanying':
        return {
          icon: '👶',
          bgGradient: 'from-purple-600 to-indigo-700',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-100'
        };
      case 'huashen':
        return {
          icon: '🌟',
          bgGradient: 'from-pink-600 to-rose-700',
          borderColor: 'border-pink-500',
          textColor: 'text-pink-100'
        };
      default:
        return {
          icon: '❓',
          bgGradient: 'from-gray-600 to-gray-700',
          borderColor: 'border-gray-500',
          textColor: 'text-gray-100'
        };
    }
  };

  const style = getRealmStyle();
  
  return (
    <div
      onClick={() => onClick(realm)}
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isActive 
          ? `bg-gradient-to-br ${style.bgGradient} ${style.borderColor} border-2 shadow-lg` 
          : 'bg-gray-800 border border-gray-600 hover:bg-gray-700'
        }
      `}
    >
      {/* 境界图标 */}
      <div className="text-2xl mb-2 text-center">
        {style.icon}
      </div>
      
      {/* 境界名称 */}
      <h3 className={`text-sm font-bold text-center mb-2 ${
        isActive ? style.textColor : 'text-white'
      }`}>
        {realmInfo.name}
      </h3>
      
      {/* 境界描述 */}
      <p className={`text-xs text-center mb-3 ${
        isActive ? style.textColor : 'text-gray-300'
      }`}>
        {realmInfo.shortDescription || realmInfo.description.substring(0, 30) + '...'}
      </p>
      
      {/* 进度条 */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            isActive 
              ? `bg-gradient-to-r ${style.bgGradient}` 
              : 'bg-gray-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 进度文字 */}
      <div className={`text-xs text-center ${
        isActive ? style.textColor : 'text-gray-400'
      }`}>
        {(progress || 0).toFixed(0)}% 完成
      </div>
      
      {/* 激活状态指示器 */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

/**
 * 境界统计组件
 */
interface RealmStatsProps {
  currentRealm: RealmType;
}

const RealmStats: React.FC<RealmStatsProps> = ({ currentRealm }) => {
  const realmState = useCurrentRealmState();
  
  const stats = {
    totalNodes: realmState?.nodes?.length || 0,
    activeNodes: realmState?.activeNodes?.length || 0,
    completedPaths: realmState?.completedPaths?.length || 0,
    progress: realmState?.progress || 0
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
      <h4 className="text-white font-semibold mb-3 text-center">修真统计</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">穴位节点</span>
          <span className="text-white">{stats.activeNodes}/{stats.totalNodes}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">经络路径</span>
          <span className="text-white">{stats.completedPaths}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">境界进度</span>
          <span className="text-white">{stats.progress.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* 整体进度条 */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 境界提示组件
 */
interface RealmTipsProps {
  currentRealm: RealmType;
}

const RealmTips: React.FC<RealmTipsProps> = ({ currentRealm }) => {
  const tips = {
    lianqi: [
      '点击穴位感知灵气',
      '按顺序激活经络',
      '观察能量流动'
    ],
    zhuji: [
      '连接相邻穴位',
      '形成经络回路',
      '稳固根基建设'
    ],
    jindan: [
      '体验3D经络网络',
      '观察金丹凝聚',
      '感受立体能量流'
    ],
    yuanying: [
      '观察生命演化',
      '理解复杂系统',
      '体验元婴诞生'
    ],
    huashen: [
      '超越三维限制',
      '感受高维几何',
      '体验神识化形'
    ]
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
      <h4 className="text-white font-semibold mb-3 text-center">修真要诀</h4>
      
      <ul className="space-y-2">
        {tips[currentRealm].map((tip, index) => (
          <li key={index} className="text-sm text-gray-300 flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * 主要的境界导航组件
 */
const RealmNavigation: React.FC<RealmNavigationProps> = ({ 
  currentRealm, 
  onRealmChange 
}) => {
  const realmState = useCurrentRealmState();
  
  // 所有境界列表
  const realms: RealmType[] = ['lianqi', 'zhuji', 'jindan', 'yuanying', 'huashen'];
  
  // 计算每个境界的进度（简化版本）
  const getRealmProgress = (realm: RealmType): number => {
    if (realm === currentRealm) {
      return realmState.progress;
    }
    // 其他境界显示模拟进度
    const realmIndex = realms.indexOf(realm);
    const currentIndex = realms.indexOf(currentRealm);
    
    if (realmIndex < currentIndex) {
      return 100; // 已完成的境界
    } else {
      return 0; // 未开始的境界
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">修真境界</h2>
        <p className="text-sm text-gray-400">选择境界开始修真之旅</p>
      </div>
      
      {/* 境界卡片列表 */}
      <div className="space-y-3">
        {realms.map((realm) => (
          <RealmCard
            key={realm}
            realm={realm}
            isActive={realm === currentRealm}
            progress={getRealmProgress(realm)}
            onClick={onRealmChange}
          />
        ))}
      </div>
      
      {/* 境界统计 */}
      <RealmStats currentRealm={currentRealm} />
      
      {/* 修真提示 */}
      <RealmTips currentRealm={currentRealm} />
      
      {/* 境界说明 */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 border border-indigo-600">
        <h4 className="text-white font-semibold mb-2 text-center">境界感悟</h4>
        <p className="text-sm text-indigo-100 text-center leading-relaxed">
          {currentRealm === 'lianqi' && '练气如种子萌芽，感知天地灵气，开启修真之门。'}
          {currentRealm === 'zhuji' && '筑基如建高楼，稳固根基，经络贯通成环。'}
          {currentRealm === 'jindan' && '金丹如明珠，凝聚精气神，三维网络立体运行。'}
          {currentRealm === 'yuanying' && '元婴如新生，生命演化，复杂系统自组织。'}
          {currentRealm === 'huashen' && '化神如蝶变，超越形体，高维空间自由遨游。'}
        </p>
      </div>
    </div>
  );
};

export default RealmNavigation;