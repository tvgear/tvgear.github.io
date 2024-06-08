import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import WindowWrapper from "@/components/WindowWrapper";
// import Loading from "@/layouts/Loading";
import styled from "styled-components";
import Home from "@/views/Home";
import Header from "@/layouts/Header";

interface IndexProps {}

const BlockWrapContent = styled.div`
  padding: 55px 0px 0px 0px;
`;

const Index: FunctionComponent<IndexProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([]).then(() =>
      setTimeout(() => {
        setIsLoading(false);
      }, 2000)
    );
  }, []);

  return (
    <Main meta={<Meta title="TVGEAR - Gaming Gear | Office Gear Secondhand & New" description="" image="" />}>
      {/* {isLoading && <Loading />} */}
      <WindowWrapper>
        <Header />
        <BlockWrapContent>
          <Home />
        </BlockWrapContent>
      </WindowWrapper>
    </Main>
  );
};

export default Index;
