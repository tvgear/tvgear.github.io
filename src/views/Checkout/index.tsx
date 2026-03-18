import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useRouter } from "next/router";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Copy, Loader2, Image as ImageIcon, HelpCircle, X, Edit2, ChevronRight, ImageUp } from "lucide-react";
import { CartItem } from "@/types/product";
import { getCart, getCartTotal, clearCart } from "@/utils/carts";
import { findColorDef } from "@/utils/colors";
import { copyToClipboard } from "@/utils";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyVpj6d0HHD5sp2XnCfL63tsQReF9oHBWUSTVJldAdZ08x5EOmXwA-yu4lmiZ8mFe99/exec";

import divisions from "@/data/vietnam-divisions.json";

interface Division {
  n: string;
  d: {
    n: string;
    w: string[];
  }[];
}

const VIETNAM_DATA = divisions as Division[];

/* ─── styled ─── */
const Page = styled.div<{ $success?: boolean }>`
  min-height: 100vh;
  padding: 24px 40px;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  @media screen and (max-width: 767px) {
    padding: 0;
  }
`;

const SuccessBackgroundStyle = createGlobalStyle`
  #layout-wrapper {
    background: #f2f2f2 !important;
  }
`;

const MobileBackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #ebebeb;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 12px;
  transition: 0.2s;
  &:hover {
    background: #dddddd;
  }
  @media screen and (max-width: 767px) {
    margin-right: 8px;
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 980px;
  margin: 0 auto;
  align-items: flex-start;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }
