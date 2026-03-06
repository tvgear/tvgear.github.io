import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideDown = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
`;

export const CatalogWrapper = styled.div`
  display: flex;
  padding: 24px 40px 60px;
  gap: 60px;
  background: #fff;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  @media screen and (max-width: 991px) {
    flex-direction: column;
    padding: 38px 8px 96px 8px;
    gap: 8px;
  }
`;

/* ─── Sidebar (Desktop) ─── */
export const Sidebar = styled.div`
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 25px;
  align-self: flex-start;
  height: fit-content;
  z-index: 10;
  @media screen and (max-width: 991px) {
    display: none;
  }
`;

export const SidebarTitle = styled.h2`
  font-family: F_BOLD;
  font-size: 2rem;
  margin-bottom: 24px;
  line-height: 1;
  color: #000;
  display: none;
`;

export const SidebarSection = styled.div`
  margin-bottom: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

export const SidebarSectionTitle = styled.h3`
  font-family: F_EXTRABOLD;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

export const SidebarBrandList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SidebarItem = styled.div<{ $active?: boolean }>`
  font-family: ${(p) => (p.$active ? "F_BOLD" : "F_MEDIUM")};
  font-size: 1.4rem;
  color: ${(p) => (p.$active ? "#000" : "#777")};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  transition: 0.2s;
  &:hover {
    color: #000;
  }
  span {
    color: ${(p) => (p.$active ? "#000" : "#bbb")};
    font-size: 1.2rem;
  }
`;

export const CheckboxGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: F_MEDIUM;
  font-size: 1.4rem;
  color: #333;
  input {
    display: none;
  }
  .custom-checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid #000;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background: #fff;
    flex-shrink: 0;
    &:after {
      content: "";
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: scale(0) rotate(45deg);
      margin-top: -2px;
      transition: 0.2s;
    }
  }
  input:checked + .custom-checkbox {
    background: #000;
    &:after {
      transform: scale(1) rotate(45deg);
    }
  }
  &.disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* ─── Main Content ─── */
export const MainContent = styled.div`
  flex: 1;
`;

export const MainHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  @media screen and (max-width: 991px) {
    margin: 0 0 12px 0 !important;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 0;
    .desktop-sort {
      display: none !important;
    }
  }
`;

export const SortBtn = styled.button<{ $active?: boolean }>`
  border: 1.5px solid ${(p) => (p.$active ? "#000" : "#f0f0f0")};
  background: #fff;
  padding: 10px 20px;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.3rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: #000;
  }
`;

export const SortSelectWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
  @media screen and (max-width: 991px) {
    margin-left: 0;
    width: fit-content;
  }
`;

export const SortIconWrap = styled.div`
  position: absolute;
  left: 12px;
  pointer-events: none;
  display: flex;
  align-items: center;
  color: #777;
  z-index: 1;
`;

export const SelectSort = styled.select`
  appearance: none;
  background: #fff;
  border: 1.5px solid #eee;
  padding: 8px 10px;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.35rem;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
  color: #333;
  width: 100%;
  text-align: center;
  text-align-last: center;
  &:hover {
    border-color: #000;
  }
  @media screen and (max-width: 991px) {
    width: fit-content;
    height: 36px;
    font-size: 1.15rem;
    border: none;
    padding: 0 4px 0 8px;
    background: transparent;
  }
`;

/* ─── Mobile Elements ─── */
export const MobilePageTitle = styled.h2`
  font-family: F_BOLD;
  font-size: 2rem;
  color: #000;
  margin-top: 2px;
  margin-bottom: 14px;
  line-height: 1;
  text-align: left;
  padding-left: 4px;
`;

export const MobileBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding-bottom: 2px;
  @media screen and (min-width: 992px) {
    display: none;
  }
`;

export const MobileTabList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 991px) {
    position: fixed;
    top: 50px;
    left: 0;
    width: 100%;
    z-index: 999;
    background: #fff;
    padding: 2px 8px 8px;
    border-bottom: none;
    margin: 0;
  }
