import View, { ViewProps } from "../view/index.js";

type ImageProps = {
  src?: string,
} & Omit<ViewProps, 'children'>;

const Image = ({
  src,
  ...props
}: ImageProps) => {
  return (
    <View as="img" src={src} {...props} />
  );
};

export default Image;
