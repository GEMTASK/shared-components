import React, { useEffect, useRef } from 'react';

import { Image } from 'bare';

const Media = ({ ...props }) => {
  const imageElementRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let image = new window.Image();

    image.src = 'images/dramatic_custom_features_1.jpg';
    image.onload = () => {
      if (imageElementRef.current?.parentElement?.parentElement) {
        imageElementRef.current.parentElement.parentElement.style.width = `${image.naturalWidth}px`;
        imageElementRef.current.parentElement.parentElement.style.height = `${image.naturalHeight + 33}px`;
      }
    };
  }, []);

  return (
    <Image flex ref={imageElementRef} src="images/dramatic_custom_features_1.jpg" {...props} />
  );
};

export default React.memo(Media);
