import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import { Helmet, getAllLocales, setLocale, useIntl } from '@@/exports';
import Icon, {
  CalendarOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/css';
import { Moon, SunOne } from '@icon-park/react';
import { useModel } from '@umijs/max';
import {
  App,
  Button,
  ConfigProvider,
  FloatButton,
  Input,
  Modal,
  Space,
  theme,
} from 'antd';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Outlet } from 'umi';
import './index.less';

const { useToken } = theme;

const langMap: Record<string, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

const Page: React.FC = () => {
  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgLayout,
      }}
      className={`relative ${css`
        & {
          min-height: 100vh;
          min-height: calc(var(--vh, 1vh) * 100);
        }

        /* 设置滚动条的样式 */

        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        /* 滚动槽 */

        *::-webkit-scrollbar-track {
          border-radius: 6px;
        }

        /* 滚动条滑块 */

        *::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background: ${token.colorFillContentHover};
        }

        *::-webkit-scrollbar-thumb:window-inactive {
          background: ${token.colorFillContent};
        }
      `}`}
    >
      <Outlet />
    </div>
  );
};

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

const Layout: React.FC = () => {
  const { isDark, setIsDark } = useModel('themeModel');
  const i18n = useIntl();

  const [openI18nModal, setOpenI18nModal] = useState(false);
  const [supportLocales, setSupportLocales] = useState<string[]>([]);

  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);

  useEffect(() => {
    setSupportLocales(getAllLocales());
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: 'MiSans, system-ui, sans-serif',
        },
      }}
    >
      <Helmet>
        <title>游戏发售时间表 | 序碑</title>
      </Helmet>
      <App>
        <Modal
          destroyOnClose
          title={i18n.formatMessage({ id: 'language' })}
          footer={false}
          open={openI18nModal}
          onCancel={() => setOpenI18nModal(false)}
        >
          {supportLocales.map((lang) => (
            <Button
              key={lang}
              type="text"
              block
              onClick={() => {
                setLocale(lang, false);
                setOpenI18nModal(false);
              }}
            >
              {langMap[lang]}
            </Button>
          ))}
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
              <Button type="primary">
                {i18n.formatMessage({ id: 'copy' })}
              </Button>
            </CopyButton>
          </Space.Compact>
        </Modal>
        <FloatButton.Group>
          <FloatButton
            tooltip={i18n.formatMessage({ id: 'backToTop' })}
            onClick={() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
            icon={<VerticalAlignTopOutlined />}
          />
          <FloatButton
            tooltip={i18n.formatMessage({ id: 'github' })}
            onClick={() => {
              window.location.href =
                'https://github.com/liziyi0914/GameCalendar';
            }}
            icon={<Icon component={XubeiLogo} />}
          />
          <FloatButton
            tooltip={i18n.formatMessage({ id: 'subscribe' })}
            onClick={() => {
              setOpenSubscribeModal(true);
            }}
            icon={<CalendarOutlined />}
          />
          <FloatButton
            tooltip={i18n.formatMessage({ id: 'darkMode' })}
            icon={isDark ? <Moon /> : <SunOne />}
            onClick={() => {
              setIsDark(!isDark);
            }}
          />
        </FloatButton.Group>
        <Page />
      </App>
    </ConfigProvider>
  );
};

export default Layout;
