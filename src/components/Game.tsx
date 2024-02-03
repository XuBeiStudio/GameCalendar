import PlatformIcons from '@/components/PlatformIcons';
import { GameType } from '@/utils/types';
import { theme } from 'antd';
import React from 'react';

const { useToken } = theme;

const Game: React.FC<{
  config: GameType;
  onClick?: () => void;
}> = (props) => {
  const { token } = useToken();

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
      <div>
        {props.config.bg && (
          <img
            src={props.config.bg ?? ''}
            className="object-cover"
            style={{
              height: '9.6875rem',
              width: '100%',
            }}
            alt="bg"
            loading="lazy"
          />
        )}
      </div>
      <div className="absolute top-0 right-0 py-2 px-6">
        {props.config.logo && (
          <img
            src={props.config.logo}
            className="object-cover h-16"
            alt="logo"
            loading="lazy"
          />
        )}
      </div>
      <div
        className="absolute top-0 left-0 bottom-0 right-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
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
      <div
        className="absolute right-0 bottom-0 py-2 px-6"
        style={{
          color: props.config.rightColor ?? 'black',
        }}
      >
        <div>
          <div className="font-bold text-right text-shadow-lg">
            {props.config.releaseDate ?? ''}
          </div>
          <div>
            <div
              className="flex gap-x-1 justify-end text-shadow-lg"
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
    </div>
  );
};

export default Game;
