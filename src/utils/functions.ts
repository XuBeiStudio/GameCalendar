import { DataType, GameDataType } from '@/utils/types';

export const sortMonth: (months: DataType) => DataType = (months) => {
  return months.sort((a, b) => {
    let dateA = new Date(a.month ?? '');
    let dateB = new Date(b.month ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

export const sortGames: (games: GameDataType[]) => GameDataType[] = (games) => {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return games.sort((a, b) => {
    let dateA = new Date(a.releaseDate ?? '');
    let dateB = new Date(b.releaseDate ?? '');

    let ret = dateA.getTime() - dateB.getTime();

    if (ret === 0) {
      return a.id?.localeCompare(b.id ?? '') ?? 0;
    }

    if (dateA.getTime() === today.getTime()) {
      return 1;
    }
    if (dateB.getTime() === today.getTime()) {
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
