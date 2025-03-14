import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const LogoSvg = (props) => {
  return (
    <Svg
      width={props.width || 80}
      height={props.height || 32}
      viewBox="0 0 80 32"
      fill="none"
      {...props}
    >
      <Path
        d="M15.2 0L0 8v16l15.2 8 15.2-8V8L15.2 0zM40 8.8h4.8L54.4 32h-5.6l-1.8-4.8h-9.2L36 32h-5.6L40 8.8zM57.6 8.8H63L70.4 20l7.2-11.2H80L70.4 24V32h-5.6v-8L57.6 8.8zM45.6 12L42 22.4h7.2L45.6 12z"
        fill="#f1ebdb"
      />
    </Svg>
  );
};

export const LogoFullSvg = (props) => {
  return (
    <Svg
      width={props.width || 120}
      height={props.height || 32}
      viewBox="0 0 120 32"
      fill="none"
      {...props}
    >
      <Path
        d="M15.2 0L0 8v16l15.2 8 15.2-8V8L15.2 0zM40 8.8h4.8L54.4 32h-5.6l-1.8-4.8h-9.2L36 32h-5.6L40 8.8zM57.6 8.8H63L70.4 20l7.2-11.2H80L70.4 24V32h-5.6v-8L57.6 8.8z"
        fill="#f1ebdb"
      />
      <Path
        d="M82 9h6v23h-6V9zM92 9h5.5l11.5 14V9h6v23h-5.5L98 18v14h-6V9z"
        fill="#0E1424"
      />
      <Path
        d="M115 9h5v23h-5V9zM45.6 12L42 22.4h7.2L45.6 12z"
        fill="#f1ebdb"
      />
    </Svg>
  );
};