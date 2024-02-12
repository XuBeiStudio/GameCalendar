import { useCallback, useEffect, useRef } from 'react';

const hmsConfig = {
  apiKey: 'ly2cNr1LffUKXaOwi5kE_UzFkRsQ2Yz0xB5R6p7h',
  projectId: '388421841221962292',
  clientId: '110293601',
  countryCode: 'CN',
};

const vapidKey =
  'BBKKBT_OCqy3e8cRZ1D_qimWzR27bWL-5eEIsltjSfoWXXFX-sQj7F5UDrzjQPBMQKLh5OA077lWiiC96imxSZA';

const huaweiModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const messaging = useRef<any>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // @ts-ignore
    hms.initializeApp(hmsConfig);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryGetMessaging = useCallback(async () => {
    if (!Notification) {
      throw new Error('浏览器不支持Notification');
    }
    let permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('granted');
      // @ts-ignore
      messaging.current = hms.messaging();
    } else {
      throw new Error('获取消息推送权限失败');
    }
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryGetMessagingToken = useCallback(async () => {
    if (messaging.current) {
      messaging.current.usePublicVapidKey(vapidKey);
      return await messaging.current.getToken();
    }
    throw new Error('获取Token失败');
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryDeleteMessagingToken = useCallback(
    async (token: string) => {
      if (messaging.current) {
        return await messaging.current.deleteToken(token);
      }
      throw new Error('删除Token失败');
    },
    [messaging],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker
          .register('/hms-messaging-sw.js', {
            scope: '/',
          })
          .then((registration) => {
            if (registration.installing) {
              console.log('正在安装 Service worker');
            } else if (registration.waiting) {
              console.log('已安装 Service worker installed');
            } else if (registration.active) {
              console.log('激活 Service worker');
            }
          });
      } catch (error) {
        console.error(`注册失败：${error}`);
      }
    }
  }, [messaging]);

  return {
    messaging,
    tryGetMessaging,
    tryGetMessagingToken,
    tryDeleteMessagingToken,
  };
};

export default huaweiModel;
