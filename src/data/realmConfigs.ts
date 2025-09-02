/**
 * 修真模拟器境界配置数据
 * 包含五个境界的详细配置信息、穴位节点、经络路径等
 */

import type {
  RealmType,
  RealmConfig,
  RealmInfo,
  AcupointNode,
  AcupointNode2D,
  MeridianPath,
  LianQiConfig,
  ZhuJiConfig,
  JinDanConfig,
  YuanYingConfig,
  HuaShenConfig
} from '../types';

/**
 * 境界基础信息配置
 */
export const realmConfigs: Record<RealmType, RealmConfig> = {
  lianqi: {
    id: 'lianqi',
    name: '练气期',
    description: '修真入门，感知天地灵气，开启经络',
    complexityLevel: 1,
    visualizationType: '2d'
  },
  zhuji: {
    id: 'zhuji',
    name: '筑基期',
    description: '筑建根基，经络贯通，形成循环',
    complexityLevel: 2,
    visualizationType: '2d'
  },
  jindan: {
    id: 'jindan',
    name: '金丹期',
    description: '凝聚金丹，三维经络网络，复杂运行',
    complexityLevel: 3,
    visualizationType: '3d'
  },
  yuanying: {
    id: 'yuanying',
    name: '元婴期',
    description: '元婴诞生，生命演化，细胞自动机',
    complexityLevel: 4,
    visualizationType: 'grid'
  },
  huashen: {
    id: 'huashen',
    name: '化神期',
    description: '神识化形，高维几何，超越三维',
    complexityLevel: 5,
    visualizationType: '3d'
  }
};

/**
 * 境界详细信息
 */
export const realmInfos: Record<RealmType, RealmInfo> = {
  lianqi: {
    id: 'lianqi',
    name: '练气期',
    description: '修真的起始阶段，通过冥想和呼吸法感知天地间的灵气，逐步开启身体的经络系统。',
    shortDescription: '感知灵气，开启经络',
    instructions: {
      manual: '点击穴位激活经络，感受灵气在体内的流动',
      auto: '观看灵气自动在经络中运行，体验练气的奥妙'
    }
  },
  zhuji: {
    id: 'zhuji',
    name: '筑基期',
    description: '在练气期的基础上，进一步巩固根基，让经络形成稳定的循环系统。',
    shortDescription: '巩固根基，经络循环',
    instructions: {
      manual: '按顺序激活穴位，建立稳定的经络循环',
      auto: '观看经络自动连接，形成完整的循环网络'
    }
  },
  jindan: {
    id: 'jindan',
    name: '金丹期',
    description: '突破二维限制，在丹田中凝聚金丹，形成三维立体的经络网络系统。',
    shortDescription: '凝聚金丹，3D网络',
    instructions: {
      manual: '在3D空间中点击穴位，构建立体经络网络',
      auto: '观看金丹自动凝聚，经络在三维空间中运行'
    }
  },
  yuanying: {
    id: 'yuanying',
    name: '元婴期',
    description: '元婴诞生，生命力达到新的层次，如同细胞的生长演化过程。',
    shortDescription: '元婴诞生，生命演化',
    instructions: {
      manual: '点击细胞控制生命演化，创造生命奇迹',
      auto: '观看生命自动演化，体验元婴的生机'
    }
  },
  huashen: {
    id: 'huashen',
    name: '化神期',
    description: '神识超越肉体，进入高维空间，理解宇宙的深层奥秘。',
    shortDescription: '神识化形，高维超脱',
    instructions: {
      manual: '探索高维几何体，感受超越三维的存在',
      auto: '观看高维形态变化，体验化神的超脱'
    }
  }
}

/**
 * 练气期配置数据
 */
export const lianqiConfig: LianQiConfig = {
  nodes: [
    { id: 'baihui', name: '百会', position: [400, 100], x: 400, y: 100, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'yintang', name: '印堂', position: [400, 150], x: 400, y: 150, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'tanzhong', name: '膻中', position: [400, 250], x: 400, y: 250, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'qihai', name: '气海', position: [400, 350], x: 400, y: 350, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'dantian', name: '丹田', position: [400, 400], x: 400, y: 400, size: 1, type: 'acupoint', isActive: false, isCompleted: false }
  ],
  paths: [
    {
      id: 'main_meridian',
      nodes: ['baihui', 'yintang', 'tanzhong', 'qihai', 'dantian'],
      isActive: false,
      progress: 0
    }
  ]
};

/**
 * 筑基期配置数据
 */
