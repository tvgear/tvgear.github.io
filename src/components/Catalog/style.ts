import Link from "next/link";
import styled from "styled-components";

export const ListTab = styled.div`
    width: 100%;
    position: sticky;
    border-radius: 18px 18px 0px 0px;
    top : 0px;
    display: flex;
    background: rgba(21,20,24,0.85);
    backdrop-filter: blur(22px);
    border-bottom : 1.5px solid rgba(30,30,30);
    z-index: 2;
    padding: 7.5px 10px;
    align-items: center;
    justify-content: flex-end;
    @media screen and (max-width : 767px) {
      justify-content: flex-start;
      overflow-x: auto;
       padding: 7.5px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
`;
export const ItemTab = styled.div`
    padding: 10px 12.5px;
    background: rgba(20,20,20);
    margin: 0px 2px;
    border-radius: 30px;
    font-family: F_SEMIBOLD;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.4s all;
    &.active {
      background: rgba(40,40,40);
      transition: 0.4s all;
    }
    @media screen and (max-width : 1199px) {
       padding: 7.5px 10px;
    }
`;

export const ImgTab = styled.img`
    width: 16px;
    height: 16px;
    margin: 0px 10px 0px 0px;
    object-fit: contain;
    border-radius: 4px;
    @media screen and (max-width : 1199px) {
        width: 14px;
        height: 14px;
    }
`

export const TextTab = styled.div`
    font-family: F_MEDIUM;
    font-size: 1.25rem;
    line-height: calc(1.25rem * 1.25);
     @media screen and (max-width : 1199px) {
       white-space: nowrap;
       font-size: 1rem;
       line-height: calc(1rem * 1.25);
     }
`

export const ListProduct = styled.div`
    padding: 15px 15px 50px 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 7.5px;
    width: 100%;
    margin: 0 auto;
    @media screen and (max-width : 1199px) {
      padding: 7.5px 10px 15px 10px;
    }
   
`;
export const ItemProduct = styled.div`
    width: calc(25% - 6px);
    background: rgba(30,30,30);
    padding: 10px 10px 2.5px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    border-radius: 7.5px;
    @media screen and (max-width : 991px) {
      width: calc(50% - 7.5px);
      margin: 0 auto;
    }
    @media screen and (max-width : 639px) {
      width: 100%;
      max-width: 350px;
    }
`;

export const ImgItem = styled.img`
    height: 200px;
    max-width: 100%;
    object-fit: contain;
    margin: 5px 0px 15px 0px;
    @media screen and (max-width : 767px) {
        height: 180px;
    }
`

export const ColorItem = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px 0px 2.5px 0px;
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
   position: absolute;
   left : 12px;
   top : 12px;
`

export const ViewTag = styled.div`
    background: #FFF;
    color : #000;
    text-transform: capitalize;
    padding: 4px 8px;
    border-radius: 20px;
    user-select: none;
`

export const TextTag = styled.div`
    color : #000;
    font-family: F_BOLD;
    font-size: 1rem;
    line-height: calc(1rem * 1.25);
    text-transform : uppercase;
`

export const NameItem = styled.div`
  color : #FFF;
  font-family: F_BOLD;
  font-size: 1.6rem;
  line-height: calc(1.6rem * 1.25);
  width: 100%;
  margin: 5px 0px 0px 0px;
  display: block;
  text-transform : uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  @media screen and (max-width : 1199px) {
    font-size: 1.4rem;
    line-height: calc(1.4rem * 1.25);
  }
`

export const OptionItem = styled.div`
  margin: 10px 0px 0px 0px;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`

export const ItemOptionSelect = styled.div`
  width: fit-content;
  padding: 5px 7.5px;
  margin: 0px 5px 5px 0px;
  height: fit-content;
  border: 1.5px solid rgba(50,50,50);
  border-radius: 30px;
  font-family: F_MEDIUM;
  font-size: 1.25rem; 
  line-height: calc(1.25rem * 1.25);
  cursor: pointer;
  transition: 0.4s all;
  white-space: nowrap;
  user-select: none;
  &.active {
    border: 1.5px solid #FFF;
    background: #FFF;
    color : #000;
    transition: 0.4s all;
  }
`

export const PriceItem = styled.div`
    font-size: 2rem;
    line-height: calc(2rem * 1.25);
    width: 100%;
    margin: 3.5px 0px 0px 0px;
    font-family: F_BOLD;
    span {
        text-decoration: underline;
        font-size: 1.8rem;
        line-height: calc(1.8rem * 1.25);
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

export const ButtonLinkItem = styled(Link)`
  margin: 0px 0px 10px 0px;
  background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  font-family: F_BOLD;
  transition: 0.4s all;
  &:active {
    color : #000;
    filter: brightness(0.9);
    transition: 0.4s all;
  }
  &:hover {
    color : #000;
    filter: brightness(0.9);
    transition: 0.4s all;
  }
`

export const TextButton = styled.div`
  color : #000;
  display: flex;
  span {
      text-decoration: underline;
      font-size: 1.2rem;
      line-height: calc(1.2rem * 1.25);
  }
`