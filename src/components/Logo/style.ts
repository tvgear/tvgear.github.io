import styled from "styled-components";

export const BlockLogo = styled.div`

`;

export const WrapLogo = styled.div``;

export const Triangle = styled.div`
    overflow: hidden;
    position: relative;
    margin: 7em auto 0;
    border-radius: 20%;
    transform: translateY(50%) rotate(30deg) skewY(30deg) scaleX(.866);
    cursor: pointer;
    pointer-events: none;
    &:before,
    &:after {
        position: absolute;
        background: #1a47b0;
        pointer-events: auto;
        content: '';
    }
    &:before {
        border-radius: 20% 20% 20% 53%;
        transform: scaleX(1.155) skewY(-30deg) rotate(-30deg) translateY(-42.3%) skewX(30deg) scaleY(.866) translateX(-24%);
    }
    &::after {
	    border-radius: 20% 20% 53% 20%;
	    transform: scaleX(1.155) skewY(-30deg) rotate(-30deg) translateY(-42.3%) skewX(-30deg) scaleY(.866) translateX(24%);
    }
`