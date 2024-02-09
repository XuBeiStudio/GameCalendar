import { DataType, GameDataType } from '@/utils/types';
import dayjs from 'dayjs';

export const sortMonth: (months: DataType) => DataType = (months) => {
  return months.sort((a, b) => {
    let dateA = dayjs(a.month ?? '', 'YYYY.MM');
    let dateB = dayjs(b.month ?? '', 'YYYY.MM');
    return dateA.unix() - dateB.unix();
  });
};

export const sortGames: (games: GameDataType[]) => GameDataType[] = (games) => {
  let today = dayjs().hour(0).minute(0).second(0).millisecond(0).unix();

  return games.sort((a, b) => {
    let dateA = dayjs(a.releaseDate ?? '', 'YYYY.MM.DD').unix();
    let dateB = dayjs(b.releaseDate ?? '', 'YYYY.MM.DD').unix();

    let ret = dateA - dateB;

    if (ret === 0) {
      return a.id?.localeCompare(b.id ?? '') ?? 0;
    }

    if (dateA === today) {
      return 1;
    }
    if (dateB === today) {
      return -1;
    }

    return ret;
  });
};

const getI18nLang: (
  i18n: {
    lang: string;
    content: string;
  }[],
  lang: string,
) => string | null = (i18n, lang) => {
  if (!lang) {
    return null;
  }
  return i18n?.filter((i) => i.lang === lang)?.[0]?.content ?? null;
};

export const getI18n: (
  i18n: {
    lang: string;
    content: string;
  }[],
  lang: string,
  prefLang?: string[],
) => string | null = (
  i18n,
  lang,
  prefLang = ['zh_CN', 'zh_HK', 'zh_MO', 'zh_TW', 'en_US', 'ja_JP'],
) => {
  let ret = getI18nLang(i18n, lang);
  if (ret) {
    return ret;
  }
  for (let i = 0; i < prefLang.length; i++) {
    ret = getI18nLang(i18n, prefLang[i]);
    if (ret) {
      return ret;
    }
  }
  return null;
};

export const hasWebShare: () => boolean = () => {
  return !!navigator?.share;
};
