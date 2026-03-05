import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ArrowLeft, Upload, CheckCircle, MessageCircle, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/product";
import { getCart, getCartTotal, clearCart } from "@/utils/carts";
import { findColorDef } from "@/utils/colors";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwCEQg77LAHejCaX4ZaDJYU9-V896QwwYu6gpLU65rVwbFmlplYwaT0bkP1cbe9dtzt/exec";

/* ─── styled ─── */
const Page = styled.div`
  min-height: 100%;
  padding: 20px;
  @media screen and (max-width: 767px) {
    padding: 12px;
  }
`;

const MobileBackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 12px;
  transition: 0.2s;
  &:hover {
    background: #e5e5e5;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 16px;
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
  gap: 12px;
  padding: 10px 0;
  &:last-child {
    border-bottom: none;
  }
`;
const CIImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 8px;
`;
const CIInfo = styled.div`
  flex: 1;
  margin : 0px 0px 0px 7.5px;
`;
const CIName = styled.div`
  font-family: F_BOLD;
  font-size: 1.4rem;
`;
const CIMeta = styled.div`
  font-size: 1.2rem;
  color: #777;
  margin: 2px 0;
`;
const CIPrice = styled.div`
  font-family: F_SEMIBOLD;
  font-size: 1.4rem;
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
  height: 44px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 1.4rem;
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
  padding: 10px 14px;
  font-size: 1.4rem;
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
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
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

const PaymentCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  text-align: center;
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
const CopyBtn = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-family: F_BOLD;
  font-size: 1.2rem;
  cursor: pointer;
  margin-bottom: 16px;
  &:hover {
    background: #333;
  }
`;
const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  color: #888;
  font-size: 1.3rem;
  margin: 12px 0;
  transition: 0.2s;
  &:hover {
    border-color: #c8e64a;
    color: #666;
  }
  input {
    display: none;
  }
`;
const UploadedImg = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin: 8px auto;
`;

const ConfirmPayBtn = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #c8e64a;
  color: #000;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #b8d63a;
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
  margin-bottom: 16px;
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
  background: #c8e64a;
  color: #000;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #b8d63a;
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
  const [note, setNote] = useState("");
  const [method, setMethod] = useState(0); // 0 = COD, 1 = CK
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const totalPrice = getCartTotal(cartItems);
  const shipFee = 40;
  const deposit = 50;
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
    setStep("payment");
    pageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmPayment = async () => {
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
          customerNote: note,
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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (step === "success") {
    return (
      <Page ref={pageRef}>
        <SuccessWrap>
          <SuccessIcon>
            <CheckCircle size={64} />
          </SuccessIcon>
          <SuccessTitle>Đặt Hàng Thành Công</SuccessTitle>

          <SuccessCard>
            <SectionTitle>Sản phẩm</SectionTitle>
            {cartItems.map((item, idx) => {
              const up = item.option.price;
              return (
                <CheckoutItem key={idx}>
                  <CIImg src={item.image} />
                  <CIInfo>
                    <CIName>{item.productName}</CIName>
                    <CIMeta>
                      {findColorDef(item.color.color)?.label || item.color.color} · {item.option.name} · x{item.quantity}
                    </CIMeta>
                    <CIPrice>{(up * item.quantity).toLocaleString("vi-VN")}.000 đ</CIPrice>
                  </CIInfo>
                </CheckoutItem>
              );
            })}
            <Divider />
            <SummaryRow $bold>
              <span>Tổng</span>
              <span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span>
            </SummaryRow>
          </SuccessCard>

          <SuccessCard>
            <SectionTitle>Thông tin khách hàng</SectionTitle>
            <SummaryRow><span>Tên</span><span>{name}</span></SummaryRow>
            <SummaryRow><span>SĐT</span><span>{phone}</span></SummaryRow>
            <SummaryRow><span>Địa chỉ</span><span>{address}</span></SummaryRow>
            {note && <SummaryRow><span>Ghi chú</span><span>{note}</span></SummaryRow>}
            <SummaryRow><span>Thanh toán</span><span>{method === 0 ? "COD" : "Chuyển khoản"}</span></SummaryRow>
          </SuccessCard>

          <SuccessBtn onClick={() => router.push("/")}>
            <ShoppingBag size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Tiếp tục Shopping
          </SuccessBtn>
          <ContactBtn href="https://facebook.com/tvgear" target="_blank" rel="noopener">
            <MessageCircle size={16} />
            Liên hệ Shop
          </ContactBtn>
        </SuccessWrap>
      </Page>
    );
  }

  if (step === "payment") {
    return (
      <Page ref={pageRef}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <MobileBackBtn onClick={() => setStep("form")}>
            <ArrowLeft size={20} />
          </MobileBackBtn>
        </div>
        <PaymentCard>
          {method === 0 ? (
            <>
              <SectionTitle style={{ justifyContent: "center" }}>Cọc Đơn Hàng (COD)</SectionTitle>
              <SummaryRow><span>Tổng sản phẩm</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <SummaryRow><span>Phí Ship dự kiến</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <Divider />
              <SummaryRow $bold><span>Số tiền cọc</span><span style={{ color: "#e53935" }}>{deposit.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <SummaryRow><span>Còn lại khi nhận</span><span>{(totalPrice + shipFee - deposit).toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            </>
          ) : (
            <>
              <SectionTitle style={{ justifyContent: "center" }}>Chuyển Khoản</SectionTitle>
              <SummaryRow><span>Giá sản phẩm</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <SummaryRow><span>Phí Ship</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <SummaryRow><span>Giảm trừ phí Ship</span><span style={{ color: "#22c55e" }}>-{shipDiscount.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
              <Divider />
              <SummaryRow $bold><span>Tổng chuyển khoản</span><span style={{ color: "#e53935" }}>{(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
            </>
          )}

          <QRImg src="/assets/images/qr/qr-banking.jpg" />
          <BankInfo>0461000636243</BankInfo>
          <BankName>VO TIEN THUAN - VIETCOMBANK</BankName>
          <CopyBtn
            onClick={() => {
              navigator.clipboard.writeText("0461000636243");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Đã Sao Chép ✓" : "Sao Chép STK"}
          </CopyBtn>

          <UploadArea>
            <Upload size={24} />
            <span>Upload ảnh chuyển khoản</span>
            <input type="file" accept="image/*" onChange={handleUpload} />
          </UploadArea>
          {uploadedFile && <UploadedImg src={uploadedFile} />}

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <ConfirmPayBtn onClick={handleConfirmPayment} disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
          </ConfirmPayBtn>
        </PaymentCard>
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
            <SectionTitle style={{ marginBottom: 0 }}>Đơn Hàng ({cartItems.length} Sản Phẩm)</SectionTitle>
          </div>
          {cartItems.map((item, idx) => {
            const up = item.option.price;
            return (
              <CheckoutItem key={idx}>
                <CIImg src={item.image} />
                <CIInfo>
                  <CIName>{item.productName}</CIName>
                  <CIMeta>
                    {findColorDef(item.color.color)?.label || item.color.color} · {item.option.name} · x{item.quantity}
                  </CIMeta>
                  <CIPrice>{(up * item.quantity).toLocaleString("vi-VN")}.000 đ</CIPrice>
                </CIInfo>
              </CheckoutItem>
            );
          })}
          <Divider />
          <SummaryRow><span>Tạm Tính</span><span>{totalPrice.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          <SummaryRow><span>Phí Ship Dự Kiến</span><span>{shipFee.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          {method === 0 && (
            <SummaryRow><span>Tiền Cọc Đơn Hàng</span><span>{deposit.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          )}
          {method === 1 && (
            <SummaryRow><span>Hỗ Trợ Phí Ship</span><span style={{ color: "#22c55e" }}>-{shipDiscount.toLocaleString("vi-VN")}.000 đ</span></SummaryRow>
          )}
          <Divider />
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
          <FormGroup>
            <Label>Ghi Chú</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho đơn hàng" rows={2} />
          </FormGroup>

          <SectionTitle>Phương Thức Thanh Toán</SectionTitle>
          <PaymentMethods>
            <PayMethodBtn $active={method === 0} onClick={() => setMethod(0)}>
              COD - Tiền Mặt
            </PayMethodBtn>
            <PayMethodBtn $active={method === 1} onClick={() => setMethod(1)}>
              Chuyển Khoản
              <DiscountTag>-10K Ship</DiscountTag>
            </PayMethodBtn>
          </PaymentMethods>

          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SubmitBtn onClick={handleSubmitOrder} disabled={submitting}>
            {method === 0 
              ? `Cọc Đơn Hàng — ${deposit.toLocaleString("vi-VN")}.000 đ` 
              : `Thanh Toán — ${(totalPrice + shipFee - shipDiscount).toLocaleString("vi-VN")}.000 đ`}
          </SubmitBtn>
        </Card>
      </TwoCol>
    </Page>
  );
}
