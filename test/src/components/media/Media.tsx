import React from 'react';

import { Image } from 'bare';

const Media = ({ ...props }) => {
  return (
    <Image src="images/dramatic_custom_features_1.jpg" {...props} />
  );
};

export default React.memo(Media);
