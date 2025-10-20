import styled, { keyframes } from "styled-components";

const moveGray = keyframes`
  0% { bottom: calc(-100%); }
  100% { bottom: -5px; }
`;

const moveBlack = keyframes`
  0% {
    bottom: -100%;
    width: 125px;
    height: 100dvh;
  }
  40% {
    width: 125px;
  }
  65% {
    width: 125px;
  }
  100% {
    width: 100vw;
    bottom: 0px;
    left : 0px;
    height: calc(100dvh + 340px);
  }
`;

export const BlockLoading = styled.div`
  position: fixed;
  width: 100vw;
  height: 100dvh;
  background: #FFF;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.8s all;
  backdrop-filter: blur(20px);
  &.active {
    opacity: 1;
    visibility: visible;
    transition: 0.8s all;
  }
`;

export const WrapMove = styled.div`
  height: 100dvh;
  position: absolute;
  z-index: 2;
  top: 0px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LineGray = styled.div`
  width: 125px;
  height: 35dvh;
  position: absolute;
  bottom: -100%;
  background: rgba(220,220,220);
  border-radius: 80px 80px 0px 0px;
  z-index: 1;
  &.active {
    animation: ${moveGray} 1.75s ease-out forwards;
  }
`;

export const LineBlack = styled.div`
  position: absolute;
  bottom: -100%;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  height: 100%;
  z-index: 2;
  background: #000;
  border-radius: 65px 65px 0px 0px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 15px 0px 0px 0px;
  overflow: hidden;
  &.active {
    animation: ${moveBlack} 1.25s cubic-bezier(0.42, 0, 0.58, 1) forwards;
  }
`;

export const ImgLogo = styled.img`
  width: 100px;
  height: 100px;
  filter: invert(1);
`

export const ImgDirect = styled.img`
  width: 100px;
  height: 100px;
  filter: invert(1);
`