import React, { useEffect, useState } from "react";
import { BlockLoading, PercentLoading } from "./style";
import Logo from "@/components/Logo";

interface LoadingProps {
  showLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ showLoading }) => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    if (showLoading) {
      let start = Date.now();
      const duration = 3000;
      const end = start + duration;
      const step = () => {
        let now = Date.now();
        let progress = Math.min((now - start) / duration, 1);
        setPercent(Math.floor(progress * 100));
        if (now < end) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    } else {
      setPercent(0);
    }
  }, [showLoading]);

  return (
    <BlockLoading className={`${showLoading ? "active" : ""}`}>
      <Logo scale="4" moveAni />
      {percent !== 100 && percent !== 0 && (
        <PercentLoading>{percent}</PercentLoading>
      )}
    </BlockLoading>
  );
};

export default Loading;
