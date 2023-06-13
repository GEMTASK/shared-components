import { createPortal } from "react-dom";

import View, { ViewProps } from "../view/index.js";
import Text from "../text/index.js";
import Divider from "../divider/index.js";
import Spacer from "../spacer/index.js";
import Button from "../button/index.js";
import Stack from "../stack/index.js";
import { useEffect } from "react";

const handleWheel = (e: WheelEvent) => e.preventDefault();

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
      <View fillColor="gray-9" style={{ position: 'absolute', inset: 0, opacity: 0.5, overscrollBehavior: 'contain' }} />
      <View as="dialog" fillColor="white" minWidth={400} style={{ position: 'relative', maxWidth: 600, borderRadius: 4, border: 'none', boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.5)' }} {...props}>
        <View horizontal paddingHorizontal="large" paddingVertical="large" align="middle left">
          <Text flex fontSize="large" >Header</Text>
          <Button round size="xsmall" icon="close" onClick={onRequestClose} />
        </View>
        <View paddingHorizontal="large">
          {children}
        </View>
        <Spacer size="small" />
        <Stack horizontal spacing="small" align="middle right" paddingVertical="large" paddingHorizontal="large">
          {actions}
        </Stack>
      </View>
    </View>,
    document.querySelector('#modals') as Element
  );
};

export default Modal;
