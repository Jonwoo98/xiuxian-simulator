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
      

    </div>
  );
};

export default RealmNavigation;