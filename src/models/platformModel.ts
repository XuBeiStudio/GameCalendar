import { getPlatform } from '@/utils/platform';
import { useEffect, useState } from 'react';

const platformModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [platform, setPlatform] = useState(getPlatform());

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (platform === 'android') {
      // @ts-ignore
      window?.['AndroidJsSdk']?.init?.();
    }
  }, [platform]);

  return {
    platform,
    setPlatform,
  };
};

export default platformModel;
