import { getPlatform } from '@/utils/platform';
import { useEffect, useState } from 'react';

const platformModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [platform, setPlatform] = useState(getPlatform());

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (platform !== 'android') {
      console.log(getPlatform());
      const onBridgeReady = () => {
        console.log('WebViewJavascriptBridgeReady');
        setPlatform('android');
      };

      document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady);

      return () => {
        document.removeEventListener(
          'WebViewJavascriptBridgeReady',
          onBridgeReady,
        );
      };
    }
  }, []);

  return {
    platform,
    setPlatform,
  };
};

export default platformModel;
