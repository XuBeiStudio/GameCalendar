import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import { ReactComponent as GELogo } from '@/assets/imgs/logo_ge.svg';
import GameList, { GameListContext, GameListCtx } from '@/components/GameList';
import { getGames } from '@/utils/api';
import { SITE_ASSETS } from '@/utils/constants';
import { hasWebShare } from '@/utils/functions';
import {
  CalendarOutlined,
  GithubOutlined,
  MessageOutlined,
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
  theme,
} from 'antd';
import React, { PropsWithChildren, useState } from 'react';
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

  const { data: gameDatas, isLoading } = useQuery(['gameDatas'], async () =>
    getGames(),
  );

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  return (
    <div>
      <Modal
        destroyOnClose
        title={i18n.formatMessage({ id: 'subscribe' })}
        footer={false}
        open={openSubscribeModal}
        onCancel={() => setOpenSubscribeModal(false)}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={`${SITE_ASSETS}/games.ics`}
            className="select-all"
            onFocus={(e) => e.target.select()}
          />
          <CopyButton text={`${SITE_ASSETS}/games.ics`}>
            <Button type="primary">{i18n.formatMessage({ id: 'copy' })}</Button>
          </CopyButton>
        </Space.Compact>
      </Modal>
      <div className="flex justify-center">
        <div className="w-full max-w-128 px-6 py-2">
          <div className="fixed top-4 z-40">
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
                    key: 'subscribe',
                    label: i18n.formatMessage({ id: 'subscribe' }),
                    icon: <CalendarOutlined />,
                    onClick: () => {
                      setOpenSubscribeModal(true);
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
              history.push(`/game/${game.id}`);
            }}
            autoScroll={true}
          />
        </GameListCtx.Provider>
      </Skeleton>
    </div>
  );
};

export default Page;
