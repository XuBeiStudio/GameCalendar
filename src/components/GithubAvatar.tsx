import { request } from '@@/exports';
import { Avatar, AvatarProps } from 'antd';
import React, { useEffect, useState } from 'react';

const Component: React.FC<
  {
    username: string;
  } & AvatarProps
> = (props) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>();

  useEffect(() => {
    request(`https://api.github.com/users/${props.username}`)
      .then((data) => setAvatarUrl(data?.avatar_url ?? null))
      .catch(() => {
        setAvatarUrl(null);
      });
  }, [props.username]);

  return (
    <Avatar
      {...{
        ...props,
        src: avatarUrl,
      }}
    />
  );
};

export default Component;
