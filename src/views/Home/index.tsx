import React from "react";
import { BlockHome, ContentWrap, TextNote } from "@/views/Home/style";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <BlockHome>
      <ContentWrap className="blockContainer">
        <TextNote>Website TVGEAR đang nâng cấp. Vui lòng quay lại sau!</TextNote>
      </ContentWrap>
    </BlockHome>
  );
};
export default Home;
