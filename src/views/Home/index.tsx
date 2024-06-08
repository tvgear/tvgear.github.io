import React from "react";
import { BlockHome } from "@/views/Home/style";
import Logo from "@/components/Logo";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <BlockHome>
      {/* <Logo /> */}
      TVGear đang nâng cấp giao diện. Vui lòng quay lại sau
    </BlockHome>
  );
};
export default Home;
