import styled from "styled-components";

export const BlockLoading = styled.div`
    position : fixed;
    width: 100vw;
    height: 100dvh;
    background : #000;
    z-index: 999;
    display : flex;
    flex-direction: column;
    align-items:  center;
    justify-content: center;
    transition: 0.6s all cubic-bezier(.61,.07,.35,.59);
    transform: scale(50);
    visibility: hidden;
    opacity: 0;
    user-select: none;
    pointer-events: none;
    &.active {
        transition: transform 0.6s cubic-bezier(.61,.07,.35,.59), visibility 0.6s;
        transform: scale(1);
        opacity: 1;
        visibility: visible;
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