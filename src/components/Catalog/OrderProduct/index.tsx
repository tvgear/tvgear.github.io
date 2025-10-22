import * as React from "react";
import {
  ButtonOrder,
  CloseForm,
  ContentForm,
  ContentPayment,
  CopyNumberBank,
  DescSelectOrder,
  FormError,
  HeaderForm,
  ImgClose,
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
  TitleAfterOrder,
  WrapContent,
  WrapFormModal,
  WrapModal,
  WrapNumberBank,
  WrapQR,
} from "./style";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwApeFO-OCZFDoEtvewN7qwEPn49xq9dBz250t6OYhkMQtfH3h-phAqEoDpjUDqlY1D/exec";

export type OrderData = {
  productName: string;
  productColor: string;
  productOption: string;
  productPriceOption: number;
  image?: string;
};

type OrderProductProps = {
  open: boolean;
  data?: OrderData;
  onClose: () => void;
  onSuccess?: () => void; 
};

const paymentMethod = [
    {
        name : "COD",
        profit : "",
    },
     {
        name : "Chuyển Khoản",
        profit : "-15K Ship",
    }
]

export default function OrderProduct({ open, data, onClose, onSuccess }: OrderProductProps) {
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerAddress, setCustomerAddress] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);
  const [method, setMethod] = React.useState(0);
  const [copied, setCopied] = React.useState(false);


  const prevOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setSubmitting(false);
      setErrorMsg(null);
      setOkMsg(null);
    }
    prevOpen.current = open;
  }, [open]);

  const handleClose = React.useCallback(() => {
    onSuccess?.();
    onClose();
  }, [onClose, onSuccess]);

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
      setOkMsg(null);

      const res = await fetch(SHEET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          productName: data.productName,
          productColor: data.productColor,
          productOption: data.productOption,
          productPriceOption: data.productPriceOption,
          customerName,
          customerPhone,
          customerAddress,
        }),
      });

      const resp = await res.json().catch(() => ({}));
      if (!res.ok || resp?.ok === false) {
        throw new Error(resp?.error || "Gửi Thất Bại.");
      }

      setOkMsg("Đơn Hàng Được Đặt Thành Công.");
    } catch (err: any) {
      setErrorMsg(err?.message || "Gửi Thất Bại. Thử Lại Sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WrapModal onClick={handleClose} className={open ? "active" : ""}>
      <WrapFormModal onClick={(e) => e.stopPropagation()} className={open ? "active" : ""}>
        <HeaderForm>
          <Title>Đặt Hàng</Title>
          <CloseForm onClick={handleClose}>
            <ImgClose src="/assets/images/icCancel.svg" alt="Đóng" />
          </CloseForm>
        </HeaderForm>
        <ContentForm>
          {okMsg ? (
            <InfoAfterOrder>
              <TitleAfterOrder>{okMsg}</TitleAfterOrder>
              <InfoProductOrder>
                <InfoImg>
                  {data?.image ? <ImgProduct src={data.image} alt="" /> : null}
                </InfoImg>
                <InfoOption>
                  <NameInfo>
                    {data?.productName ?? ""}
                    <span>{data?.productColor ?? ""}</span>
                    <span>{data?.productOption ?? ""}</span>
                  </NameInfo>
                  <PriceSelectInfo>
                    {(data?.productPriceOption ?? 0).toLocaleString("vi-VN")} đ
                  </PriceSelectInfo>
                </InfoOption>
              </InfoProductOrder>
              <DescSelectOrder>
                Chọn Hình Thức Thanh Toán Cho Đơn Hàng Của Bạn
              </DescSelectOrder>
              <InfoPayment>
                <TabPayment>
                   {paymentMethod.map((payment, index) => (
                    <ItemTab
                      key={payment.name}
                      className={method === index ? "active" : ""}
                      onClick={() => setMethod(index)}
                    >
                      {payment.name}
                      {payment.profit && (
                        <ProfitItem>{payment.profit}</ProfitItem>
                      )}
                    </ItemTab>
                  ))}
                </TabPayment>
                <ContentPayment>
                  <WrapQR>
                    <ImgQR src="/assets/images/qr.jpg" />
                    <WrapNumberBank>
                        <NumberBank>0461000636243</NumberBank>
                        <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>
                        <CopyNumberBank onClick={() => {
                                navigator.clipboard.writeText("0461000636243");
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}>
                        {copied ? "Đã Copy STK" : "Copy"}
                        </CopyNumberBank>
                    </WrapNumberBank>
                  </WrapQR>
                  {method === 0 && (
                    <ItemPayment>
                        <WrapContent>
                          <span>Đơn Hàng : {((data?.productPriceOption ?? 0)).toLocaleString("vi-VN")} đ</span>
                          <span>Phí Ship : 35.000 đ ~ 40.000 đ</span>
                          <span className="payment">Phí Cọc Đơn Hàng : 50.000 đ</span>
                          <span>Nhận Hàng Thanh Toán : {((data?.productPriceOption ?? 0) - 50000).toLocaleString("vi-VN")} đ + Phí Ship</span>
                          <span className="note">* Phí cọc không hoàn lại trong mọi trường hợp hủy đơn & không nhận hàng</span>
                        </WrapContent>
                    </ItemPayment>
                  )}
                  {method === 1 && (
                    <ItemPayment>
                        <WrapContent>
                          <span>Đơn Hàng : {((data?.productPriceOption ?? 0)).toLocaleString("vi-VN")} đ</span>
                          <span>Phí Ship : 40.000 đ</span>
                          <span>Tổng Đơn Hàng : {((data?.productPriceOption ?? 0) + 40000).toLocaleString("vi-VN")} đ</span>
                          <span>Hỗ Trợ Phí Ship : 15.000 đ</span>
                          <span className="payment">Tổng Thanh Toán : {((data?.productPriceOption ?? 0) + 25000).toLocaleString("vi-VN")} đ</span>
                          <span className="note">* Ghi Chú Tên Facebook + Tên Sản Phẩm khi chuyển khoản</span>
                        </WrapContent>
                    </ItemPayment>
                  )}
                   
                </ContentPayment>
              </InfoPayment>
            </InfoAfterOrder>
          ) : (
            <>
              <InfoProduct>
                <InfoImg>
                  {data?.image ? <ImgProduct src={data.image} alt="" /> : null}
                </InfoImg>
                <InfoOption>
                  <NameInfo>
                    {data?.productName ?? ""}
                    <span>{data?.productColor ?? ""}</span>
                    <span>{data?.productOption ?? ""}</span>
                  </NameInfo>
                  <PriceSelectInfo>
                    {(data?.productPriceOption ?? 0).toLocaleString("vi-VN")} đ
                  </PriceSelectInfo>
                </InfoOption>
              </InfoProduct>
              <InfoCustomer>
                <form onSubmit={handleSubmit}>
                  {errorMsg ? <FormError>{errorMsg}</FormError> : null}
                  <ItemForm>
                    <InputForm
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tên Facebook"
                    />
                  </ItemForm>
                  <ItemForm>
                    <InputForm
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="SĐT"
                    />
                  </ItemForm>
                  <ItemForm>
                    <TextAreaForm
                      value={customerAddress}
                      rows={3}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Địa Chỉ"
                    />
                  </ItemForm>
                  <ButtonOrder type="submit" disabled={submitting}>
                    {submitting ? "Đang Tạo Đơn Hàng..." : "Thanh Toán Đơn Hàng"}
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
