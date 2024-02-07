import { theme } from 'antd';
import React from 'react';

const { useToken } = theme;

const Bilibili: React.FC<{
  id: string;
}> = (props) => {
  const { token } = useToken();

  return (
    <iframe
      src={`//player.bilibili.com/player.html?${
        props?.id?.startsWith?.('BV') ? 'bvid=' : 'aid='
      }${props.id}&p=1`}
      scrolling="no"
      frameBorder="no"
      style={{
        border: '0',
        width: '100%',
        height: '24rem',
        borderRadius: token.borderRadiusLG,
      }}
      allowFullScreen={true}
    ></iframe>
  );
};

export default Bilibili;
