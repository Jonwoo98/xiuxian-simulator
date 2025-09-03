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
    description: '突破二维限制，在丹田中凝聚金丹，形成三维立体的经络网络系统。',
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
    // 任脉（前中线，范围扩大）
    { id: 'baihui', name: '百会', position: [400, 80], x: 400, y: 80, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'yintang', name: '印堂', position: [400, 140], x: 400, y: 140, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'tiantu', name: '天突', position: [400, 200], x: 400, y: 200, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'tanzhong', name: '膻中', position: [400, 260], x: 400, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'zhongwan', name: '中脘', position: [400, 300], x: 400, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'qihai', name: '气海', position: [400, 360], x: 400, y: 360, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'guanyuan', name: '关元', position: [400, 410], x: 400, y: 410, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'huiyin', name: '会阴', position: [400, 520], x: 400, y: 520, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    // 督脉（后中线，范围扩大）
    { id: 'dazhui', name: '大椎', position: [540, 140], x: 540, y: 140, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'jiaji', name: '夹脊', position: [540, 260], x: 540, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'mingmen', name: '命门', position: [540, 360], x: 540, y: 360, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    // 左右侧经（扩大至更外侧，渐疏）
    { id: 'jianjing_left', name: '肩井(左)', position: [260, 180], x: 260, y: 180, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'feishu_left', name: '肺俞(左)', position: [260, 220], x: 260, y: 220, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'xinshu_left', name: '心俞(左)', position: [260, 260], x: 260, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'ganshu_left', name: '肝俞(左)', position: [260, 300], x: 260, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'shenshu_left', name: '肾俞(左)', position: [260, 340], x: 260, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'huantiao_left', name: '环跳(左)', position: [300, 480], x: 300, y: 480, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    { id: 'jianjing_right', name: '肩井(右)', position: [540, 180], x: 540, y: 180, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'feishu_right', name: '肺俞(右)', position: [540, 220], x: 540, y: 220, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'xinshu_right', name: '心俞(右)', position: [540, 260], x: 540, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'ganshu_right', name: '肝俞(右)', position: [540, 300], x: 540, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'shenshu_right', name: '肾俞(右)', position: [540, 340], x: 540, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'huantiao_right', name: '环跳(右)', position: [500, 480], x: 500, y: 480, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    // 腹侧（横向连接的锚点，位置外扩）
    { id: 'tianshu_left', name: '天枢(左)', position: [340, 340], x: 340, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'tianshu_right', name: '天枢(右)', position: [460, 340], x: 460, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    // 渐疏过渡层（胸/腹两侧的过渡点）
    { id: 'mid_left_chest', name: '胸侧(左)', position: [320, 260], x: 320, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'mid_right_chest', name: '胸侧(右)', position: [480, 260], x: 480, y: 260, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'mid_left_abdomen', name: '腹侧(左)', position: [320, 340], x: 320, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'mid_right_abdomen', name: '腹侧(右)', position: [480, 340], x: 480, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    // 网心（胸腹致密网格，中心更密集）
    { id: 'center_c1', name: '网心-上左', position: [380, 280], x: 380, y: 280, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_c2', name: '网心-上中', position: [400, 280], x: 400, y: 280, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_c3', name: '网心-上右', position: [420, 280], x: 420, y: 280, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    { id: 'center_m1', name: '网心-中左', position: [370, 300], x: 370, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_m2', name: '网心-中中', position: [400, 300], x: 400, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_m3', name: '网心-中右', position: [430, 300], x: 430, y: 300, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    { id: 'center_m4', name: '网心-下左', position: [370, 320], x: 370, y: 320, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_m5', name: '网心-下中', position: [400, 320], x: 400, y: 320, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_m6', name: '网心-下右', position: [430, 320], x: 430, y: 320, size: 1, type: 'acupoint', isActive: false, isCompleted: false },

    { id: 'center_b1', name: '网心-腹左', position: [380, 340], x: 380, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_b2', name: '网心-腹中', position: [400, 340], x: 400, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false },
    { id: 'center_b3', name: '网心-腹右', position: [420, 340], x: 420, y: 340, size: 1, type: 'acupoint', isActive: false, isCompleted: false }
  ],
  paths: [
    // 前中线（任脉）
    { id: 'ren_meridian', nodes: ['baihui', 'yintang', 'tiantu', 'tanzhong', 'zhongwan', 'qihai', 'guanyuan', 'huiyin'], isActive: false, progress: 0 },

    // 后中线（督脉）
    { id: 'du_meridian', nodes: ['huiyin', 'mingmen', 'jiaji', 'dazhui', 'baihui'], isActive: false, progress: 0 },

    // 左右侧经（由上至下，外侧更疏）
    { id: 'left_side_meridian', nodes: ['jianjing_left', 'feishu_left', 'xinshu_left', 'ganshu_left', 'shenshu_left', 'huantiao_left'], isActive: false, progress: 0 },
    { id: 'right_side_meridian', nodes: ['jianjing_right', 'feishu_right', 'xinshu_right', 'ganshu_right', 'shenshu_right', 'huantiao_right'], isActive: false, progress: 0 },

    // 原有横向连结（保持）
    { id: 'shoulder_link', nodes: ['jianjing_left', 'tiantu', 'jianjing_right'], isActive: false, progress: 0 },
    { id: 'chest_link', nodes: ['feishu_left', 'tanzhong', 'feishu_right'], isActive: false, progress: 0 },
    { id: 'heart_link', nodes: ['xinshu_left', 'zhongwan', 'xinshu_right'], isActive: false, progress: 0 },
    { id: 'stomach_link', nodes: ['tianshu_left', 'qihai', 'tianshu_right'], isActive: false, progress: 0 },
    { id: 'pelvis_link', nodes: ['huantiao_left', 'guanyuan', 'huantiao_right'], isActive: false, progress: 0 },

    // 渐疏过渡层桥接（加宽区域连接）
    { id: 'chest_bridge_mid', nodes: ['mid_left_chest', 'tanzhong', 'mid_right_chest'], isActive: false, progress: 0 },
    { id: 'abdomen_bridge_mid', nodes: ['mid_left_abdomen', 'qihai', 'mid_right_abdomen'], isActive: false, progress: 0 },
    { id: 'tianshu_bridge', nodes: ['tianshu_left', 'center_b2', 'tianshu_right'], isActive: false, progress: 0 },

    // 网心致密网格（行）
    { id: 'center_row_280', nodes: ['center_c1', 'center_c2', 'center_c3'], isActive: false, progress: 0 },
    { id: 'center_row_300', nodes: ['center_m1', 'center_m2', 'center_m3'], isActive: false, progress: 0 },
    { id: 'center_row_320', nodes: ['center_m4', 'center_m5', 'center_m6'], isActive: false, progress: 0 },
    { id: 'center_row_340', nodes: ['center_b1', 'center_b2', 'center_b3'], isActive: false, progress: 0 },

    // 网心致密网格（列）
    { id: 'center_col_380', nodes: ['center_c1', 'center_m1', 'center_m4', 'center_b1'], isActive: false, progress: 0 },
    { id: 'center_col_400', nodes: ['center_c2', 'center_m2', 'center_m5', 'center_b2'], isActive: false, progress: 0 },
    { id: 'center_col_420', nodes: ['center_c3', 'center_m3', 'center_m6', 'center_b3'], isActive: false, progress: 0 }
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
          type: 'acupoint',
          // 确保每次都是全新的初始状态
          isActive: false,
          isCompleted: false
        })),
        paths: lianqiConfig.paths.map(path => ({
          ...path,
          // 确保每次都是全新的初始状态
          isActive: false,
          progress: 0
        }))
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
          type: 'acupoint',
          // 确保每次都是全新的初始状态
          isActive: false,
          isCompleted: false
        })),
        paths: zhujiConfig.paths.map(path => ({
          ...path,
          // 确保每次都是全新的初始状态
          isActive: false,
          progress: 0
        }))
      };
    case 'jindan':
      return {
        nodes: jindanConfig.nodes.map(node => ({
          ...node,
          // 确保每次都是全新的初始状态
          isActive: false,
          isCompleted: false
        })),
        paths: jindanConfig.paths.map(path => ({
          ...path,
          // 确保每次都是全新的初始状态
          isActive: false,
          progress: 0
        }))
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