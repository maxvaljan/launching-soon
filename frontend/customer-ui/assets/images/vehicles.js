import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export const MotorcycleSvg = (props) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Circle cx={32} cy={30} r={6} fill="#f1ebdb" />
      <Circle cx={10} cy={30} r={6} fill="#f1ebdb" />
      <Path
        d="M32 28c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-22 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM31 20l3-9h-15l-1-3H8v3h7l3.3 10H28c0 1.7-1.3 3-3 3s-3-1.3-3-3h-6.7l-.8-2.5L14 11h18.3l-2.5 7.5L28.7 20H31z"
        fill="#f1ebdb"
      />
    </Svg>
  );
};

export const CarSvg = (props) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M33.7 14.9L31.9 10C31.5 9 30.6 8 29.5 8h-19C9.4 8 8.5 9 8.1 10L6.3 14.9C5.5 15.2 5 16 5 17v8c0 1.1.9 2 2 2h1v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3h14v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3h1c1.1 0 2-.9 2-2v-8c0-1-.5-1.8-1.3-2.1zM10.2 11c.2-.5.5-1 1-1h17.5c.5 0 .8.5 1 1l1.7 4H8.5l1.7-4zM10 25c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm20 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        fill="#f1ebdb"
      />
    </Svg>
  );
};

export const VanSvg = (props) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M33 13h-3V8H8c-1.1 0-2 .9-2 2v20h3c0 2.2 1.8 4 4 4s4-1.8 4-4h8c0 2.2 1.8 4 4 4s4-1.8 4-4h3v-9l-3-8zM13 31c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3-7l.6-2h7.9l1-2H11l.6-2h9.9l1-2H12.2l.6-2h12.8l-1.2 3-1.4 4-1.4 3H10zm16 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-7h-3.7l4.3-11.5 1.9 5.1L31 24z"
        fill="#f1ebdb"
      />
    </Svg>
  );
};

export const TruckSvg = (props) => {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
      <Path
        d="M32 11H26V7H6c-1.1 0-2 .9-2 2v22h3c0 2.2 1.8 4 4 4s4-1.8 4-4h10c0 2.2 1.8 4 4 4s4-1.8 4-4h3v-14l-4-6zm-21 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm12-12H6v-4h17v4zm6 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-12h-8v-6h4.8L31 19z"
        fill="#f1ebdb"
      />
      <Rect x="6" y="13" width="17" height="4" fill="#f1ebdb" />
    </Svg>
  );
};