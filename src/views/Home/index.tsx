import React from "react";
import { BlockHome, ContentWrap } from "@/views/Home/style";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <BlockHome>
      <ContentWrap className="blockContainer"></ContentWrap>
    </BlockHome>
  );
};
export default Home;
