import { theme } from 'antd';
import React from 'react';

const { useToken } = theme;

const Youtube: React.FC<{
  id: string;
}> = (props) => {
  const { token } = useToken();

  return (
    <iframe
      style={{
        width: '100%',
        height: '24rem',
        borderRadius: token.borderRadiusLG,
      }}
      src={`https://www.youtube.com/embed/${props.id}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
};

export default Youtube;
