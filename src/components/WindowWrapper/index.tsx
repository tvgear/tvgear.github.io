import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

const WindowWrapper = ({ children }: Props) => {
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowReadyFlag(true);
    }
  }, [router.route]);

  if (windowReadyFlag) {
    return <Fragment>{children}</Fragment>;
  }
  return null;
};

export default WindowWrapper;
