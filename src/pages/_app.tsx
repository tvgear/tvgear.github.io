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
        <meta name="description" content="Chuyên cung cấp Gaming Gear 2ND & New chính hãng. Bàn phím cơ, chuột gaming, tai nghe với giá tốt nhất." />
        
        {/* Open Graph / Facebook / Zalo */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tvgear.github.io/" />
        <meta property="og:title" content="TVGEAR Shop | Gaming Gear 2ND & New" />
        <meta property="og:description" content="Chuyên cung cấp Gaming Gear 2ND & New chính hãng. Bàn phím cơ, chuột gaming, tai nghe với giá tốt nhất." />
        <meta property="og:image" content="https://tvgear.github.io/assets/images/og-banner.png" />
        <meta property="og:site_name" content="TVGEAR Shop" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://tvgear.github.io/" />
        <meta name="twitter:title" content="TVGEAR Shop | Gaming Gear 2ND & New" />
        <meta name="twitter:description" content="Chuyên cung cấp Gaming Gear 2ND & New chính hãng. Bàn phím cơ, chuột gaming, tai nghe với giá tốt nhất." />
        <meta name="twitter:image" content="https://tvgear.github.io/assets/images/og-banner.png" />
      </Head>
      <GoogleAnalytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
};

export default MyApp;
