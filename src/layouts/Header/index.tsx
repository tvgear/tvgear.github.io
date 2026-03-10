import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { ShoppingBag, X, Mouse as MouseIcon, Keyboard as KeyboardIcon, Headphones, LayoutGrid, Trash2, Plus, Minus, MapPin, ChevronDown, MessageCircleMore } from "lucide-react";
import { getCart, getCartTotal, updateQty as updateCartQuantity, removeFromCart } from "@/utils/carts";
import { CartItem } from "@/types/product";


/* ─── Styled Components ─── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideLeft = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

const BlockHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 1440px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  width: 100%;
  @media screen and (max-width: 991px) {
    background: #fff;
    backdrop-filter: none;
  }
`;

const InnerHeader = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  @media screen and (max-width: 991px) {
    height: 48px;
    padding: 0 12px 0 7.5px;
  }
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  @media screen and (max-width: 991px) {
    justify-content: flex-start;
  }
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 4.5px;
  height: 46px;
  cursor: pointer;
  background: #000;
  padding: 0 16px 0 12px;
  border-radius: 26px;
  transition: 0.2s;
  &:hover {
    background: #222;
  }
  @media screen and (max-width: 991px) {
    height: 34px;
    padding: 0 11px 0 6.5px;
    gap: 2.5px;
    border-radius: 20px;
  }
`;

const WrapLogo = styled.div`
  width: 30px;
  height: 30px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  @media screen and (max-width: 991px) {
    width: 30px;
    height: 30px;
    img {
      width: 16px;
      height: 16px;
    }
  }
`;

const LogoText = styled.div`
  font-family: F_BOLD;
  font-size: 2.1rem;
  color: #fff;
  &.dark { color: #000; }
  line-height: 1;
  margin-top: -1px;
  @media screen and (max-width: 991px) {
    font-size: 1.6rem;
  }
`;

const NavLeft = styled.nav`
  display: flex;
  gap: 48px;
  @media screen and (max-width: 991px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: F_EXTRABOLD;
  font-size: 1.5rem;
  color: ${(p) => (p.$active ? "#000" : "#777")};
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  &:hover {
    color: #000;
  }
`;

const RightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
  @media screen and (max-width: 991px) {
    gap: 6px;
  }
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }
  @media screen and (max-width: 991px) {
    padding: 4px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff3b30;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1rem;
  min-width: 18px;
  height: 18px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  transform: translate(25%, -25%);
  @media screen and (max-width: 991px) {
    min-width: 14px;
    height: 14px;
    font-size: 0.8rem;
  }
`;

const CartHeaderBadge = styled.div`
  background: #ff3b30;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1.05rem;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  @media screen and (max-width: 480px) {
    font-size: 0.9rem;
    height: 18px;
    padding: 0 6px;
  }
`;

const MobileDivider = styled.div`
  display: none;
  @media screen and (max-width: 991px) {
    display: block;
    width: 1px;
    height: 14px;
    background: #eee;
    margin-left: 12px;
  }
`;

const HeaderSeparator = styled.div`
  width: 1px;
  height: 16px;
  background: #eee;
  margin: 0 2px;
`;

const StoreNote = styled.div`
  font-family: F_BOLD;
  font-size: 1.2rem;
  color: #ff3b30;
  background: #fffbfa;
  border: 1px solid #ffccc7;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  margin-top: 32px;
  line-height: 1.5;
  text-transform: uppercase;
`;


const MobileCategorySelector = styled.div`
  display: none;
  @media screen and (max-width: 991px) {
    display: flex;
    align-items: center;
    gap: 4.5px;
    margin-left: 10px;
    padding: 6px 0;
    background: transparent;
    border-radius: 100px;
    font-family: F_EXTRABOLD;
    font-size: 1.4rem;
    color: #000;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    text-transform: uppercase;
  }
`;

const MobileDropdownPortal = styled.div`
  position: fixed;
  top: 48px;
  left: 12px;
  right: 12px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  padding: 10px 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const DropdownItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 16px;
  text-decoration: none;
  color: ${(p) => (p.$active ? "#000" : "#777")};
  background: ${(p) => (p.$active ? "#f6f6f6" : "transparent")};
  transition: 0.2s;
  span {
    font-family: ${(p) => (p.$active ? "F_EXTRABOLD" : "F_BOLD")};
    font-size: 0.95rem;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
  }
`;

const CartOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99999;
  animation: ${(p) => (p.$isClosing ? fadeOut : fadeIn)} 0.25s ease forwards;
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 100px;
  background: #f6f6f6;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #ececec;
  }
`;

const CartDrawer = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  background: #fff;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
  animation: ${(p) => (p.$isClosing ? slideOut : slideLeft)} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media screen and (max-width: 480px) {
    width: 90dvw;
    right: 0;
  }
`;

const CartHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 {
    font-family: F_BOLD;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  @media screen and (max-width: 480px) {
    h2 {
      font-size: 1.4rem;
    }
  }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const CartImg = styled.img`
  width: 84px;
  height: 84px;
  background: #f6f6f6;
  border-radius: 12px;
  object-fit: contain;
  padding: 10px;
`;

const CartInfo = styled.div`
  flex: 1;
  .name {
    font-family: F_BOLD;
    font-size: 1.35rem;
    text-transform: uppercase;
    margin-bottom: 2px;
    @media screen and (max-width: 480px) {
      font-size: 1.15rem;
    }
  }
  .opt {
    font-family: F_MEDIUM;
    font-size: 1.15rem;
    color: #777;
    margin-bottom: 2px;
    @media screen and (max-width: 480px) {
      font-size: 1rem;
    }
  }
  .item-price {
    font-family: F_BOLD;
    font-size: 1.45rem;
    color: #000;
    @media screen and (max-width: 480px) {
      font-size: 1.25rem;
    }
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  input {
    width: 32px;
    text-align: center;
    font-family: F_BOLD;
    font-size: 1.4rem;
    border: none;
    @media screen and (max-width: 480px) {
      font-size: 1.25rem;
    }
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  button {
    width: 22px;
    height: 22px;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: 0.2s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      border-color: #000;
    }
  }
`;

const CartActionBtn = styled.button`
  background: #fff1f0;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  cursor: pointer;
  color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    background: #ffccc7;
    color: #cf1322;
  }
`;

const CartItemBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const CartFooter = styled.div`
  padding: 16px 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .label {
    font-family: F_MEDIUM;
    color: #000;
    font-size: 1.4rem;
  }
  .value {
    font-family: F_BOLD;
    font-size: 1.8rem;
  }
  @media screen and (max-width: 480px) {
    margin-bottom: 12px;
    .label {
      font-size: 1.3rem;
    }
    .value {
      font-size: 1.5rem;
    }
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  height: 52px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.85;
  }
  @media screen and (max-width: 480px) {
    height: 46px;
    font-size: 1.4rem;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #bbb;
  gap: 16px;
  svg {
    opacity: 0.3;
  }
  span {
    font-family: F_REGULAR;
    font-size: 1.4rem;
  }
`;

/* ─── About/Store Modal Styles ─── */
const AboutOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease forwards;
  ${(p) => p.$isClosing && css`animation: ${fadeOut} 0.3s ease forwards;`}
  @media screen and (max-width: 991px) {
    align-items: flex-end;
  }
