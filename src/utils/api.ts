import { API, GAME_ASSETS } from '@/utils/constants';
import { GameDataType, GameDetailsType } from '@/utils/types';
import { request } from '@@/exports';

const host = process?.env?.NODE_ENV === 'development' ? '' : GAME_ASSETS;

const isDEV = process?.env?.NODE_ENV === 'development';
const DEV_HOST = '';

const API_HOST =
  process?.env?.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : API;

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

function requestWebAPI<T>(
  path: string,
  params: {
    method?: 'POST' | 'GET';
    params?: Record<string, any>;
    data?: Record<string, any>;
  },
) {
  return request<{
    code: number;
    msg?: string;
    data?: T;
  }>(API_HOST + path, {
    ...params,
  });
}

export const registerWebPush = (
  type: string,
  token: string,
  recaptchaToken: string,
) => {
  return requestWebAPI<string>('/subscription/register', {
    method: 'POST',
    data: {
      platform: type,
      token,
      captcha: recaptchaToken,
    },
  });
};

export const unregisterWebPush = (
  type: string,
  token: string,
  recaptchaToken: string,
  secret: string,
) => {
  return requestWebAPI('/subscription/unregister', {
    method: 'POST',
    data: {
      platform: type,
      token,
      captcha: recaptchaToken,
      secret,
    },
  });
};

export const refreshWebPush = (type: string, token: string, secret: string) => {
  return requestWebAPI('/subscription/refresh', {
    method: 'POST',
    data: {
      platform: type,
      token,
      secret,
    },
  });
};

export const updateWebPush = (
  type: string,
  token: string,
  recaptchaToken: string,
  secret: string,
  triggers: number,
) => {
  return requestWebAPI('/subscription/update', {
    method: 'POST',
    data: {
      platform: type,
      token,
      captcha: recaptchaToken,
      secret,
      channel: triggers,
    },
  });
};
