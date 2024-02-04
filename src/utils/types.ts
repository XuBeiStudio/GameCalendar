export type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

export type FreeType = 'XGP' | 'PSPlus';

export type GameType = {
  id?: string;
  title?: string;
  subtitle?: string[];
  releaseDate?: string;
  platforms?: PlatformType[];
  bg?: string;
  logo?: string;
  leftColor?: string;
  rightColor?: string;
  bgColor?: string;
  free?: FreeType[];
};

export type DataType = {
  month: string;
  games: GameType[];
}[];

export type GameDetailsType = {
  id: string;
  name: Record<string, string>;
  bg: string;
  logo: string;
  badges: {
    type: 'steam' | 'epic';
    value: string;
  }[];
  releaseDate?: string;
  platforms?: PlatformType[];
  developer?: string[];
  publisher?: string[];
};
