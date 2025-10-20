import React, { useEffect, useRef } from "react";
import {
  BlockHeader,
  ImgLogo,
  ItemMenu,
  LeftHeader,
  ListMenu,
  NameMenu,
  RightHeader,
  TextLogo,
  WrapLogo,
} from "./style";
import Link from "next/link";
import { useRouter } from "next/router";

const dataMenu = [
  { name: "Chuột", link: "/mouse" },
  { name: "Phím", link: "/keyboard" },
  // { name: "Tai Nghe", link: "/headphone" },
  // { name: "SoundCard", link: "/soundcard" },
  // { name: "Loa", link: "/speaker" },
  // { name: "Micro", link: "/micro" },
  // { name: "Webcam", link: "/webcam" },
];

const Header: React.FC = () => {
  const router = useRouter();
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = dataMenu.findIndex((menu) =>
      router.asPath.startsWith(menu.link)
    );
    if (activeIndex !== -1 && menuRefs.current[activeIndex]) {
      menuRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [router.asPath]);

  return (
    <BlockHeader>
      <LeftHeader>
        <WrapLogo>
          <ImgLogo src="/logo.svg" />
          <TextLogo>
            <span>TVGEAR</span>
            <span>SHOP</span>
          </TextLogo>
        </WrapLogo>
      </LeftHeader>
      <RightHeader>
        <ListMenu>
          {dataMenu.map((menu, index) => {
            const isActive = router.asPath.startsWith(menu.link);
            return (
              <Link href={menu.link} passHref key={index}>
                <ItemMenu
                  className={isActive ? "active" : ""}
                  ref={(el) => (menuRefs.current[index] = el)}
                >
                  <NameMenu>{menu.name}</NameMenu>
                </ItemMenu>
              </Link>
            );
          })}
        </ListMenu>
      </RightHeader>
    </BlockHeader>
  );
};

export default Header;
