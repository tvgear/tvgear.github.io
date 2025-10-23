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
  WrapContent,
  WrapFormModal,
  WrapModal,
  WrapNumberBank,
  WrapQR,
} from "./style";

const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzQ1s6HRl4xdO6j3C4VPZZl8JI_JyCUjNvvatEXwx8XZhrRccz2mRiMkgD6-iIkE9oG/exec";
  

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
  { name: "Tiền Mặt/COD", profit: "" },
  { name: "Chuyển Khoản", profit: "-10K Ship" },
  { name: "Crypto", profit: "-15K Ship" },
];

export default function OrderProduct({
  open,
  data,
  onClose,
  onSuccess,
}: OrderProductProps) {
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

  const prevOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerNote("");
      setSubmitting(false);
      setErrorMsg(null);
      setOkMsg(null);
      setSubmittedInfo(null);
      requestAnimationFrame(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        if (contentRef.current) contentRef.current.scrollTop = 0;
      });
    }
    prevOpen.current = open;
  }, [open]);

  const handleClose = React.useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    if (contentRef.current) contentRef.current.scrollTop = 0;
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

      const customerPayment = paymentMethod[method]?.name ?? "";

      // Tránh preflight: KHÔNG đặt headers -> body đi như text/plain
      const payload = {
        productName: data.productName,
        productColor: data.productColor,
        productOption: data.productOption,
        productPriceOption: data.productPriceOption,
        customerName,
        customerPhone,
        customerAddress,
        customerNote,
        customerPayment,
      };

      const res = await fetch(SHEET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Đọc text trước rồi parse JSON an toàn
      const text = await res.text();
      let resp: any = {};
      try { resp = JSON.parse(text); } catch { resp = { ok: res.ok }; }

      if (!res.ok || resp?.ok === false) {
        throw new Error(resp?.error || "Gửi Thất Bại.");
      }

      setSubmittedInfo({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        note: customerNote,
        payment: customerPayment,
      });

      setOkMsg("Đặt Hàng Thành Công 🎉");
      requestAnimationFrame(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Đặt Hàng Thất Bại. Thử Lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const shortAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : "";

  return (
    <WrapModal onClick={handleClose} className={open ? "active" : ""}>
      <WrapFormModal onClick={(e) => e.stopPropagation()} className={open ? "active" : ""}>
        <HeaderForm className={`${okMsg ? "orderSuccess" : ""}`}>
          <Title className={`${okMsg ? "orderSuccess" : ""}`}>{okMsg ? okMsg : "Đặt Hàng"}</Title>
          <CloseForm onClick={handleClose}>
            <ImgClose src="/assets/images/icCancel.svg" alt="Đóng" />
          </CloseForm>
        </HeaderForm>
        <ContentForm ref={contentRef}>
          {okMsg ? (
            <InfoAfterOrder>
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

              <WrapContent>
                <span>{submittedInfo?.name || customerName}</span>
                <span>{submittedInfo?.phone || customerPhone}</span>
                <span>{submittedInfo?.address || customerAddress}</span>
                <span>{submittedInfo?.note || customerNote}</span>
                <span>{submittedInfo?.payment || paymentMethod[method]?.name}</span>
              </WrapContent>

              <ContentPayment>
                {method === 0 && (
                  <ItemPayment>
                    <WrapContent>
                      <span className="payment">Phí Cọc Đơn Hàng : 50.000 đ</span>
                      <span>
                        Nhận Hàng Thanh Toán :{" "}
                        {((data?.productPriceOption ?? 0) - 50000).toLocaleString("vi-VN")} đ + Phí Ship
                      </span>
                      <span className="note">* Phí cọc không hoàn lại trong mọi trường hợp hủy đơn & không nhận hàng</span>
                      <span className="note">* Sau Khi Đặt Hàng, vui lòng chụp màn hình chuyển khoản tiền cọc gửi về Facebook TVGEAR để hoàn tất.</span>
                    </WrapContent>
                  </ItemPayment>
                )}
                {method === 1 && (
                  <ItemPayment>
                    <WrapContent>
                      <span className="payment">
                        Tổng Thanh Toán : {((data?.productPriceOption ?? 0) + 30000).toLocaleString("vi-VN")} đ
                      </span>
                      <span className="note">* Sau Khi Đặt Hàng, vui lòng chụp màn hình chuyển khoản gửi về Facebook TVGEAR để hoàn tất.</span>
                    </WrapContent>
                  </ItemPayment>
                )}
                {method === 2 && (
                  <ItemPayment>
                    <WrapContent>
                      <span className="payment">
                        Tổng Thanh Toán : {((data?.productPriceOption ?? 0) + 25000).toLocaleString("vi-VN")} đ
                      </span>
                      <span className="payment">
                        Tổng Thanh Toán Quy Đổi : {(((data?.productPriceOption ?? 0) + 25000) / 26000).toFixed(2)} USDT
                      </span>
                      <span className="note">* Sau Khi Đặt Hàng, vui lòng chụp màn hình chuyển USDT gửi về Facebook TVGEAR để hoàn tất.</span>
                    </WrapContent>
                  </ItemPayment>
                )}
              </ContentPayment>
            </InfoAfterOrder>
          ) : (
            <>
              <TitleOrder>
                <ImgLogo src="/logo.svg" />
                Thông Tin Sản Phẩm
              </TitleOrder>
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

              <TitleOrder>
                <ImgLogo src="/logo.svg" />
                Thông Tin Nhận Hàng
              </TitleOrder>
              <InfoCustomer>
                <form onSubmit={handleSubmit}>
                  <ItemForm>
                    <InputForm
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tên Facebook *"
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
                      placeholder="Ghi Chú"
                    />
                  </ItemForm>

                  <InfoPayment>
                    <TitleOrder className="inForm">
                      <ImgLogo src="/logo.svg" />
                      Phương Thức Thanh Toán
                    </TitleOrder>
                    <TabPayment>
                      {paymentMethod.map((payment, index) => (
                        <ItemTab
                          key={payment.name}
                          className={method === index ? "active" : ""}
                          onClick={() => setMethod(index)}
                        >
                          {payment.name}
                          {payment.profit && <ProfitItem>{payment.profit}</ProfitItem>}
                        </ItemTab>
                      ))}
                    </TabPayment>

                    <ContentPayment>
                      {method === 0 && (
                        <ItemPayment>
                          <WrapQR>
                            <ImgQR src="/assets/images/qr.jpg" />
                            <WrapNumberBank>
                              <NumberBank>0461000636243</NumberBank>
                              <InfoBank>VO TIEN THUAN - VIETCOMBANK</InfoBank>
                              <CopyNumberBank
                                onClick={() => {
                                  navigator.clipboard.writeText("0461000636243");
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                              >
                                {copied ? "Đã Sao Chép" : "Sao Chép Số Tài Khoản"}
                              </CopyNumberBank>
                            </WrapNumberBank>
                          </WrapQR>
                          <WrapContent>
                            <span>Tiền Hàng : {(data?.productPriceOption ?? 0).toLocaleString("vi-VN")} đ</span>
                            <span className="payment">Phí Cọc Đơn Hàng : 50.000 đ</span>
                            <span>
                              Nhận Hàng Thanh Toán : {((data?.productPriceOption ?? 0) - 50000).toLocaleString("vi-VN")} đ + Phí Ship
                            </span>
                          </WrapContent>
                          <WrapContent>
                            <span className="note">* Phí cọc đơn hàng là bắt buộc với Tiền Mặt/COD.</span>
                            <span className="note">* Phí cọc dùng để thanh toán phí vận chuyển 2 chiều nếu hủy/hoàn hàng.</span>
                          </WrapContent>
                        </ItemPayment>
                      )}

                      {method === 1 && (
                        <ItemPayment>
                          <WrapQR>
                            <ImgQR src="/assets/images/qr.jpg" />
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
                          <WrapContent>
                            <span>Tiền Hàng : {(data?.productPriceOption ?? 0).toLocaleString("vi-VN")} đ</span>
                            <span>Phí Ship : 40.000 đ</span>
                            <span>Tổng Đơn Hàng : {((data?.productPriceOption ?? 0) + 40000).toLocaleString("vi-VN")} đ</span>
                            <span>Hỗ Trợ Phí Ship : -10.000 đ</span>
                            <span className="payment">Tổng Thanh Toán : {((data?.productPriceOption ?? 0) + 30000).toLocaleString("vi-VN")} đ</span>
                          </WrapContent>
                        </ItemPayment>
                      )}

                      {method === 2 && (
                        <ItemPayment>
                          <WrapQR>
                            <ImgQR src="/assets/images/qr-crypto.jpg" />
                            <WrapNumberBank>
                              <NumberBank>{shortAddress("0x41ab3715ee3dd25c49d034a9cc85f34639372216")}</NumberBank>
                              <InfoBank>BSC - BNB Smart Chain (BEP20)</InfoBank>
                              <CopyNumberBank
                                onClick={() => {
                                  navigator.clipboard.writeText("0x41ab3715ee3dd25c49d034a9cc85f34639372216");
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                              >
                                {copied ? "Đã Sao Chép" : "Sao Chép Mã Ví"}
                              </CopyNumberBank>
                            </WrapNumberBank>
                          </WrapQR>
                          <WrapContent>
                            <span>Tiền Hàng : {(data?.productPriceOption ?? 0).toLocaleString("vi-VN")} đ</span>
                            <span>Phí Ship : 40.000 đ</span>
                            <span>Tổng Đơn Hàng : {((data?.productPriceOption ?? 0) + 40000).toLocaleString("vi-VN")} đ</span>
                            <span>Hỗ Trợ Phí Ship : 15.000 đ</span>
                            <span className="payment">Tổng Thanh Toán : {((data?.productPriceOption ?? 0) + 25000).toLocaleString("vi-VN")} đ</span>
                            <span className="payment">Tổng Thanh Toán Quy Đổi : {(((data?.productPriceOption ?? 0) + 25000) / 26000).toFixed(2)} USDT</span>
                          </WrapContent>
                          <WrapContent>
                            <span className="note">* Tỉ giá 1 USDT = 26.000 VND (đã gồm phí P2P, chưa gồm gas).</span>
                            <span className="note">* Chỉ gửi USDT (BEP20) đến địa chỉ trên.</span>
                          </WrapContent>
                        </ItemPayment>
                      )}
                    </ContentPayment>
                  </InfoPayment>

                  {errorMsg ? <FormError>{errorMsg}</FormError> : null}
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
