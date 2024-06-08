import React from "react";
import { BlockLogo, Triangle, WrapLogo } from "./style";

interface AboutProps {}

const Logo: React.FC<AboutProps> = () => {
  return (
    <BlockLogo>
      <WrapLogo>
        <Triangle />
        aa
      </WrapLogo>
    </BlockLogo>
  );
};

export default Logo;
