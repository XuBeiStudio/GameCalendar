import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import GameList from '@/components/GameList';
import { GameType } from '@/utils/types';
import { request, useQuery } from '@umijs/max';
import { Skeleton, theme } from 'antd';
import React from 'react';

const { useToken } = theme;

const Page: React.FC = () => {
  const { token } = useToken();

  const { data: gameDatas, isLoading } = useQuery(['gameDatas'], async () =>
    request<GameType[]>('/data.json'),
  );

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-full max-w-128">
          <div className="fixed left-4 bottom-4">
            <XubeiLogo
              width={256}
              height={256}
              style={{
                fill: token.colorTextQuaternary,
              }}
            />
          </div>
        </div>
      </div>
      <Skeleton loading={isLoading} active>
        <GameList data={gameDatas} onClickGame={() => {}} autoScroll={true} />
      </Skeleton>
    </div>
  );
};

export default Page;