`;

const ChatOverlay = styled(AboutOverlay)`
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 20px 20px 0; 
  @media screen and (max-width: 991px) {
    justify-content: center;
    padding-right: 0;
    padding: 8px;
    align-items: flex-end;
  }
`;



const popOut = keyframes`
  0% { transform: scale(0.92); opacity: 0; }
  60% { transform: scale(1.03); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;


const AboutModalContainer = styled.div<{ $isClosing?: boolean }>`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  height: 95dvh;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  ${(p) => p.$isClosing && `transform: translateY(100%); transition: 0.3s ease-in;`}
  @media screen and (max-width: 991px) {
    border-radius: 24px 24px 0 0;
  }
`;

const AboutHeader = styled.div`
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: none;
`;

const AboutTabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  padding: 8px 16px;
  min-height: 50px;
  box-sizing: border-box;
  background: transparent;
  gap: 8px;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const AboutTabItem = styled.div<{ $active?: boolean }>`
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.25rem;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.2s;
  background: ${(p) => (p.$active ? "#000" : "#f6f6f6")};
  color: ${(p) => (p.$active ? "#fff" : "#777")};
  &:hover {
    background: ${(p) => (p.$active ? "#000" : "#eee")};
    color: ${(p) => (p.$active ? "#fff" : "#333")};
  }
`;

const AboutContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 32px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 10px;
  }
