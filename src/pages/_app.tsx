import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Fragment } from "react";
import "@/styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default MyApp;
