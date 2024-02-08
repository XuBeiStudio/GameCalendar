import { useLocalStorageState } from 'ahooks';

const themeModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDark, setIsDark] = useLocalStorageState('dark', {
    defaultValue: false,
  });

  return {
    isDark,
    setIsDark,
  };
};

export default themeModel;
