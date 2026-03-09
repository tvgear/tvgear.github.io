import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import Head from "next/head";
import { Fragment } from "react";
import "@/styles/global.css";
import Layout from "@/layouts";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <Head>
        <title>TVGEAR Shop | Gaming Gear 2ND & New</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
};

export default MyApp;
