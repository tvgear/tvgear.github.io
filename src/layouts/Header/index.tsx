import React from "react";
import Logo from "@/components/Logo";
import {
  BlockHeader,
  ContentWrap,
  ImgSearch,
  ItemMenu,
  MenuWeb,
  SearchTool,
  WrapCenter,
  WrapHeader,
  WrapLeft,
  WrapRight,
} from "./style";

const dataMenu = [
  {
    nameMenu: "Chuột",
    hrefMenu: "/chuot",
  },
  {
    nameMenu: "Bàn phím",
    hrefMenu: "/ban-phim",
  },
  {
    nameMenu: "Tai nghe",
    hrefMenu: "/tai-nghe",
  },
  {
    nameMenu: "Soundcard",
    hrefMenu: "/souncard",
  },
  {
    nameMenu: "Micro",
    hrefMenu: "/micro",
  },
  {
    nameMenu: "Webcam",
    hrefMenu: "/webcam",
  },
  {
    nameMenu: "Pad",
    hrefMenu: "/pad",
  },
  {
    nameMenu: "Loa",
    hrefMenu: "/loa",
  },
  {
    nameMenu: "Phụ kiện",
    hrefMenu: "/phu-kien",
  },
];

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <BlockHeader>
      <ContentWrap className="blockContainer">
        <WrapHeader>
          <WrapLeft>
            <Logo scale="0.5" />
          </WrapLeft>
          <WrapCenter>
            <MenuWeb>
              {dataMenu.map((item, index) => {
                return (
                  <ItemMenu href={item.hrefMenu} key={index}>
                    {item.nameMenu}
                  </ItemMenu>
                );
              })}
            </MenuWeb>
          </WrapCenter>
          <WrapRight>
            <SearchTool>
              <ImgSearch src="/assets/images/icSearch.svg" />
            </SearchTool>
          </WrapRight>
        </WrapHeader>
      </ContentWrap>
    </BlockHeader>
  );
};
export default Header;
