import Link from "next/link";
import styled from "styled-components";

export const BlockHeader = styled.div`
   background : rgba(0,0,0,0.9);
   backdrop-filter: blur(10px);
   position : fixed;
   top : 0px;
   left: 0px;
   width: 100%;
`
export const ContentWrap = styled.div``

export const WrapHeader = styled.div`
    width: 100%;
    height : 55px;
    display : flex;
    align-items : center;
    justify-content : space-between;
`
export const WrapLeft = styled.div`
    display : flex;
    width : 100px;
`

export const WrapCenter = styled.div`
 display : flex;
 width : calc(100% - 200px);
 align-items:  center;
 justify-content : center;
`

export const MenuWeb = styled.div`
    display : flex;
`
export const ItemMenu = styled(Link)`
    display : flex;
    margin : 0px 17.5px;
    font-family : F_SEMIBOLD;
    transition : 0.4s all;
    color : rgba(255, 255, 255, .8);
    &:hover {
        color : #FFF;
    }
`

export const WrapRight = styled.div`
 display : flex;
  width : 100px;
`

export const SearchTool = styled.div`
    cursor : pointer;
`

export const ImgSearch = styled.img`
    width: 16px;
    height: 16px;
    filter : invert(1);
`