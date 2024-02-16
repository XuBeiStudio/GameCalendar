import { useState } from 'react';

const gamesModel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeMonth, setActiveMonth] = useState<string>();

  return {
    activeMonth,
    setActiveMonth,
  };
};

export default gamesModel;
