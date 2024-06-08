import React from "react";
import { BlockHome } from "@/views/Home/style";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <BlockHome>
      TVGear đang nâng cấp giao diện. Vui lòng quay lại sau
    </BlockHome>
  );
};
export default Home;
