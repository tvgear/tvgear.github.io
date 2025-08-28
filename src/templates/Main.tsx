import { Fragment, type ReactNode } from "react";
import { SWRConfig } from "swr";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <Fragment>
    {props.meta}
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <>{props.children}</>
    </SWRConfig>
  </Fragment>
);

export { Main };