`;

const ContentParagraph = styled.p`
  font-family: F_MEDIUM;
  font-size: 1.45rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const SectionTitle = styled.h4`
  font-family: F_BOLD;
  font-size: 1.45rem;
  margin-bottom: 12px;
  color: #000;
  text-transform: uppercase;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const ListItem = styled.div`
  display: flex;
  gap: 12px;
  font-family: F_MEDIUM;
  font-size: 1.45rem;
  line-height: 1.5;
  color: #444;
  &::before {
    content: '•';
    color: #000;
    font-weight: bold;
  }
`;

const StoreSocials = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const SocialBox = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 12px;
  background: #f6f6f6;
  color: #333;
  text-decoration: none;
  gap: 10px;
  transition: 0.2s;
  &:hover {
    background: #eee;
    transform: translateY(-2px);
  }
  span {
    font-family: F_BOLD;
    font-size: 1.35rem;
    color: #000;
  }
`;

const BranchItem = styled.div`
  margin-bottom: 24px;
  .name {
    font-family: F_BOLD;
    font-size: 1.5rem;
    color: #000;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .address {
    font-family: F_MEDIUM;
    font-size: 1.4rem;
    color: #666;
    line-height: 1.6;
  }
`;

/* ─── Chat Modal Styles ─── */
const ChatModalContainer = styled.div<{ $isClosing?: boolean }>`
  width: 92%;
  max-width: 400px;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  ${(p) => p.$isClosing && `transform: translateY(100%); transition: 0.3s ease-in; opacity: 0;`}
  @media screen and (max-width: 991px) {
    width: 96%;
    margin-bottom: 8px;
  }
`;


const ChatHeader = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-bottom: 1px solid #f6f6f6;
  position: relative;
`;


const ChatAvatar = styled.div`
  width: 62px;
  height: 62px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  img {
    width: 32px;
    height: 32px;
    filter: invert(1);
  }
`;

const ChatHeaderInfo = styled.div`
  flex: 1;
  .shop-name {
    font-family: F_BOLD;
    font-size: 1.8rem;
    color: #000;
    line-height: 1.2;
  }
  .status-text {
    font-family: F_MEDIUM;
    font-size: 1.15rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }
`;


const ChatBody = styled.div`
  padding: 20px;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;


const ChatTime = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.1rem;
  color: #bbb;
  text-align: center;
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ $show?: boolean; $isTip?: boolean }>`
  align-self: flex-start;
  background: ${(p) => (p.$isTip ? "#f0f7ff" : "#f1f3f4")};
  border: ${(p) => (p.$isTip ? "1.5px solid #1877f2" : "none")};
  padding: 12px 18px;
  border-radius: 16px;
  max-width: 85%;
  font-family: F_MEDIUM;
  font-size: 1.45rem;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 12px;
  transform-origin: top left;
  animation: ${(p) => (p.$show ? css`${popOut} 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards` : 'none')};
  
  .highlight-blue {
    color: #1877f2;
    font-family: F_BOLD;
  }
`;