`;

export const MobileTab = styled.div<{ $active?: boolean }>`
  flex-shrink: 0;
  padding: 6px 14px;
  background: ${(p) => (p.$active ? "#f2f2f2" : "#fff")};
  border: 1.5px solid ${(p) => (p.$active ? "#f2f2f2" : "#eee")};
  color: ${(p) => (p.$active ? "#000" : "#777")};
  border-radius: 100px;
  font-family: ${(p) => (p.$active ? "F_BOLD" : "F_MEDIUM")};
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.15s;
`;

export const MobileProductCount = styled.div`
  font-family: F_EXTRABOLD;
  font-size: 1.3rem;
  color: #000;
  white-space: nowrap;
  padding-left: 4px;
  @media screen and (min-width: 992px) {
    font-size: 1.6rem;
    padding-left: 0;
  }
`;

export const MobileActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 0;
`;

export const MobileActionGroup = styled.div`
  display: flex;
  align-items: center;
  background: transparent;
  overflow: hidden;
  height: 36px;
`;

export const MobileSeparator = styled.div`
  width: 1.5px;
  height: 14px;
  background: #eee;
  flex-shrink: 0;
`;

export const MobileActionBtn = styled.button`
  background: transparent;
  border: none;
  height: 100%;
  padding: 0 10px 0 0;
  font-family: F_BOLD;
  font-size: 1.15rem;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

/* ─── Mobile Filter Overlay ─── */
export const MobileFilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

export const MobileFilterContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const MobileFilterFooter = styled.div`
  padding: 20px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #eee;
`;

export const ClearFilterBtn = styled.button`
  flex: 1;
  height: 48px;
  background: #f6f6f6;
  border: none;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.4rem;
  color: #777;
  cursor: pointer;
`;

export const ApplyBtn = styled.button`
  flex: 1.5;
  height: 48px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.4rem;
  cursor: pointer;
`;

/* ─── Product Grid ─── */
export const ListProduct = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 767px) {
    gap: 20px 8px;
  }
`;

export const ItemProduct = styled.div`
  cursor: pointer;
  transition: 0.25s ease;
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export const WrapImg = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f6;
  @media screen and (max-width: 767px) {
    border-radius: 12px;
  }
`;

export const ImgItem = styled.img`
  width: 75%;
  height: 75%;
  object-fit: contain;
  transition: 0.3s;
  @media screen and (max-width: 767px) {
    width: 70%;
    height: 70%;
  }
`;

export const TagMod = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff3b30;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: F_EXTRABOLD;
  font-size: 1rem;
  letter-spacing: 0.5px;
`;

export const ItemMeta = styled.div`
  margin-top: 12px;
  @media screen and (max-width: 767px) {
    margin-top: 8px;
  }
`;

export const CatItem = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  color: #777;
  text-transform: uppercase;
  margin-bottom: 2px;
  @media screen and (max-width: 767px) {
    font-size: 0.95rem;
  }
`;

export const NameItem = styled.div`
  font-family: F_BOLD;
  font-size: 1.6rem;
  color: #000;
  margin-bottom: 4px;
  line-height: 1.2;
  text-transform: uppercase;
  @media screen and (max-width: 767px) {
    font-size: 1.2rem;
  }
`;

export const PriceItem = styled.div`
  font-family: F_EXTRABOLD;
  font-size: 1.6rem;
  color: #000;
  margin-top: 6px;
  @media screen and (max-width: 767px) {
    font-size: 1.15rem;
    margin-top: 4px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #bbb;
  gap: 16px;
  p {
    font-family: F_MEDIUM;
    font-size: 1.6rem;
  }
  button {
    background: #000;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 100px;
    font-family: F_BOLD;
    cursor: pointer;
  }
`;

/* ─── Detail Modal ─── */
export const DetailOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 10000;
  animation: ${(p) => (p.$isClosing ? fadeOut : fadeIn)} 0.25s ease forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  @media screen and (max-width: 767px) {
    padding: 0;
    align-items: flex-end;
  }
