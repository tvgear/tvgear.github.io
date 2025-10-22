import styled from "styled-components";

export const WrapModal = styled.div`
    position: fixed;
    top : 0px;
    z-index: 1;
    z-index: 99;
    right: 0px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(10px);
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 100dvh;
    visibility: hidden;
    transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &.active {
        visibility: visible;
        transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
`
export const WrapFormModal = styled.div`
    border: 1.25px solid #777;
    border-bottom: none;
    width: 380px;
    background: #000;
    transform: translateX(100%);
    transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    &.active {
         transform: translateX(0%);
          transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
`;

export const HeaderForm = styled.div`
    border-bottom : 1.25px solid #777;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
`;
export const Title = styled.div`
    font-size : 1.8rem;
    line-height: calc(1.8rem * 1.25);
    text-transform: uppercase;
    font-family: F_BOLD;
    padding: 0px 10px;
`;
export const CloseForm = styled.div`
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    border-left : 1.25px solid #777;
    cursor: pointer;
`;

export const ImgClose = styled.img`
    width: 12.5px;
    height: 12.5px;
    filter: invert(1);
`

export const ContentForm = styled.div`
    height: calc(100dvh - 40px);
    overflow-y : auto;
   
    &::-webkit-scrollbar {
        display: none;
    }
`;
export const InfoProduct = styled.div`
    
    display: flex;
    align-items: flex-start;
    border-bottom : 1.25px solid #777;
`;
export const InfoImg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #151515;
    width: 150px;
    height: 125px;
    padding: 0px 10px;
    
`;
export const ImgProduct = styled.img`
    width: 100%;
    height: 125px;
    object-fit: contain;
`;

export const InfoOption = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 100px);
    height: 125px;
    padding: 5px 10px 10px 10px;
`

export const NameInfo = styled.div`
    font-family: F_BOLD;
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
    display: flex;
    flex-direction: column;
    span {
        color : #AAA;
        font-family: F_REGULAR;
        font-size: 1.25rem;
        line-height: calc(1.25rem * 1.25);
        margin: 3.5px 0px 0px 0px;
    }
`
export const PriceSelectInfo = styled.div`
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
    margin: 5px 0px 0px 0px;
    font-family: F_SEMIBOLD;
`

export const InfoCustomer = styled.div`
    padding: 5px;
`

export const ItemForm = styled.div`
    margin: 0px 0px 5px 0px;
`
export const InputForm = styled.input`
    background: #000;
    border : 1.5px solid #777;
    outline: none;
    height: 50px;
    padding: 0px 10px;
    color : #fff;
    width: 100%;
    font-family: F_REGULAR;
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
`

export const TextAreaForm = styled.textarea`
    background: #000;
    border : 1.5px solid #777;
    outline: none;
    max-height: 100px;
    padding: 10px 10px;
    color : #fff;
    width: 100%;
    font-family: F_REGULAR;
    resize: none;
    font-size: 1.6rem;
    line-height: calc(1.6rem * 1.25);
`

export const ButtonOrder = styled.button`
  width: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  background: -webkit-linear-gradient(
    -135deg,
    rgba(97, 221, 249, 1) 0%,
    rgba(150, 215, 250, 1) 25%,
    rgba(200, 210, 250, 1) 50%,
    rgba(230, 223, 248, 1) 100%
  );
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: F_BOLD;
  transition: 0.4s all;
  color : #000;
  padding: 0px 10px;
  text-transform: uppercase;
  &:hover {
    color : #000;
  }
  @media screen and (max-width : 767px) {
    height: 30px;
  }
`

export const FormError = styled.div`
  background: rgba(255, 107, 107, 0.125);
  color : rgba(255, 107, 107, 1);
  border : 1px solid rgba(255, 107, 107, 0.5);
  text-transform: uppercase;
  text-align: center;
  padding: 5px 0px;
  margin: 0px 0px 5px 0px;
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  line-height: calc(1.2rem * 1.25);
`

export const InfoAfterOrder = styled.div`
  
`
export const TitleAfterOrder = styled.div`
  color : #6bff8a;
  font-family: F_BOLD;
  font-size: 1.6rem; 
  line-height: calc(1.6rem * 1.25);
  text-transform : uppercase;
  padding: 10px 10px 10px 10px;
`

export const DescAfterOrder = styled.div`
  padding: 0px 10px;
  margin: 5px 0px 0px 0px;
  text-transform: uppercase;
  font-size: 1.25rem; 
  line-height: calc(1.25rem * 1.25);
`

export const DescSelectOrder = styled.div`
  padding: 0px 10px;
  margin: 7.5px 0px 7.5px 0px;
  color : #FFF;
  text-align: center;
  text-transform: uppercase;
  font-size: 1.25rem; 
  line-height: calc(1.25rem * 1.25);
`

export const InfoPayment = styled.div`
  padding: 0px 10px;
  margin: 10px 0px 0px 0px;
`
export const TabPayment = styled.div`
  display: flex;
  border : 1px solid #777;
`
export const ItemTab = styled.div`
  width : 50%;
  height: 30px;
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  font-size: 1.4rem;
  line-height: calc(1.4rem * 1.25);
  font-family: F_BOLD;
  &.active {
    background: #FFF;
    color : #000;
    transition: 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }
`
export const ContentPayment = styled.div`
    margin: 0px 0px 10px 0px;
`
export const InfoProductOrder = styled.div`
    display: flex;
    border-bottom : 1.5px solid #777;
    border-top : 1.5px solid #777;
    
`

export const ProfitItem = styled.div`
    background: rgba(224,55,43);
    color : #FFF;
    position: absolute;
    top: -5px;
    right : -5px;
    font-size: 1rem;
    line-height: calc(0.85rem * 1.25);
    font-family: F_MEDIUM;
    padding: 2px;
`

export const ItemPayment = styled.div``
export const WrapQR = styled.div`
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px auto;
    border : 1.5px solid #777;
`;
export const ImgQR = styled.img`
    width: 175px;
    height: 175px;
    object-fit: contain;
    user-select: none;
`;

export const WrapContent = styled.div`
    background: #222;
    margin: 10px 0px 0px 0px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    span {
        &.payment {
            color : #6bff8a;
        }
        &.note {
            font-size: 1rem;
            margin: -2px 0px 0px 0px;
            text-transform: uppercase;
            color : #AAA;
        }
        text-transform: uppercase;
        margin: 0px 0px 10px 0px;
        &:last-child {
            margin: 0px;
        }
    }
`

export const WrapNumberBank = styled.div`
    width: fit-content;
    background: #000;
    margin: 0px 0px 0px 0px;
    padding: 5px;
    width: 100%;
`
export const NumberBank = styled.div`
    color : #fff;
    font-family: F_MEDIUM;
    font-size: 1.8rem;
    line-height: calc(1.8rem * 1.25);
    text-align: center;
`

export const InfoBank = styled.div`
    color : #fff;
    font-family: F_MEDIUM;
    font-size: 1.2rem;
    line-height: calc(1.2rem * 1.25);
    text-align: center;
    margin: 2.5px 0px 0px 0px;
`

export const CopyNumberBank = styled.div`
    background: #FFF;
    margin: 5px 0px 0px 0px;
    height: 27.5px;
    color : #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    line-height: calc(1.2rem * 1.25);
    font-family: F_BOLD;
    text-transform: uppercase;
`