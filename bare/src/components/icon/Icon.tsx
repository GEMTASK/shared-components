import View from '../view/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

type IconProps = {
  icon: React.ComponentProps<typeof FontAwesomeIcon>['icon'],
} & React.ComponentProps<typeof FontAwesomeIcon>;

const Icon = ({
  icon,
  ...props
}: IconProps) => {
  return (
    <FontAwesomeIcon icon={icon} {...props} />
  );
};

export default Icon;
