import React from "react";
import { BlockLogo, Circle, CirclePoint, Line, WrapLogo } from "./style";

interface AboutProps {
  scale?: string;
  animation?: boolean;
  moveAni? : boolean;
}

const Logo: React.FC<AboutProps> = ({ scale, animation, moveAni }) => {
  return (
    <BlockLogo style={{ transform: `scale(${scale})` }}>
      <WrapLogo className={`${animation ? "active" : "" || moveAni ? "move" : ""}`}>
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
