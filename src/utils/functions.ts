import { DataType, GameType } from '@/utils/types';

export const sortMonth: (months: DataType) => DataType = (months) => {
  return months.sort((a, b) => {
    let dateA = new Date(a.month ?? '');
    let dateB = new Date(b.month ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

export const sortGames: (games: GameType[]) => GameType[] = (games) => {
  return games.sort((a, b) => {
    let dateA = new Date(a.releaseDate ?? '');
    let dateB = new Date(b.releaseDate ?? '');

    let ret = dateA.getTime() - dateB.getTime();

    if (ret === 0) {
      return a.id?.localeCompare(b.id ?? '') ?? 0;
    }

    return ret;
  });
};
