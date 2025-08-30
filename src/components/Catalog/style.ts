import Link from "next/link";
import styled from "styled-components";

export const ListTab = styled.div`
    width: 175px;
    position: fixed;
    border-radius: 20px;
    padding: 0px 10px;
    top : 155px;
    @media screen and (max-width : 1199px) {
       position: fixed;
       z-index: 2;
       top : 120px;
       padding: 10px;
       width: 60px;
       overflow-y: auto;
       &::-webkit-scrollbar {
        display: none;
       }
    }
    @media screen and (max-width : 767px) {
       top : 55px;
    }
`;
export const ItemTab = styled.div`
    padding: 10px 15px;
    border: 1.5px solid rgba(24,24,24);
    margin: 10px 0px;
    border-radius: 10px;
    font-family: F_BOLD;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.4s all;
    &.active {
        background: rgba(30,30,30);
        transition: 0.4s all;
    }
    @media screen and (max-width : 1199px) {
        margin: 0px 0px 10px 0px;
        padding: 7.5px 10px;
        width: 40px;
        height: 40px;
        padding: 0px;
        justify-content: center;
    }
`;

export const ImgTab = styled.img`
    width: 22px;
    height: 22px;
    margin: 0px 12.5px 0px 0px;
    object-fit: contain;
    border-radius: 4px;
    @media screen and (max-width : 1199px) {
        margin: 0px;
        width: 20px;
        height: 20px;
    }
`

export const TextTab = styled.div`
    font-family: F_MEDIUM;
    @media screen and (max-width : 1199px) {
       display: none;
    }
`

export const ListProduct = styled.div`
    padding: 0px 0px 50px 225px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
    @media screen and (max-width : 1199px) {
      padding: 0px 15px 50px 15px;
      max-width: 675px;
      margin: 0 auto;
    }
    @media screen and (max-width : 767px) {
      max-width: 400px;
      padding: 0px 15px 50px 65px;
      margin: 0 auto;
    }
`;
export const ItemProduct = styled.div`
    width: calc(33% - 7.5px);
    background: rgba(20,20,20);
    padding: 12.5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    @media screen and (max-width : 1199px) {
      width: calc(50% - 7.5px);
    }
    @media screen and (max-width : 767px) {
     width: 100%;
    }
`;

export const ImgItem = styled.img`
    height: 175px;
    max-width: 100%;
    object-fit: contain;
    margin: 10px 0px;
    @media screen and (max-width : 767px) {
        height: 150px;
    }
`

export const ColorItem = styled.div`
    display: flex;
    width: 100%;
    margin: 7.5px 0px 0px 0px;
`

export const ItemColorSelect = styled.div`
    width: 20px;
    height: 20px;
    margin: 0px 5px 0px 0px;
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
    width: 13px;
    height: 13px;
    border-radius: 50%;
`

export const TagItem = styled.div`
   position: absolute;
   left : 7.5px;
   top : 7.5px;
`

export const ViewTag = styled.div`
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    text-transform: capitalize;
    padding: 4px 8px;
    border-radius: 2px;
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
  font-size: 1.4rem;
  line-height: calc(1.4rem * 1.25);
  width: 100%;
  margin: 5px 0px 0px 0px;
  display: block;
  text-transform : uppercase;
  background: -webkit-linear-gradient(
    -60deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @media screen and (max-width : 1199px) {
    font-size: 1.4rem;
    line-height: calc(1.4rem * 1.25);
  }
`

export const OptionItem = styled.div`
  margin: 10px 0px 15px -1.5px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-height: 60px;
  flex-wrap: wrap;
`

export const ItemOptionSelect = styled.div`
  width: fit-content;
  padding: 3.5px 7.5px;
  margin: 0px 5px 0px 0px;
  height: fit-content;
  border: 1.5px solid rgba(40,40,40);
  border-radius: 6.5px;
  font-family: F_BOLD;
  font-size: 1.2rem; 
  line-height: calc(1.2rem * 1.25);
  cursor: pointer;
  transition: 0.4s all;
  white-space: nowrap;
  user-select: none;
  &.active {
    background: #FFF;
    color : #000;
    transition: 0.4s all;
  }
`

export const PriceItem = styled.div`
    font-size: 1.8rem;
    line-height: calc(1.8rem * 1.25);
    width: 100%;
    margin: 0px 0px 0px 0px;
    font-family: F_BOLD;
    span {
        text-decoration: underline;
        font-size: 1.6rem;
        line-height: calc(1.6rem * 1.25);
    }
    @media screen and (max-width : 1199px) {
        font-size: 1.6rem;
        line-height: calc(1.6rem * 1.25);
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
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  color : #000;
  width: 75px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-family: F_BOLD;
  transition: 0.4s all;
  text-transform: uppercase;
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