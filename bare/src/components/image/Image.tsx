import React from 'react';
import View, { ViewProps } from '../view/index.js';

type ImageProps = {
  src?: string,
  width?: number | string,
  height?: number | string,
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
  const {
    objectFit,
    objectPosition,
  } = style ?? {};

  const imageStyle = {
    objectFit: objectFit ?? 'contain',
    objectPosition,
    width,
    height,
    ...(round && { borderRadius: 1000 })
  } as const;

  return (
    <View {...props} style={{ overflow: 'hidden', ...style }}>
      <View as="img" src={src} style={imageStyle} />
    </View>
  );
};

export default Image;
