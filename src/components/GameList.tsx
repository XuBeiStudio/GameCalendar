import Game from '@/components/Game';
import Month from '@/components/Month';
import SideNav from '@/components/SideNav';
import {
  GamepadManager,
  XboxAxisMap,
  XboxButtonMap,
} from '@/utils/GamepadManager';
import { sortGames, sortMonth } from '@/utils/functions';
import { GameDataType } from '@/utils/types';
import { useBoolean } from 'ahooks';
import { Affix, App } from 'antd';
import dayjs from 'dayjs';
import lodash from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

export class GameListContext {
  public games: HTMLDivElement[] = [];
}

export const GameListCtx = React.createContext<GameListContext | null>(null);

const MonthGroup: React.FC<{
  item: {
    month: string;
    games: GameDataType[];
  };
  container?: () => HTMLElement | Window | null;
  onClickGame?: (game: GameDataType) => void;
  onClickMonth?: (affixed: boolean) => void;
}> = ({ item, container, onClickGame, onClickMonth }) => {
  const [closed, setClosed] = useState(false);

  return (
    <div className="flex justify-center">
      <div
        className="w-full"
        style={{
          maxWidth: '32rem',
        }}
      >
        <div className="pb-6">
          <Month
            value={item.month}
            container={container}
            closed={closed}
            onClick={(affixed) => onClickMonth?.(affixed)}
          />
          <div
            id={`month_${item.month}`}
            className="absolute"
            style={{
              top: '2px',
            }}
          />
          <div className="px-10 pt-2 flex flex-col gap-y-4">
            {sortGames(item.games)
              .reverse()
              .map((game, index) => (
                <Game
                  key={`${item.month}_${index}`}
                  config={game}
                  onClick={() => onClickGame?.(game)}
                />
              ))}
          </div>
          <Affix
            onChange={(affixed) => setClosed(affixed ?? false)}
            target={container ?? (() => window)}
          >
            <div />
          </Affix>
        </div>
      </div>
    </div>
  );
};

