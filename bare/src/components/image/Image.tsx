import View, { ViewProps } from "../view/index.js";

type ImageProps = {
  src?: string,
  width?: number,
  height?: number,
  style?: React.CSSProperties,
} & Omit<ViewProps, 'children'>;

const Image = ({
  src,
  width,
  height,
  style,
  ...props
}: ImageProps) => {
  return (
    <View {...props} style={{ ...style }}>
      <View as="img" src={src} style={{ objectFit: 'contain', width, height }} />
    </View>
  );
};

export default Image;
