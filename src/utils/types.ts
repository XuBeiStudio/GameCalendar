export type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

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
};

export type DataType = {
  month: string;
  games: GameType[];
}[];
