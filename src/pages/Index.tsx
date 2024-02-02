import data from '@/assets/data.json';
import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import PlatformIcons from '@/components/PlatformIcons';
import { Affix, App, theme } from 'antd';
import * as ics from 'ics';
import { DateTime } from 'ics';
import React, { useEffect, useMemo, useState } from 'react';

const { useToken } = theme;

type PlatformType =
  | 'Steam'
  | 'Epic'
  | 'Xbox'
  | 'Switch'
  | 'PlayStation'
  | 'Android'
  | 'Apple';

type GameType = {
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

type DataType = {
  month: string;
  games: GameType[];
}[];

const sortMonth: (months: DataType) => DataType = (months) => {
  return months.sort((a, b) => {
    let dateA = new Date(a.month ?? '');
    let dateB = new Date(b.month ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

const sortGames: (games: GameType[]) => GameType[] = (games) => {
  return games.sort((a, b) => {
    let dateA = new Date(a.releaseDate ?? '');
    let dateB = new Date(b.releaseDate ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

const Month: React.FC<{
  value: string;
}> = (props) => {
  const { token } = useToken();

  const [affixed, setAffixed] = useState(false);

  const month = useMemo(() => {
    let [y, m] = props.value.split('.');
    if (m.length === 1) {
      m = `0${m}`;
    }
    return `${y}.${m}`;
  }, [props.value]);

  return (
    <Affix onChange={(affixed) => setAffixed(affixed ?? false)}>
      <div
        className={`flex justify-center ${affixed ? 'backdrop-blur-2xl' : ''}`}
      >
        <div className="w-full max-w-128 px-6 py-2">
          <div
            className="-mx-6 px-6 font-extrabold text-right text-6xl select-none"
            style={{
              color: token.colorTextTertiary,
            }}
          >
            {month}
          </div>
        </div>
      </div>
    </Affix>
  );
};

const Game: React.FC<{
  config: GameType;
}> = (props) => {
  const { modal } = App.useApp();
  const { token } = useToken();

  return (
    <div
      className="relative my-4 overflow-hidden shadow-md select-none cursor-pointer"
      style={{
        borderRadius: token.borderRadiusLG,
        background: props.config.bgColor ?? 'white',
      }}
      onClick={() => {
        modal.confirm({
          title: `添加到日历`,
          content: `是否添加《${props.config.title}》到日历？`,
          onOk: () => {
            let { title, releaseDate, platforms } = props.config;

            ics.createEvent(
              {
                title: title,
                description: `《${title}》 现已在 ${platforms?.join(
                  '、',
                )} 上推出`,
                start: (releaseDate?.split('.').map((n) => parseInt(n)) ?? [
                  1970, 1, 1,
                ]) as DateTime,
                duration: { days: 1 },
                url: 'https://game-calendar.liziyi0914.com',
                organizer: { name: '序碑工作室', email: 'games@xu-bei.cn' },
              },
              (error, value) => {
                if (!error) {
                  let blob = new Blob([value], {
                    type: 'text/calendar;charset=utf-8',
                  });
                  let url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }
              },
            );
          },
        });
      }}
    >
      <div>
        <img
          src={props.config.bg ?? ''}
          className="object-cover"
          style={{
            height: '9.6875rem',
            width: '100%',
          }}
          alt="bg"
          loading="lazy"
        />
      </div>
      <div className="absolute top-0 right-0 py-2 px-6">
        {props.config.logo && (
          <img
            src={props.config.logo}
            className="object-cover h-16"
            alt="logo"
            loading="lazy"
          />
        )}
      </div>
      <div
        className="absolute top-0 left-0 bottom-0 right-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 py-2 px-6"
        style={{
          color: props.config.leftColor ?? 'black',
        }}
      >
        <div>
          <div className="font-extrabold text-lg truncate w-64 text-shadow-lg">
            {props.config.title ?? ''}
          </div>
          <div className="font-medium leading-5 truncate w-64 text-shadow-lg">
            {(props.config.subtitle ?? []).map((name, index) => (
              <div key={`${props.config.subtitle}_${index}`}>{name}</div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute right-0 bottom-0 py-2 px-6"
        style={{
          color: props.config.rightColor ?? 'black',
        }}
      >
        <div>
          <div className="font-bold text-right text-shadow-lg">
            {props.config.releaseDate ?? ''}
          </div>
          <div>
            <div
              className="flex gap-x-1 justify-end text-shadow-lg"
              style={{
                fontSize: '0.5rem',
              }}
            >
              {(props.config.platforms ?? [])
                ?.map((p) => PlatformIcons[p])
                .map((Comp, index) => (
                  <Comp key={`${props.config.title ?? ''}_${index}`} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const { token } = useToken();

  const gameDatas: DataType = useMemo(() => {
    return sortMonth(data as DataType).reverse();
  }, [data]);

  useEffect(() => {
    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth());
    let index = gameDatas.findIndex((item) => {
      const date = new Date(item.month);
      return now.getTime() === date.getTime();
    });

    document
      .getElementById(`month_${gameDatas[index]?.month}`)
      ?.scrollIntoView();
  }, [gameDatas]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-full max-w-128">
          <div className="fixed left-4 bottom-4">
            <XubeiLogo
              width={256}
              height={256}
              style={{
                fill: token.colorTextQuaternary,
              }}
            />
          </div>
        </div>
      </div>
      {gameDatas.map((item, index) => (
        <div key={`${item.month}_${index}`} className="relative">
          <Month value={item.month} />
          <div
            id={`month_${item.month}`}
            className="absolute"
            style={{
              top: '1px',
            }}
          />
          <div className="flex justify-center">
            <div
              className="w-full px-6"
              style={{
                maxWidth: '30rem',
              }}
            >
              {sortGames(item.games)
                .reverse()
                .map((game, index) => (
                  <Game key={`${item.month}_${index}`} config={game} />
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
