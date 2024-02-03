import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import GameList from '@/components/GameList';
import { GameType } from '@/utils/types';
import { request, useQuery } from '@umijs/max';
import { App, Skeleton, theme } from 'antd';
import * as ics from 'ics';
import { DateTime } from 'ics';
import React from 'react';

const { useToken } = theme;

const Page: React.FC = () => {
  const { token } = useToken();
  const { modal } = App.useApp();

  const { data: gameDatas, isLoading } = useQuery(['gameDatas'], async () =>
    request<GameType[]>('/data.json'),
  );

  const onClickGame = (game: GameType) => {
    modal.confirm({
      title: `添加到日历`,
      content: `是否添加《${game.title}》到日历？`,
      onOk: () => {
        let { title, releaseDate, platforms } = game;

        ics.createEvent(
          {
            title: title,
            description: `《${title}》 现已在 ${platforms?.join('、')} 上推出`,
            start: (releaseDate?.split('.').map((n) => parseInt(n)) ?? [
              1970, 1, 1,
            ]) as DateTime,
            duration: { hours: 24 },
            url: 'https://game-calendar.liziyi0914.com',
            organizer: { name: '序碑工作室', email: 'games@xu-bei.cn' },
            location: platforms?.join(', '),
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
  };

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
      <Skeleton loading={isLoading} active>
        <GameList
          data={gameDatas}
          onClickGame={onClickGame}
          autoScroll={true}
        />
      </Skeleton>
    </div>
  );
};

export default Page;
