import styled from "styled-components";

export const BlockLogo = styled.div`
    user-select : none;
    cursor : pointer;
`;

export const Line = styled.div`
    position:  absolute;
    top : -20px;
    left : -15px;
    width: 80px;
    height : 40px;
    background : #000;
    border-radius : 50%;
    margin : 1px 0px;
    transition : 0.4s all;
    &:nth-child(2) {
        top : unset;
        bottom : -20px;
    }
`

export const Circle = styled.div`
    width: 75px;
    height: 75px;
    border-radius : 50%;
    position : relative;
    background : #FFF;
    display : flex;
    align-items: center;
    justify-content : center;
    transition : 0.4s all cubic-bezier(0.79,0.14,0.15,0.86);
`

export const CircleText = styled.div`
    color : #FFF;
    position : absolute;
    font-size : 1.6rem;
    line-height: calc(1.6rem * 1.25);
    bottom : -18px;
    margin : 0px 0px 0px 5px;
    font-family : F_HEAVY;
    transition : 0.4s all 0.1s;
`

export const WrapLogo = styled.div`
    width: 100px;
    height : 100px;
    display : flex;
    align-items: center;
    justify-content : center;
    transition : 0.4s all cubic-bezier(0.79,0.14,0.15,0.86);
    &.move {
        ${Line} {
            animation : moveTopLogo 2.5s;
            &:nth-child(2) {
                top : unset;
                animation : moveBottomLogo 2.5s;
            }
        }
    }
    &.active {
        ${Line} {
            animation : rotateLogo 15s infinite cubic-bezier(.41,1.13,.76,-0.3);
        }
    }
`;

export const CirclePoint  = styled.div`
    width: 50px;
    height: 50px;
    position : absolute;
    top : 0px;
    left : 0px;
    right: 0px;
    bottom : 0px;
    margin : auto;
    border-radius : 50%;
    overflow : hidden;
`


