import React from "react";
import { BlockLogo, Circle, Line, LineBottomLeft, LineBottomRight, LineCenter, LineTop, WrapBrandLine } from "./style";

interface LogoProps {
  size?: number;
  scale?: number; 
  isText? : boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 80, scale = 1, isText }) => {
  return (
    <BlockLogo size={size} scale={scale} className="blockLogo">
      <Circle>
        <WrapBrandLine>
          <LineTop />
          <LineCenter />
          <LineBottomLeft />
          <LineBottomRight />
        </WrapBrandLine>
      </Circle>
      <Line />
    </BlockLogo>
  );
};

export default Logo;
