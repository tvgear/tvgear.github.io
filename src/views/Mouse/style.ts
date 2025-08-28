import styled from "styled-components";

export const BlockMouse = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    @media screen and (max-width : 1199px) {
       flex-direction: column;
    }
`;

export const TitleProduct = styled.div`
    position: absolute;
    color : #fff;
    background: rgba(24,24,24);
    padding: 7.5px 15px;
    border-radius: 30px;
    top : 135px;
    z-index: 999;
    display: none;
    font-family: F_BOLD;
    font-size: 1.25rem;
    line-height: calc(1.25rem * 1.25);
    @media screen and (max-width : 1199px) {
        display: flex;
    }
`