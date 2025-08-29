
import styled from "styled-components";

export const BlockHeader = styled.div`
    padding: 15px;
    top : 0;
    left : 0;
    right: 0px;
    position: fixed;
    max-width: 1100px;
    margin: 0 auto;
    background: rgba(0,0,0,.75);
    backdrop-filter: blur(10px);
    z-index: 9;
    width: 100%;
    @media screen and (max-width : 1199px) {
        padding: 7.5px 0px;
    }
`

export const ContentWrap = styled.div`
    margin: 0 auto; 
    @media screen and (max-width : 1199px) {
        padding: 0px;
    }
    @media screen and (max-width : 767px) {
        display: flex;
    }
`

export const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width : 1199px) {
        padding: 10px;
        .blockLogo {
            width: 45px;
            height: 45px;
        }
    }
    @media screen and (max-width : 767px) {
        padding: 0px;
        min-width: 65px;
        display: flex;
        align-items: center;
        justify-content: center;
        .blockLogo {
            width: 37.5px;
            height: 37.5px;
        }
    }
`

export const ListMenu = styled.div`
    margin: 20px 0px 0px 0px;
    display: flex;
    justify-content: center;
    @media screen and (max-width : 1199px) {
      margin: 7.5px 0px 0px 0px;
      overflow: auto;
    }
    @media screen and (max-width : 767px) {
      margin: 0px 0px 0px 0px;
      justify-content: flex-start;
      overflow: auto;
      padding: 0px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
`

export const NameMenu = styled.div`
   white-space: nowrap;
`

export const ItemMenu = styled.div`
    margin: 0px 7.5px 0px 0px;
    height: 37.5px;
    width: fit-content;
    padding: 0px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-family: F_BOLD;
    text-transform: uppercase;
    transition: 0.4s all;
    border: 2px solid rgba(30,30,30);
    transition: 0.4s all;
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
      font-size: 1.25rem; 
      line-height: calc(1.25rem * 1.25);
      padding: 0px 12.5px;
    }
    @media screen and (max-width : 1199px) {
      font-size: 1.1rem; 
      line-height: calc(1.1rem * 1.25);
      padding: 0px 12.5px;
      margin: 0px 5px 0px 0px;
    }
`
