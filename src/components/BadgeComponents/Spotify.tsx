import React from 'react';

const Playlist: React.FC<{
  id: string;
}> = (props) => {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${props.id}?utm_source=generator&theme=0`}
      width="100%"
      height="352"
      frameBorder="0"
      allowFullScreen={false}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
};

const Track: React.FC<{
  id: string;
}> = (props) => {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${props.id}?utm_source=generator`}
      width="100%"
      height="352"
      frameBorder="0"
      allowFullScreen={false}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
};

export default {
  Playlist,
  Track,
};
