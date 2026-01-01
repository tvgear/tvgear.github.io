import * as React from "react";
import {
  ButtonOrder,
  CloseForm,
  ContentForm,
  ContentPayment,
  CopyNumberBank,
  FormError,
  HeaderForm,
  ImgClose,
  ImgLogo,
  ImgProduct,
  ImgQR,
  InfoAfterOrder,
  InfoBank,
  InfoCustomer,
  InfoImg,
  InfoOption,
  InfoPayment,
  InfoProduct,
  InfoProductOrder,
  InputForm,
  ItemForm,
  ItemPayment,
  ItemTab,
  NameInfo,
  NumberBank,
  PriceSelectInfo,
  ProfitItem,
  TabPayment,
  TextAreaForm,
  Title,
  TitleOrder,
  TitleProductOrder,
  WrapContact,
  WrapContent,
  WrapFormModal,
  WrapModal,
  WrapNumberBank,
  WrapQR,
} from "./style";

import {
  ColorItem,
  ItemColorSelect,
  OptionItem,
  ItemOptionSelect,
} from "../style";

import { Note } from "@/layouts";

export type ProductColor = {
  color: string;
  labelColor?: string;
  image: string;
  priceAdd: number;
};

export type ProductOption = {
  name: string;
  price: number;
  colors?: string[];
};

export type OrderData = {
  productName: string;
  colors: ProductColor[];
  options: ProductOption[];
  selectedColorIndex: number;
  selectedOptionName: string;
  image?: string;
};

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwCEQg77LAHejCaX4ZaDJYU9-V896QwwYu6gpLU65rVwbFmlplYwaT0bkP1cbe9dtzt/exec";

type OrderProductProps = {
  open: boolean;
  data?: OrderData;
  onClose: () => void;
  onSuccess?: () => void;
};

const paymentMethod = [
  { name: "COD - Tiền Mặt", profit: "" },
  { name: "Chuyển Khoản", profit: "-10K Ship" },
];

