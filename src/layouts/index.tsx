import { PushSettingsType } from '@/components/PushSettings';
import { refreshWebPush } from '@/utils/api';
import { Helmet, getAllLocales, setLocale, useIntl } from '@@/exports';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useModel } from '@umijs/max';
import { useLocalStorageState } from 'ahooks';
import { App, Button, ConfigProvider, FloatButton, Modal, theme } from 'antd';
import dayjs from 'dayjs';
import eruda from 'eruda';
import { onMessage } from 'firebase/messaging';
import React, { useEffect, useState } from 'react';
import { isSafari } from 'react-device-detect';
import { Outlet } from 'umi';
import './index.less';

const { useToken } = theme;

const langMap: Record<string, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

const Page: React.FC = () => {
  const { token } = useToken();
  const [pushSettings, setPushSettings] =
    useLocalStorageState<PushSettingsType | null>('pushSettings', {
      defaultValue: null,
    });
  const { messaging, tryGetMessaging } = useModel('firebaseModel');
  const { notification } = App.useApp();

  useEffect(() => {
    if (pushSettings?.updatedAt) {
      let updatedAt = pushSettings?.updatedAt;
      if (dayjs().diff(dayjs(updatedAt), 'day') > 1) {
        refreshWebPush(
          pushSettings.platform,
          pushSettings.token,
          pushSettings.secret,
        ).then((result) => {
          if (result.code === 200) {
            setPushSettings({
              ...pushSettings,
              updatedAt: new Date().getTime(),
            });
          }
        });
      }

      let unsubscribe = () => {};
      tryGetMessaging().then(() => {
        if (messaging.current) {
          console.log(messaging);
          unsubscribe = onMessage?.(messaging.current, (payload) => {
            console.log('Message received. ', payload);
            notification.info({
              message: payload.notification?.title,
              description: payload.notification?.body,
              duration: 0,
            });
          });
          console.log(unsubscribe);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [pushSettings, notification]);

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

const Layout: React.FC = () => {
  const { isDark } = useModel('themeModel');
  const i18n = useIntl();

  const [openI18nModal, setOpenI18nModal] = useState(false);
  const [supportLocales, setSupportLocales] = useState<string[]>([]);

  useEffect(() => {
    setSupportLocales(getAllLocales());

    if (
      (process.env.NODE_ENV === 'development' ||
        window.location.href.includes('__debug_eruda=1')) &&
      eruda
    ) {
      eruda.init();
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: isSafari
            ? '"San Francisco", "Helvetica Neue", "PingFang SC", system-ui, sans-serif'
            : '"MiSans VF", system-ui, sans-serif',
        },
      }}
    >
      <Helmet>
        <html
          //@ts-ignore
          style={`font-family: ${
            isSafari
              ? '"San Francisco", "Helvetica Neue", "PingFang SC"'
              : '"MiSans VF", '
          }system-ui, sans-serif;scroll-behavior: smooth;`}
        />
        <title>{i18n.formatMessage({ id: 'site' })}</title>
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
        <FloatButton.BackTop
          tooltip={i18n.formatMessage({ id: 'backToTop' })}
          icon={<VerticalAlignTopOutlined />}
        />
        <Page />
      </App>
    </ConfigProvider>
  );
};

export default Layout;
