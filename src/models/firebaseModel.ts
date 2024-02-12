import { Analytics, getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
} from 'firebase/messaging';
import { useCallback, useEffect, useRef } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyD5OZIdQ9NsovaHbDVsx3f_WxpizJzqSxs',
  authDomain: 'gamingepochs.firebaseapp.com',
  projectId: 'gamingepochs',
  storageBucket: 'gamingepochs.appspot.com',
  messagingSenderId: '779623346293',
  appId: '1:779623346293:web:5853654b593c84c1f4c83c',
  measurementId: 'G-Q6N7XZ8206',
};

const vapidKey =
  'BE3PkZ0hWksA0lWNSPskbHMimsCR7cyHh__uCr3DQUW4vKctwHnbDinMi9BEwdwNnLU7gX-T7JJPqFCzUhwAO8Q';

const firebaseModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const app = useRef<FirebaseApp>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const analytics = useRef<Analytics>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const messaging = useRef<Messaging>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryGetMessaging = useCallback(async () => {
    if (!Notification) {
      throw new Error('浏览器不支持Notification');
    }
    let permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('granted');
      messaging.current = getMessaging(app.current);
    } else {
      throw new Error('获取消息推送权限失败');
    }
  }, [app]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryGetMessagingToken = useCallback(async () => {
    if (messaging.current) {
      return await getToken(messaging.current, {
        vapidKey: vapidKey,
      });
    }
    throw new Error('获取Token失败');
  }, [app, messaging]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tryDeleteMessagingToken = useCallback(async () => {
    if (messaging.current) {
      return await deleteToken(messaging.current);
    }
    throw new Error('删除Token失败');
  }, [app, messaging]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    app.current = initializeApp(firebaseConfig);
    analytics.current = getAnalytics(app.current);
  }, []);

  return {
    messaging,
    tryGetMessaging,
    tryGetMessagingToken,
    tryDeleteMessagingToken,
  };
};

export default firebaseModel;
