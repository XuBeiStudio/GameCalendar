import Bilibili from '@/components/BadgeComponents/Bilibili';
import Spotify from '@/components/BadgeComponents/Spotify';
import Youtube from '@/components/BadgeComponents/Youtube';
import Markdown from '@/components/Markdown';
import PlatformIcons from '@/components/PlatformIcons';
import { getGame, getGameMd } from '@/utils/api';
import { SITE_ASSETS } from '@/utils/constants';
import { getI18n, hasWebShare } from '@/utils/functions';
import { Helmet, useIntl, useMatch, useModel, useQuery } from '@@/exports';
import {
  CalendarOutlined,
  GiftOutlined,
  GithubOutlined,
  MenuOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { ArrowLeft, Moon, SunOne } from '@icon-park/react';
import { history } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Affix, Alert, Button, Dropdown, Empty, Skeleton, theme } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import * as ics from 'ics';
import React, { useMemo, useRef, useState } from 'react';

dayjs.extend(utc);
dayjs.extend(duration);

const { useToken } = theme;

export const parseBadge = (badge: { type: string; value: string }) => {
  switch (badge.type) {
    case 'store.steam':
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
    case 'store.epic':
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
    case 'music.spotify.playlist':
      return <Spotify.Playlist id={badge.value} />;
    case 'music.spotify.track':
      return <Spotify.Track id={badge.value} />;
    case 'video.bilibili':
      return <Bilibili id={badge.value} />;
    case 'video.youtube':
      return <Youtube id={badge.value} />;
    default:
      return null;
  }
};

const ReleaseCountdown: React.FC<{ releaseDate?: string }> = (props) => {
  const [deltaInfo, setDeltaInfo] = useState<{
    type: 'soon' | 'today' | 'released';
    msg?: string;
  }>();
  const updateInterval = useMemo(() => {
    let now = dayjs('2024.02.16');
    let du = dayjs.duration(dayjs(props.releaseDate ?? '1970.01.01').diff(now));

    if (du.asDays() < -1) {
      return undefined;
    }

    return 1000;
  }, [props]);
  const releaseTime = useMemo(
    () => dayjs(props.releaseDate ?? '1970.01.01'),
    [props.releaseDate],
  );
  const surprise = useMemo(
    () => ['🎉', '✨', '🎊'][Math.round(Math.random() * 10000) % 3],
    [],
  );

  useInterval(
    () => {
      let now = dayjs();
      let du = dayjs.duration(releaseTime.diff(now));
      let days = du.asDays();

      if (days < -1) {
        setDeltaInfo({
          type: 'released',
        });
        return;
      } else if (days <= 0) {
        setDeltaInfo({
          type: 'today',
        });
        return;
      }

      let result = '';

      if (days <= 7) {
        result += `${du.days()} 天 ${du.hours()} 小时`;
        if (days <= 3) {
          result += ` ${du.minutes()} 分钟 ${du.seconds()} 秒`;
        }
      } else {
        result += `${Math.ceil(du.asDays())} 天`;
      }

      setDeltaInfo({
        type: 'soon',
        msg: result,
      });
    },
    updateInterval,
    { immediate: true },
  );

  switch (deltaInfo?.type) {
    case 'released':
      return <></>;
    case 'today':
      return (
        <Alert
          type="success"
          message={`今日发售 ${surprise}`}
          showIcon
          closable
          icon={<GiftOutlined />}
        />
      );
    case 'soon':
      return (
        <Alert
          type="warning"
          message={`距离游戏发售还有 ${deltaInfo?.msg}`}
          showIcon
          closable
        />
      );
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
    getGame(queryKey[1]),
  );
  const {
    data: gameMd,
    isLoading: isLoadingGameMd,
    isError: isGameMdError,
  } = useQuery(['game', gameId, 'md'], async ({ queryKey }) =>
    getGameMd(queryKey[1]),
  );

  return (
    <div className="h-screen overflow-hidden relative">
      <Helmet>
        <title>{getI18n(gameData?.name ?? [], 'zh_CN') ?? '未知'} | 序碑</title>
      </Helmet>
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
                        trigger={['click']}
                        menu={{
                          items: [
                            {
                              key: 'github',
                              label: i18n.formatMessage({ id: 'github' }),
                              icon: <GithubOutlined />,
                              onClick: () => {
                                window.location.href =
                                  'https://github.com/XuBeiStudio/GameCalendar';
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
                    <div>
                      <div className="py-1.5">
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
                                  url: SITE_ASSETS,
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
                            {i18n.formatMessage({ id: 'addCalendar' })}
                          </Button>
                          {hasWebShare() && (
                            <Button
                              icon={<ShareAltOutlined />}
                              onClick={() => {
                                navigator.share({
                                  title: `${
                                    getI18n(gameData?.name ?? [], 'zh_CN') ??
                                    '未知'
                                  } | 游历年轴`,
                                  text: `${
                                    getI18n(gameData?.name ?? [], 'zh_CN') ??
                                    '未知'
                                  } | 游历年轴`,
                                  url: window.location.href,
                                });
                              }}
                            >
                              {i18n.formatMessage({ id: 'share' })}
                            </Button>
                          )}
                          {gameData?.badges
                            ?.filter(
                              (b) =>
                                !(
                                  b.type.startsWith('music.') ||
                                  b.type.startsWith('video.')
                                ),
                            )
                            ?.map((badge) => (
                              <div key={badge.type}>{parseBadge(badge)}</div>
                            ))}
                        </div>
                      </div>
                      <div className="py-1.5">
                        <ReleaseCountdown releaseDate={gameData?.releaseDate} />
                      </div>
                      <div className="py-1.5">
                        {gameData?.badges
                          ?.filter(
                            (b) =>
                              b.type.startsWith('music.') ||
                              b.type.startsWith('video.'),
                          )
                          ?.map((badge, index) => (
                            <div
                              key={`${badge.type}_${index}`}
                              className="pb-2"
                            >
                              {parseBadge(badge)}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </Skeleton>
                <Skeleton loading={isLoadingGameMd} active>
                  {isGameMdError || (gameMd ?? '') === '' ? (
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
