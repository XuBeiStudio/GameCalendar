import { useModel } from '@@/exports';
import { Affix, theme } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const { useToken } = theme;

const Month: React.FC<{
  value: string;
  container?: () => HTMLElement | Window | null;
  closed?: boolean;
  onClick?: (affixed: boolean) => void;
}> = (props) => {
  const { token } = useToken();
  const { isDark } = useModel('themeModel');
  const { setActiveMonth } = useModel('gamesModel');

  const [affixed, setAffixed] = useState(false);

  const month = useMemo(() => {
    let [y, m] = props.value.split('.');
    if (m.length === 1) {
      m = `0${m}`;
    }
    return `${y}.${m}`;
  }, [props.value]);

  useEffect(() => {
    if (affixed) {
      setActiveMonth(month);
    }
  }, [affixed, month]);

  return (
    <Affix
      onChange={(affixed) => setAffixed(affixed ?? false)}
      target={props.container ?? (() => window)}
    >
      <div
        className={`flex justify-center ${
          affixed && !props.closed ? 'backdrop-blur-3xl shadow-md' : ''
        } rounded-b-lg`}
        style={{
          background:
            props.closed || !affixed
              ? 'transparent'
              : isDark
              ? `linear-gradient(180deg, ${token.colorBgLayout}, rgba(0,0,0,0.4))`
              : `linear-gradient(180deg, ${token.colorBgLayout}, rgba(255,255,255,0.4))`,
        }}
      >
        <div
          className="w-full px-6 py-2"
          onClick={() => {
            props.onClick?.(affixed);
          }}
        >
          <div
            className="-mx-6 px-6 font-extrabold text-right text-6xl select-none"
            style={{
              color: token.colorTextTertiary,
              height: '3.75rem',
            }}
          >
            {props.closed ? '' : month}
          </div>
        </div>
      </div>
    </Affix>
  );
};

export default Month;