const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 18px;
  background: #f1f3f4;
  border-radius: 16px;
  width: fit-content;
  margin-bottom: 24px;
  
  span {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
`;

const ChatActions = styled.div<{ $show?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transform: translateY(${(p) => (p.$show ? 0 : '20px')});
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.3s;
`;

const ChatActionBtn = styled.a<{ $type: "zalo" | "messenger" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  border-radius: 20px;
  font-family: F_BOLD;
  font-size: 1.4rem;
  text-decoration: none;
  transition: 0.2s;
  background: ${(p) => (p.$type === "zalo" ? "#000" : "#1877F2")};
  color: #fff !important;
  &:hover, &:visited, &:active {
    opacity: 0.9;
    transform: translateY(-1px);
    color: #fff !important;
  }
  @media screen and (max-width: 991px) {
    font-size: 1.25rem;
    height: 48px;
    border-radius: 20px;
    gap: 4px;
    svg {
      width: 12px;
      height: 12px;
    }
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;


const ChatModalClose = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: #f6f6f6;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #777;
  transition: 0.2s;
  z-index: 2;
  &:hover {
    background: #eee;
    color: #000;
  }
`;



/* ─── Cart Drawer Portal ─── */
function CartDrawerPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return ReactDOM.createPortal(children, document.body);
}

/* ─── Component ─── */
const Header: React.FC<{ contentRef: any }> = ({ contentRef }) => {
  const router = useRouter();
  const [showCart, setShowCart] = React.useState(false);
  const [isClosingCart, setIsClosingCart] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const aboutScrollRef = React.useRef<HTMLDivElement>(null);
  const [editingQty, setEditingQty] = React.useState<{ [key: number]: string }>({});
  
  const [showChatModal, setShowChatModal] = React.useState(false);
  const [isClosingChatModal, setIsClosingChatModal] = React.useState(false);
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [showChatMessage, setShowChatMessage] = React.useState(false);
  const [showSecondMessage, setShowSecondMessage] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);

  const [isClosingAbout, setIsClosingAbout] = React.useState(false);

  const currentHour = new Date().getHours();
  const isOnline = currentHour >= 9 && currentHour < 23;

  const handleOpenChat = () => {
    setShowChatModal(true);
    setIsChatLoading(true);
    setShowChatMessage(false);
    setShowSecondMessage(false);
    setTimeout(() => {
      setIsChatLoading(false);
      setShowChatMessage(true);
      setTimeout(() => {
        setShowSecondMessage(true);
      }, 700);
    }, 2500);
  };


  const handleCloseChatModal = () => {
    setIsClosingChatModal(true);
    setTimeout(() => {
      setShowChatModal(false);
      setIsClosingChatModal(false);
      setIsChatLoading(false);
      setShowChatMessage(false);
      setShowSecondMessage(false);
    }, 300);
  };



  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    if (aboutScrollRef.current) {
      aboutScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleOpenAbout = () => {
    setShowAbout(true);
    setActiveTab(0);
  };

  const handleCloseAbout = () => {
    setIsClosingAbout(true);
    setTimeout(() => {
      setShowAbout(false);
      setIsClosingAbout(false);
    }, 300);
  };

  const handleCloseCart = () => {
    setIsClosingCart(true);
    setTimeout(() => {
      setShowCart(false);
      setIsClosingCart(false);
    }, 240);
  };

  const categories = React.useMemo(() => [
    { name: "Chuột", link: "/mouse", icon: MouseIcon },
    { name: "Bàn Phím", link: "/keyboard", icon: KeyboardIcon },
    { name: "Tai Nghe", link: "/headphone", icon: Headphones },
    { name: "Phụ Kiện", link: "/accessories", icon: LayoutGrid },
  ], []);

  const currentCategory = categories.find(c => c.link === router.pathname) || categories[0]!;

  const scrollToTop = () => {
    contentRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const sync = () => setCartItems(getCart());
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const handleQty = (idx: number, delta: number) => {
    const item = cartItems[idx];
    if (!item) return;
    updateCartQuantity(idx, item.quantity + delta);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleRemove = (idx: number) => {
    removeFromCart(idx);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleQtyChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    setEditingQty(prev => ({ ...prev, [idx]: valStr }));
    
    let val = parseInt(valStr);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    
    const item = cartItems[idx];
    if (!item) return;

    updateCartQuantity(idx, val);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleQtyBlur = (idx: number) => {
    setEditingQty(prev => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
    setCartItems(getCart());
  };

  return (
    <>
      <BlockHeader>
        <InnerHeader>
          <LeftHeader>
            <LogoArea onClick={handleOpenAbout}>
              <WrapLogo>
                <img src="/logo.svg" />
              </WrapLogo>
              <LogoText>tvgear</LogoText>
            </LogoArea>
            <MobileDivider />
            <MobileCategorySelector onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <span style={{ fontSize: '1.3rem' }}>{currentCategory.name}</span>
              <ChevronDown size={14} strokeWidth={2.5} style={{ transform: showMobileMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </MobileCategorySelector>
          </LeftHeader>

          <NavLeft>
            {categories.map((cat) => (
              <NavLink 
                key={cat.link} 
                href={cat.link}
                $active={router.pathname === cat.link} 
                onClick={scrollToTop}
              >
                {cat.name}
              </NavLink>
            ))}
          </NavLeft>

          <RightHeader>
            <IconBtn onClick={handleOpenChat}>
              <MessageCircleMore size={22} />
            </IconBtn>
            <HeaderSeparator />
            <IconBtn id="cart-icon-btn" onClick={() => setShowCart(true)}>
              <ShoppingBag size={23} />
              {cartItems.length > 0 && (
                <Badge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Badge>
              )}
            </IconBtn>
          </RightHeader>
        </InnerHeader>
      </BlockHeader>

      {showMobileMenu && (
        <CartDrawerPortal>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 10000 }} 
            onClick={() => setShowMobileMenu(false)} 
          />
          <MobileDropdownPortal>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <DropdownItem 
                  key={cat.link}
                  href={cat.link}
                  $active={router.pathname === cat.link} 
                  onClick={() => { setShowMobileMenu(false); scrollToTop(); }}
                >
                  <Icon size={24} strokeWidth={router.pathname === cat.link ? 2.5 : 2} />
                  <span>{cat.name}</span>
                </DropdownItem>
              );
            })}
          </MobileDropdownPortal>
        </CartDrawerPortal>
      )}

      {/* About/Store Modal */}
      {showAbout && (
        <CartDrawerPortal>
          <AboutOverlay $isClosing={isClosingAbout} onClick={handleCloseAbout}>
            <AboutModalContainer $isClosing={isClosingAbout} onClick={(e) => e.stopPropagation()}>
              <AboutHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    onClick={() => { handleCloseAbout(); router.push("/mouse"); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '50px', padding: '0 8px', cursor: 'pointer' }}
                  >
                    <WrapLogo style={{ width: '34px', height: '34px' }}>
                      <img src="/logo.svg" style={{ filter: 'invert(1)', width: '22px', height: '22px' }} />
                    </WrapLogo>
                    <LogoText className="dark" style={{ fontSize: '2.4rem' }}>tvgear</LogoText>
                  </div>
                </div>
                <CloseBtn onClick={handleCloseAbout}>
                  <X size={20} />
                </CloseBtn>
              </AboutHeader>

              <AboutTabsContainer>
                {["Thông Tin", "Bảo Hành", "Đổi Trả"].map((tab, idx) => (
                  <AboutTabItem 
                    key={tab} 
                    $active={activeTab === idx} 
                    onClick={() => handleTabChange(idx)}
                  >
                    {tab}
                  </AboutTabItem>
                ))}
              </AboutTabsContainer>

              <AboutContentScroll ref={aboutScrollRef}>
                {activeTab === 0 && (
                  <div key="tab-info">
                    <ContentParagraph>
                      <span style={{ fontFamily: 'F_BOLD' }}>TVGEAR Shop</span> chuyên kinh doanh các sản phẩm gaming gear (thiết bị điện tử) bao gồm : chuột, bàn phím, tai nghe, phụ kiện, ... đã qua sử dụng và hàng mới chưa qua sử dụng.
                    </ContentParagraph>
                    <ContentParagraph>
                      Sản phẩm tại shop 95% là hàng đã qua sử dụng và bảo hành tại shop. Những sản phẩm có gắn tag bảo hành hãng sẽ có kèm tháng và năm còn bảo hành hãng, những sản phẩm này sẽ được bảo hành hãng và sẽ không bảo hành tại shop (trừ khi còn bảo hành quá ít tại hãng).
                    </ContentParagraph>
                    <ContentParagraph>
                      Sản phẩm tại shop 90% là hàng chính hãng từ Logitech, Razer. 10% còn lại là hàng chính hãng từ các hãng khác như Lamzu, Pulsar, ... Shop không bán hàng fake bất cứ mã sản phẩm nào.
                    </ContentParagraph>
                    <ContentParagraph style={{ marginBottom: '32px' }}>
                      Shop chỉ bán sản phẩm, không nhận thu vào, trade up hoặc trade down.
                    </ContentParagraph>

                    <SectionTitle>Shop Online</SectionTitle>
                    <StoreSocials>
                      <SocialBox href="https://facebook.com/tvgear" target="_blank">
                        <span>TVGEAR - Facebook</span>
                      </SocialBox>
                      <SocialBox href="https://m.me/tvgear" target="_blank">
                        <span>TVGEAR - Messenger</span>
                      </SocialBox>
                    </StoreSocials>

                    <SectionTitle>Shop Offline</SectionTitle>
                    <BranchItem>
                      <div className="name"><MapPin size={18} /> Chi Nhánh Hưng Yên</div>
                      <div className="address">Thôn Du Mỹ, Vân Du, Ân Thi, Hưng Yên</div>
                    </BranchItem>

                    <BranchItem style={{ marginBottom: '24px' }}>
                      <div className="name"><MapPin size={18} /> Chi Nhánh TP.HCM</div>
                      <div className="address">
                        194/21a Bùi Đình Tuý, P.12, Q. Bình Thạnh, TP.HCM<br/>
                        9 Hoa Cau, P.7, Q. Phú Nhuận, TP.HCM
                      </div>
                    </BranchItem>

                    <StoreNote>
                      VUI LÒNG LIÊN HỆ TRƯỚC VỚI SHOP TRƯỚC KHI QUA MUA SẢN PHẨM, VÌ SẢN PHẨM CÓ THỂ KHÔNG SẴN TẠI CỬA HÀNG
                    </StoreNote>
                  </div>
                )}

                {activeTab === 1 && (
                  <div key="tab-warranty">
                    <SectionTitle>Thời hạn bảo hành</SectionTitle>
                    <ListContainer>
                      <ListItem>Chuột: 3 tháng bảo hành tại shop</ListItem>
                      <ListItem>Phím, Tai Nghe và Phụ Kiện khác: 1 tháng bảo hành tại shop</ListItem>
                      <ListItem>Một số phụ kiện đặc biệt sẽ không có bảo hành (pad chuột, feet chuột, ...)</ListItem>
                      <ListItem>Sản phẩm có bảo hành hãng sẽ có ghi Tháng/Năm bảo hành từ hãng, khách mua có thể tự xử lí với hãng sau khi mua sản phẩm có bảo hành hãng.</ListItem>
                    </ListContainer>

                    <SectionTitle>Điều kiện bảo hành</SectionTitle>
                    <ListContainer>
                      <ListItem>Tem bảo hành còn nguyên vẹn</ListItem>
                      <ListItem>Ốc vít của sản phẩm không có dấu hiệu bị cạy mở</ListItem>
                      <ListItem>Sản phẩm không bị vào nước, chất liệu có nước, bám bụi bẩn, keo,...</ListItem>
                      <ListItem>Sản phẩm không bị vỡ nát do tác động vật lý dù vô ý hay cố ý</ListItem>
                      <ListItem>Sản phẩm không có dấu hiệu bị chập cháy, ám khói do vật liệu nổ, chảy nhựa.</ListItem>
                      <ListItem>Sản phẩm sử dụng sai quy cách, về sạc pin, thao tác dẫn đến hư hỏng vô ý.</ListItem>
                      <ListItem>Sản phẩm còn đủ linh kiện & phụ kiện khi shop bán ra, không bị tráo hàng, tráo linh kiện và thay đổi cấu trúc linh kiện phụ kiện (trừ các trường hợp thay feet, dán grip tape, mất hộp, thiếu phụ kiện phụ). Riêng trường hợp thiếu phụ kiện phụ trước khi bảo hành vui lòng chụp lại và báo trước với shop, shop sẽ không chịu trách nhiệm khi phụ kiện gửi về không đủ.</ListItem>
                    </ListContainer>

                    <SectionTitle>Chi Phí Vận chuyển</SectionTitle>
                    <ListContainer>
                      <ListItem>Trong vòng 3 ngày (từ ngày nhận hàng) : shop chịu phí ship 2 chiều</ListItem>
                      <ListItem>Từ ngày thứ 4 &rarr; ngày thứ 30 (tròn 1 tháng từ ngày nhận hàng) : khách chịu phí ship gửi về, shop chịu phí ship gửi lại</ListItem>
                      <ListItem>Sau 1 tháng : khách chịu 2 đầu phí ship gửi về và chiều shop gửi lại</ListItem>
                    </ListContainer>

                    <SectionTitle>Hậu Mãi</SectionTitle>
                    <ListContainer>
                      <ListItem>Shop sẽ sẵn sàng hỗ trợ những trường hợp còn có thể cứu vãn sản phẩm trong thời gian còn bảo hành, thông qua thảo luận về chi phí sửa chữa, nguồn linh kiện phục vụ cho sửa chữa nếu có thể. Nếu không đạt được thoả thuận, shop có thể tư vấn khách đem đến 1 shop quen khác chuyên sửa chữa gaming gear chuyên sâu để khách hàng tự quyết định về việc sửa chữa sản phẩm với các thoả thuận khác.</ListItem>
                      <ListItem>Sau khi hết thời hạn bảo hành shop có nhận sửa chữa các lỗi cơ bản cho sản phẩm về switch, lăn, các nút, ... Nếu không thể sửa chữa các lỗi nặng hơn, shop có thể tư vấn khách đem đến 1 shop quen khác chuyên sửa chữa gaming gear chuyên sâu để khách hàng có thể sửa chữa sản phẩm.</ListItem>
                    </ListContainer>
                  </div>
                )}

                {activeTab === 2 && (
                  <div key="tab-return">
                    <SectionTitle>Thời hạn đổi trả</SectionTitle>
                    <ListContainer>
                      <ListItem>Tối đa 1 ngày sau khi đơn hàng giao thành công</ListItem>
                      <ListItem>Đổi sản phẩm khác (sẵn tại chi nhánh shop) hoặc hoàn 100% tiền hàng đã thanh toán</ListItem>
                      <ListItem>Sau thời gian trên không đổi trả vì bất kì lý do nào, sản phẩm sẽ được bảo hành nếu phát sinh lỗi.</ListItem>
                    </ListContainer>

                    <SectionTitle>Điều kiện đổi trả</SectionTitle>
                    <ListContainer>
                      <ListItem>
                        <span>
                          <span style={{ color: '#ff3b30', fontFamily: 'F_EXTRABOLD' }}>CỰC KÌ QUAN TRỌNG, BẮT BUỘC PHẢI CÓ VIDEO KHI MỞ GÓI HÀNG</span> (Video quay các góc gói hàng chưa bị tháo mở hoặc có dấu hiệu tháo mở khi nhận được từ shipper & có mặt shipper tại đó khi nhận hàng, video quay từ trong ra ngoài gói hàng và cận cảnh lỗi ngoại hình sản phẩm từ khi mở gói hàng đến khi bắt đầu sử dụng hoặc bắt đầu kiểm tra).
                        </span>
                      </ListItem>
                      <div style={{ fontStyle: 'italic', color: '#ff3b30', fontSize: '1.2rem', fontWeight: 'bold', paddingLeft: '24px', marginTop: '-4px', marginBottom: '8px' }}>
                        *Không đáp ứng điều kiện này thì sản phẩm sẽ được đưa về diện bảo hành nếu phát sinh lỗi, không áp dụng đổi trả.
                      </div>
                      <ListItem>Sản phẩm bị hư hỏng ngay lần đầu tiên hoặc trong ngày khi sử dụng.</ListItem>
                      <ListItem>Sản phẩm không thuộc nhóm sản phẩm hàng thanh lý.</ListItem>
                      <ListItem>Sản phẩm bị nứt, vỡ khi vừa nhận hàng đến tay và khui hàng.</ListItem>
                      <ListItem>Sản phẩm có dấu hiệu bị cạy mở, bị tráo hàng, tráo phụ kiện từ khâu vận chuyển.</ListItem>
                      <ListItem>Sản phẩm có dính nước, chất liệu có nước, bụi bẩn, keo,... khi khui hàng.</ListItem>
                      <div style={{ fontStyle: 'italic', color: '#ff3b30', fontSize: '1.2rem', fontWeight: 'bold', paddingLeft: '24px', marginTop: '4px' }}>
                        * Khách hàng vui lòng liên hệ shop khi gặp các trường hợp trên để trao đổi về trách nhiệm và giải quyết các vấn đề liên quan đến vận chuyển và sử dụng sản phẩm.
                      </div>
                    </ListContainer>

                    <SectionTitle>Chi Phí Vận chuyển</SectionTitle>
                    <ListContainer>
                      <ListItem>Shop chịu 2 đầu phí ship nếu đạt thoả thuận đổi sản phẩm khác do sản phẩm hư hỏng, shop chịu 1 đầu phí ship gửi lại nếu đạt thoả thuận hoàn trả sản phẩm và nhận lại 100% tiền.</ListItem>
                    </ListContainer>
                  </div>
                )}
              </AboutContentScroll>
            </AboutModalContainer>
          </AboutOverlay>
        </CartDrawerPortal>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <CartDrawerPortal>
          <ChatOverlay $isClosing={isClosingChatModal} onClick={handleCloseChatModal}>
            <ChatModalContainer $isClosing={isClosingChatModal} onClick={(e) => e.stopPropagation()}>
              <ChatHeader>
                <ChatModalClose onClick={handleCloseChatModal}>
                  <X size={20} strokeWidth={2.5} />
                </ChatModalClose>
                <ChatAvatar>
                  <img src="/logo.svg" alt="TVGEAR Logo" />
                </ChatAvatar>
                <ChatHeaderInfo>

                  <div className="shop-name">TVGEAR</div>
                  <div className="status-text">
                    <span style={{ color: isOnline ? '#22c55e' : '#94a3b8' }}>●</span>
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </ChatHeaderInfo>
              </ChatHeader>
              <ChatBody>
                <ChatTime>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</ChatTime>
                
                {isChatLoading ? (
                  <LoadingDots>
                    <span /><span /><span />
                  </LoadingDots>
                ) : (
                  <>
                    <MessageBubble $show={showChatMessage} $isTip>
                      💖 MẸO: Bạn có thể bấm vào sản phẩm, chọn loại sản phẩm muốn tư vấn và nhấn vào nút <span className="highlight-blue">Chat Màu Xanh</span> để gửi thông tin đến TVGEAR nhé.
                    </MessageBubble>




                    {showSecondMessage && (
                      <MessageBubble $show={showSecondMessage}>
                        Xin chào 👋{"\n"}Bạn cần tư vấn sản phẩm nào ở TVGEAR?
                      </MessageBubble>
                    )}
                    <ChatActions $show={showSecondMessage}>
                      <ChatActionBtn $type="zalo" href="https://zalo.me/0398637036" target="_blank" rel="noopener noreferrer">
                        Chat Zalo
                      </ChatActionBtn>
                      <ChatActionBtn $type="messenger" href="https://m.me/tvgear" target="_blank" rel="noopener noreferrer">
                        Chat Messenger
                      </ChatActionBtn>
                    </ChatActions>


                  </>
                )}
              </ChatBody>

            </ChatModalContainer>
          </ChatOverlay>
        </CartDrawerPortal>
      )}

      {/* Cart Drawer - rendered via portal to body */}

      {showCart && (
        <CartDrawerPortal>
          <CartOverlay $isClosing={isClosingCart} onClick={handleCloseCart} />
          <CartDrawer $isClosing={isClosingCart}>
            <CartHeader>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Giỏ Hàng <CartHeaderBadge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} Sản Phẩm</CartHeaderBadge>
              </h2>
              <CloseBtn onClick={handleCloseCart}>
                <X size={20} />
              </CloseBtn>
            </CartHeader>
            <CartList>
              {cartItems.length === 0 ? (
                <EmptyCart>
                  <ShoppingBag size={48} strokeWidth={1.5} />
                  <span>Giỏ hàng đang trống ...</span>
                </EmptyCart>
              ) : (
                cartItems.map((item, idx) => (
                  <CartItemRow key={`${item.productName}-${idx}`}>
                    <CartImg src={item.image} />
                    <CartInfo>
                      <div className="name">{item.productName}</div>
                      <div className="opt">
                        {item.color.labelColor} <span style={{fontSize: '0.6em', opacity: 0.6, position: 'relative', top: '-1.5px', margin: '0 4px'}}>&#8226;</span> {item.option.name}
                      </div>
                      <div className="item-price">
                        {(item.option.price * item.quantity).toLocaleString("vi-VN")}.000đ
                      </div>
                      <CartItemBottom>
                        <QtyControl>
                          <button onClick={() => { handleQtyBlur(idx); handleQty(idx, -1); }}><Minus size={16} strokeWidth={3} /></button>
                          <input 
                            type="number" 
                            value={editingQty[idx] !== undefined ? editingQty[idx] : item.quantity} 
                            min={1} 
                            max={99} 
                            onChange={(e) => handleQtyChange(idx, e)} 
                            onBlur={() => handleQtyBlur(idx)}
                          />
                          <button onClick={() => { handleQtyBlur(idx); handleQty(idx, 1); }}><Plus size={16} strokeWidth={3} /></button>
                        </QtyControl>
                        <CartActionBtn onClick={() => handleRemove(idx)}>
                          <Trash2 size={15} />
                        </CartActionBtn>
                      </CartItemBottom>
                    </CartInfo>
                  </CartItemRow>
                ))
              )}
            </CartList>
            {cartItems.length > 0 && (
              <CartFooter>
                <TotalRow>
                  <div className="label">Tổng Cộng</div>
                  <div className="value">{getCartTotal(cartItems).toLocaleString("vi-VN")}.000đ</div>
                </TotalRow>
                <CheckoutBtn onClick={() => { handleCloseCart(); setTimeout(() => router.push("/checkout"), 250); }}>
                  Đặt Hàng
                </CheckoutBtn>
              </CartFooter>
            )}
          </CartDrawer>
        </CartDrawerPortal>
      )}
    </>
  );
};

export default Header;
