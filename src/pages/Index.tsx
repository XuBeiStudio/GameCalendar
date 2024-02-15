import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import { ReactComponent as GELogo } from '@/assets/imgs/logo_ge.svg';
import GameList, { GameListContext, GameListCtx } from '@/components/GameList';
import GithubAvatar from '@/components/GithubAvatar';
import PushSettings from '@/components/PushSettings';
import { getGames } from '@/utils/api';
import { CONTRIBUTORS, MAINTAINERS, SITE_ASSETS } from '@/utils/constants';
import { hasWebShare } from '@/utils/functions';
import { platformExec } from '@/utils/platform';
import {
  GithubOutlined,
  MessageOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Moon, SunOne } from '@icon-park/react';
import { history, useIntl, useModel, useQuery } from '@umijs/max';
import {
  App,
  Button,
  Dropdown,
  Input,
  Modal,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
  theme,
} from 'antd';
import dayjs from 'dayjs';
import lodash from 'lodash';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { useToken } = theme;

const CopyButton: React.FC<
  PropsWithChildren<{
    text: string;
  }>
> = (props) => {
  const { message } = App.useApp();
  const i18n = useIntl();

  return (
    <CopyToClipboard
      text={props.text}
      onCopy={() => message.success(i18n.formatMessage({ id: 'copy.success' }))}
    >
      {props.children}
    </CopyToClipboard>
  );
};

const Page: React.FC = () => {
  const { token } = useToken();
  const { isDark, setIsDark } = useModel('themeModel');
  const i18n = useIntl();
  const { platform } = useModel('platformModel');

  const { data: gameDatas, isLoading } = useQuery(['gameDatas'], async () =>
    getGames(),
  );

  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const VERSION = useMemo(() => {
    // @ts-ignore
    let time = dayjs(BUILD_TIME);
    // @ts-ignore
    return `${BUILD_ENV}_${time.format('YYYYMMDD_HHmmss')}`;
  }, []);

  return (
    <div>
      <Modal
        title="设置"
        open={openSettingsModal}
        destroyOnClose
        footer={false}
        onCancel={() => setOpenSettingsModal(false)}
      >
        <Tabs
          tabPosition="left"
          items={[
            {
              key: 'calendar',
              label: '日历',
              children: (
                <>
                  <div className="pb-2 font-semibold">订阅地址</div>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      value={`${SITE_ASSETS}/games.ics`}
                      className="select-all"
                      onFocus={(e) => e.target.select()}
                    />
                    <CopyButton text={`${SITE_ASSETS}/games.ics`}>
                      <Button type="primary">
                        {i18n.formatMessage({ id: 'copy' })}
                      </Button>
                    </CopyButton>
                  </Space.Compact>
                </>
              ),
            },
            {
              key: 'push',
              label: '推送(测试)',
              children: <PushSettings />,
            },
            {
              key: 'about',
              label: '关于',
              children: (
                <>
                  <div className="font-semibold pb-2 select-none">构建编号</div>
                  <div className="pb-3 select-none">{VERSION}</div>
                  <div className="font-semibold pb-2 select-none">Github</div>
                  <div className="pb-3">
                    <Button
                      type="text"
                      icon={<GithubOutlined />}
                      onClick={() => {
                        window.location.href =
                          'https://github.com/XuBeiStudio/GameCalendar';
                      }}
                    >
                      XuBeiStudio/GameCalendar
                    </Button>
                  </div>
                  <div className="font-semibold pb-2 select-none">
                    主要贡献者
                  </div>
                  <div className="pb-3">
                    <div className="flex flex-col gap-y-2">
                      {MAINTAINERS.map((username) => (
                        <div
                          className="flex items-center gap-x-2"
                          key={username}
                        >
                          <div>
                            <GithubAvatar username={username} />
                          </div>
                          <div className="flex-grow select-none">
                            {username}
                          </div>
                          <Button
                            type="text"
                            icon={<GithubOutlined />}
                            onClick={() =>
                              (window.location.href = `https://github.com/${username}`)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="font-semibold pb-2 select-none">维护者</div>
                  <div className="pb-3">
                    <div className="flex flex-col gap-y-2 group">
                      {lodash
                        .values(
                          lodash.groupBy(
                            CONTRIBUTORS.map((obj: any, i) => ({
                              item: obj,
                              index: i,
                            })),
                            (o: any) => Math.floor(o.index / 5),
                          ),
                        )
                        .map((group, i) => (
                          <div key={i} className="flex">
                            {group
                              .map((o) => o.item)
                              .map((username: string, j) => (
                                <div
                                  key={`${i}-${j}`}
                                  className="-me-4 transition-all duration-100 ease-in-out translate-x-0 group-hover:me-1"
                                >
                                  <Tooltip title={username}>
                                    <GithubAvatar
                                      username={username}
                                      onClick={() => {
                                        window.location.href = `https://github.com/${username}`;
                                      }}
                                    />
                                  </Tooltip>
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ),
            },
          ]}
        />
      </Modal>
      <div className="flex justify-center">
        <div className="w-full max-w-128 px-6 py-2">
          <div className="fixed top-4 z-40">
            {platform === 'android' && (
              <Button
                type="text"
                size="large"
                onClick={() => {
                  platformExec({
                    android: 'openSettingsPage',
                  })?.('').then();
                }}
              >
                <XubeiLogo
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    fill: token.colorTextSecondary,
                  }}
                />
              </Button>
            )}
            {platform === 'web' && (
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
                    ...(hasWebShare()
                      ? [
                          {
                            key: 'share',
                            label: i18n.formatMessage({ id: 'share' }),
                            icon: <ShareAltOutlined />,
                            onClick: () => {
                              navigator.share({
                                title: i18n.formatMessage({ id: 'site' }),
                                text: i18n.formatMessage({ id: 'site' }),
                                url: window.location.href,
                              });
                            },
                          },
                        ]
                      : []),
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
                      key: 'settings',
                      label: i18n.formatMessage({ id: 'settings' }),
                      icon: <SettingOutlined />,
                      onClick: () => {
                        setOpenSettingsModal(true);
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
                <Button type="text" size="large">
                  <XubeiLogo
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      fill: token.colorTextSecondary,
                    }}
                  />
                </Button>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-128">
          <div className="fixed left-4 bottom-4">
            <GELogo
              width={256}
              height={256}
              style={{
                fill: isDark ? '#555' : '#ccc',
                stroke: isDark ? '#555' : '#ccc',
              }}
            />
          </div>
        </div>
      </div>
      <Skeleton loading={isLoading} active>
        <GameListCtx.Provider value={new GameListContext()}>
          <GameList
            data={gameDatas}
            onClickGame={(game) => {
              platformExec({
                android: 'openGamePage',
                web: (id) => {
                  history.push(`/game/${id}`);
                },
              })?.(game.id ?? '').then();
            }}
            autoScroll={true}
          />
        </GameListCtx.Provider>
      </Skeleton>
    </div>
  );
};

export default Page;
