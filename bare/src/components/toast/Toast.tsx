import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';
import Text from '../text/index.js';
import Stack from '../stack/index.js';
import Icon from '../icon/Icon.js';
import Spacer from '../spacer/Spacer.js';
import Button from '../button/Button.js';

const useStyles = createUseStyles({
  '@keyframes fadeIn': {
    from: { marginBottom: 'var(--height)', opacity: 0.0, transform: 'scale(0.9, 0.9)' },
    to: { marginBottom: '0', opacity: 1.0, transform: 'identity' },
  },
  Toast: {
    animation: '$fadeIn 0.1s ',
    boxShadow: '0 8px 16px hsla(0, 0%, 0%, 0.1), 0 0 0 1px hsla(0, 0%, 0%, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

type ToastProps = {
  message: string,
};

const Toast = ({
  message
}: ToastProps) => {
  const toastElementRef = useRef<HTMLElement>(null);

  const styles = useStyles();

  useLayoutEffect(() => {
    if (toastElementRef.current) {
      // console.log('height', toastElementRef.current.offsetHeight);

      toastElementRef.current.style.setProperty('--height', `${-toastElementRef.current.offsetHeight}px`);
    }
  }, []);

  return (
    <View ref={toastElementRef} horizontal className={styles.Toast} padding="small large" fillColor="white" minWidth={200} maxWidth={400} style={{ pointerEvents: 'auto' }} align="top left">
      <View horizontal style={{ marginTop: 3 }}>
        <Icon size="lg" icon="info-circle" />
        <Spacer size="small" />
        <Text style={{ marginTop: 3 }}>{message}</Text>
      </View>
      <Spacer size="large" />
      <Button size="xsmall" title="Press Me" />
    </View>
  );
};

//
//
//

const List = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const handleToastMessage = (event: CustomEventInit<{ message: string; }>) => {
    const toast = event.detail;

    if (toast) {
      setToasts(toasts => [toast, ...toasts]);

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

        console.log('here');

        return toasts.slice(0, -1);
      });
    }, 3000);
  };

  useEffect(() => {
    window.addEventListener('toast', handleToastMessage);

    return () => {
      window.removeEventListener('toast', handleToastMessage);
    };
  }, []);

  return createPortal(
    <View fixed align="top center" style={{ inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Stack spacing="small" padding="large" align="top center">
        {toasts.map(({ message }) => (
          <Toast key={message} message={message} />
        ))}
      </Stack>
    </View>,
    document.querySelector('#modals') as Element
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
