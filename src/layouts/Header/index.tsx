import React, { useEffect, useRef } from "react";
import {
  BlockHeader,
  ContentWrap,
  ItemMenu,
  ListMenu,
  NameMenu,
  WrapLogo,
} from "./style";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/router";

const dataMenu = [
  { name: "Chuột", link: "/mouse" },
  { name: "Bàn Phím", link: "/keyboard" },
  { name: "Tai Nghe", link: "/headphone" },
  { name: "SoundCard", link: "/soundcard" },
  { name: "Loa", link: "/speaker" },
  { name: "Micro", link: "/micro" },
  { name: "Webcam", link: "/webcam" },
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
      <ContentWrap className="blockContainer">
        <WrapLogo>
          <Logo size={50} />
        </WrapLogo>
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
      </ContentWrap>
    </BlockHeader>
  );
};

export default Header;
