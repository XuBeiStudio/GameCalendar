import { Affix, theme } from 'antd';
import React, { useMemo, useState } from 'react';

const { useToken } = theme;

const Month: React.FC<{
  value: string;
  container?: () => HTMLElement | Window | null;
}> = (props) => {
  const { token } = useToken();

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
        className={`flex justify-center ${affixed ? 'backdrop-blur-2xl' : ''}`}
      >
        <div className="w-full max-w-128 px-6 py-2">
          <div
            className="-mx-6 px-6 font-extrabold text-right text-6xl select-none"
            style={{
              color: token.colorTextTertiary,
            }}
          >
            {month}
          </div>
        </div>
      </div>
    </Affix>
  );
};

export default Month;
