import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Divider from '../divider/index.js';
import Spacer from '../spacer/index.js';
import Button from '../button/index.js';
import Stack from '../stack/index.js';

const handleWheel = (e: WheelEvent) => e.preventDefault();

const useStyles = createUseStyles({
  '@keyframes fadeIn': {
    from: { opacity: 0.0 },
    to: { opacity: 0.5 },
  },
  '@keyframes scaleIn': {
    from: { opacity: 0.0, transform: 'translate(0, -32px)' },
    to: { opacity: 1.0, transform: 'translate(0, 0)' },
  },
  Overlay: {
    position: 'absolute',
    inset: 0,
    animation: '0.5s $fadeIn forwards',
  },
  Modal: {
    position: 'relative',
    maxWidth: 600,
    borderRadius: 4,
    border: 'none',
    boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.5)',
    animation: '0.5s $scaleIn forwards',
  },
});

type ModalProps = {
  isOpen?: boolean,
  actions?: React.ReactElement[],
  onRequestClose?: () => void,
} & ViewProps;

const Modal = ({
  isOpen,
  actions,
  children,
  onRequestClose,
  ...props
}: ModalProps) => {
  const styles = useStyles();

  useEffect(() => {
    if (isOpen) {
      const container = document.querySelector('#container');

      if (container) {
        (container as any).inert = true;
      }

      document.addEventListener('wheel', handleWheel, {
        passive: false
      });
    } else {
      const container = document.querySelector('#container');

      if (container) {
        (container as any).inert = false;
      }

      document.removeEventListener('wheel', handleWheel);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <View align="middle center" style={{ position: 'fixed', inset: 0 }}>
      <View fillColor="gray-9" className={styles.Overlay} onClick={onRequestClose} />
      <View as="dialog" fillColor="white" minWidth={400} className={styles.Modal} {...props}>
        <View horizontal padding="large" align="middle left">
          <Text flex fontSize="large" >Lorem ipsum dolor sit amet</Text>
          <Button round icon="close" onClick={onRequestClose} />
        </View>
        <View paddingHorizontal="large">
          {children}
        </View>
        <Spacer size="small" />
        <Stack horizontal spacing="small" align="middle right" padding="large">
          {actions?.map((action, index) => (
            React.cloneElement(action, { key: index })
          ))}
        </Stack>
      </View>
    </View>,
    document.querySelector('#modals') as Element
  );
};

export default Modal;
