import React, { useEffect, useMemo, useState } from 'react';
import { Affix, theme } from 'antd';
import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import PlatformIcons from '@/components/PlatformIcons';
import data from '@/assets/data.json';

const { useToken } = theme;

type PlatformType = 'Steam' | 'Epic' | 'Xbox' | 'Switch' | 'PlayStation' | 'Android' | 'Apple';

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

const sortMonth: (months: DataType) => DataType = months => {
  return months.sort((a, b) => {
    let dateA = new Date(a.month ?? '');
    let dateB = new Date(b.month ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

const sortGames: (games: GameType[]) => GameType[] = games => {
  return games.sort((a, b) => {
    let dateA = new Date(a.releaseDate ?? '');
    let dateB = new Date(b.releaseDate ?? '');
    return dateA.getTime() - dateB.getTime();
  });
};

const Month: React.FC<{
  value: string;
}> = props => {
  const { token } = useToken();

  const [affixed, setAffixed] = useState(false);

  return (
    <Affix
      onChange={affixed => setAffixed(affixed ?? false)}
    >
      <div className={`flex justify-center ${affixed ? 'backdrop-blur-2xl' : ''}`}>
        <div className="w-full max-w-128 px-6 py-2">
          <div
            className="-mx-6 px-6 font-extrabold text-right text-6xl select-none"
            style={{
              color: token.colorTextTertiary,
            }}
          >
            {props.value}
          </div>
        </div>
      </div>
    </Affix>
  );
};

const Game: React.FC<{
  config: GameType;
}> = props => {
  const { token } = useToken();

  return (
    <div
      className="relative my-4 overflow-hidden shadow-md select-none cursor-pointer"
      style={{
        borderRadius: token.borderRadiusLG,
        background: props.config.bgColor ?? 'white',
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
        />
      </div>
      <div className="absolute top-0 right-0 py-2 px-6">
        {props.config.logo && (
          <img
            src={props.config.logo}
            className="object-cover h-16"
            alt="logo"
          />
        )}
      </div>
      <div
        className="absolute top-0 left-0 bottom-0 right-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 py-2 px-6"
        style={{
          color: props.config.leftColor ?? 'black',
        }}
      >
        <div>
          <div
            className="font-extrabold text-lg truncate w-64"
          >{props.config.title ?? ''}</div>
          <div
            className="font-medium leading-5 truncate w-64"
          >
            {(props.config.subtitle ?? []).map((name, index) => (
              <div key={`${props.config.subtitle}_${index}`}>
                {name}
              </div>
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
          <div className="font-bold text-right">{props.config.releaseDate ?? ''}</div>
          <div>
            <div
              className="flex gap-x-1 justify-end"
              style={{
                fontSize: '0.5rem',
              }}
            >
              {(props.config.platforms ?? [])?.map(p => PlatformIcons[p]).map((Comp, index) => (
                <Comp key={`${props.config.title ?? ''}_${index}`} />))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const { token } = useToken();

  const gameDatas = useMemo(() => {
    return sortMonth(data as DataType);
  }, [data]);

  useEffect(() => {
    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth());
    let index = gameDatas.findIndex(item => {
      const date = new Date(item.month);
      return now.getTime() === date.getTime();
    });

    document.getElementById(`month_${gameDatas[index]?.month}`)?.scrollIntoView();
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
        <div
          key={`${item.month}_${index}`}
          className="relative"
        >
          <Month
            value={item.month}
          />
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
              {sortGames(item.games).map((game, index) => (
                <Game
                  key={`${item.month}_${index}`}
                  config={game}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
