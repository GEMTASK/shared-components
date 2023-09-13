import React, { useEffect, useRef, useState } from 'react';

import { View } from 'bare';

const Eyes = ({ ...props }: any) => {
  const svgElementRef = useRef<HTMLElement>(null);

  const [leftEyeAngle, setLeftEyeAngle] = useState(0);
  const [leftEyeLength, setLeftEyeLength] = useState(0);
  const [rightEyeAngle, setRightEyeAngle] = useState(0);
  const [rightEyeLength, setRightEyeLength] = useState(0);

  const handleWindowPointerMove = (event: PointerEvent) => {
    if (svgElementRef.current) {
      const rect = svgElementRef.current.getBoundingClientRect();

      const leftEyeAngle = Math.atan2(
        event.clientY - rect.top - rect.height / 2,
        event.clientX - rect.left - rect.width / 4
      );

      const leftEyeLength = Math.sqrt(
        (event.clientX - rect.left - rect.width / 4) ** 2 + (event.clientY - rect.top - rect.height / 2) ** 2
      ) / 2.5;

      setLeftEyeAngle(leftEyeAngle - Math.PI / 2);
      setLeftEyeLength(leftEyeLength);

      const rightEyeAngle = Math.atan2(
        event.clientY - rect.top - rect.height / 2,
        event.clientX - rect.left - rect.width / 1.5
      );

      const rightEyeLength = Math.sqrt(
        (event.clientX - rect.left - rect.width / 1.5) ** 2 + (event.clientY - rect.top - rect.height / 2) ** 2
      ) / 2.5;

      setRightEyeAngle(rightEyeAngle - Math.PI / 2);
      setRightEyeLength(rightEyeLength);
    }
  };

  useEffect(() => {
    document.addEventListener('pointermove', handleWindowPointerMove);

    return () => {
      document.removeEventListener('pointermove', handleWindowPointerMove);
    };
  }, []);

  const leftEye = {
    x: -Math.sin(leftEyeAngle) * Math.min(leftEyeLength, 10),
    y: +Math.cos(leftEyeAngle) * Math.min(leftEyeLength, 10)
  };

  const rightEye = {
    x: -Math.sin(rightEyeAngle) * Math.min(rightEyeLength, 10),
    y: +Math.cos(rightEyeAngle) * Math.min(rightEyeLength, 10)
  };

  return (
    <View ref={svgElementRef} fillColor="white" {...props}>
      <View as="svg" flex viewBox="0 0 100 100">
        <circle
          cx={25}
          cy={50}
          r={20}
          fill="transparent"
          stroke="#343a40"
          strokeWidth={2}
        />
        <circle
          cx={75}
          cy={50}
          r={20}
          fill="transparent"
          stroke="#343a40"
          strokeWidth={2}
        />
        <circle
          cx={leftEye.x + 25}
          cy={leftEye.y + 50}
          r={5}
          fill="#343a40"
        />
        <circle
          cx={rightEye.x + 75}
          cy={rightEye.y + 50}
          r={5}
          fill="#343a40"
        />
      </View>
    </View>
  );
};

export default Eyes;
