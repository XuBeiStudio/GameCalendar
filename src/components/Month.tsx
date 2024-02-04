import { useModel } from '@@/exports';
import { Affix, theme } from 'antd';
import React, { useMemo, useState } from 'react';

const { useToken } = theme;

const Month: React.FC<{
  value: string;
  container?: () => HTMLElement | Window | null;
  closed?: boolean;
}> = (props) => {
  const { token } = useToken();
  const { isDark } = useModel('themeModel');

  const [affixed, setAffixed] = useState(false);

  const month = useMemo(() => {
    let [y, m] = props.value.split('.');
    if (m.length === 1) {
      m = `0${m}`;
    }
    return `${y}.${m}`;
  }, [props.value]);

  return (
    <Affix
      onChange={(affixed) => setAffixed(affixed ?? false)}
      target={props.container ?? (() => window)}
    >
      <div
        className={`flex justify-center ${
          affixed && !props.closed ? 'backdrop-blur-3xl shadow-md' : ''
        }`}
        style={{
          backgroundColor:
            props.closed || !affixed
              ? 'transparent'
              : isDark
              ? 'rgba(0,0,0,0.2)'
              : 'rgba(255,255,255,0.2)',
        }}
      >
        <div className="w-full max-w-128 px-6 py-2">
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
