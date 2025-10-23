import { ReactNode, useEffect, useState } from "react";
import Header from "@/layouts/Header";
import Loading from "./Loading";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const WrapWeb = styled.div`
  /* Chiều cao toàn trang – ưu tiên svh để xử lý thanh URL iOS */
  height: 100vh;
  @supports (height: 100svh) {
    height: 100svh;
  }
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  /* KHÔNG đặt fixed trên mobile để tránh khoá scroll lồng */
  @media (max-width: 1199px) {
    position: relative;
    z-index: 10;
  }
`;

const Content = styled.div`
  /* Vùng cuộn chính */
  flex: 1 1 auto;
  min-height: 0; /* bắt buộc để flex child cho phép overflow */
  width: 100%;
  position: relative;
  z-index: 10;

  border: 1.25px solid #777;
  border-bottom: none;
  border-top: none;
  margin: 0 auto;
  padding: 0 0 25px 0;

  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1199px) {
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Ổn định layer cuộn cho iOS hiếm khi bị kẹt repaint */
  transform: translateZ(0);
  will-change: transform;
`;

const Note = styled.div`
  font-size: 1.2rem;
  line-height: calc(1.2rem * 1.25);
  padding: 5px 5px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(56, 113, 224);
  text-transform: uppercase;
  margin: 20px 5px 5px 5px;
  text-align: center;
  a {
    text-decoration: underline;
    margin: 3.5px 0 2.5px 0;
    &:hover {
      color: #fff;
    }
  }
`;

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
      <Loading showLoading={isLoading} />
      <WrapWeb>
        <Header />
        <Content>
          {children}
          <Note>
            Danh sách sản phẩm đang được cập nhật lên website
            <br />
            List đầy đủ vui lòng xem tại bài ghim Facebook
            <br />
            <a href="https://facebook.com/tvgear" target="_blank" rel="noreferrer">
              https://facebook.com/tvgear
            </a>
          </Note>
        </Content>
      </WrapWeb>
    </>
  );
};

export default Layout;
