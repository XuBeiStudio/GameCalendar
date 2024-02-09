import { GameDataType } from '@/utils/types';
import { useModel } from '@@/exports';
import { css } from '@emotion/css';
import { theme } from 'antd';
import lodash from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

const { useToken } = theme;

const Component: React.FC<{
  games: GameDataType[];
}> = (props) => {
  const { token } = useToken();
  const { isDark } = useModel('themeModel');
  const { activeMonth } = useModel('gamesModel');
  const [currentMonth, setCurrentMonth] = useState<string>();

  const gameList = useMemo(() => {
    let yearMap: Record<string, Record<string, number>> = {};
    props.games.forEach((game) => {
      let date = (game?.releaseDate ?? '').split('.');
      if (date.length !== 3) {
        return;
      }
      let [y, m] = date;
      if (!yearMap[y]) {
        yearMap[y] = {};
      }
      if (!yearMap[y][m]) {
        yearMap[y][m] = 0;
      }
      yearMap[y][m]++;
    });

    let result: Array<{
      year: string;
      months: Array<{
        month: string;
        count: number;
      }>;
    }> = [];
    lodash.forEach(yearMap, (months, year) => {
      let monthList: Array<{
        month: string;
        count: number;
      }> = [];
      lodash.forEach(months, (count, month) => {
        monthList.push({
          month,
          count,
        });
      });
      result.push({
        year,
        months: monthList.sort((a, b) => parseInt(b.month) - parseInt(a.month)),
      });
    });
    result = result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    return result;
  }, [props.games]);

  useEffect(() => {
    setCurrentMonth(activeMonth);
    if (activeMonth && activeMonth !== '') {
      document
        .getElementById(`nav_month_${activeMonth}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeMonth]);

  return (
    <div
      className="backdrop-blur-3xl shadow-md"
      style={{
        borderRadius: token.borderRadiusLG,
        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
      }}
    >
      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(100vh - 6rem)',
          maxHeight: '32rem',
        }}
      >
        {gameList.map((y) => (
          <div key={y.year}>
            <div className="text-3xl font-medium select-none px-4 py-2">
              <div
                className="text-right"
                style={{
                  color: token.colorTextSecondary,
                }}
              >
                {y.year}年
              </div>
            </div>
            {y.months.map((m) => (
              <div
                key={`${y.year}_${m.month}`}
                id={`nav_month_${y.year}.${m.month}`}
                className={`flex text-3xl select-none px-4 py-2 cursor-pointer transition-colors duration-75 ease-in-out ${css`
                  & {
                    --color-month: ${currentMonth === `${y.year}.${m.month}`
                      ? token.colorPrimaryText
                      : token.colorTextTertiary};
                  }

                  &:hover {
                    background: ${token.colorBgTextHover};
                    --color-month: ${currentMonth === `${y.year}.${m.month}`
                      ? token.colorPrimaryTextHover
                      : token.colorTextTertiary};
                  }

                  &:active {
                    background: ${token.colorBgTextActive};
                    --color-month: ${currentMonth === `${y.year}.${m.month}`
                      ? token.colorPrimaryTextActive
                      : token.colorTextTertiary};
                  }
                `}`}
                onClick={() => {
                  document
                    .getElementById(`month_${y.year}.${m.month}`)
                    ?.scrollIntoView();
                  setCurrentMonth(`${y.year}.${m.month}`);
                }}
              >
                <div
                  className="flex-grow w-12"
                  style={{
                    color: token.colorTextQuaternary,
                  }}
                >
                  {m.count}
                </div>
                <div
                  className="text-right w-24"
                  style={{
                    color: 'var(--color-month)',
                  }}
                >
                  {parseInt(m.month)}月
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Component;
