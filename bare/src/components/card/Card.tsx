import React from 'react';

import View, { ViewProps } from '../view/index.js';
import Image from '../image/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

type CardProps = {
  imageSrc?: string,
  imageWidth?: number,
  headingTitle?: string,
  headingTitleRight?: string,
  headingSubtitle?: string,
  headingSubtitleRight?: string | ViewProps['children'],
  extra?: ViewProps['children'],
} & ViewProps;

const Card = ({
  imageSrc,
  imageWidth,
  headingTitle,
  headingTitleRight,
  headingSubtitle,
  headingSubtitleRight,
  extra,
  children,
  ...props
}: CardProps) => {
  const subtitleRightElement = headingSubtitleRight !== undefined && typeof headingSubtitleRight === 'string' ? (
    <Text fontSize="xsmall" textColor="gray-6">
      {headingSubtitleRight}
    </Text>
  ) : headingSubtitleRight;

  return (
    <View border fillColor="white" {...props}>
      <Image src={imageSrc} width={imageWidth} height="100%" style={{ objectFit: 'cover', objectPosition: 'left  center' }} />
      <View flex padding="large">
        <View horizontal>
          <View flex>
            <Text fontSize="medium" fontWeight="semibold">
              {headingTitle}
            </Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6">
              {headingSubtitle}
            </Text>
          </View>
          <View>
            {extra}
          </View>
          <Spacer size="small" />
          {!!headingTitleRight && (
            <View>
              <Text fontSize="medium">
                {headingTitleRight}
              </Text>
              <Spacer size="small" />
              {subtitleRightElement}
            </View>
          )}
        </View>
        <Spacer size="large" />
        {children}
      </View>
    </View>
  );
};

export default Card;
