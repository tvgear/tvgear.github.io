import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useRouter } from "next/router";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Copy, Loader2 } from "lucide-react";
import { CartItem } from "@/types/product";
import { getCart, getCartTotal, clearCart } from "@/utils/carts";
import { findColorDef } from "@/utils/colors";
import { copyToClipboard } from "@/utils";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbweimQGN6gaZ6RqQgoYybF7tnU7OlVT6KU8_TfnButyiwAiZ6v-K5mV1KWKRf7TrJsZ/exec";

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
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 10px;
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

const SelectFlex = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  @media screen and (max-width : 767px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 38px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 32px 0 12px;
  font-size: 1.3rem;
  font-family: F_MEDIUM;
  color: #000;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23777' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
  &:focus {
    border-color: #c8e64a;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
  @media screen and (max-width: 767px) {
    height: 34px;
    font-size: 1.2rem;
    padding-right: 28px;
    background-position: right 10px center;
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
  margin-bottom: 20px;
  @media screen and (max-width: 767px) {
    gap: 16px;
    padding: 8px;
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
  width: 160px;
  height: 160px;
  object-fit: contain;
  @media screen and (max-width: 767px) {
    width: 144px;
    height: 144px;
  }
`;
const BankInfo = styled.div`
  font-family: F_BOLD;
  font-size: 1.8rem;
  margin: 6px 0 8px;
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
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingSpinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
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

type Step = "form" | "payment" | "success";

export default function CheckoutView() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartItems(getCart());
    if (typeof window !== 'undefined' && window.innerWidth > 767) {
      setLimit(4);
    }
  }, []);

  const totalPrice = getCartTotal(cartItems);
  const shipFee = 40;
  const deposit = 40;
  const shipDiscount = 10;

  const availableWards = React.useMemo(() => {
    if (!city || !district) return [];
    return VIETNAM_DATA.find(p => p.n === city)?.d.find(d => d.n === district)?.w || [];
  }, [city, district]);

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
    setError(null);
    
    // Combine address parts
    const addressParts = [street.trim(), ward, district, city].filter(Boolean);
    const fullAddress = addressParts.join(", ");
    
    try {
      setSubmitting(true);
      const items = cartItems.map(item => {
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
      };

      await fetch(SHEET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      clearCart();
      window.dispatchEvent(new Event("cart-updated"));
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Gửi đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
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
          <SummaryRow $bold $color="#ff3b30"><span>Tiền Cọc Phí Ship</span><span>{deposit.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          <SummaryRow $bold>
            <span>Thanh Toán Khi Nhận</span>
            <span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span>
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
            <div style={{ marginBottom: "12px" }}>
              <Select 
                value={city} 
                onChange={(e) => {
                  setCity(e.target.value);
                  setDistrict("");
                  setWard("");
                }}
              >
                <option value="">Chọn Tỉnh/Thành Phố</option>
                {VIETNAM_DATA.map(p => (
                  <option key={p.n} value={p.n}>{p.n}</option>
                ))}
              </Select>
            </div>

            <SelectFlex>
              <Select 
                value={district} 
                disabled={!city}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setWard("");
                }}
              >
                <option value="">Chọn Quận/Huyện</option>
                {city && VIETNAM_DATA.find(p => p.n === city)?.d.map(d => (
                  <option key={d.n} value={d.n}>{d.n}</option>
                ))}
              </Select>

              <Select 
                value={ward} 
                disabled={!district || availableWards.length === 0}
                onChange={(e) => setWard(e.target.value)}
              >
                <option value="">{district && availableWards.length === 0 ? "--" : "Chọn Phường/Xã"}</option>
                {availableWards.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </Select>
            </SelectFlex>
            <Input 
              value={street} 
              onChange={(e) => setStreet(e.target.value)} 
              placeholder="Số Nhà, Tên Đường ..." 
            />
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

          <PaymentMethodSummary />

          <QRBlock>
            <QRWrap>
              <QRImg src="/assets/images/qr/qr-banking.jpg" />
            </QRWrap>
            <QRInfoWrap>
              <BankName className="bank-title">
                <img src="/assets/images/bank/vietcombank-logo.png" alt="VCB" />
                VIETCOMBANK
              </BankName>
              <BankInfo>0461000636243</BankInfo>
              <BankName style={{ marginBottom: '12px' }}>VO TIEN THUAN</BankName>
              <CopyBtn
                $success={copied}
                onClick={() => {
                  copyToClipboard("0461000636243");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ marginTop: '10px', marginBottom: 0 }}
              >
                {copied ? (
                  <>
                    <Check size={14} /> <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} /> <span>Sao Chép STK</span>
                  </>
                )}
              </CopyBtn>
            </QRInfoWrap>
          </QRBlock>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn onClick={handleSubmitOrder} disabled={submitting}>
            {submitting ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LoadingSpinner size={20} />
                <span>Đang Đặt Hàng...</span>
              </div>
            ) : method === 0 ? "Xác Nhận Đã Cọc" : "Xác Nhận Đã Chuyển Khoản"}
          </SubmitBtn>
        </Card>
      </TwoCol>
    </Page>
  );
}
