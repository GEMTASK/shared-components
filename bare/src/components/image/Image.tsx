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
    // <View {...props} style={{ width, height, ...style }}>
    <View as="img" src={src} {...props} style={{ objectFit: 'contain', width, height, ...style }} />
    // </View>
  );
};

export default Image;
