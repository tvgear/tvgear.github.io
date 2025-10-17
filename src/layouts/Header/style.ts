
import styled from "styled-components";

export const BlockHeader = styled.div`
    top : 0;
    left : 0;
    right: 0px;
    height: 60px;
    margin: 0 auto;
    z-index: 9;
    width: 100%;
    max-width: 1440px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 2.5px;
    @media screen and (max-width : 1199px) {
       padding: 0px 5px;
       height: 50px;
       overflow-x: hidden;
    }
`

export const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    .blockLogo {
        border: 2.5px solid #000;
    }
    @media screen and (max-width : 1199px) {
        display: none;
    }
`

export const TextLogo = styled.div`
    font-family: F_BOLD;
    font-size: 2.4rem;
    line-height: calc(2.4rem * 1.25);
    color : #000;
    margin: 0px 0px 0px 8.5px;
`

export const ListMenu = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 0px 0px 12.5px;
    background: #000;
    height: 47.5px;
    border-radius: 30px;
    padding: 0px 3.5px;
    @media screen and (max-width : 1199px) {
      height: 35px;
      overflow-x: auto;
      overflow-y: hidden;
      justify-content: flex-start;
      width: calc(100%);
      border: 1px solid rgba(60,60,60);
      padding: 0px 1.5px;
      margin: 0px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
`

export const NameMenu = styled.div`
   white-space: nowrap;
`

export const ItemMenu = styled.div`
    margin: 0px 1.5px;
    height: 37.5px;
    width: fit-content;
    padding: 0px 17.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-family: F_SEMIBOLD;
    transition: 0.4s all;
    color : #FFF;
    &:hover {
      background: rgba(30,30,30);
      transition: 0.4s all;
    }
    &.active {
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  color : #000;
      transition: 0.4s all;
    }
    @media screen and (max-width : 1199px) {
      font-size: 1.1rem; 
      line-height: calc(1.1rem * 1.25);
      height: 28px;
      margin: 0px 2.5px;
      padding: 0px 10px;
      &:hover {
        background: rgba(50,50,50);
        transition: 0.4s all;
     }
    }
`
