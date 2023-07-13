import { useEffect, useRef, useState } from 'react';

import View from '../view/index.js';
import Text from '../text/index.js';
import { createPortal } from 'react-dom';
import Stack from '../stack/index.js';

const List = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const handleToastMessage = (event: CustomEventInit<{ message: string; }>) => {
    const toast = event.detail;

    if (toast) {
      setToasts(toasts => [...toasts, toast]);

      processToasts();
    }
  };

  const processToasts = () => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setToasts(toasts => {
        if (toasts.length > 1) {
          processToasts();
        }

        return toasts.slice(1);
      });
    }, 3000);
  };

  useEffect(() => {
    window.addEventListener('toast', handleToastMessage);

    processToasts();

    return () => {
      window.removeEventListener('toast', handleToastMessage);
    };
  }, []);

  return createPortal(
    <View fixed align="top center" style={{ inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Stack spacing="small" padding="large" style={{ pointerEvents: 'auto' }}>
        {toasts.map(({ message }) => (
          <Toast key={message} message={message} />
        ))}
      </Stack>
    </View>,
    document.querySelector('#modals') as Element
  );
};

type ToastProps = {
  message: string,
};

const Toast = ({
  message
}: ToastProps) => {
  return (
    <View border shadow borderColor="alpha-1" padding="large large" fillColor="white" minWidth={200}>
      <Text>{message}</Text>
    </View>
  );
};

const toast = (message: string) => {
  const event = new CustomEvent("toast", {
    detail: {
      message,
    }
  });

  window.dispatchEvent(event);
};

Toast.List = List;

export default Toast;

export {
  toast,
};
