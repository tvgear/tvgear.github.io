import { useEffect, useState } from "react";
import { BlockLoading, LineGradient, LineGray, WrapMove } from "./style";
import Logo from "@/components/Logo";

interface LoadingProps {
  showLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ showLoading }) => {


  const [startGray, setStartGray] = useState(false);
  const [startGradient, setStartGradient] = useState(false);

 useEffect(() => {
  if (!showLoading) return;
  const grayTimer = setTimeout(() => setStartGray(true), 750);
  const gradientTimer = setTimeout(() => setStartGradient(true), 2000);

  return () => {
    clearTimeout(grayTimer);
    clearTimeout(gradientTimer);
  };
}, [showLoading]);

  return (
    <BlockLoading className={`${showLoading ? "active" : ""}`}>
      <Logo size={120} />
      <WrapMove>
        <LineGray className={startGray ? "active" : ""} />
        <LineGradient className={startGradient ? "active" : ""}>
          <Logo size={100} />
        </LineGradient>
      </WrapMove>
    </BlockLoading>
  );
};

export default Loading;
