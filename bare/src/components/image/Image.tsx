import View, { ViewProps } from "../view/index.js";

type ImageProps = {
  src?: string,
  width?: number,
  height?: number,
  round?: boolean,
  style?: React.CSSProperties,
} & Omit<ViewProps, 'children'>;

const Image = ({
  src,
  width,
  height,
  round,
  style,
  ...props
}: ImageProps) => {
  const imageStyle = {
    objectFit: 'contain',
    width,
    height,
    ...(round && { borderRadius: 1000 })
  } as const;

  return (
    <View {...props} style={{ ...style }}>
      <View as="img" src={src} style={imageStyle} />
    </View>
  );
};

export default Image;
