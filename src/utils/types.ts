export type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

export type FreeType = 'XGP' | 'PSPlus';

export type GameDataType = {
  id?: string;
  title?: string;
  subtitle?: string[];
  name?: {
    lang: string;
    content: string;
  }[];
  releaseDate?: string;
  platforms?: PlatformType[];
  bg?: string;
  logo?: string;
  leftColor?: string;
  rightColor?: string;
  bgColor?: string;
  free?: FreeType[];
  badges?: {
    type: 'steam' | 'epic';
    value: string;
  }[];
  developer?: {
    name: string;
  }[];
  publisher?: {
    name: string;
  }[];
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
    type: 'steam' | 'epic';
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
