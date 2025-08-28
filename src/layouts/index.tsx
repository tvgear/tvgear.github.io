import { ReactNode, useEffect, useState } from "react";
import Header from "@/layouts/Header";
import Loading from "./Loading";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const Content = styled.div`
  padding: 165px 0px 0px 0px;
  position: relative;
  z-index: 1;
  @media screen and (max-width : 1199px) {
    padding: 180px 0px 0px 0px;
  }
`

const Layout = ({ children }: LayoutProps) => {
 const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([]).then(() =>
      setTimeout(() => {
        setIsLoading(false);
      }, 3000)
    );
  }, []);
  return (
    <>
      <Loading showLoading={isLoading}  />
      <Header />
      <Content className="blockContainer">
        {children}
      </Content>
    </>
  );
};

export default Layout;
