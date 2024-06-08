import React from "react";
import { BlockLogo, Circle, CirclePoint, Line, WrapLogo } from "./style";

interface AboutProps {
    scale? : string;
}

const Logo: React.FC<AboutProps> = ({ scale }) => {
  return (
    <BlockLogo style={{ transform : `scale(${scale})`}}>
      <WrapLogo>
        <Circle>
          <CirclePoint>
            <Line />
            <Line />
          </CirclePoint>
        </Circle>
      </WrapLogo>
    </BlockLogo>
  );
};

export default Logo;
