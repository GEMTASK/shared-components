import React, { useEffect, useRef } from 'react';

import { Image } from 'bare';

const Media = ({ args, ...props }: any) => {
  const imageElementRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let image = new window.Image();

    image.src = `https://webdav.mike-austin.com/${args}`;
    image.onload = () => {
      if (imageElementRef.current?.parentElement?.parentElement) {
        imageElementRef.current.parentElement.parentElement.style.width = `${image.naturalWidth * ((600 - 32) / image.naturalHeight)}px`;
        // imageElementRef.current.parentElement.parentElement.style.height = `${image.naturalHeight + 33}px`;
      }
    };
  }, []);

  return (
    <Image flex ref={imageElementRef} src={`https://webdav.mike-austin.com/${args}`} {...props} />
  );
};

export default React.memo(Media);
