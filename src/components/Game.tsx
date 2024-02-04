import PlatformIcons from '@/components/PlatformIcons';
import { GameDataType } from '@/utils/types';
import { Image, theme } from 'antd';
import React, { useMemo } from 'react';

const { useToken } = theme;

const FallbackImg =
  'data:image/png;base64,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';

const Game: React.FC<{
  config: GameDataType;
  onClick?: () => void;
}> = (props) => {
  const { token } = useToken();

  const todayRelease = useMemo(() => {
    const releaseDate = new Date(props.config?.releaseDate ?? '1970.01.01');
    const today = new Date();
    return releaseDate.toDateString() === today.toDateString();
  }, [props.config]);

  return (
    <div
      className="relative my-4 overflow-hidden shadow-md select-none cursor-pointer"
      style={{
        borderRadius: token.borderRadiusLG,
        background: props.config.bgColor ?? 'white',
        height: '9.6875rem',
      }}
      onClick={() => {
        props.onClick?.();
      }}
    >
      {/*背景*/}
      <div>
        {props.config.bg && (
          <Image
            src={props.config.bg ?? ''}
            className="object-cover"
            height="9.6875rem"
            width="100%"
            alt="bg"
            loading="lazy"
            preview={false}
            fallback={FallbackImg}
          />
        )}
      </div>
      {/*游戏logo*/}
      <div className="absolute top-0 right-0 py-2 px-6">
        {props.config.logo && (
          <Image
            src={props.config.logo}
            className="object-cover"
            height="4rem"
            alt="logo"
            loading="lazy"
            preview={false}
            fallback={FallbackImg}
          />
        )}
      </div>
      {/*渐变层*/}
      <div
        className="absolute top-0 left-0 bottom-0 right-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
      {/*游戏名称、副标题*/}
      <div
        className="absolute top-0 left-0 py-2 px-6"
        style={{
          color: props.config.leftColor ?? 'black',
        }}
      >
        <div>
          <div className="font-extrabold text-lg truncate w-64 text-shadow-lg">
            {props.config.title ?? ''}
          </div>
          <div className="font-medium leading-5 truncate w-64 text-shadow-lg">
            {(props.config.subtitle ?? []).map((name, index) => (
              <div key={`${props.config.subtitle}_${index}`}>{name}</div>
            ))}
          </div>
        </div>
      </div>
      {/*发售日期、平台*/}
      <div
        className={`absolute right-0 bottom-0 pb-2 pt-1 px-6 ${
          todayRelease
            ? 'backdrop-blur-md bg-white bg-opacity-20 shadow-lg'
            : ''
        } text-shadow-lg`}
        style={{
          color: todayRelease ? 'white' : props.config.rightColor ?? 'black',
          borderTopLeftRadius: token.borderRadius,
        }}
      >
        <div>
          <div className="font-bold text-right">
            {todayRelease ? '🎉今日发售' : props.config.releaseDate ?? ''}
          </div>
          <div>
            <div
              className="flex gap-x-1 justify-end"
              style={{
                fontSize: '0.5rem',
              }}
            >
              {(props.config.platforms ?? [])
                ?.map((p) => PlatformIcons[p])
                .map((Comp, index) => (
                  <Comp key={`${props.config.title ?? ''}_${index}`} />
                ))}
            </div>
          </div>
        </div>
      </div>
      {/*会员免费*/}
      <div
        className="absolute bottom-0 left-0 overflow-hidden text-xs text-center"
        style={{
          borderTopRightRadius: token.borderRadius,
        }}
      >
        {(props.config.free ?? []).includes('XGP') && (
          <div
            className="px-3 py-1"
            style={{
              backgroundColor: '#107c10',
              color: 'white',
            }}
          >
            Xbox Game Pass
          </div>
        )}
        {(props.config.free ?? []).includes('PSPlus') && (
          <div
            className="px-3 py-1"
            style={{
              backgroundColor: '#00439c',
              color: 'white',
            }}
          >
            PlayStation Plus
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
