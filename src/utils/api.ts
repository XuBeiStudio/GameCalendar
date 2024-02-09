import { GAME_ASSETS } from '@/utils/constants';
import { GameDataType, GameDetailsType } from '@/utils/types';
import { request } from '@@/exports';

const host = process?.env?.NODE_ENV === 'development' ? '' : GAME_ASSETS;

const isDEV = process?.env?.NODE_ENV === 'development';
const DEV_HOST = '';

export const getGames = async () => {
  const games = await request<GameDataType[]>(host + '/games.json');
  if (isDEV) {
    return games.map((g) => {
      g.bg = g?.bg?.replace(GAME_ASSETS, DEV_HOST);
      g.logo = g?.logo?.replace(GAME_ASSETS, DEV_HOST);
      return g;
    });
  } else {
    return games;
  }
};

export const getGame = async (id: string) => {
  const g = await request<GameDetailsType>(host + `/games/${id}/game.json`);
  if (isDEV) {
    g.bg = g?.bg?.replace(GAME_ASSETS, DEV_HOST);
    g.logo = g?.logo?.replace(GAME_ASSETS, DEV_HOST);
  }
  return g;
};

export const getGameMd = (id: string) => {
  return request<string>(host + `/games/${id}/game.md`);
};
