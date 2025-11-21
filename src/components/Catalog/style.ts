import styled from "styled-components";

export const ListTab = styled.div`
    width: 100%;
    position: sticky;
    top : 0px;
    display: flex;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(22px);
    border-bottom : 1.25px solid #777;
    z-index: 2;
    padding: 7.5px 10px; 
    align-items: center;
    @media screen and (max-width : 767px) {
      overflow-x: auto;
      padding: 5px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
`;

export const TextTab = styled.div`
    font-family: F_BOLD;
    text-transform: uppercase;
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
    color : rgba(125,125,125);
    white-space: nowrap;
    @media screen and (max-width : 767px) {
       font-size: 1.25rem;
       line-height: calc(1.25rem * 1.25);
    }
`

export const ItemTab = styled.div`
    padding: 11.5px 15px;
    margin: 0px 3.5px 0px 0px;
    font-family: F_SEMIBOLD;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &:hover {
      background: rgba(28,28,28);
     transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
    &.active {
     transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
      background: rgba(28,28,28);
      ${TextTab} {
        color  : #FFF;
      }
    }
    @media screen and (max-width : 767px) {
      padding: 7.5px 10px;
    }
`;



export const ListProduct = styled.div`
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
    margin: 0 auto;
`;
export const ItemProduct = styled.div`
    width: calc(25% - 3.75px);
    border : 1.25px solid #777;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0px 0px 10px 0px;
    @media screen and (max-width : 1199px) {
      width: calc(100% / 3 - 3.5px);
    }
    @media screen and (max-width : 991px) {
      width: calc(50% - 2.5px);
    }
    @media screen and (max-width : 639px) {
      width: 100%;
    }
    &.sold {
      display: none;
    }
`;

export const ImgItem = styled.img`
    height: 225px;
    max-width: 100%;
    object-fit: contain;
    margin: -10px 0px 0px 0px;
    @media screen and (max-width : 767px) {
      height: 185px;
      width: 100%;
    }
`

export const ColorItem = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    top : 242.5px;
    right: 2.5px;
    @media screen and (max-width : 767px) {
      top : 192.5px;
    }
`

export const ItemColorSelect = styled.div`
    width: 24px;
    height: 24px;
    margin: 0px 6.5px 0px 0px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(40,40,40);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.4s all;
    &.active {
        border: 2px solid #FFF;
        &:hover {
            border: 2px solid #FFF;
        }
    }
    &:hover {
        border: 2px solid rgba(60,60,60);
        transition: 0.4s all;
    }
`

export const ColorProduct = styled.div`
    width: 14px;
    height: 14px;
    border-radius: 50%;
`

export const TagItem = styled.div`
  margin: 10px 0px 0px 0px;
`

export const ViewTag = styled.div`
  padding: 0px 10px;
  user-select: none;
`

export const TextTag = styled.div`
    color : #888;
    font-family: F_MEDIUM;
    font-size: 1.1rem;
    line-height: calc(1.1rem * 1.25);
    text-transform : uppercase;
     @media screen and (max-width : 767px) {
      font-size: 1rem;
      line-height: calc(1rem * 1.25);
    }
`

export const NameItem = styled.div`
  color : #FFF;
  font-family: F_BOLD;
  font-size: 2rem;
  line-height: calc(2rem * 1.25);
  width: 100%;
  margin: 2.5px 0px 0px 0px;
  padding: 0px 10px;
  display: block;
  text-transform : uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @media screen and (max-width : 767px) {
    font-size: 1.9rem;
    line-height: calc(1.9rem * 1.25);
  }
`

export const OptionItem = styled.div`
  margin: 10px 0px 10px 0px;
  padding: 0px 10px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

export const ItemOptionSelect = styled.div`
  width: fit-content;
  padding: 5px 12.5px;
  margin: 0px 5px 5px 0px;
  height: fit-content;
  background: #111;
  border: 1.5px solid #555;
  font-family: F_MEDIUM;
  font-size: 1.4rem; 
  line-height: calc(1.4rem * 1.25);
  cursor: pointer;
  transition: 0.4s all;
  white-space: nowrap;
  user-select: none;
  &.active {
    background: #FFF;
    /* border: 1.5px solid #FFF; */
    color : #000;
    transition: 0.4s all;
  }
  @media screen and (max-width : 767px) {
    font-size: 1.25rem;
    line-height: calc(1.25rem * 1.25);
  }
`

export const TitleProduct = styled.div`
    position: absolute;
    color : #FFF;
    text-transform: uppercase;
    padding: 7.5px 0px;
    border-radius: 30px;
    top : 130px;
    z-index: 9;
    display: none;
    font-family: F_BOLD;
    font-size: 1.8rem;
    line-height: calc(1.8rem * 1.25);
    @media screen and (max-width : 1199px) {
        display: flex;
    }
    @media screen and (max-width : 767px) {
        top : 60px;
    }
`

export const ButtonLinkItem = styled.div`
  width: fit-content;
  border: none;
  outline: none;
  cursor: pointer;
  background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: F_BOLD;
  transition: 0.4s all;
  color : #000;
  padding: 0px 10px;
  &:hover {
    color : #000;
  }
  @media screen and (max-width : 767px) {
    height: 30px;
  }
`


export const WrapImg = styled.div`
  padding: 20px;
  width: 100%;
  height: 275px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
  radial-gradient(1000px 700px at 40% 30%, rgba(0,0,0,1), transparent 60%),
  radial-gradient(800px 550px  at 55% 55%, rgba(255,255,255,.15), transparent 40%),
  #0a0a0f;
  background-blend-mode: screen, screen, normal;
  @media screen and (max-width : 767px) {
    height: 230px;
  }
`

export const BuyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;
export const PriceOptionSelect = styled.div`
  font-size: 2rem;
  line-height: calc(2rem * 1.25);
  font-family: F_SEMIBOLD;
  @media screen and (max-width : 767px) {
    font-size: 1.85rem;
    line-height: calc(1.85rem * 1.25);
  }
`;

export const ImgLogo = styled.img`
  width: 14px;
  height: 14px;
  margin: 0px 7.5px 0px 0px;
  filter: invert(1);
`

