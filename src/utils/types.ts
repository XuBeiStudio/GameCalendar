// 发行平台
export type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

// 会员免费类型
export type FreeType = 'XGP' | 'PSPlus';

// 徽章类型
export type BadgeTypes =
  | 'store.steam'
  | 'store.epic'
  | 'video.bilibili'
  | 'video.youtube'
  | 'music.spotify.playlist'
  | 'music.spotify.track';

// 游戏信息
export type GameDataType = {
  // 游戏 ID
  id?: string;
  // 卡片标题
  title?: string;
  // 卡片副标题（最多两项）
  subtitle?: string[];
  // 游戏名称
  name?: {
    // 语言（zh_CN、en_US、ja_JP等）
    lang: string;
    // 游戏名称
    content: string;
  }[];
  // 发行日期
  releaseDate?: string;
  // 发行平台
  platforms?: PlatformType[];
  // 背景图URL
  bg?: string;
  // Logo URL
  logo?: string;
  // 卡片左侧颜色（CSS颜色）
  leftColor?: string;
  // 卡片右侧颜色（CSS颜色）
  rightColor?: string;
  // 卡片背景颜色（CSS颜色）
  bgColor?: string;
  // 会员免费
  free?: FreeType[];
  // 徽章
  badges?: {
    // 徽章类型
    type: BadgeTypes;
    // 值
    value: string;
  }[];
  // 开发商
  developer?: {
    name: string;
  }[];
  // 发行商
  publisher?: {
    name: string;
  }[];
  // 游戏简介（Markdown格式）
  markdown?: string;
};

export type DataType = {
  month: string;
  games: GameDataType[];
}[];

export type GameDetailsType = {
  id: string;
  name: {
    lang: string;
    content: string;
  }[];
  bg: string;
  logo: string;
  badges: {
    type: BadgeTypes;
    value: string;
  }[];
  releaseDate?: string;
  platforms?: PlatformType[];
  developer?: {
    name: string;
  }[];
  publisher?: {
    name: string;
  }[];
};
