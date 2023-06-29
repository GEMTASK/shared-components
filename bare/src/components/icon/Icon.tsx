import View from '../view/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import OpenColor from 'open-color';

library.add(fas, far);

type IconProps = {
  icon: React.ComponentProps<typeof FontAwesomeIcon>['icon'],
  color?: React.ComponentProps<typeof FontAwesomeIcon>['color'],
} & React.ComponentProps<typeof FontAwesomeIcon>;

const Icon = ({
  icon,
  color,
  ...props
}: IconProps) => {
  return (
    <FontAwesomeIcon icon={icon} color={color ?? OpenColor.gray[7]} {...props} />
  );
};

export default Icon;
