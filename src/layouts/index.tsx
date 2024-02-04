import { Helmet, getAllLocales, setLocale, useIntl } from '@@/exports';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { useModel } from '@umijs/max';
import { App, Button, ConfigProvider, FloatButton, Modal, theme } from 'antd';
import React, { useEffect, useState } from 'react';
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

const Layout: React.FC = () => {
  const { isDark } = useModel('themeModel');
  const i18n = useIntl();

  const [openI18nModal, setOpenI18nModal] = useState(false);
  const [supportLocales, setSupportLocales] = useState<string[]>([]);

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
