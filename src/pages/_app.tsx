import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Fragment } from "react";
import "@/styles/global.css";
import Layout from "@/layouts";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
};

export default MyApp;
