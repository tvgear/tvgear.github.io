
import styled from "styled-components";

export const BlockHeader = styled.div`
    top : 0;
    left : 0;
    right: 0px;
    margin: 0 auto;
    z-index: 9;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #000;
    border: 1.25px solid #777;
`

export const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0px 0px 10px;
  height: 55px;
  @media screen and (max-width : 767px) {
      height: 45px;
  }
`

export const WrapLogo = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
`

export const ImgLogo = styled.img`
  width: 32px;
  height: 32px;
`

export const TextLogo = styled.div`
  font-size: 1.4rem;
  line-height: calc(1.4rem * 1.25);
  font-family: F_BOLD;
  margin: 0px 0px -1.5px 5px;
  user-select: none;
  display: flex;
  flex-direction: column;
`

export const RightHeader = styled.div`
  display: flex;
`




export const ListMenu = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    
`

export const NameMenu = styled.div`
   white-space: nowrap;
`

export const ItemMenu = styled.div`
    border-left : 1.25px solid #777;
    height: 55px;
    width: fit-content;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: F_BOLD;
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
    transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    color : #FFF;
    text-transform: uppercase;
    &.active {
      color : #000;
      background: #FFF;
     transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
    @media screen and (max-width : 767px) {
      height: 45px;
      font-size: 1.4rem;
      line-height: calc(1.4rem * 1.25);
      padding: 0px 15px;
    }
`
