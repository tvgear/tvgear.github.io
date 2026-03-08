import { ReactNode, useEffect, useRef, useState } from "react";
import Header from "@/layouts/Header";
import Loading from "./Loading";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

import { useRouter } from "next/router";

const WrapWeb = styled.div<{ $isCheckout?: boolean }>`
  height: 100dvh;
  width: 100dvw;
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.$isCheckout ? "linear-gradient(to right, #f9f9f9 50%, #fff 50%)" : "transparent"};
  @media screen and (max-width : 1199px) {
    position: fixed;
    z-index: 10;
  }
  @media screen and (max-width: 767px) {
    background: ${(p) => p.$isCheckout ? "#f9f9f9" : "transparent"};
  }
`;

const Content = styled.div<{ $hasHeader?: boolean }>`
  width: 100%;
  max-width: 1440px;
  margin: 0px auto;
  position: relative;
  padding: ${(p) => (p.$hasHeader ? "68px" : "0px")} 0px 100px 0px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 1199px) {
    overflow-y: auto;
  }
  @media screen and (max-width: 991px) {
    padding-top: ${(p) => (p.$hasHeader ? "50px" : "0px")};
  }
`;
export const Note = styled.div`
  font-size : 1.3rem;
  line-height: calc(1.3rem * 1.25);
  padding: 10px 5px;
  color: #FFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(56,113,224);
  text-transform: uppercase;
  margin: 20px 5px 5px 5px;
  text-align: center;
  a {
    text-decoration: underline;
    margin: 3.5px 0px 2.5px 0px;
    &:hover {
      color : #FFF;
    }
  }
`

const Layout = ({ children }: LayoutProps) => {
 const router = useRouter();
 const isCheckout = router.pathname === "/checkout";
 const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Promise.all([]).then(() =>
      setTimeout(() => {
        setIsLoading(false);
      }, 3500)
    );
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
     <Loading showLoading={isLoading}  />
     <WrapWeb $isCheckout={isCheckout}>
      <Content id="main-content" ref={contentRef} $hasHeader={!isCheckout}>
        {!isCheckout && <Header contentRef={contentRef} />}
        {children}
      </Content>
     </WrapWeb>
    </>
  );
};

export default Layout;