`;

export const DetailModal = styled.div<{ $isClosing?: boolean }>`
  background: #fff;
  width: 100%;
  max-width: 900px;
  max-height: 90dvh;
  border-radius: 24px;
  display: flex;
  position: relative;
  overflow: hidden;
  animation: ${(p) => (p.$isClosing ? slideDown : slideUp)} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    max-height: 100dvh;
    height: 95dvh;
    border-radius: 24px 24px 0px 0px;
    overflow: hidden;
  }
`;

export const DetailClose = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  background: #f6f6f6;
  border: none;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: 0.2s;
  &:hover {
    background: #ececec;
  }
  @media screen and (max-width: 767px) {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
`;

export const DetailImgWrap = styled.div`
  width: 42%;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  @media screen and (max-width: 767px) {
    width: 100%;
    height: 220px;
    flex-shrink: 0;
    padding: 16px;
  }
`;

export const DetailMainImg = styled.img`
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
`;

export const DetailContent = styled.div`
  width: 58%;
  padding: 48px;
  overflow-y: auto;
  @media screen and (max-width: 767px) {
    width: 100%;
    padding: 16px 16px 100px 16px;
    flex: 1;
    overflow-y: auto;
  }
`;

export const DetailName = styled.h1`
  font-family: F_BOLD;
  font-size: 2rem;
  color: #000;
  margin-bottom: 8px;
  line-height: 1.1;
  text-transform: uppercase;
  @media screen and (max-width: 767px) {
    font-size: 1.4rem;
    margin-bottom: 4px;
  }
`;

export const DetailWarranty = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 14px;
  text-transform: uppercase;
  @media screen and (max-width: 767px) {
    margin-bottom: 6px;
  }
`;

export const DetailPrice = styled.div`
  font-family: F_EXTRABOLD;
  font-size: 2.4rem;
  color: #000;
  margin-bottom: 40px;
  @media screen and (max-width: 767px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 24px;
  @media screen and (max-width: 767px) {
    margin-bottom: 16px;
  }
`;

export const DetailLabel = styled.div`
  font-family: F_BOLD;
  font-size: 1.2rem;
  text-transform: uppercase;
  color: #000;
  margin-bottom: 8px;
  @media screen and (max-width: 767px) {
    font-size: 1.1rem;
  }
  span {
    color: #000;
    margin-left: 8px;
  }
`;

export const DetailValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const OptionChip = styled.div<{ $active?: boolean }>`
  padding: 8px 16px;
  border: 1.5px solid ${(p) => (p.$active ? "#000" : "#f0f0f0")};
  background: #fff;
  font-family: F_MEDIUM;
  font-size: 1.3rem;
  @media screen and (max-width: 767px) {
    padding: 6px 14px;
    font-size: 1.2rem;
  }
  color: #000;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: #000;
  }
`;

export const DetailThumb = styled.div<{ $active?: boolean; $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 12px;
  border: 1.5px solid ${(p) => (p.$active ? "#000" : "#f0f0f0")};
  padding: 3px;
  cursor: pointer;
  background: #fff;
  transition: 0.2s;
  opacity: 1 !important;
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: ${(p) => p.$color || "#eee"};
    border-radius: 8px;
  }
  &:hover {
    border-color: #000;
  }
`;

export const ModalActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 40px;
  @media screen and (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 12px 16px;
    background: #fff;
    border-top: none;
    z-index: 2;
  }
`;

export const BuyNowBtn = styled.button`
  flex: 1;
  height: 48px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
  @media screen and (max-width: 767px) {
    height: 42px;
    font-size: 1.3rem;
  }
`;

export const AddCartGhostBtn = styled.button`
  flex: 1;
  height: 48px;
  background: #fff;
  color: #000;
  border: 1.5px solid #ddd;
  border-radius: 16px;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border-color: #000;
  }
  @media screen and (max-width: 767px) {
    height: 42px;
    font-size: 1.3rem;
  }
`;

export const ChatBtn = styled.button`
  width: 48px;
  height: 48px;
  background: #1877f2;
  color: #fff;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
  @media screen and (max-width: 767px) {
    width: 42px;
    height: 42px;
  }