`;

const Card = styled.div`
  background: transparent;
  padding: 0 20px;
  @media screen and (max-width: 767px) {
    background: #fff;
    padding: 8px 16px 16px;
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

const Badge = styled.div`
  background: #ff3b30;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1.05rem;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  @media screen and (max-width: 767px) {
    font-size: 0.9rem;
    height: 18px;
    padding: 0 6px;
  }
`;

const SectionTitle = styled.div`
  font-family: F_BOLD;
  font-size: 1.4rem;
  margin-top: 32px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:first-child {
    margin-top: 0;
  }
  @media screen and (max-width: 767px) {
    font-size: 1.2rem;
    margin-top: 32px;
    margin-bottom: 10px;
    &.mobile-no-mt {
      margin-top: 0;
    }
    &.mobile-hide {
      display: none;
    }
  }
`;

const ProductListWrap = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 12px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  @media screen and (max-width: 767px) {
    padding: 0px;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }
`;

const CheckoutItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;
const CIImg = styled.img`
  width: 76px;
  height: 76px;
  object-fit: contain;
  border-radius: 12px;
  background: #fafafa;
  padding: 10px;
`;
const CIInfo = styled.div`
  flex: 1;
  margin : 0px 0px 0px 7.5px;
`;
const CIName = styled.div`
  font-family: F_BOLD;
  font-size: 1.35rem;
  text-transform: uppercase;
  margin-bottom: 2px;
  @media screen and (max-width: 767px) {
    font-size: 1.15rem;
  }
`;
const CIMeta = styled.div`
  font-size: 1.2rem;
  color: #777;
  margin: 2px 0;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
`;
const CIPriceWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;
const CIPrice = styled.div`
  font-family: F_SEMIBOLD;
  font-size: 1.4rem;
  @media screen and (max-width: 767px) {
    font-size: 1.25rem;
  }
`;
const CIQty = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.3rem;
  color: #555;
  @media screen and (max-width: 767px) {
    font-size: 1.15rem;
  }
`;

const SummaryRow = styled.div<{ $bold?: boolean; $large?: boolean; $color?: string }>`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: ${(p) => (p.$bold || p.$large ? "F_BOLD" : "F_REGULAR")};
  font-size: ${(p) => (p.$large ? "1.5rem" : "1.4rem")};
  padding: 3px 0;
  color: ${(p) => p.$color || (p.$bold || p.$large ? "#000" : "#555")};
  
  span:first-child {
    flex-shrink: 0;
    min-width: 150px;
    color: #777;
    font-family: F_MEDIUM;
  }
  
  span:last-child {
    flex: 1;
    text-align: right;
    word-break: break-word;
  }

  @media screen and (max-width: 767px) {
    font-size: ${(p) => (p.$large ? "1.3rem" : "1.2rem")};
    padding: 2px 0;
    gap: 12px;
    
    span:first-child {
      min-width: 100px;
    }
  }
`;

const SummaryContainer = styled.div`
  margin-top: 16px;
  @media screen and (max-width: 767px) {
    margin-top: 12px;
  }
`;

const MethodSummaryWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
  @media screen and (max-width: 767px) {
    margin: 8px 0;
    padding: 8px 0;
    gap: 6px;
    background: transparent;
    border-radius: 0;
    border: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 6px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
  flex: 1;
`;
const ShowMoreBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: #f2f2f2;
  border: none;
  border-radius: 12px;
  font-family: F_BOLD;
  font-size: 1.2rem;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px 0;
  transition: 0.2s;
  &:hover {
    background: #f0f0f0;
    color: #000;
  }
  @media screen and (max-width: 767px) {
    font-size: 1.1rem;
    padding: 8px;
    margin: 8px 0;
  }
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  @media screen and (max-width: 767px) {
    gap: 12px;
    margin-top: 12px;
  }
`;
const Label = styled.label`
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
  color: #555;
  display: block;
  margin-bottom: 6px;
  @media screen and (max-width: 767px) {
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
`;




const Input = styled.input`
  width: 100%;
  height: 38px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 1.3rem;
  font-family: F_MEDIUM;
  color: #000;
  background: #fff;
  outline: none;
  transition: 0.2s;
  &:focus {
    border-color: #c8e64a;
  }
  @media screen and (max-width: 767px) {
    height: 34px;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;
const PayMethodBtn = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid ${(p) => (p.$active ? "#000" : "#e0e0e0")};
  background: ${(p) => (p.$active ? "#000" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  text-align: center;
  cursor: pointer;
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
  transition: 0.2s;
  position: relative;
  @media screen and (max-width: 767px) {
    font-size: 1.25rem;
    padding: 8px;
  }
`;
const DiscountTag = styled.div`
  position: absolute;
  top: -8px;
  right: -4px;
  background: #e53935;
  color: #fff;
  font-size: 1rem;
  font-family: F_BOLD;
  padding: 2px 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  @media screen and (max-width: 767px) {
    font-size: 0.8rem;
    padding: 1px 4px;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 14px;
  background: #c8e64a;
  color: #000;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #b8d63a;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media screen and (max-width: 767px) {
    height: 42px;
    font-size: 1.4rem;
    border-radius: 12px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  @media screen and (min-width: 768px) {
    align-items: center;
  }
`;

const ModalContent = styled.div`
  background: #fff;
  width: 100%;
  max-width: 500px;
  max-height: 90dvh;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  @media screen and (min-width: 768px) {
    border-radius: 20px;
    max-height: 80vh;
  }
`;

const ModalTitle = styled.div`
  font-family: F_BOLD;
  font-size: 1.6rem;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseBtn = styled.button`
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 32px; height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  color: #555;
  &:hover { background: #e0e0e0; }
  @media screen and (max-width: 767px) {
    color: #555 !important;
  }
`;

const IconBtn = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  color: inherit;
`;

const ClickableDiv = styled.div`
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
  &:hover { border-color: #c8e64a; }
`;

const spinnerSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const Spinner = styled(Loader2)`
  animation: ${spinnerSpin} 1s linear infinite;
`;

const UploadZone = styled.div`
  border: 1.5px dashed #ccc;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  background: #fafafa;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  &:hover {
    border-color: #c8e64a;
    background: #f0fbcc;
  }
`;

const UploadImgPreview = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  background: #fdfdfd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  img {
    max-width: 100%; 
    max-height: 100%; 
    object-fit: contain;
    border-radius: 8px;
  }
`;

const EditImgBtn = styled.button`
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(0,0,0,0.8);
  }
`;


const ErrorMsg = styled.div`
  background: rgba(229, 57, 53, 0.08);
  color: #e53935;
  border: 1px solid rgba(229, 57, 53, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1.3rem;
  font-family: F_MEDIUM;
  margin-bottom: 12px;
`;

const QRBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 8px;
  @media screen and (max-width: 767px) {
    gap: 16px;
    padding: 8px;
    margin-bottom: 4px;
  }
`;
const QRWrap = styled.div`
  background: #fcfcfc;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @media screen and (max-width: 767px) {
    padding: 6px;
  }
`;
const QRInfoWrap = styled.div`
  flex: 1;
  text-align: left;
`;
const QRImg = styled.img`
  width: 154px;
  height: 154px;
  object-fit: contain;
  @media screen and (max-width: 767px) {
    width: 132px;
    height: 132px;
  }
`;
const BankInfo = styled.div`
  font-family: F_BOLD;
  font-size: 1.8rem;
  margin: 0 0 4px;
  @media screen and (max-width: 767px) {
    font-size: 1.5rem;
    margin: 4px 0 6px;
  }
`;
const BankName = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.25rem;
  color: #777;
  margin-bottom: 2px;
  &.bank-title {
    color: #000;
    font-family: F_BOLD;
    font-size: 1.3rem;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    img {
      height: 14px;
      object-fit: contain;
    }
    @media screen and (max-width: 767px) {
      font-size: 1.2rem;
      margin-bottom: 4px;
      gap: 6px;
      img {
        height: 12px;
      }
    }
  }
`;
const CopyBtn = styled.button<{ $success?: boolean }>`
  background: ${(p) => (p.$success ? "#22c55e" : "#000")};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: F_BOLD;
  font-size: 1.2rem;
  cursor: pointer;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: 0.2s;
  &:hover {
    background: ${(p) => (p.$success ? "#1eb452" : "#333")};
  }
`;
const SuccessWrap = styled.div`
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  padding: 20px 0;
  @media screen and (max-width: 767px) {
    padding: 20px 16px;
  }
`;
const scaleUp = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const confettiFade = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
`;

const SuccessIcon = styled.div`
  color: #22c55e;
  margin-bottom: 12px;
  position: relative;
  display: inline-flex;
  
  svg {
    width: 64px;
    height: 64px;
    position: relative;
    z-index: 2;
    animation: ${scaleUp} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  @media screen and (max-width: 767px) {
    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const ConfettiPiece = styled.div<{ $color: string; $rot: number; $tx: number; $ty: number; $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 12px;
  background: ${p => p.$color};
  border-radius: 2px;
  z-index: 1;
  --rot: ${p => p.$rot}deg;
  --tx: ${p => p.$tx}px;
  --ty: ${p => p.$ty}px;
  animation: ${confettiFade} 0.8s ease-out both;
  animation-delay: ${p => p.$delay}s;
`;




const SuccessTitle = styled.div`
  font-family: F_BOLD;
  font-size: 2.4rem;
  margin-bottom: 24px;
  color: #22c55e;
  @media screen and (max-width: 767px) {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
`;
const SuccessCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  text-align: left;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;
const SuccessBtn = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #000;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 16px;
  transition: 0.2s;
  &:hover {
    background: #333;
  }
  @media screen and (max-width: 767px) {
    height: 42px;
    font-size: 1.3rem;
  }
`;
const ContactBtn = styled.a`
  display: flex;
  width: 100%;
  height: 48px;
  border: 1.5px solid #000;
  border-radius: 12px;
  background: #fff;
  color: #000;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 12px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  &:hover {
    background: #f5f5f5;
    color: #000;
  }
  @media screen and (max-width: 767px) {
    height: 42px;
    font-size: 1.3rem;
    margin-top: 10px;
  }
`;

const ProgressOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;

const ProgressContainer = styled.div`
  width: 90%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Step = "form" | "payment" | "success";

export default function CheckoutView() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [step, setStep] = useState<Step>("form");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [method, setMethod] = useState(0); // 0 = COD, 1 = CK
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(2);

  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [requireBill] = useState(true);
  const [billImage, setBillImage] = useState<string | null>(null);
  const [billFileName, setBillFileName] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isHeicPreviewFailed, setIsHeicPreviewFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [addressStep, setAddressStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "Đang kiểm tra danh sách sản phẩm ...",
    "Đơn hàng đang được gửi đến TVGEAR ...",
    "Đơn hàng đã được TVGEAR tiếp nhận ..."
  ];

  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    
    if (submitting) {
      const startTime = Date.now();
      const duration = 6000;
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        
        // Slow -> Fast -> Slow easing
        // t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
        let easedP;
        if (p < 0.5) {
          easedP = 4 * p * p * p;
        } else {
          easedP = 1 - Math.pow(-2 * p + 2, 3) / 2;
        }
        
        setProgress(Math.round(easedP * 100));
        
        if (p < 1) {
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);

      textInterval = setInterval(() => {
        setLoadingTextIndex(prev => (prev < 2 ? prev + 1 : prev));
      }, 2000);
    } else {
      setProgress(0);
      setLoadingTextIndex(0);
    }
    
    return () => {
      clearInterval(textInterval);
    };
  }, [submitting]);

  useEffect(() => {
    if (step === "success") {
      const scrollTarget = document.getElementById('main-content') || window;
      setTimeout(() => {
        scrollTarget.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
    if (cartItems !== null && cartItems.length === 0 && step === "form") {
      router.push("/");
    }
  }, [cartItems, step, router]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [addressStep]);

  const formatCityName = (n: string) => n.replace(/^Thành phố\s+/i, "").replace(/^Tỉnh\s+/i, "").trim();

  const [tempCity, setTempCity] = useState("");
  const [tempDistrict, setTempDistrict] = useState("");
  const [tempWard, setTempWard] = useState("");
  const [tempStreet, setTempStreet] = useState("");

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartItems(getCart());
    if (typeof window !== 'undefined' && window.innerWidth > 767) {
      setLimit(4);
    }
  }, []);

  const totalPrice = getCartTotal(cartItems || []);
  const shipFee = 40;
  const deposit = 50;
  const shipDiscount = 10;

  const availableWards = React.useMemo(() => {
    if (!city || !district) return [];
    return VIETNAM_DATA.find(p => p.n === city)?.d.find(d => d.n === district)?.w || [];
  }, [city, district]);

  const currentAvailableWards = React.useMemo(() => {
    if (!tempCity || !tempDistrict) return [];
    return VIETNAM_DATA.find(p => p.n === tempCity)?.d.find(d => d.n === tempDistrict)?.w || [];
  }, [tempCity, tempDistrict]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Kích thước ảnh quá lớn, vui lòng chọn ảnh < 10MB");
        return;
      }
      setBillFileName(file.name);
      setIsHeicPreviewFailed(false);
      setIsConverting(true);
      setError(null);
      setBillImage(null); // Clear previous to show loading state
      setIsHeicPreviewFailed(false);
      
      try {
        const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        let fileToProcess: File | Blob = file;

        if (isHeic) {
          try {
            console.log("Starting HEIC conversion for:", file.name);
            const heicModule = await import("heic2any");
            const heic2any = heicModule.default || heicModule;
            
            // Try converting to jpeg first
            let conversionResult;
            try {
              conversionResult = await (heic2any as any)({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8
              });
            } catch (err) {
              console.warn("HEIC to JPEG failed, trying PNG...", err);
              conversionResult = await (heic2any as any)({
                blob: file,
                toType: "image/png"
              });
            }
            
            const blobResult = (Array.isArray(conversionResult) ? conversionResult[0] : conversionResult) as Blob;
            if (blobResult && (blobResult.type === "image/jpeg" || blobResult.type === "image/png")) {
              console.log("HEIC conversion successful, type:", blobResult.type);
              fileToProcess = new File([blobResult], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: blobResult.type });
            } else {
              console.error("HEIC conversion returned invalid blob type:", blobResult?.type);
            }
          } catch (e) {
            console.error("HEIC conversion fatal error:", e);
          }
        }

        try {
          const imageCompressionModule = await import("browser-image-compression");
          const imageCompression = imageCompressionModule.default || imageCompressionModule;
          
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: "image/jpeg"
          };
          
          fileToProcess = await (imageCompression as any)(fileToProcess as File, options);
          console.log("Compression successful");
        } catch (e) {
          console.error("Compression failed, using uncompressed:", e);
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setBillImage(result);
          setIsConverting(false);
          
          // CRITICAL: Check if the resulting data URL is actually displayable if it was HEIC
          if (isHeic) {
             const isSuccess = result.startsWith('data:image/jpeg') || result.startsWith('data:image/png');
             if (!isSuccess) setIsHeicPreviewFailed(true);
          }
        };
        reader.readAsDataURL(fileToProcess as File);
      } catch (error) {
        console.error("Fatal image processing error:", error);
        // Last resort fallback
        const reader = new FileReader();
        reader.onloadend = () => {
          setBillImage(reader.result as string);
          setIsConverting(false);
          // If we reached here with HEIC and conversion failed, browser won't show it.
          const isStillHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
          if (isStillHeic) setIsHeicPreviewFailed(true);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (cartItems === null) return null;

  if (cartItems.length === 0 && step === "form") {
    return (
      <Page>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <MobileBackBtn onClick={() => router.push("/")}>
            <ArrowLeft size={20} />
          </MobileBackBtn>
        </div>
        <Card style={{ textAlign: "center", padding: "60px 20px", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: "1.6rem", color: "#999" }}>Giỏ hàng trống</div>
          <SubmitBtn style={{ marginTop: 20, maxWidth: 240, margin: "20px auto 0" }} onClick={() => router.push("/")}>
            Tiếp tục mua hàng
          </SubmitBtn>
        </Card>
      </Page>
    );
  }

  const handleSubmitOrder = async () => {
    const isWardRequired = availableWards.length > 0;
    if (!name.trim() || !phone.trim() || !city || !district || (isWardRequired && !ward) || !street.trim()) {
      setError("Vui lòng nhập đầy đủ Tên, SĐT và Địa chỉ.");
      return;
    }
    if (requireBill && !billImage) {
      setError("Vui lòng tải lên Ảnh Chụp Màn Hình Chuyển Khoản để hoàn tất.");
      return;
    }
    setError(null);
    
    // Combine address parts
    const addressParts = [street.trim(), ward, district, city].filter(Boolean);
    const fullAddress = addressParts.join(", ");
    
    try {
      setSubmitting(true);
      document.getElementById('main-content')?.scrollTo(0, 0);
      window.scrollTo(0, 0);
      
      const items = (cartItems || []).map(item => {
        const unitPrice = item.option.price;
        return {
          productName: item.productName,
          productColor: findColorDef(item.color.color)?.label ?? item.color.color ?? "",
          productOption: item.option.name,
          productPriceOption: unitPrice * 1000,
          productQuantity: item.quantity,
        };
      });

      const payload = {
        items,
        customerName: name,
        customerPhone: phone,
        customerAddress: fullAddress,
        customerPayment: method === 0 ? "COD - Tiền Mặt" : "Chuyển Khoản",
        billImage: requireBill ? billImage : null,
      };

      const apiCall = fetch(SHEET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const animationTimer = new Promise(resolve => setTimeout(resolve, 6000));

      await Promise.all([apiCall, animationTimer]);
      
      clearCart();
      window.dispatchEvent(new Event("cart-updated"));
      setStep("success");
      setSubmitting(false);
      setTimeout(() => {
        document.getElementById('main-content')?.scrollTo(0, 0);
        window.scrollTo(0, 0);
      }, 0);
    } catch {
      setError("Gửi đơn hàng thất bại. Vui lòng thử lại.");
      setSubmitting(false);
    }
  };



  if (step === "success") {
    return (
      <Page ref={pageRef} $success>
        <SuccessBackgroundStyle />
        <SuccessWrap>
          <SuccessIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
            </svg>
            {[...Array(12)].map((_, i) => {
              const colors = ['#FFD700', '#FF3B30', '#22C55E', '#007AFF', '#FF9500', '#AF52DE'];
              const angle = (i * 30) * (Math.PI / 180);
              const dist = 60 + Math.random() * 40;
              return (
                <ConfettiPiece 
                  key={i}
                  $color={colors[i % colors.length]!}
                  $rot={i * 30}
                  $tx={Math.cos(angle) * dist}
                  $ty={Math.sin(angle) * dist}
                  $delay={0.2 + (Math.random() * 0.2)}
                />
              );
            })}
          </SuccessIcon>
          <SuccessTitle>Đặt Hàng Thành Công</SuccessTitle>

          <SuccessCard>
            <SectionTitle>Sản Phẩm</SectionTitle>
            <div style={{ background: '#fcfcfc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              {cartItems.map((item, idx) => {
                const up = item.option.price;
                return (
                  <CheckoutItem key={idx}>
                    <CIImg src={item.image} />
                    <CIInfo>
                      <CIName>{item.productName}</CIName>
                      <CIMeta>
                        {findColorDef(item.color.color)?.label || item.color.color} <span style={{fontSize: '0.6em', opacity: 0.6, position: 'relative', top: '-1.5px', margin: '0 4px'}}>&#8226;</span> {item.option.name}
                      </CIMeta>
                      <CIPriceWrap>
                        <CIPrice>{(up * item.quantity).toLocaleString("vi-VN")}.000 đ</CIPrice>
                        <CIQty>x{item.quantity}</CIQty>
                      </CIPriceWrap>
                    </CIInfo>
                  </CheckoutItem>
                );
              })}
            </div>
            <SummaryRow><span>Tổng Đơn Hàng</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            <SummaryRow><span>Phí Ship</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            {method === 1 && (
              <SummaryRow><span>Hỗ Trợ Ship</span><span style={{ color: '#22c55e' }}>-{shipDiscount.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            )}
            <Divider />
            <SummaryRow $bold>
              <span>Tổng Cộng</span>
              <span>
                {method === 0
                  ? `${(totalPrice + shipFee).toLocaleString("vi-VN")}.000 đ`
                  : `${(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ`}
              </span>
            </SummaryRow>
          </SuccessCard>

          <SuccessCard>
            <SectionTitle>Thông Tin Nhận Hàng</SectionTitle>
            <SummaryRow><span>Tên</span><span>{name}</span></SummaryRow>
            <SummaryRow><span>SĐT</span><span>{phone}</span></SummaryRow>
            <SummaryRow><span>Địa Chỉ</span><span>{[street, ward, district, city].filter(Boolean).join(", ")}</span></SummaryRow>
            <SummaryRow><span>Thanh Toán</span><span>{method === 0 ? "COD - Tiền Mặt" : "Chuyển Khoản"}</span></SummaryRow>
            <SummaryRow>
              <span>Tổng Tiền</span>
              <span>
                {method === 0 
                  ? `${(totalPrice + shipFee).toLocaleString("vi-VN")}.000 đ`
                  : `${(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ`}
              </span>
            </SummaryRow>
            {method === 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #ddd' }}>
                 <SummaryRow>
                  <span>Tiền Cọc Ship</span>
                  <span>{deposit.toLocaleString("vi-VN")}.000 đ</span>
                </SummaryRow>
                <SummaryRow $bold>
                  <span style={{ color: '#ff3b30' }}>Thanh Toán Khi Nhận</span>
                  <span style={{ color: '#ff3b30' }}>{(totalPrice + shipFee - deposit).toLocaleString("vi-VN")}.000 đ</span>
                </SummaryRow>
              </div>
            )}
          </SuccessCard>

          <SuccessBtn onClick={() => router.push("/")}>
            Trở Lại Shop
          </SuccessBtn>
          <ContactBtn href="https://facebook.com/tvgear" target="_blank" rel="noopener">
            Liên Hệ Shop
          </ContactBtn>
        </SuccessWrap>
      </Page>
    );
  }





  const PaymentMethodSummary = () => (
    <MethodSummaryWrap>
      {method === 0 ? (
        <>
          <SummaryRow $bold $color="#ff3b30">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Tiền Cọc Đơn Hàng
            <IconBtn onClick={() => setDepositModalOpen(true)}>
              <HelpCircle size={16} />
            </IconBtn>
            </span>
            <span>{deposit.toLocaleString("vi-VN")}.000 đ</span>
          </SummaryRow>
          <SummaryRow $bold>
            <span>Thanh Toán Khi Nhận</span>
            <span>{(totalPrice + shipFee - deposit).toLocaleString("vi-VN")}.000 đ</span>
          </SummaryRow>
        </>
      ) : (
        <>
          <SummaryRow $bold $color="#22c55e"><span>Hỗ Trợ Phí Ship</span><span>-{shipDiscount.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          <SummaryRow $bold>
            <span>Tổng Chuyển Khoản</span>
            <span>{(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ</span>
          </SummaryRow>
        </>
      )}
    </MethodSummaryWrap>
  );

  return (
    <Page ref={pageRef}>
      <TwoCol>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <MobileBackBtn onClick={() => router.push("/")}>
              <ArrowLeft size={18} />
            </MobileBackBtn>
            <SectionTitle className="mobile-no-mt" style={{ marginTop: 0, marginBottom: 0, gap: '12px' }}>Đơn Hàng <Badge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} Sản Phẩm</Badge></SectionTitle>
          </div>
          <ProductListWrap>
            {(showAll ? cartItems : cartItems.slice(0, limit)).map((item, idx) => {
              const up = item.option.price;
              return (
                <CheckoutItem key={idx}>
                  <CIImg src={item.image} />
                  <CIInfo>
                    <CIName>{item.productName}</CIName>
                    <CIMeta>
                      {findColorDef(item.color.color)?.label || item.color.color} <span style={{fontSize: '0.6em', opacity: 0.6, position: 'relative', top: '-1.5px', margin: '0 4px'}}>&#8226;</span> {item.option.name}
                    </CIMeta>
                    <CIPriceWrap>
                      <CIPrice>{(up * item.quantity).toLocaleString("vi-VN")}.000 đ</CIPrice>
                      <CIQty>x{item.quantity}</CIQty>
                    </CIPriceWrap>
                  </CIInfo>
                </CheckoutItem>
              );
            })}
          </ProductListWrap>
          {cartItems.length > limit && (
            <ShowMoreBtn onClick={() => setShowAll(!showAll)}>
              {showAll ? (
                <>Thu Gọn <ChevronUp size={16} /></>
              ) : (
                <>Xem Thêm {cartItems.length - limit} Sản Phẩm <ChevronDown size={16} /></>
              )}
            </ShowMoreBtn>
          )}
          <SummaryContainer>
            <SummaryRow><span>Tổng Đơn Hàng</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            <SummaryRow><span>Phí Ship</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            <Divider style={{ margin: '8px 0' }} />
            <SummaryRow $large>
              <span>Tạm Tính</span>
              <span>{(totalPrice + shipFee).toLocaleString("vi-VN")}.000 đ</span>
            </SummaryRow>
          </SummaryContainer>
        </Card>

        <Card>
          <SectionTitle className="mobile-no-mt">Thông Tin Nhận Hàng</SectionTitle>

          <InputRow>
            <FormGroup>
              <Label>Tên *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập Tên" />
            </FormGroup>
            <FormGroup>
              <Label>Số Điện Thoại *</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập SĐT" type="tel" inputMode="numeric" />
            </FormGroup>
          </InputRow>
          <FormGroup>
            <Label>Địa Chỉ *</Label>
            <ClickableDiv onClick={() => {
              setTempCity(city);
              setTempDistrict(district);
              setTempWard(ward);
              setTempStreet(street);
              setAddressStep(1);
              setAddressModalOpen(true);
            }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                {!city ? (
                  <span style={{ color: '#777', fontFamily: 'F_MEDIUM', fontSize: '1.3rem' }}>Chọn Địa Chỉ</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'F_SEMIBOLD', fontSize: '1.3rem', color: '#000' }}>{street || "---"}</span>
                    <span style={{ color: '#555', fontSize: '1.15rem' }}>{[ward, district, city].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
              <ChevronRight size={20} color="#777" />
            </ClickableDiv>
          </FormGroup>


          <SectionTitle>Phương Thức Thanh Toán</SectionTitle>
          <PaymentMethods>
            <PayMethodBtn $active={method === 0} onClick={() => setMethod(0)}>
              COD - Tiền Mặt
            </PayMethodBtn>
            <PayMethodBtn $active={method === 1} onClick={() => setMethod(1)}>
              Chuyển Khoản
              <DiscountTag>-10K</DiscountTag>
            </PayMethodBtn>
          </PaymentMethods>

          <QRBlock>
            <QRWrap>
              <QRImg src="/assets/images/qr/qr-banking.jpg" />
            </QRWrap>
            <QRInfoWrap>
              <BankName className="bank-title">
                <img src="/assets/images/bank/vietcombank-logo.png" alt="VCB" />
                VIETCOMBANK
              </BankName>
              <div style={{ fontSize: '1rem', color: '#777', fontFamily: 'F_REGULAR', marginTop: '-4px', marginBottom: '4px' }}>Ngân Hàng TMCP Ngoại Thương VN</div>
              <BankInfo>0461000636243</BankInfo>
              <BankName style={{ marginBottom: '2px' }}>VO TIEN THUAN</BankName>
              <CopyBtn
                $success={copied}
                onClick={() => {
                  copyToClipboard("0461000636243");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ marginTop: '4px', marginBottom: 0 }}
              >
                {copied ? (
                  <>
                    <Check size={14} /> <span>Đã Sao Chép</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} /> <span>Sao Chép</span>
                  </>
                )}
              </CopyBtn>
            </QRInfoWrap>
          </QRBlock>

          <PaymentMethodSummary />

          <div style={{ marginBottom: '16px', marginTop: '20px' }}>
            <SectionTitle style={{ marginBottom: '8px' }}>Hình Ảnh Chuyển Khoản</SectionTitle>
            
            {isConverting ? (
              <UploadZone>
                <Spinner size={28} color="#22c55e" />
                <span style={{ fontSize: '1rem', color: '#555', marginTop: '8px' }}>
                  Đang xử lý ảnh...
                </span>
              </UploadZone>
            ) : !billImage ? (
              <UploadZone onClick={() => {
                fileInputRef.current?.click();
              }}>
                <ImageUp size={28} color="#777" />
              </UploadZone>
            ) : (
              <UploadImgPreview>
                {isHeicPreviewFailed ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px' }}>
                    <ImageIcon size={32} color="#777" />
                    <span style={{ fontSize: '1.2rem', color: '#555', fontFamily: 'F_MEDIUM', textAlign: 'center', wordBreak: 'break-all' }}>
                      {billFileName}
                    </span>
                  </div>
                ) : (
                  <img src={billImage} alt="Bill Transfer" />
                )}
                <EditImgBtn onClick={() => fileInputRef.current?.click()}>
                  <Edit2 size={16} />
                </EditImgBtn>
              </UploadImgPreview>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
          </div>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn onClick={handleSubmitOrder} disabled={submitting}>
            Xác Nhận Đặt Hàng
          </SubmitBtn>
        </Card>
      </TwoCol>

      {submitting && (
        <ProgressOverlay>
          <ProgressContainer>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#c8e64a', transition: 'width 0.1s linear' }} />
              </div>
              <span style={{ width: '40px', textAlign: 'right', fontFamily: 'F_BOLD', fontSize: '1.3rem', color: '#000' }}>{progress}%</span>
            </div>
            <div style={{ marginTop: '16px', fontSize: '1.25rem', fontFamily: 'F_MEDIUM', color: '#555', textAlign: 'center' }}>
              {loadingTexts[loadingTextIndex]}
            </div>
          </ProgressContainer>
        </ProgressOverlay>
      )}

      {/* MODALS */}
      {isDepositModalOpen && (
        <ModalOverlay onClick={() => setDepositModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ height: 'auto', maxHeight: '90vh' }}>
            <ModalTitle>
              Tiền Cọc Đơn Hàng
              <CloseBtn onClick={() => setDepositModalOpen(false)}><X size={18} /></CloseBtn>
            </ModalTitle>
            <div style={{ fontSize: '1.3rem', lineHeight: 1.6, color: '#333' }}>
              <p style={{ marginBottom: '12px' }}>
                Tiền Cọc Đơn Hàng là phần tiền để shop dùng trả phí ship của đơn hàng (~40K) + tiền hoàn (10K) nếu đơn hàng không giao thành công.
              </p>
              <p style={{ marginBottom: '12px' }}>
                Tiền Cọc Đơn Hàng là bắt buộc đối với mọi đơn COD (Cash On Delivery - Thanh Toán Khi Nhận Hàng) bán ra tại shop, đối với mọi khách hàng.
              </p>
              <p>
                Phần tiền dư sau khi trừ Phí Ship sẽ được shop trừ thẳng vào giá sản phẩm để thanh toán khi nhận.
              </p>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}



      {isAddressModalOpen && (
        <ModalOverlay onClick={() => setAddressModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>
              <span>Chọn Địa Chỉ</span>
              <CloseBtn onClick={() => setAddressModalOpen(false)}><X size={18} /></CloseBtn>
            </ModalTitle>

            {/* Address Progress Bar */}
            {(() => {
              const getDotStyle = (stepNum: number, tempVal: string) => {
                if (stepNum === 3 && tempDistrict && currentAvailableWards.length === 0) {
                  return { width: '6px', height: '6px', background: '#ccc', border: 'none' };
                }
                const isCurrent = addressStep === stepNum;
                const isPassed = !!tempVal && addressStep !== stepNum;
                
                if (isCurrent) {
                  return { width: '16px', height: '16px', background: '#c8e64a', border: '5px solid #000' };
                }
                if (isPassed) {
                  return { width: '8px', height: '8px', background: '#000', border: 'none' };
                }
                return { width: '6px', height: '6px', background: '#ccc', border: 'none' };
              };

              const getTextStyle = (stepNum: number, tempVal: string) => {
                const isCurrent = addressStep === stepNum;
                const isPassed = !!tempVal && addressStep !== stepNum;
                if (isPassed) return 'F_SEMIBOLD';
                if (isCurrent) return 'F_MEDIUM';
                return 'F_REGULAR';
              };

              return (
                <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Step 1: City */}
                    <div style={{ display: 'flex', position: 'relative', cursor: 'pointer', height: '36px', alignItems: 'center' }} onClick={() => setAddressStep(1)}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', height: '100%' }}>
                        <div style={{ flex: 1 }} />
                        <div style={{ ...getDotStyle(1, tempCity), borderRadius: '50%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>

                        </div>
                        <div style={{ width: '1px', background: '#eee', flex: 1 }} />
                      </div>
                      <div style={{ flex: 1, paddingLeft: '8px', color: (addressStep === 1 || tempCity) ? '#000' : '#ccc', fontFamily: getTextStyle(1, tempCity), fontSize: '1.25rem' }}>
                        {tempCity ? formatCityName(tempCity) : "Tỉnh/Thành Phố"}
                      </div>
                    </div>

                    {/* Step 2: District */}
                    <div style={{ display: 'flex', position: 'relative', cursor: tempCity ? 'pointer' : 'default', height: '36px', alignItems: 'center' }} onClick={() => tempCity && setAddressStep(2)}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', height: '100%' }}>
                        <div style={{ width: '1px', background: '#eee', flex: 1 }} />
                        <div style={{ ...getDotStyle(2, tempDistrict), borderRadius: '50%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        </div>
                        <div style={{ width: '1px', background: '#eee', flex: 1 }} />
                      </div>
                      <div style={{ flex: 1, paddingLeft: '8px', color: (addressStep === 2 || tempDistrict) ? '#000' : '#ccc', fontFamily: getTextStyle(2, tempDistrict), fontSize: '1.25rem' }}>
                        {tempDistrict || "Quận/Huyện"}
                      </div>
                    </div>

                    {/* Step 3: Ward */}
                    <div style={{ display: 'flex', position: 'relative', cursor: (currentAvailableWards.length > 0 && tempDistrict) ? 'pointer' : (tempDistrict ? 'not-allowed' : 'default'), height: '36px', alignItems: 'center' }} onClick={() => tempDistrict && currentAvailableWards.length > 0 && setAddressStep(3)}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', height: '100%' }}>
                        <div style={{ width: '1px', background: '#eee', flex: 1 }} />
                        <div style={{ ...getDotStyle(3, tempWard), borderRadius: '50%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        </div>
                        <div style={{ flex: 1 }} />
                      </div>
                      <div style={{ flex: 1, paddingLeft: '8px', color: tempDistrict && currentAvailableWards.length === 0 ? '#ccc' : ((addressStep === 3 || tempWard) ? '#000' : '#ccc'), fontFamily: tempDistrict && currentAvailableWards.length === 0 ? 'F_REGULAR' : getTextStyle(3, tempWard), fontSize: '1.25rem' }}>
                        {tempDistrict && currentAvailableWards.length === 0 ? "--" : (tempWard || "Phường/Xã")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Address Step Content */}
            <div style={{ paddingBottom: '8px', fontSize: '1.1rem', color: '#777', fontFamily: 'F_MEDIUM' }}>
              {addressStep === 1 && "Chọn Tỉnh/Thành Phố"}
              {addressStep === 2 && "Chọn Quận/Huyện"}
              {addressStep === 3 && "Chọn Phường/Xã"}
              {addressStep === 4 && "Nhập Số Nhà, Tên Đường *"}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }} ref={scrollRef}>
              {addressStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '1.3rem' }}>
                  {[...VIETNAM_DATA]
                    .sort((a,b) => {
                      const nameA = formatCityName(a.n);
                      const nameB = formatCityName(b.n);
                      
                      const isA_HCM = nameA === "Hồ Chí Minh";
                      const isA_HN = nameA === "Hà Nội";
                      const isB_HCM = nameB === "Hồ Chí Minh";
                      const isB_HN = nameB === "Hà Nội";

                      if (isA_HCM) return -1;
                      if (isB_HCM) return 1;
                      if (isA_HN) return -1;
                      if (isB_HN) return 1;

                      return nameA.localeCompare(nameB, 'vi');
                    })
                    .map((p, index, array) => (
                    <div 
                      key={p.n} 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: index === array.length - 1 ? 'none' : '1px solid #f5f5f5', cursor: 'pointer', fontFamily: tempCity === p.n ? 'F_BOLD' : 'F_REGULAR', color: '#000' }}
                      onClick={() => {
                        setTempCity(p.n);
                        setTempDistrict("");
                        setTempWard("");
                        setAddressStep(2);
                      }}
                    >
                      {formatCityName(p.n)}
                      {tempCity === p.n && <Check size={16} color="#000" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
              )}
              {addressStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '1.3rem' }}>
                   {VIETNAM_DATA.find(p => p.n === tempCity)?.d
                    .map((d, index, array) => (
                    <div 
                      key={d.n} 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: index === array.length - 1 ? 'none' : '1px solid #f5f5f5', cursor: 'pointer', fontFamily: tempDistrict === d.n ? 'F_BOLD' : 'F_REGULAR', color: '#000' }}
                      onClick={() => {
                        setTempDistrict(d.n);
                        setTempWard("");
                        const dWards = VIETNAM_DATA.find(p => p.n === tempCity)?.d.find(dx => dx.n === d.n)?.w || [];
                        if (dWards.length === 0) setAddressStep(4);
                        else setAddressStep(3);
                      }}
                    >
                      {d.n}
                      {tempDistrict === d.n && <Check size={16} color="#000" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
              )}
              {addressStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '1.3rem' }}>
                  {currentAvailableWards
                    .map((w, index, array) => (
                    <div 
                      key={w} 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: index === array.length - 1 ? 'none' : '1px solid #f5f5f5', cursor: 'pointer', fontFamily: tempWard === w ? 'F_BOLD' : 'F_REGULAR', color: '#000' }}
                      onClick={() => {
                        setTempWard(w);
                        setAddressStep(4);
                      }}
                    >
                      {w}
                      {tempWard === w && <Check size={16} color="#000" strokeWidth={3} />}
                    </div>
                  ))}
                </div>
              )}
              {addressStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                  <Input 
                    value={tempStreet}
                    onChange={e => setTempStreet(e.target.value)}
                    placeholder="Nhập địa chỉ cụ thể"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {addressStep === 4 && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <SubmitBtn 
                  style={{ flex: 2 }} 
                  disabled={!tempStreet.trim()}
                  onClick={() => {
                    setCity(tempCity);
                    setDistrict(tempDistrict);
                    setWard(tempWard);
                    setStreet(tempStreet);
                    setAddressModalOpen(false);
                  }}
                >
                  Thiết Lập Địa Chỉ
                </SubmitBtn>
              </div>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

    </Page>
  );
}
