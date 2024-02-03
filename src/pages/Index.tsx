import { ReactComponent as XubeiLogo } from '@/assets/imgs/logo.svg';
import GameDetails from '@/components/GameDetails';
import GameList from '@/components/GameList';
import { GameType } from '@/utils/types';
import { request, useQuery } from '@umijs/max';
import { Modal, Skeleton, theme } from 'antd';
import React, { useState } from 'react';

const { useToken } = theme;

const Page: React.FC = () => {
  const { token } = useToken();

  const { data: gameDatas, isLoading } = useQuery(['gameDatas'], async () =>
    request<GameType[]>('/data.json'),
  );

  const [openGameDetails, setOpenGameDetails] = useState<boolean>(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  return (
    <div>
      <Modal
        open={openGameDetails}
        onCancel={() => {
          setOpenGameDetails(false);
        }}
        onOk={() => {
          setOpenGameDetails(false);
        }}
        footer={false}
        destroyOnClose
      >
        <GameDetails gameId={currentGameId} />
      </Modal>
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
        <GameList
          data={gameDatas}
          onClickGame={(game) => {
            setCurrentGameId(game.id ?? null);
            setOpenGameDetails(true);
          }}
          autoScroll={true}
        />
      </Skeleton>
    </div>
  );
};

export default Page;