`;

export const ContactOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 10005;
  animation: ${(p) => (p.$isClosing ? fadeOut : fadeIn)} 0.25s ease forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  @media screen and (max-width: 767px) {
    padding: 16px;
    align-items: flex-end;
  }
`;

export const ContactModal = styled.div<{ $isClosing?: boolean }>`
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
  padding: 24px;
  position: relative;
  animation: ${(p) => (p.$isClosing ? slideDown : slideUp)} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media screen and (max-width: 767px) {
    padding: 20px;
    border-radius: 20px;
  }
`;

export const ContactClose = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: #f6f6f6;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #ececec;
  }
`;

export const ContactTitle = styled.div`
  font-family: F_BOLD;
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

export const ContactProductSummary = styled.div`
  display: flex;
  gap: 16px;
  background: #f8f8f8;
  padding: 12px;
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 20px;
  align-items: center;
`;

export const ContactProductImg = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #eee;
`;

export const ContactProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ContactProductName = styled.div`
  font-family: F_BOLD;
  font-size: 1.4rem;
  color: #000;
  line-height: 1.25;
  text-transform: uppercase;
`;

export const ContactProductMeta = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  color: #666;
`;

export const ContactProductPrice = styled.div`
  font-family: F_EXTRABOLD;
  font-size: 1.4rem;
  color: #000;
  margin-top: 2px;
`;

export const ContactNote = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: F_MEDIUM;
  font-size: 1.4rem;
  color: #444;
  line-height: 1.7;
  text-align: center;
  margin-bottom: 24px;
  padding: 0 10px;
`;

export const HighlightAction = styled.span<{ $type: "copy" | "paste" }>`
  display: inline-block;
  padding: 3px 8px;
  margin: 0 4px;
  border-radius: 6px;
  font-family: F_BOLD;
  font-size: 1.1rem;
  text-transform: uppercase;
  line-height: 1.2;
  background: ${(p) => p.$type === "copy" ? "#e6f8ec" : "#fff0e6"};
  color: ${(p) => p.$type === "copy" ? "#00c853" : "#ff9800"};
  border: 1px solid ${(p) => p.$type === "copy" ? "#00c853" : "#ff9800"};
  vertical-align: middle;
  transform: translateY(-1px);
`;

export const HighlightName = styled.span`
  font-family: F_EXTRABOLD;
  color: #000;
`;

export const PasteInstructImg = styled.img`
  width: 100%;
  max-width: 280px;
  margin: 2px auto 8px;
  border-radius: 8px;
  border: 1px solid #eee;
  display: block;
`;

export const ContactActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const ContactBtn = styled.a<{ $type: "fb" | "zalo" }>`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 20px;
  font-family: F_BOLD;
  font-size: 1.3rem;
  cursor: pointer;
  text-decoration: none;
  background: ${(p) => p.$type === "fb" ? "#1877F2" : "#000"};
  color: #fff;
  transition: 0.2s;
  
  &:hover {
    opacity: 0.85;
    color: #fff;
  }

  @media screen and (max-width: 767px) {
    height: 48px;
    font-size: 1.2rem;
    border-radius: 16px;
  }
`;

// Legacy styles for OrderProduct
export const ColorItem = styled.div`
  margin: 5px 0px 0px 0px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

export const ItemColorSelect = styled.div`
  width: fit-content;
  padding: 3.5px 10px;
  margin: 0px 5px 5px 0px;
  height: fit-content;
  background: #fff;
  border: 1px solid #ddd;
  font-family: F_MEDIUM;
  font-size: 1.4rem; 
  cursor: pointer;
`;

export const ColorProduct = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
`;

export const OptionItem = styled.div`
  margin: 5px 0px 0px 0px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

export const ItemOptionSelect = styled.div`
  width: fit-content;
  padding: 3.5px 10px;
  margin: 0px 5px 5px 0px;
  height: fit-content;
  background: #fff;
  border: 1.5px solid #ddd;
  font-family: F_MEDIUM;
  font-size: 1.4rem; 
  cursor: pointer;
`;

export const TitleProduct = styled.div`
  font-family: F_BOLD;
  font-size: 1.8rem;
  color: #000;
`;