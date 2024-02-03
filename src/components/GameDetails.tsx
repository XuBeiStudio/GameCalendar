import Markdown from '@/components/Markdown';
import PlatformIcons from '@/components/PlatformIcons';
import { GameDetailsType } from '@/utils/types';
import { request, useQuery } from '@@/exports';
import { CalendarOutlined } from '@ant-design/icons';
import { Button, Empty, Skeleton, theme } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as ics from 'ics';
import React from 'react';

dayjs.extend(utc);

const { useToken } = theme;

const parseBadge = (badge: { type: string; value: string }) => {
  switch (badge.type) {
    case 'steam':
      return (
        <Button
          onClick={() => {
            window.open(
              `https://store.steampowered.com/app/${badge.value}`,
              '_blank',
            );
          }}
        >
          <div className="flex">
            <div className="mr-1">
              <PlatformIcons.Steam />
            </div>
            <div>Steam</div>
          </div>
        </Button>
      );
    case 'epic':
      return (
        <Button
          onClick={() => {
            window.open(
              `https://store.epicgames.com/zh-CN/p/${badge.value}`,
              '_blank',
            );
          }}
        >
          <div className="flex">
            <div className="mr-1">
              <PlatformIcons.Epic />
            </div>
            <div>Epic</div>
          </div>
        </Button>
      );
    default:
      return null;
  }
};

const Component: React.FC<{
  gameId: string | null;
}> = (props) => {
  const { token } = useToken();

  const {
    data: gameData,
    isLoading: isLoadingGameData,
    isError: isGameDataError,
  } = useQuery(['game', props.gameId, 'json'], async ({ queryKey }) =>
    request<GameDetailsType>(`/games/${queryKey[1]}/game.json`),
  );
  const {
    data: gameMd,
    isLoading: isLoadingGameMd,
    isError: isGameMdError,
  } = useQuery(['game', props.gameId, 'md'], async ({ queryKey }) =>
    request<string>(`/games/${queryKey[1]}/info.md`),
  );

  return (
    <div>
      <div className="text-2xl font-bold">{gameData?.name ?? '未知'}</div>
      <div
        className="text-xs pt-1 pb-3"
        style={{
          color: token.colorTextSecondary,
        }}
      >
        <div>开发商：{gameData?.developer ?? '未知'}</div>
        <div>发行商：{gameData?.publisher ?? '未知'}</div>
      </div>
      <div
        className="overflow-auto"
        style={{
          maxHeight: '60vh',
        }}
      >
        <Skeleton loading={isLoadingGameData} active>
          {isGameDataError ? (
            <></>
          ) : (
            <div className="pb-2">
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => {
                    if (!gameData) return;

                    let { name, releaseDate, platforms } = gameData;

                    ics.createEvent(
                      {
                        title: name,
                        description: `《${name}》 现已在 ${platforms?.join(
                          '、',
                        )} 上推出`,
                        start: dayjs(
                          `${(releaseDate ?? '').replaceAll(
                            '.',
                            '-',
                          )}T00:00:00+0800`,
                        )
                          .utc()
                          .format('YYYYMMDD[T]HHmmss[Z]') as string,
                        duration: { hours: 24 },
                        url: 'https://game-calendar.liziyi0914.com',
                        organizer: {
                          name: '序碑工作室',
                          email: 'games@xu-bei.cn',
                        },
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
                  }}
                >
                  加入日历
                </Button>
                {gameData?.badges?.map((badge) => parseBadge(badge))}
              </div>
            </div>
          )}
        </Skeleton>
        <Skeleton loading={isLoadingGameMd} active>
          {isGameMdError ? (
            <Empty />
          ) : (
            <Markdown
              markdown={gameMd ?? ''}
              components={{
                img: (props: any) => (
                  <img
                    {...props}
                    style={{
                      maxWidth: '100%',
                    }}
                  />
                ),
              }}
            />
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default Component;
