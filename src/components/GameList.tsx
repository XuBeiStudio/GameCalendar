import Game from '@/components/Game';
import Month from '@/components/Month';
import { sortGames, sortMonth } from '@/utils/functions';
import { GameType } from '@/utils/types';
import lodash from 'lodash';
import React, { useEffect, useMemo } from 'react';

const Component: React.FC<{
  data?: GameType[];
  onClickGame?: (game: GameType) => void;
  container?: () => HTMLElement | Window | null;
  autoScroll?: boolean;
}> = (props) => {
  const months = useMemo(() => {
    let result: {
      month: string;
      games: GameType[];
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
    if (!props.autoScroll) {
      return;
    }

    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth());
    let index = (months ?? []).findIndex((item) => {
      const date = new Date(item.month);
      return now.getTime() === date.getTime();
    });

    document
      .getElementById(`month_${(months ?? [])[index]?.month}`)
      ?.scrollIntoView();
  }, [months, props.autoScroll]);

  return (
    <div>
      {(months ?? []).map((item, index) => (
        <div key={`${item.month}_${index}`} className="relative">
          <Month value={item.month} container={props.container} />
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
                  <Game
                    key={`${item.month}_${index}`}
                    config={game}
                    onClick={() => props?.onClickGame?.(game)}
                  />
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Component;
