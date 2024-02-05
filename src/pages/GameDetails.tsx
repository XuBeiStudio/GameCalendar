import Markdown from '@/components/Markdown';
import PlatformIcons from '@/components/PlatformIcons';
import { getI18n } from '@/utils/functions';
import { GameDetailsType } from '@/utils/types';
import { request, useIntl, useMatch, useModel, useQuery } from '@@/exports';
import {
  CalendarOutlined,
  GithubOutlined,
  MenuOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { ArrowLeft, Moon, SunOne } from '@icon-park/react';
import { history } from '@umijs/max';
import { Affix, Button, Dropdown, Empty, Skeleton, theme } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as ics from 'ics';
import React, { useMemo, useRef, useState } from 'react';

dayjs.extend(utc);

const { useToken } = theme;

export const parseBadge = (badge: { type: string; value: string }) => {
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

const Page: React.FC = () => {
  const { token } = useToken();
  const match = useMatch('/game/:gameId');
  const { isDark, setIsDark } = useModel('themeModel');
  const i18n = useIntl();

  const gameId = useMemo(() => match?.params?.gameId ?? '', [match]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [affixHeader, setAffixHeader] = useState(false);
  const [affixTitle, setAffixTitle] = useState(false);

  const {
    data: gameData,
    isLoading: isLoadingGameData,
    isError: isGameDataError,
  } = useQuery(['game', gameId, 'json'], async ({ queryKey }) =>
    request<GameDetailsType>(`/games/${queryKey[1]}/game.json`),
  );
  const {
    data: gameMd,
    isLoading: isLoadingGameMd,
    isError: isGameMdError,
  } = useQuery(['game', gameId, 'md'], async ({ queryKey }) =>
    request<string>(`/games/${queryKey[1]}/game.md`),
  );

  return (
    <div className="h-screen overflow-hidden relative">
      <div className="relative z-10">
        <div
          ref={scrollRef}
          className="flex justify-center h-screen overflow-y-auto"
        >
          <div className="w-192">
            <div className="h-32" />
            <div
              className="px-8 py-6 shadow-md"
              style={{
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadius,
                minHeight: 'calc(100vh - 12rem)',
              }}
            >
              <div className="-mx-8 -mt-6">
                <Affix
                  onChange={(affixed) => setAffixHeader(affixed ?? false)}
                  target={() => scrollRef.current}
                >
                  <div
                    className={`px-2 py-2 flex border-solid border-0 backdrop-blur-md ${
                      affixHeader ? 'border-b' : ''
                    }`}
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(255,255,255,0.2)',
                      borderTopLeftRadius: token.borderRadius,
                      borderTopRightRadius: token.borderRadius,
                      borderColor: token.colorBorder,
                    }}
                  >
                    <div>
                      <Button
                        size="large"
                        type="text"
                        onClick={() => history.back()}
                      >
                        <ArrowLeft />
                      </Button>
                    </div>
                    <div className="flex-grow">
                      {affixTitle && (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-lg font-bold text-shadow-md">
                            {getI18n(gameData?.name ?? [], 'zh_CN') ?? '未知'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Dropdown
                        trigger={['click', 'hover', 'contextMenu']}
                        menu={{
                          items: [
                            {
                              key: 'github',
                              label: i18n.formatMessage({ id: 'github' }),
                              icon: <GithubOutlined />,
                              onClick: () => {
                                window.location.href =
                                  'https://github.com/liziyi0914/GameCalendar';
                              },
                            },
                            {
                              key: 'txc',
                              label: i18n.formatMessage({ id: 'txc' }),
                              icon: <MessageOutlined />,
                              onClick: () => {
                                window.location.href =
                                  'https://txc.qq.com/products/634520';
                              },
                            },
                            {
                              key: 'darkMode',
                              label: i18n.formatMessage({ id: 'darkMode' }),
                              icon: isDark ? <Moon /> : <SunOne />,
                              onClick: () => {
                                setIsDark(!isDark);
                              },
                            },
                          ],
                        }}
                      >
                        <Button size="large" type="text">
                          <MenuOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </Affix>
              </div>
              <Affix
                onChange={(affixed) => setAffixTitle(affixed ?? false)}
                target={() => scrollRef.current}
              >
                <div />
              </Affix>
              <div className="text-2xl font-bold py-2">
                {getI18n(gameData?.name ?? [], 'zh_CN') ?? '未知'}
              </div>
              <div className="flex pb-3">
                <div
                  className="flex-grow text-xs w-0"
                  style={{
                    color: token.colorTextSecondary,
                  }}
                >
                  <div className="truncate">
                    开发商：
                    {gameData?.developer?.map((i) => i.name)?.join(' ') ??
                      '未知'}
                  </div>
                  <div className="truncate">
                    发行商：
                    {gameData?.publisher?.map((i) => i.name)?.join(' ') ??
                      '未知'}
                  </div>
                </div>
                <div className="text-xs">
                  <div className="text-right">{gameData?.releaseDate} 发售</div>
                  <div className="">
                    <div
                      className="flex justify-end gap-x-1"
                      style={{
                        fontSize: '0.5rem',
                      }}
                    >
                      {(gameData?.platforms ?? [])
                        ?.map((p) => PlatformIcons[p])
                        .map((Comp, index) => (
                          <Comp key={`${gameData?.id ?? ''}_${index}`} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
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

                            let {
                              name: _name,
                              releaseDate,
                              platforms,
                            } = gameData;
                            let name = getI18n(_name, 'zh_CN') ?? '';

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
                            alt="img"
                          />
                        ),
                      }}
                    />
                  )}
                </Skeleton>
              </div>
            </div>
            <div className="h-6" />
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 right-0 z-0">
        <div className="relative">
          <div>
            <img
              src={gameData?.bg}
              alt="bg"
              className="w-full h-64 object-cover"
            />
          </div>
          <div
            className="absolute top-0 left-0 right-0 bottom-0"
            style={{
              background: `linear-gradient(180deg, transparent 30%, ${token.colorBgLayout} 90%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
