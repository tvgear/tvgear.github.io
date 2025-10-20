import { ReactNode, useEffect, useState } from "react";
import Header from "@/layouts/Header";
import Loading from "./Loading";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const WrapWeb = styled.div`
  height: 100dvh;
  width: 100dvw;
  position: relative;
  display: flex;
  flex-direction: column;
  @media screen and (max-width : 1199px) {
    position: fixed;
  }
`;

const Content = styled.div`
  width: 100dvw;
  height: 100dvh;
  border : 1.25px solid #777;
  border-bottom: none;
  border-top: none;
  margin: 0px auto;
  position: relative;
  padding: 0px 0px 25px 0px;
  z-index: 1;
  overflow-y : auto;
  overflow-x : hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`
const Note = styled.div`
  font-size : 1rem;
  line-height: calc(1rem * 1.25);
  padding: 3.5px 5px;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(56,113,224);
  text-transform: uppercase;
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
          <Note>Sản phẩm đang được cập nhật. List hàng đầy đủ vui lòng xem tại bài ghim Facebook</Note>
          {children}
        </Content>
      </WrapWeb>
    </>
  );
};

export default Layout;
