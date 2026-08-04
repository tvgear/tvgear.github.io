# Kết nối TVGEAR Admin với Google Sheets

## 1. Tạo bảng tính mới

Tạo một Google Sheet trống. Không cần tạo tab `Products` trước: Apps Script sẽ tự tạo và thiết lập các tiêu đề cột.

## 2. Cài Apps Script

Trong Sheet, vào **Extensions → Apps Script**.

1. Mở file `scripts/products-apps-script.gs` trong project này và sao chép toàn bộ nội dung.
2. Xóa code mặc định trong `Code.gs`, dán script vào, sau đó bấm **Save**.
3. Chọn hàm `setupProductsSheet` và bấm **Run**.
4. Hoàn tất cấp quyền cho Apps Script. Quay lại Sheet sẽ thấy tab `Products`.

## 3. Deploy API

1. Chọn **Deploy → New deployment → Web app**.
2. Chọn **Execute as: Me**.
3. Chọn quyền truy cập phù hợp để website quản trị gọi được endpoint (thường là **Anyone** với website public).
4. Bấm **Deploy** và sao chép Web App URL kết thúc bằng `/exec`.

## 4. Cấu hình website

Sao chép `.env.example` thành `.env.local`, sau đó điền URL vào `NEXT_PUBLIC_PRODUCTS_API_URL`. Build/deploy lại website sau khi thay đổi biến này.

Sau khi deploy lại website, mở `/admin/products`. Nếu tab `Products` vừa tạo và chưa có dữ liệu, website tự đưa toàn bộ catalogue hiện có vào đó đúng một lần. Những lần sau, website chỉ đọc dữ liệu từ Sheet; sửa, xóa, đổi trạng thái và trang `/admin/orders` đều dùng cùng endpoint này.

Sau mỗi lần sửa Apps Script: **Deploy → Manage deployments → Edit → New version → Deploy**.
