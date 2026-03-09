import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ArrowLeft, Check, CheckCircle, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { CartItem } from "@/types/product";
import { getCart, getCartTotal, clearCart } from "@/utils/carts";
import { findColorDef } from "@/utils/colors";
import { copyToClipboard } from "@/utils";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwCEQg77LAHejCaX4ZaDJYU9-V896QwwYu6gpLU65rVwbFmlplYwaT0bkP1cbe9dtzt/exec";

/* ─── styled ─── */
const Page = styled.div<{ $success?: boolean }>`
  min-height: 100%;
  padding: 24px 40px;
  background: ${(p) => (p.$success ? "#f8f8f8" : "transparent")};
  @media screen and (max-width: 767px) {
    padding: 0;
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
  padding: 6px;
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
  font-family: ${(p) => (p.$bold || p.$large ? "F_BOLD" : "F_REGULAR")};
  font-size: ${(p) => (p.$large ? "1.5rem" : "1.4rem")};
  padding: 3px 0;
  color: ${(p) => p.$color || (p.$bold || p.$large ? "#000" : "#555")};
  @media screen and (max-width: 767px) {
    font-size: ${(p) => (p.$large ? "1.3rem" : "1.2rem")};
    padding: 2px 0;
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
const Input = styled.input`
  width: 100%;
  height: 40px;
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
    height: 36px;
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
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  padding: 20px 0;
`;
const SuccessIcon = styled.div`
  color: #22c55e;
  margin-bottom: 12px;
`;
const SuccessTitle = styled.div`
  font-family: F_BOLD;
  font-size: 2.4rem;
  margin-bottom: 24px;
  color: #22c55e;
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
  margin-top: 8px;
  transition: 0.2s;
  &:hover {
    background: #333;
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
  margin-top: 8px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  &:hover {
    background: #f5f5f5;
    color: #000;
  }
`;

type Step = "form" | "payment" | "success";

export default function CheckoutView() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<Step>("form");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Vui lòng nhập đầy đủ Tên, SĐT và Địa chỉ.");
      return;
    }
    setError(null);
    
    try {
      setSubmitting(true);
      for (const item of cartItems) {
        const unitPrice = item.option.price + (item.color.priceAdd || 0);
        const payload = {
          productName: item.productName,
          productColor: findColorDef(item.color.color)?.label ?? item.color.color ?? "",
          productOption: item.option.name,
          productPriceOption: unitPrice * 1000,
          productQuantity: item.quantity,
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          customerNote: "",
          customerPayment: method === 0 ? "COD - Tiền Mặt" : "Chuyển Khoản",
        };
        await fetch(SHEET_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      clearCart();
      window.dispatchEvent(new Event("cart-updated"));
      setStep("success");
      pageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Gửi đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };



  if (step === "success") {
    return (
      <Page ref={pageRef} $success>
        <SuccessWrap>
          <SuccessIcon>
            <CheckCircle size={64} />
          </SuccessIcon>
          <SuccessTitle>Đặt Hàng Thành Công</SuccessTitle>

          <SuccessCard>
            <SectionTitle>Sản Phẩm</SectionTitle>
            <div style={{ background: '#fcfcfc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              {cartItems.map((item, idx) => {
                const up = item.option.price + (item.color.priceAdd || 0);
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
            <SummaryRow><span>Địa chỉ</span><span>{address}</span></SummaryRow>
            <SummaryRow><span>Thanh toán</span>
              <span>
                {method === 0 
                  ? "COD - Đã Cọc 40K Phí ship" 
                  : `Chuyển Khoản + ${(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ`}
              </span>
            </SummaryRow>
            {method === 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #ddd' }}>
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
              const up = item.option.price + (item.color.priceAdd || 0);
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
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập Địa Chỉ" />
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
            {submitting ? "Đang xử lý..." : method === 0 ? "Xác Nhận Đã Cọc" : "Xác Nhận Đã Chuyển Khoản"}
          </SubmitBtn>
        </Card>
      </TwoCol>
    </Page>
  );
}
