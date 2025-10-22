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
    z-index: 10;
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
  z-index: 10;
  padding: 0px 0px 25px 0px;
  overflow-y : auto;
  overflow-x : hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width : 1199px) {
    overflow-y : auto;
    overflow-x : auto;
  }
`
const Note = styled.div`
  font-size : 1.2rem;
  line-height: calc(1.2rem * 1.25);
  padding: 5px 5px;
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
        <Note>Danh sách sản phẩm đang được cập nhật lên website<br />List đầy đủ vui lòng xem tại bài ghim Facebook<br /><a href="https://facebook.com/tvgear" target="_blank">https://facebook.com/tvgear</a></Note>
      </Content>
     </WrapWeb>
    </>
  );
};

export default Layout;
