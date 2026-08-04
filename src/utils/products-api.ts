import { AdminProduct } from "@/data/admin-products";

const productsApiUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

type ProductsResponse = {
  ok: boolean;
  products?: AdminProduct[];
  product?: AdminProduct;
  initialized?: boolean;
  error?: string;
};

export type SheetProducts = {
  products: AdminProduct[];
  initialized: boolean;
};

export type SheetOrders = {
  headers: string[];
  rows: string[][];
};

export const isProductsApiConfigured = (): boolean => Boolean(productsApiUrl);

const request = async (payload?: Record<string, unknown>): Promise<ProductsResponse> => {
  if (!productsApiUrl) throw new Error("Chưa cấu hình NEXT_PUBLIC_PRODUCTS_API_URL.");

  const response = payload
    ? await fetch(productsApiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
    : await fetch(productsApiUrl);

  const result = await response.json() as ProductsResponse;
  if (!result.ok) throw new Error(result.error ?? "Không thể đồng bộ dữ liệu sản phẩm.");
  return result;
};

export const fetchSheetProducts = async (): Promise<SheetProducts> => {
  const result = await request();
  return { products: result.products ?? [], initialized: result.initialized === true };
};

export const fetchSheetOrders = async (): Promise<SheetOrders> => {
  if (!productsApiUrl) throw new Error("Chưa cấu hình NEXT_PUBLIC_PRODUCTS_API_URL.");
  const separator = productsApiUrl.includes("?") ? "&" : "?";
  const response = await fetch(`${productsApiUrl}${separator}action=orders`);
  const result = await response.json() as { ok: boolean; headers?: string[]; rows?: string[][]; error?: string };
  if (!result.ok) throw new Error(result.error ?? "Không thể tải đơn hàng.");
  return { headers: result.headers ?? [], rows: result.rows ?? [] };
};

export const upsertSheetProduct = async (product: AdminProduct): Promise<void> => {
  await request({ action: "upsert", product });
};

export const replaceSheetProducts = async (products: AdminProduct[]): Promise<void> => {
  await request({ action: "replace", products });
};

export const deleteSheetProduct = async (id: string): Promise<void> => {
  await request({ action: "delete", id });
};
