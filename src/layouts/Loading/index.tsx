import { useEffect, useState } from "react";
import { BlockLoading, ImgDirect, ImgLogo, LineBlack, LineGray, WrapMove } from "./style";

interface LoadingProps {
  showLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ showLoading }) => {


  const [startGray, setStartGray] = useState(false);
  const [startBlack, setStartBlack] = useState(false);

 useEffect(() => {
  if (!showLoading) return;
  const grayTimer = setTimeout(() => setStartGray(true), 750);
  const blackTimer = setTimeout(() => setStartBlack(true), 2000);

  return () => {
    clearTimeout(grayTimer);
    clearTimeout(blackTimer);
  };
}, [showLoading]);

  return (
    <BlockLoading className={`${showLoading ? "active" : ""}`}>
      <ImgLogo src="/logo.svg" />
      <WrapMove>
        <LineGray className={startGray ? "active" : ""} />
        <LineBlack className={startBlack ? "active" : ""}>
          <ImgDirect src="/assets/images/icUp.svg" />
        </LineBlack>
      </WrapMove>
    </BlockLoading>
  );
};

export default Loading;
