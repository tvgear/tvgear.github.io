import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

export const ListTab = styled.div`
    width: 175px;
    position: fixed;
    border-radius: 20px;
    padding: 0px 10px;
    top : 155px;
    @media screen and (max-width : 1199px) {
       position: fixed;
       z-index: 2;
       top : 125px;
       padding: 10px;
       overflow-y: auto;
       &::-webkit-scrollbar {
        display: none;
       }
    }
`;
export const ItemTab = styled.div`
    padding: 10px 15px;
    border: 1.5px solid rgba(24,24,24);
    margin: 10px 0px;
    border-radius: 10px;
    font-family: F_BOLD;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: 0.4s all;
    &.active {
        background: rgba(30,30,30);
        transition: 0.4s all;
    }
    @media screen and (max-width : 1199px) {
        margin: 0px 0px 10px 0px;
        padding: 7.5px 10px;
        width: 40px;
        height: 40px;
        padding: 0px;
        justify-content: center;
    }
`;

export const ImgTab = styled.img`
    width: 22px;
    height: 22px;
    margin: 0px 12.5px 0px 0px;
    object-fit: contain;
    @media screen and (max-width : 1199px) {
        margin: 0px;
        width: 20px;
        height: 20px;
    }
`

export const TextTab = styled.div`
    font-family: F_BOLD;
    @media screen and (max-width : 1199px) {
       display: none;
    }
`

export const ListProduct = styled.div`
    padding: 0px 0px 50px 225px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
    @media screen and (max-width : 1199px) {
      padding: 0px 15px 50px 15px;
      max-width: 675px;
      margin: 0 auto;
    }
    @media screen and (max-width : 767px) {
      max-width: 400px;
      padding: 0px 15px 50px 65px;
      margin: 0 auto;
    }
`;
export const ItemProduct = styled.div`
    width: calc(50% - 7.5px);
    background: rgba(14,14,14);
    padding: 35px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    @media screen and (max-width : 767px) {
     width: 100%;
    }
`;

export const ImgItem = styled.img`
    height: 225px;
    max-width: 100%;
    object-fit: contain;
`

export const ColorItem = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    align-items: flex-end;
    right : 12.5px;
    bottom : 150px;
`

export const ItemColorSelect = styled.div`
    width: 24px;
    height: 24px;
    margin: 3.5px 0px;
    border-radius: 50%;
    border: 2px solid rgba(40,40,40);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.4s all;
    &.active {
        border: 2px solid #FFF;
        &:hover {
            border: 2px solid #FFF;
        }
    }
    &:hover {
        border: 2px solid rgba(60,60,60);
        transition: 0.4s all;
    }
`

export const ColorProduct = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
`

export const TagItem = styled.div`
    position: absolute;
    top : 10px;
    left : 10px;
    display: flex;
`

export const ViewTag = styled.div`
    background: rgba(30,30,30);
    margin: 0px 3.5px 0px 0px;
    text-transform: capitalize;
    padding: 3.5px 10px;
    border-radius: 20px;
    user-select: none;
`

export const TextTag = styled.div`
    background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: F_BOLD;
  font-size: 1.25rem;
  line-height: calc(1.25rem * 1.25);
`

export const NameItem = styled.div`
     background: -webkit-linear-gradient(
    0deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: F_BOLD;
  font-size: 1.8rem;
  line-height: calc(1.8rem * 1.25);
  width: 100%;
  margin: 15px 0px 5px 0px;
`

export const OptionItem = styled.div`
  margin: 7.5px 0px 0px 0px;
  display: flex;
  align-items: center;
  width: 100%;
`

export const ItemOptionSelect = styled.div`
  width: fit-content;
  padding: 5px 7.5px;
  margin: 0px 3.5px 0px 0px;
  border: 1.5px solid rgba(30,30, 30);
  border-radius: 10px;
  font-family: F_MEDIUM;
  cursor: pointer;
  transition: 0.4s all;
  &.active {
    background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
    color : #000;
    transition: 0.4s all;
  }
`

export const PriceItem = styled.div`
    font-size: 2rem;
    line-height: calc(2rem * 1.25);
    width: 100%;
    margin: 5px 0px 0px 0px;
    font-family: F_BOLD;
    span {
        text-decoration: underline;
        font-size: 1.6rem;
        line-height: calc(1.6rem * 1.25);
    }
`

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mouse"); 
  }, [router]);

  return null;
};

export default Index;