export default function OrderProduct({ open, data, onClose, onSuccess }: OrderProductProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

 
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerAddress, setCustomerAddress] = React.useState("");
  const [customerNote, setCustomerNote] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  const [method, setMethod] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const [submittedInfo, setSubmittedInfo] = React.useState<{
    name: string;
    phone: string;
    address: string;
    note?: string;
    payment?: string;
  } | null>(null);

  // ===========================================
  // STATE MÀU + OPTION TRONG MODAL
  // ===========================================
  const [colorIndex, setColorIndex] = React.useState(0);
  const [optionName, setOptionName] = React.useState("");

  // Khi mở modal → reset state + lấy default từ OrderData
  const prevOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && !prevOpen.current && data) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerNote("");
      setSubmitting(false);
      setErrorMsg(null);
      setOkMsg(null);
      setSubmittedInfo(null);

      // reset màu + option
      setColorIndex(data.selectedColorIndex);
      setOptionName(data.selectedOptionName);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      });
    }
    prevOpen.current = open;
  }, [open, data]);

  // ===========================================
  // TÍNH GIÁ THEO MÀU + OPTION ĐANG CHỌN
  // ===========================================
  const currentColor = data?.colors[colorIndex];

  // Lọc option theo màu
  const filteredOpts =
    data?.options.filter(
      (opt) => !opt.colors || opt.colors.includes(currentColor?.color ?? "")
    ) ?? [];

  const visibleOptions =
    filteredOpts.length > 0 ? filteredOpts : data?.options ?? [];

  // option mặc định đầu tiên
  const currentOption =
    visibleOptions.find((o) => o.name === optionName) ?? visibleOptions[0];

  // giá = option.price + color.priceAdd
  const finalPrice =
    (currentOption?.price ?? 0) + (currentColor?.priceAdd ?? 0);

  // ===========================================
  // SUBMIT FORM
  // ===========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMsg("Nhập đầy đủ thông tin nhận hàng.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        productName: data.productName,
        productColor: currentColor?.labelColor ?? currentColor?.color ?? "",
        productOption: currentOption?.name,
        productPriceOption: finalPrice * 1000,
        customerName,
        customerPhone,
        customerAddress,
        customerNote,
        customerPayment: paymentMethod[method]?.name ?? "",
      };

      const res = await fetch(SHEET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let resp: any = {};

      try {
        resp = JSON.parse(text);
      } catch {
        resp = { ok: res.ok };
      }

      if (!res.ok || resp.ok === false) throw new Error(resp.error || "Gửi thất bại");

      setSubmittedInfo({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        note: customerNote,
        payment: paymentMethod[method]?.name,
      });

      setOkMsg("Đặt Hàng Thành Công 🎉");

      requestAnimationFrame(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Đặt Hàng Thất Bại");
    } finally {
      setSubmitting(false);
    }
  };


  const handleClose = React.useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    onSuccess?.();
    onClose();
  }, [onSuccess, onClose]);




  return (
    <WrapModal onClick={handleClose} className={open ? "active" : ""}>
      <WrapFormModal onClick={(e) => e.stopPropagation()} className={open ? "active" : ""}>
        <HeaderForm className={okMsg ? "orderSuccess" : ""}>
          <Title className={okMsg ? "orderSuccess" : ""}>
            {okMsg ? okMsg : "Đặt Hàng"}
          </Title>

          <CloseForm onClick={handleClose}>
            <ImgClose src="/assets/images/icons/icCancel.svg" alt="Đóng" />
          </CloseForm>
        </HeaderForm>

        <ContentForm ref={contentRef}>
          {okMsg ? (
            <InfoAfterOrder>
              <InfoProductOrder>
                <InfoImg>
                  <ImgProduct src={currentColor?.image} />
                </InfoImg>
                <InfoOption>
                  <NameInfo>
                    {data?.productName}
                    <span>{currentColor?.labelColor ?? currentColor?.color}</span>
                    <span>{currentOption?.name}</span>
                  </NameInfo>
                  <PriceSelectInfo>
                    {finalPrice.toLocaleString("vi-VN")}.000  đ
                  </PriceSelectInfo>
                </InfoOption>
              </InfoProductOrder>

              <ContentPayment>
                {method === 0 && (
                  <ItemPayment>
                    <WrapContent>
                      <span className="payment">Phí Cọc Đơn Hàng : 50.000 đ</span>
                      <span>
                        Nhận Hàng Thanh Toán :{" "}
                        {(finalPrice - 50000).toLocaleString("vi-VN")}.000  đ + Phí Ship
                      </span>
                      <span className="note">
                        * Phí cọc không hoàn lại nếu hủy hoặc không nhận hàng
                      </span>
                    </WrapContent>

                    <WrapQR>
                      <ImgQR src="/assets/images/qr/qr-banking.jpg" />
                      <WrapNumberBank>
                        <NumberBank>0461000636243</NumberBank>
                        <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>

                        <CopyNumberBank
                          onClick={() => {
                            navigator.clipboard.writeText("0461000636243");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1000);
                          }}
                        >
                          {copied ? "Đã Sao Chép" : "Sao Chép Số Tài Khoản"}
                        </CopyNumberBank>
                      </WrapNumberBank>
                    </WrapQR>
                  </ItemPayment>
                )}

              
                {method === 1 && (
                  <ItemPayment>
                    <WrapContent>
                      <span className="payment">
                        Tổng Thanh Toán : {(finalPrice + 30).toLocaleString("vi-VN")}.000  đ
                      </span>
                    </WrapContent>

                    <WrapQR>
                      <ImgQR src="/assets/images/qr/qr-banking.jpg" />
                      <WrapNumberBank>
                        <NumberBank>0461000636243</NumberBank>
                        <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>

                        <CopyNumberBank
                          onClick={() => {
                            navigator.clipboard.writeText("0461000636243");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1000);
                          }}
                        >
                          {copied ? "Đã Sao Chép" : "Sao Chép Số Tài Khoản"}
                        </CopyNumberBank>
                      </WrapNumberBank>
                    </WrapQR>
                  </ItemPayment>
                )}
             
                <WrapContact>
                  <Note>
                    Sau Khi Chuyển Khoản/Cọc Vui Lòng Chụp Màn Hình Và Gửi Tại Đây<br />
                    <a href="https://facebook.com/tvgear" target="_blank">
                      https://facebook.com/tvgear
                    </a>
                  </Note>
                </WrapContact>

                <WrapContent>
                  <span>{submittedInfo?.name}</span>
                  <span>{submittedInfo?.phone}</span>
                  <span>{submittedInfo?.address}</span>
                  <span>{submittedInfo?.note}</span>
                  <span>{submittedInfo?.payment}</span>
                </WrapContent>
              </ContentPayment>
            </InfoAfterOrder>
          ) : (
            <>
              {/* ======================
                  INFO PRODUCT
              ======================= */}
              <TitleOrder>
                <ImgLogo src="/logo.svg" /> Thông Tin Sản Phẩm
              </TitleOrder>

              <InfoProduct>
                <InfoImg>
                  <ImgProduct src={currentColor?.image} />
                </InfoImg>

                <InfoOption>
                <NameInfo>{data?.productName}</NameInfo>
                <PriceSelectInfo>{finalPrice.toLocaleString("vi-VN")}.000 đ</PriceSelectInfo>
                    <TitleProductOrder>
                      Màu
                    </TitleProductOrder>
                    <ColorItem>
                      {data?.colors.map((c, i) => (
                        <ItemColorSelect
                          key={c.color}
                          className={i === colorIndex ? "active" : ""}
                          onClick={() => {
                            setColorIndex(i);
                            const allowed = data.options.filter(
                              (opt) => !opt.colors || opt.colors.includes(c.color)
                            );

                            if (!allowed.some((o) => o.name === optionName)) {
                              setOptionName(allowed[0]?.name ?? data.options[0]?.name ?? "");
                            }
                          }}
                        >
                          {c.labelColor}
                        </ItemColorSelect>
                      ))}
                    </ColorItem>
                  
                    <TitleProductOrder>
                      Phân Loại
                    </TitleProductOrder>

                    <OptionItem>
                      {visibleOptions.map((o) => (
                        <ItemOptionSelect
                          key={o.name}
                          className={optionName === o.name ? "active" : ""}
                          onClick={() => setOptionName(o.name)}
                        >
                          {o.name}
                        </ItemOptionSelect>
                      ))}
                    </OptionItem>
                      </InfoOption>
              </InfoProduct>
             
              <TitleOrder>
                <ImgLogo src="/logo.svg" /> Thông Tin Nhận Hàng
              </TitleOrder>

              <InfoCustomer>
                <form onSubmit={handleSubmit}>
                  <ItemForm>
                    <InputForm
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tên *"
                    />
                  </ItemForm>

                  <ItemForm>
                    <InputForm
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Số Điện Thoại *"
                      type="number"
                      inputMode="numeric"
                    />
                  </ItemForm>

                  <ItemForm>
                    <TextAreaForm
                      value={customerAddress}
                      rows={2}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Địa Chỉ *"
                    />
                  </ItemForm>
                  <ItemForm>
                    <TextAreaForm
                      value={customerNote}
                      rows={2}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="Ghi Chú Cho Đơn Hàng"
                    />
                  </ItemForm>

                  <InfoPayment>
                    <TitleOrder className="inForm">
                      <ImgLogo src="/logo.svg" /> Phương Thức Thanh Toán
                    </TitleOrder>

                    <TabPayment>
                      {paymentMethod.map((p, idx) => (
                        <ItemTab
                          key={p.name}
                          className={method === idx ? "active" : ""}
                          onClick={() => setMethod(idx)}
                        >
                          {p.name}
                          {p.profit && <ProfitItem>{p.profit}</ProfitItem>}
                        </ItemTab>
                      ))}
                    </TabPayment>
                    <ContentPayment>
  {method === 0 && (
    <ItemPayment>
      <WrapContent>
        <span className="payment">Phí Cọc Đơn Hàng : 50.000 đ</span>
        <span>
          Nhận Hàng Thanh Toán :{" "}
          {(finalPrice - 50).toLocaleString("vi-VN")}.000  đ + Phí Ship
        </span>
        <span className="note">
          * Phí cọc dùng để thanh toán phí vận chuyển 2 chiều nếu hủy/hoàn hàng
        </span>
      </WrapContent>

      <WrapQR>
        <ImgQR src="/assets/images/qr/qr-banking.jpg" />
        <WrapNumberBank>
          <NumberBank>0461000636243</NumberBank>
          <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>
          <CopyNumberBank
            onClick={() => {
              navigator.clipboard.writeText("0461000636243");
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
          >
            {copied ? "Đã Sao Chép" : "Sao Chép Số Tài Khoản"}
          </CopyNumberBank>
        </WrapNumberBank>
      </WrapQR>
    </ItemPayment>
  )}

  {method === 1 && (
    <ItemPayment>
      <WrapContent>
        <span>Tiền Hàng : {finalPrice.toLocaleString("vi-VN")}.000 đ</span>
        <span>Phí Ship : 40.000 đ</span>
        <span>
          Tổng Đơn Hàng : {(finalPrice + 40).toLocaleString("vi-VN")}.000  đ
        </span>
        <span>Hỗ Trợ Phí Ship : -10.000 đ</span>
        <span className="payment">
          Tổng Thanh Toán : {(finalPrice + 30).toLocaleString("vi-VN")}.000  đ
        </span>
      </WrapContent>

      <WrapQR>
        <ImgQR src="/assets/images/qr/qr-banking.jpg" />
        <WrapNumberBank>
          <NumberBank>0461000636243</NumberBank>
          <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>
          <CopyNumberBank
            onClick={() => {
              navigator.clipboard.writeText("0461000636243");
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
          >
            {copied ? "Đã Sao Chép" : "Sao Chép Số Tài Khoản"}
          </CopyNumberBank>
        </WrapNumberBank>
      </WrapQR>
    </ItemPayment>
  )}
</ContentPayment>
                  </InfoPayment>

                  

                  {errorMsg && <FormError>{errorMsg}</FormError>}

                  <ButtonOrder type="submit" disabled={submitting}>
                    {submitting ? "Đang Xác Nhận Đơn Hàng ..." : "Xác Nhận Thanh Toán Đơn Hàng"}
                  </ButtonOrder>
                </form>
              </InfoCustomer>
            </>
          )}
        </ContentForm>
      </WrapFormModal>
    </WrapModal>
  );
}
