import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ArrowLeft, Check, CheckCircle } from "lucide-react";
import { CartItem } from "@/types/product";
import { getCart, getCartTotal, clearCart } from "@/utils/carts";
import { findColorDef } from "@/utils/colors";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwCEQg77LAHejCaX4ZaDJYU9-V896QwwYu6gpLU65rVwbFmlplYwaT0bkP1cbe9dtzt/exec";

/* ─── styled ─── */
const Page = styled.div<{ $success?: boolean }>`
  min-height: 100%;
  padding: 24px 40px;
  background: ${(p) => (p.$success ? "#f8f8f8" : "transparent")};
  @media screen and (max-width: 767px) {
    padding: 16px;
  }
`;

const MobileBackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ebebeb;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 12px;
  transition: 0.2s;
  &:hover {
    background: #dddddd;
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
    gap: 32px;
  }
`;

const Card = styled.div`
  background: transparent;
  padding: 0;
  @media screen and (max-width: 767px) {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

const Badge = styled.div`
  background: #ff3b30;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1.2rem;
  padding: 0 8px;
  height: 20px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionTitle = styled.div`
  font-family: F_BOLD;
  font-size: 1.6rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
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
`;
const CIMeta = styled.div`
  font-size: 1.2rem;
  color: #777;
  margin: 2px 0;
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
`;
const CIQty = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.3rem;
  color: #555;
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-family: ${(p) => (p.$bold ? "F_BOLD" : "F_REGULAR")};
  font-size: ${(p) => (p.$bold ? "1.6rem" : "1.4rem")};
  padding: 6px 0;
  color: ${(p) => (p.$bold ? "#000" : "#555")};
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 8px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 14px;
`;
const Label = styled.label`
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
  color: #555;
  display: block;
  margin-bottom: 6px;
`;
const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 1.3rem;
  font-family: F_REGULAR;
  color: #000;
  background: #fff;
  outline: none;
  transition: 0.2s;
  &:focus {
    border-color: #c8e64a;
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 1.3rem;
  font-family: F_REGULAR;
  color: #000;
  background: #fff;
  outline: none;
  resize: none;
  transition: 0.2s;
  &:focus {
    border-color: #c8e64a;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;
const PayMethodBtn = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
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
`;
const DiscountTag = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  background: #e53935;
  color: #fff;
  font-size: 1rem;
  font-family: F_BOLD;
  padding: 2px 6px;
  border-radius: 0 10px 0 6px;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: #c8e64a;
  color: #000;
  font-family: F_BOLD;
  font-size: 1.6rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #b8d63a;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const QRImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin: 12px auto;
`;
const BankInfo = styled.div`
  font-family: F_BOLD;
  font-size: 1.8rem;
  margin: 4px 0;
`;
const BankName = styled.div`
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 8px;
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

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartItems(getCart());
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
        const unitPrice = item.option.price;
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



  return (
    <Page ref={pageRef}>
      <TwoCol>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <MobileBackBtn onClick={() => router.push("/")}>
              <ArrowLeft size={20} />
            </MobileBackBtn>
            <SectionTitle style={{ marginBottom: 0, gap: '12px' }}>Đơn Hàng <Badge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Badge></SectionTitle>
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '12px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
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
          <div style={{ marginTop: '24px' }}>
            <SummaryRow><span>Tạm Tính</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            <SummaryRow><span>Phí Ship</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          </div>
          <Divider />
          {method === 0 && (
            <SummaryRow><span>Tiền Cọc Phí Ship</span><span style={{ color: "#ff3b30" }}>{deposit.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          )}
          {method === 1 && (
            <SummaryRow><span>Hỗ Trợ Phí Ship</span><span style={{ color: "#22c55e" }}>-{shipDiscount.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          )}
          <SummaryRow $bold>
            <span>{method === 1 ? 'Tổng Thanh Toán' : 'Tổng Thanh Toán Khi Nhận'}</span>
            <span>
              {method === 0
                ? `${(totalPrice + shipFee - deposit).toLocaleString("vi-VN")}.000 đ`
                : `${(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ`}
            </span>
          </SummaryRow>
        </Card>

        <Card>
          <SectionTitle>Thông Tin Nhận Hàng</SectionTitle>

          <FormGroup>
            <Label>Tên *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên" />
          </FormGroup>
          <FormGroup>
            <Label>Số Điện Thoại *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập SĐT" type="tel" inputMode="numeric" />
          </FormGroup>
          <FormGroup>
            <Label>Địa Chỉ *</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ" rows={2} />
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

          <div style={{ background: '#fcfcfc', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0', textAlign: 'center', marginBottom: '20px' }}>
            <QRImg src="/assets/images/qr/qr-banking.jpg" style={{ width: '160px', height: '160px', margin: '0 auto 12px' }} />
            <BankInfo style={{ fontSize: '1.6rem' }}>0461000636243</BankInfo>
            <BankName>VO TIEN THUAN - VIETCOMBANK</BankName>
            <CopyBtn
              $success={copied}
              style={{ padding: '6px 16px', marginBottom: 0, minWidth: '130px' }}
              onClick={() => {
                navigator.clipboard.writeText("0461000636243");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={3} />
                  <span>Đã sao chép</span>
                </>
              ) : (
                "Sao Chép STK"
              )}
            </CopyBtn>
          </div>



          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn onClick={handleSubmitOrder} disabled={submitting}>
            {submitting ? "Đang xử lý..." : method === 0 
              ? "Xác Nhận Đã Cọc" 
              : "Xác Nhận Đã Chuyển Khoản"}
          </SubmitBtn>
        </Card>
      </TwoCol>
    </Page>
  );
}
