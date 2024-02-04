import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import GameDetails from '@/components/GameDetails';
import GameList from '@/components/GameList';
import { GameType } from '@/utils/types';
import { useIntl, useModel } from '@@/exports';
import {
  CalendarOutlined,
  GithubOutlined,
  MenuOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Moon, SunOne } from '@icon-park/react';
import { request, useQuery } from '@umijs/max';
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
    request<GameType[]>('/data.json'),
  );

  const [openGameDetails, setOpenGameDetails] = useState<boolean>(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  return (
    <div>
      <Modal
        open={openGameDetails}
        onCancel={() => {
          setOpenGameDetails(false);
        }}
        onOk={() => {
          setOpenGameDetails(false);
        }}
        footer={false}
        destroyOnClose
      >
        <GameDetails gameId={currentGameId} />
      </Modal>
      <Modal
        destroyOnClose
        title={i18n.formatMessage({ id: 'subscribe' })}
        footer={false}
        open={openSubscribeModal}
        onCancel={() => setOpenSubscribeModal(false)}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value="https://game-calendar.liziyi0914.com/games.ics"
            className="select-all"
            onFocus={(e) => e.target.select()}
          />
          <CopyButton text="https://game-calendar.liziyi0914.com/games.ics">
            <Button type="primary">{i18n.formatMessage({ id: 'copy' })}</Button>
          </CopyButton>
        </Space.Compact>
      </Modal>
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
          onClickGame={(game) => {
            setCurrentGameId(game.id ?? null);
            setOpenGameDetails(true);
          }}
          autoScroll={true}
        />
      </Skeleton>
      <div className="fixed left-0 right-0 top-2 z-40">
        <div className="flex justify-center">
          <div className="w-full max-w-128 px-6 py-2">
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
                <MenuOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
