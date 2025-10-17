import styled from "styled-components";

export const Circle = styled.div`
  position: absolute;
  margin: auto;
  width: 65%;
  height: 65%;
  border-radius: 50%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  left: 0;
  right: 0;
  top : 0;
  bottom: 0;
  margin: auto;
`;

export const Line = styled.div`
  position: absolute;
  left:  0;
  right: 0;
  margin: auto;
  top : -0.5px;
  width: 15%;
  height: calc(100% + 1px);
  background: #000;
  transition: 0.4s all;
  z-index: 1;
  will-change: transform;
`;

export const LineTop = styled.div`
    width: 75%;
    height: 12.5%;
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    position: absolute;
    top : 17.5%;
    z-index: 2;
`

export const LineCenter = styled.div`
    width: 55%;
    height: 12.5%;
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    position: absolute;
    top : 45%;
    transform: rotate(90deg);
    z-index: 1;
`

export const LineBottomLeft = styled.div`
    width: 50%;
    height: 13.5%;
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    position: absolute;
    bottom : 20%;
    left: 12%;
    transform: rotate(45deg);
    z-index: 2;
`

export const LineBottomRight = styled.div`
    width: 50%;
    height: 13.5%;
    background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    position: absolute;
    bottom : 20%;
    right : 12%;
    transform: rotate(-45deg);
    z-index: 2;
`

export const WrapBrandLine = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70%;
    height: 70%;
`

export const BlockLogo = styled.div<{ size: number; scale: number }>`
  user-select: none;
  cursor: pointer;
  position: relative;
 
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  transform: scale(${({ scale }) => scale});
  border-radius: 50%;
  background: linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
`;