export const zhujiConfig: ZhuJiConfig = {
  nodes: [
    // 任脉
    { id: 'baihui', name: '百会', position: [400, 100], x: 400, y: 100, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'yintang', name: '印堂', position: [400, 150], x: 400, y: 150, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'tanzhong', name: '膻中', position: [400, 250], x: 400, y: 250, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'qihai', name: '气海', position: [400, 350], x: 400, y: 350, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'huiyin', name: '会阴', position: [400, 450], x: 400, y: 450, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    // 督脉
    { id: 'mingmen', name: '命门', position: [500, 350], x: 500, y: 350, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'jiaji', name: '夹脊', position: [500, 250], x: 500, y: 250, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'dazhui', name: '大椎', position: [500, 150], x: 500, y: 150, size: 1, type: 'acupoint', isActive: false, isCompleted: false }
  ],
  paths: [
    {
      id: 'ren_meridian',
      nodes: ['baihui', 'yintang', 'tanzhong', 'qihai', 'huiyin'],
      isActive: false,
      progress: 0
    },
    {
      id: 'du_meridian',
      nodes: ['huiyin', 'mingmen', 'jiaji', 'dazhui', 'baihui'],
      isActive: false,
      progress: 0
    }
  ]
};

/**
 * 金丹期配置数据
 */
export const jindanConfig: JinDanConfig = {
  nodes: [
    // 核心金丹
    { id: 'core', name: '金丹核心', position: [0, 0, 0], x: 0, y: 0, z: 0, size: 2, type: 'core', isActive: false, isCompleted: false },
    // 内层经络节点
    { id: 'inner_1', name: '内环1', position: [2, 0, 0], x: 2, y: 0, z: 0, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    { id: 'inner_2', name: '内环2', position: [-2, 0, 0], x: -2, y: 0, z: 0, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    { id: 'inner_3', name: '内环3', position: [0, 2, 0], x: 0, y: 2, z: 0, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    { id: 'inner_4', name: '内环4', position: [0, -2, 0], x: 0, y: -2, z: 0, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    { id: 'inner_5', name: '内环5', position: [0, 0, 2], x: 0, y: 0, z: 2, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    { id: 'inner_6', name: '内环6', position: [0, 0, -2], x: 0, y: 0, z: -2, size: 1.5, type: 'inner', isActive: false, isCompleted: false },
    // 中层经络节点
    { id: 'middle_1', name: '中环1', position: [3, 3, 0], x: 3, y: 3, z: 0, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_2', name: '中环2', position: [-3, 3, 0], x: -3, y: 3, z: 0, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_3', name: '中环3', position: [3, -3, 0], x: 3, y: -3, z: 0, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_4', name: '中环4', position: [-3, -3, 0], x: -3, y: -3, z: 0, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_5', name: '中环5', position: [0, 3, 3], x: 0, y: 3, z: 3, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_6', name: '中环6', position: [0, -3, 3], x: 0, y: -3, z: 3, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_7', name: '中环7', position: [0, 3, -3], x: 0, y: 3, z: -3, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    { id: 'middle_8', name: '中环8', position: [0, -3, -3], x: 0, y: -3, z: -3, size: 1.2, type: 'middle', isActive: false, isCompleted: false },
    // 外层经络节点
    { id: 'outer_1', name: '外环1', position: [4, 0, 0], x: 4, y: 0, z: 0, size: 1, type: 'outer', isActive: false, isCompleted: false },
    { id: 'outer_2', name: '外环2', position: [-4, 0, 0], x: -4, y: 0, z: 0, size: 1, type: 'outer', isActive: false, isCompleted: false },
    { id: 'outer_3', name: '外环3', position: [0, 4, 0], x: 0, y: 4, z: 0, size: 1, type: 'outer', isActive: false, isCompleted: false },
    { id: 'outer_4', name: '外环4', position: [0, -4, 0], x: 0, y: -4, z: 0, size: 1, type: 'outer', isActive: false, isCompleted: false },
    { id: 'outer_5', name: '外环5', position: [0, 0, 4], x: 0, y: 0, z: 4, size: 1, type: 'outer', isActive: false, isCompleted: false },
    { id: 'outer_6', name: '外环6', position: [0, 0, -4], x: 0, y: 0, z: -4, size: 1, type: 'outer', isActive: false, isCompleted: false }
  ],
  paths: [
    {
      id: 'core_to_inner',
      nodes: ['core', 'inner_1', 'inner_2', 'inner_3', 'inner_4', 'inner_5', 'inner_6'],
      isActive: false,
      progress: 0
    },
    {
      id: 'inner_to_middle',
      nodes: ['inner_1', 'middle_1', 'middle_2', 'middle_3', 'middle_4'],
      isActive: false,
      progress: 0
    },
    {
      id: 'middle_to_outer',
      nodes: ['middle_1', 'outer_1', 'outer_2', 'outer_3', 'outer_4', 'outer_5', 'outer_6'],
      isActive: false,
      progress: 0
    }
  ],
  cameraPositions: [
    {
      position: [10, 10, 10],
      target: [0, 0, 0]
    },
    {
      position: [0, 0, 15],
      target: [0, 0, 0]
    },
    {
      position: [15, 0, 0],
      target: [0, 0, 0]
    }
  ]
};

/**
 * 元婴期配置数据
 */
export const yuanyingConfig: YuanYingConfig = {
  gridSize: {
    width: 40,
    height: 30
  },
  presets: {
    glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
    block: [[0, 0], [0, 1], [1, 0], [1, 1]],
    blinker: [[1, 0], [1, 1], [1, 2]],
    toad: [[1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2]],
    beacon: [[0, 0], [0, 1], [1, 0], [2, 3], [3, 2], [3, 3]]
  }
};

/**
 * 化神期配置数据
 */
export const huashenConfig: HuaShenConfig = {
  geometryType: 'klein_bottle',
  shaderUniforms: {
    time: 0,
    complexity: 1.0,
    morphFactor: 0.5
  },
  philosophyTexts: [
    '道可道，非常道',
    '无极生太极，太极生两仪',
    '天地不仁，以万物为刍狗',
    '上善若水，水善利万物而不争',
    '知者不言，言者不知'
  ]
};

/**
 * 获取境界初始数据
 * @param realm 境界类型
 * @returns 境界的节点和路径数据
 */
export function getRealmInitialData(realm: RealmType): { nodes: AcupointNode[]; paths: MeridianPath[] } {
  switch (realm) {
    case 'lianqi':
      return {
        nodes: lianqiConfig.nodes.map(node => ({ 
          ...node, 
          position: [...node.position, 0] as [number, number, number],
          x: node.position[0],
          y: node.position[1],
          z: 0,
          size: 1,
          type: 'acupoint'
        })),
        paths: lianqiConfig.paths
      };
    case 'zhuji':
      return {
        nodes: zhujiConfig.nodes.map(node => ({ 
          ...node, 
          position: [...node.position, 0] as [number, number, number],
          x: node.position[0],
          y: node.position[1],
          z: 0,
          size: 1,
          type: 'acupoint'
        })),
        paths: zhujiConfig.paths
      };
    case 'jindan':
      return {
        nodes: jindanConfig.nodes,
        paths: jindanConfig.paths
      };
    case 'yuanying':
      // 元婴期使用网格，转换为节点格式
      const gridNodes: AcupointNode[] = [];
      for (let x = 0; x < yuanyingConfig.gridSize.width; x++) {
        for (let y = 0; y < yuanyingConfig.gridSize.height; y++) {
          const posX = x - yuanyingConfig.gridSize.width / 2;
          const posY = y - yuanyingConfig.gridSize.height / 2;
          gridNodes.push({
            id: `cell_${x}_${y}`,
            name: `细胞(${x},${y})`,
            position: [posX, posY, 0],
            x: posX,
            y: posY,
            z: 0,
            size: 1,
            type: 'cell',
            isActive: false,
            isCompleted: false
          });
        }
      }
      return {
        nodes: gridNodes,
        paths: []
      };
    case 'huashen':
      // 化神期使用高维几何，生成基础节点
      const geometryNodes: AcupointNode[] = [];
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const posX = Math.cos(angle) * 5;
        const posY = Math.sin(angle) * 5;
        const posZ = Math.sin(angle * 2) * 3;
        geometryNodes.push({
          id: `geometry_${i}`,
          name: `维度点${i}`,
          position: [posX, posY, posZ],
          x: posX,
          y: posY,
          z: posZ,
          size: 1.5,
          type: 'geometry',
          isActive: false,
          isCompleted: false
        });
      }
      return {
        nodes: geometryNodes,
        paths: [{
          id: 'dimension_flow',
          nodes: geometryNodes.map(node => node.id),
          isActive: false,
          progress: 0
        }]
      };
    default:
      return { nodes: [], paths: [] };
  }
}

/**
 * 获取境界配置
 * @param realm 境界类型
 * @returns 境界配置对象
 */
export function getRealmConfig(realm: RealmType): RealmConfig {
  return realmConfigs[realm];
}

/**
 * 获取境界信息
 * @param realm 境界类型
 * @returns 境界信息对象
 */
export function getRealmInfo(realm: RealmType): RealmInfo {
  return realmInfos[realm];
}