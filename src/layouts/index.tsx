import { ReactNode, useEffect, useState } from "react";
import Header from "@/layouts/Header";
import Loading from "./Loading";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const WrapWeb = styled.div`
  background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  height: 100dvh;
  position: relative;
  display: flex;
  flex-direction: column;
  @media screen and (max-width : 1199px) {
    position: fixed;
    width: 100dvw;
  }
`;

const Content = styled.div`
  background: rgba(21,20,24);
  height: calc(100dvh - 75px);
  width: calc(100dvw - 20px);
  margin: 2px auto 0px auto;
  max-width: 1440px;
  position: relative;
  border-radius: 20px;
  padding: 0px;
  z-index: 1;
  overflow-y : auto;
  overflow-x : hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width : 1199px) {
    height: calc(100dvh - 55px);
    width: calc(100dvw - 15px);
    margin: 0px 0px 0px 7.5px;
    border-radius: 18px;
  }
  
`

const Layout = ({ children }: LayoutProps) => {
 const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([]).then(() =>
      setTimeout(() => {
        setIsLoading(false);
      }, 3500)
    );
  }, []);
  return (
    <>
     <Loading showLoading={isLoading}  />
      <WrapWeb>
        <Header />
        <Content>
          {children}
        </Content>
      </WrapWeb>
    </>
  );
};

export default Layout;
