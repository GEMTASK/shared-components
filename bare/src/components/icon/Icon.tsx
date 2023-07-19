import View from '../view/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import OpenColor from 'open-color';

library.add(fas, far);

type IconProps = {
  icon: React.ComponentProps<typeof FontAwesomeIcon>['icon'],
  color?: React.ComponentProps<typeof View>['fillColor'],
} & React.ComponentProps<typeof FontAwesomeIcon>;

const Icon = ({
  icon,
  color: _color,
  ...props
}: IconProps) => {
  const [color, level] = (_color ?? '')?.split('-') as [keyof OpenColor, number | undefined];
  const iconColor = level ? OpenColor[color][level] : OpenColor[color] as string;

  return (
    <FontAwesomeIcon icon={icon} color={iconColor ?? OpenColor.gray[7]} {...props} />
  );
};

export default Icon;
