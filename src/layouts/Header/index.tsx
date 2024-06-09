import React from "react";
import Logo from "@/components/Logo";
import {
  BlockHeader,
  ContentWrap,
  ImgLink,
  ItemLinkDirect,
  ItemMenu,
  MenuWeb,
  WrapCenter,
  WrapHeader,
  WrapLeft,
  WrapLinkDirect,
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
    hrefMenu: "/soundcard",
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
            <Logo scale="0.5" animation />
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
            <WrapLinkDirect>
              <ItemLinkDirect href="https://m.me/tvgear" target="_blank">
                <ImgLink src="/assets/images/icMess.svg" />
              </ItemLinkDirect>
              <ItemLinkDirect
                href="https://facebook.com/tvgear"
                target="_blank"
              >
                <ImgLink src="/assets/images/icShop.svg" />
              </ItemLinkDirect>
            </WrapLinkDirect>
          </WrapRight>
        </WrapHeader>
      </ContentWrap>
    </BlockHeader>
  );
};
export default Header;
