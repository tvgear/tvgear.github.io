import React from "react";
import { BlockHome } from "@/views/Home/style";
import Logo from "@/components/Logo";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <BlockHome>
      <Logo />
    </BlockHome>
  );
};
export default Home;
