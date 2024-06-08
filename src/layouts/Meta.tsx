import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '@/utils/AppConfig';
import { Fragment } from 'react';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <Fragment>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <meta
          name="twitter:image"
          content={props?.image ?? `${router.basePath}/logo.png`}
        />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
          images: props?.image
            ? [
                {
                  url: props?.image,
                  alt: `Og ${AppConfig.site_name}`,
                  type: 'image/jpeg',
                },
              ]
            : [
                {
                  url: `${router.basePath}/logo.png`,
                  alt: `Og ${AppConfig.site_name}`,
                  type: 'image/jpeg',
                },
              ],
        }}
      />
    </Fragment>
  );
};

export { Meta };
