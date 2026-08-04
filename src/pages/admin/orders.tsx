import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { fetchSheetOrders, isProductsApiConfigured, SheetOrders } from "@/utils/products-api";

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;
`;

const Breadcrumb = styled.p`
  color: #858d98;
  font-size: 1.2rem;
`;

const Title = styled.h1`
  margin-top: 9px;
  font-family: F_BOLD;
  font-size: clamp(2.7rem, 4vw, 3.5rem);
  letter-spacing: -0.045em;
`;

const Subtitle = styled.p`
  margin-top: 9px;
  color: #737c88;
  font-size: 1.35rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #dce1e6;
  border-radius: 9px;
  background: #fff;
  color: #39414c;
  cursor: pointer;
  font-family: F_SEMIBOLD;
  font-size: 1.25rem;
  &:disabled { cursor: wait; opacity: .6; }
`;

const Notice = styled.div<{ $error?: boolean }>`
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid ${(props) => (props.$error ? "#f1c4c4" : "#d9dfe4")};
  border-radius: 10px;
  background: ${(props) => (props.$error ? "#fff5f5" : "#fff")};
  color: ${(props) => (props.$error ? "#b42318" : "#626c78")};
  font-size: 1.25rem;
  line-height: 1.45;
`;

const TableCard = styled.div`
  overflow: hidden;
  border: 1px solid #e1e5e9;
  border-radius: 14px;
  background: #fff;
`;

const TableWrap = styled.div`overflow: auto;`;

const Table = styled.table`
  width: 100%;
  min-width: 780px;
  text-align: left;
  th { padding: 13px 18px; border-bottom: 1px solid #e9ecef; background: #fafbfc; color: #747d89; font-family: F_SEMIBOLD; font-size: 1.08rem; letter-spacing: .04em; text-transform: uppercase; }
  td { padding: 14px 18px; border-bottom: 1px solid #eef0f2; color: #4f5965; font-size: 1.25rem; vertical-align: top; line-height: 1.45; }
  tr:last-child td { border-bottom: 0; }
`;

const Empty = styled.div`
  padding: 56px 25px;
  color: #7b8490;
  font-size: 1.35rem;
  line-height: 1.6;
  text-align: center;
`;

const OrdersPage = () => {
  const [orders, setOrders] = useState<SheetOrders>({ headers: [], rows: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    if (!isProductsApiConfigured()) return;
    setIsLoading(true);
    setError("");
    try { setOrders(await fetchSheetOrders()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Không thể tải đơn hàng."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { void loadOrders(); }, []);

  return (
    <AdminLayout>
      <Head><title>Đơn hàng | TVGEAR Admin</title></Head>
      <Header><div><Breadcrumb>Quản trị / Đơn hàng</Breadcrumb><Title>Đơn Hàng</Title><Subtitle>{orders.rows.length ? `${orders.rows.length} đơn hàng từ Google Sheets.` : "Dữ liệu đơn hàng từ tab Orders."}</Subtitle></div><Button type="button" onClick={() => void loadOrders()} disabled={isLoading || !isProductsApiConfigured()}><RefreshCw size={16} />Làm mới</Button></Header>
      {error && <Notice $error>{error}</Notice>}
      {!isProductsApiConfigured() && <Notice>Chưa có URL Apps Script. Sau khi cấu hình `NEXT_PUBLIC_PRODUCTS_API_URL`, tab này sẽ tự đọc dữ liệu từ sheet <strong>Orders</strong>.</Notice>}
      <TableCard><TableWrap>{orders.headers.length ? <Table><thead><tr>{orders.headers.map((header, index) => <th key={`${header}-${index}`}>{header || `Cột ${index + 1}`}</th>)}</tr></thead><tbody>{orders.rows.map((row, rowIndex) => <tr key={rowIndex}>{orders.headers.map((_, cellIndex) => <td key={cellIndex}>{row[cellIndex] || "—"}</td>)}</tr>)}</tbody></Table> : <Empty>{isLoading ? "Đang tải đơn hàng..." : "Chưa có đơn hàng để hiển thị."}</Empty>}</TableWrap></TableCard>
    </AdminLayout>
  );
};

export default OrdersPage;
