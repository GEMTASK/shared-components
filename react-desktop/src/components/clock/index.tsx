import { useCallback, useEffect, useRef, useState } from 'react';

import { Text } from 'bare';

const DigitalClock = () => {
  const [date, setDate] = useState(new Date());
  const timerRef = useRef<number>();

  const updateDate = useCallback(() => {
    const now = new Date();

    setDate(now);

    timerRef.current = window.setTimeout(() => {
      updateDate();
    }, 1000 - now.getMilliseconds());
  }, []);

  useEffect(() => {
    updateDate();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [updateDate]);

  return (
    <Text fontWeight="semibold" align="center">
      {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </Text>
  );
};

export { default } from './Clock';

export {
  DigitalClock
};
