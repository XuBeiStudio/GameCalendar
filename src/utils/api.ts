import { GAME_ASSETS } from '@/utils/constants';
import { GameDataType } from '@/utils/types';
import { request } from '@@/exports';

const host =
  process?.env?.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : GAME_ASSETS;

export const getGames = async () => {
  return request<GameDataType[]>(host + '/games.json');
};
