import styled from "styled-components";

export const BlockLoading = styled.div`
    position : fixed;
    width: 100vw;
    height: 100vh;
    background : #000;
    z-index: 999;
    display : flex;
    flex-direction: column;
    align-items:  center;
    justify-content: center;
    clip-path: polygon(0 0, 100% 0, 100% 0%, 0% 0%);
    transform: translateY(100%);
    transition: 0.6s all cubic-bezier(.61,.07,.35,.59);
    &.active {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        transition: 0.6s all cubic-bezier(.61,.07,.35,.59);
        transform: translateY(0%);
    }
   
`

export const PercentLoading = styled.div`
    font-size: 5rem;
    line-height : calc(5rem * 1.25);
    color : #fff;
    font-family: F_SEMIBOLD;
    position: absolute;
    bottom : 5px;
    right: 15px;
    &:hidden {
        opacity : 0;
    }
`