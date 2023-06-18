import View, { ViewProps } from "../view/index.js";
import Image from "../image/Image.js";
import Text from "../text/Text.js";
import Spacer from "../spacer/Spacer.js";

type CardProps = {
  imageSrc?: string,
  title?: string,
  subtitle?: string,
  extra?: ViewProps['children'],
} & ViewProps;

const Card = ({
  imageSrc,
  title,
  subtitle,
  extra,
  children,
  ...props
}: CardProps) => {
  return (
    <View border fillColor="white" {...props}>
      <Image src={imageSrc} style={{ mixBlendMode: 'multiply' }} />
      <View padding="large">
        <View horizontal>
          <View flex>
            <Text fontSize="medium" fontWeight="semibold">
              {title}
            </Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6">
              {subtitle}
            </Text>
          </View>
          <View>
            {extra}
          </View>
        </View>
        <Spacer size="large" />
        {children}
      </View>
    </View>
  );
};

export default Card;