const Component: React.FC<{
  data?: GameDataType[];
  onClickGame?: (game: GameDataType) => void;
  container?: () => HTMLElement | Window | null;
  autoScroll?: boolean;
}> = (props) => {
  const { message } = App.useApp();
  const behaviorInstance = useRef<GamepadManager>();
  const ctx = useContext(GameListCtx);
  const [openSider, { toggle: toggleSider }] = useBoolean(false);

  const months = useMemo(() => {
    let result: {
      month: string;
      games: GameDataType[];
    }[] = [];
    let dict = lodash.groupBy(props.data, (item) => {
      let [y, m] = (item?.releaseDate ?? '1970.1.1').split('.');
      return `${y}.${m}`;
    });
    for (let month in dict) {
      if (!dict.hasOwnProperty(month)) {
        continue;
      }
      result.push({
        month,
        games: dict[month],
      });
    }
    return sortMonth(result).reverse();
  }, [props.data]);

  useEffect(() => {
    let behavior = new GamepadManager();

    behavior.onGamepadConnected = (e) => {
      console.log('手柄已连接', e);
      message.success('手柄已连接');

      behavior.playEffect('dual-rumble', {
        duration: 200,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
      });

      {
        // focus到当前屏幕上第一个可见游戏
        const viewWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const viewHeight =
          window.innerHeight || document.documentElement.clientHeight;
        let games = ctx?.games;
        if (!games || games.length === 0) {
          return;
        }
        let find = false;
        for (let i = 0; i < games.length; i++) {
          let game = games[i];

          const { top, left, bottom, right } = game.getBoundingClientRect();

          let visible =
            top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
          if (visible && !find) {
            game.focus();
            behavior.setData({
              focused: i,
            });
            find = true;
          }

          game.onfocus = () => {
            behavior.setData({
              focused: i,
            });
          };
        }
      }
    };

    behavior.onGamepadDisconnected = (e) => {
      console.log('手柄已断开', e);
      message.error('手柄已断开');
    };

    behavior.update = (data: { focused: number; pressing: boolean }) => {
      let games = ctx?.games;
      if (!games || games.length === 0) {
        return data;
      }

      let pressing = false;
      let focused = data.focused ?? 0;

      if (
        behavior.getButtonState(XboxButtonMap.LeftStick)?.pressed ||
        behavior.getButtonState(XboxButtonMap.RightStick)?.pressed ||
        behavior.getButtonState(XboxButtonMap.X)?.pressed ||
        behavior.getButtonState(XboxButtonMap.B)?.pressed
      ) {
        pressing = true;
        if (!data.pressing) {
          let game = games[Math.floor(focused) % games.length];
          game?.click();
        }
        return {
          focused,
          pressing,
        };
      }

      let speed = 0;
      if (
        behavior.getButtonState(XboxButtonMap.A)?.pressed ||
        behavior.getButtonState(XboxButtonMap.Down)?.pressed
      ) {
        speed = 10;
        pressing = true;
      }
      if (
        behavior.getButtonState(XboxButtonMap.Y)?.pressed ||
        behavior.getButtonState(XboxButtonMap.Up)?.pressed
      ) {
        speed = -10;
        pressing = true;
      }
      if (Math.abs(behavior.getAxisState(XboxAxisMap.LeftY)) > 0.1) {
        speed = behavior.getAxisState(XboxAxisMap.LeftY) * 15;
      }
      if (Math.abs(behavior.getAxisState(XboxAxisMap.RightY)) > 0.1) {
        speed = behavior.getAxisState(XboxAxisMap.RightY) * 15;
      }

      if (pressing) {
        if (!data.pressing) {
          focused = data.focused + speed / Math.abs(speed);
          if (focused < 0) {
            focused = 0;
          } else if (focused > games.length) {
            focused = games.length;
          }
          games[Math.floor(focused) % games.length]?.focus();
        }
        return {
          focused,
          pressing,
        };
      }

      if (speed !== 0) {
        focused = data.focused + (behavior.deltaTime / 1000) * speed;
        if (focused < 0) {
          focused = 0;
        } else if (focused > games.length) {
          focused = games.length;
        }
        games[Math.floor(focused) % games.length]?.focus();
      } else {
        pressing = false;
      }

      return {
        focused,
        pressing,
      };
    };

    behaviorInstance.current = behavior;

    return () => {
      behavior.onDestroy();
    };
  }, []);

  useEffect(() => {
    if (!props.autoScroll) {
      return;
    }

    let now = dayjs().date(1).hour(0).minute(0).second(0).millisecond(0);
    let index = (months ?? []).findIndex((item) => {
      const date = dayjs(item.month, 'YYYY.MM')
        .date(1)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      return now.unix() === date.unix();
    });

    document
      .getElementById(`month_${(months ?? [])[index]?.month}`)
      ?.scrollIntoView();
  }, [months, props.autoScroll]);

  return (
    <div>
      <div className={`flex justify-center`}>
        <div
          className="w-full z-30 flex justify-end"
          style={{
            maxWidth: '32rem',
          }}
        >
          <div
            className={`fixed top-24 mr-2 transition duration-150 ease-in-out ${
              openSider ? 'visible translate-y-0' : 'invisible -translate-y-6'
            }`}
          >
            <SideNav games={props.data ?? []} />
          </div>
        </div>
      </div>
      <div>
        {(months ?? []).map((item, index) => (
          <div key={`${item.month}_${index}`} className="relative">
            <MonthGroup
              item={item}
              container={props.container}
              onClickGame={props.onClickGame}
              onClickMonth={(affixed) => {
                if (affixed) {
                  toggleSider();
                } else {
                  document
                    .getElementById(`month_${item.month}`)
                    ?.scrollIntoView();
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Component;
