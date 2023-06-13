import View, { ViewProps } from "../view/index.js";
import Text from "../text/index.js";
import Divider from "../divider/index.js";
import Spacer from "../spacer/index.js";
import Button from "../button/index.js";
import Stack from "../stack/index.js";

type ModalProps = {
  isOpen?: boolean,
  onRequestClose?: () => void,
} & ViewProps;

const Modal = ({
  isOpen,
  children,
  onRequestClose,
  ...props
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <View align="middle center" style={{ position: 'fixed', inset: 0 }}>
      <View fillColor="gray-9" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <View fillColor="white" minWidth={400} style={{ position: 'relative', maxWidth: 600, borderRadius: 4 }} {...props}>
        <View horizontal paddingHorizontal="large" paddingVertical="large" align="middle left">
          <Text flex fontSize="large" >Header</Text>
          <Button round size="xsmall" icon="close" onClick={onRequestClose} />
        </View>
        {/* <Divider /> */}
        <Spacer size="small" />
        <View paddingHorizontal="large">
          {children}
        </View>
        {/* <Divider /> */}
        <Spacer size="small" />
        <Stack horizontal spacing="small" align="middle right" paddingVertical="large" paddingHorizontal="large">
          <Button solid primary title="Save" />
          <Button solid title="Cancel" />
        </Stack>
      </View>
    </View>
  );
};

export default Modal;
