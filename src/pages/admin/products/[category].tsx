import { GetStaticPaths, GetStaticProps } from "next";

export { default } from "../products";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ["mouse", "keyboard", "headphone", "accessories"].map((category) => ({ params: { category } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async () => ({ props: {} });
