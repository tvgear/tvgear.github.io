import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { MoreHorizontal, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { AdminProduct, AdminProductColor, AdminProductOption, CONNECTION_OPTIONS, getDefaultWarranty, getGroupLabel, initialAdminProducts, ProductCategory, ProductWarranty, productCategories, WARRANTY_OPTIONS } from "@/data/admin-products";
import { PRODUCT_COLORS } from "@/data/product-colors";
import { deleteSheetProduct, fetchSheetProducts, isProductsApiConfigured, replaceSheetProducts, upsertSheetProduct } from "@/utils/products-api";

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  @media (max-width: 620px) { flex-direction: column; }
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
  line-height: 1.55;
`;

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
`;

const Button = styled.button<{ $secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: ${(props) => (props.$secondary ? "1px solid #dce1e6" : "1px solid #17191c")};
  border-radius: 9px;
  background: ${(props) => (props.$secondary ? "#fff" : "#17191c")};
  color: ${(props) => (props.$secondary ? "#39414c" : "#fff")};
  cursor: pointer;
  font-family: F_SEMIBOLD;
  font-size: 1.25rem;
  white-space: nowrap;
  &:disabled { cursor: wait; opacity: .6; }
`;

const Notice = styled.div<{ $error?: boolean }>`
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid ${(props) => (props.$error ? "#f1c4c4" : "#cfe4d7")};
  border-radius: 10px;
  background: ${(props) => (props.$error ? "#fff5f5" : "#f3fbf6")};
  color: ${(props) => (props.$error ? "#b42318" : "#267a47")};
  font-size: 1.25rem;
  line-height: 1.45;
`;

const GroupTabs = styled.nav`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 0 18px;
  padding-bottom: 2px;
`;

const GroupTab = styled(Link)<{ $active: boolean }>`
  flex: 0 0 auto;
  padding: 9px 13px;
  border: 1px solid ${(props) => (props.$active ? "#17191c" : "#dce1e6")};
  border-radius: 8px;
  background: ${(props) => (props.$active ? "#17191c" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#5c6570")};
  font-family: F_SEMIBOLD;
  font-size: 1.2rem;
  white-space: nowrap;
`;

const ProductList = styled.div`
  display: grid;
  gap: 12px;
`;

const ProductCard = styled.article`
  display: grid;
  grid-template-columns: minmax(225px, .72fr) minmax(260px, 1.28fr) 31px;
  align-items: start;
  gap: 22px;
  padding: 17px;
  border: 1px solid #e1e5e9;
  border-radius: 14px;
  background: #fff;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr) 31px;
    gap: 16px;
  }
`;

const ProductOptions = styled.div`
  min-width: 0;
  @media (max-width: 700px) { grid-column: 1 / -1; }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  min-width: 225px;
`;

const ProductImage = styled.div`
  box-sizing: border-box;
  width: 88px;
  height: 88px;
  flex: 0 0 88px;
  overflow: hidden;
  display: grid;
  place-items: center;
  line-height: 0;
  padding: 8px;
  border: 1px solid #e4e8eb;
  border-radius: 10px;
  background: #f0f2f4;
  color: #737b85;
  font-family: F_BOLD;
  font-size: 1.1rem;

  img {
    display: block;
    width: 100%;
    height: calc(88px - 16px - 2px);
    max-height: calc(88px - 16px - 2px);
    object-fit: contain;
  }
`;

const ProductName = styled.p`
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
`;

const ProductConnection = styled.p`
  margin-top: 3px;
  color: #7b8490;
  font-size: 1.15rem;
`;

const ProductAvailability = styled.div`
  display: flex;
  align-items: center;
  margin-top: 7px;
`;

const OptionList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  align-items: start;
  gap: 8px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, max-content); }
  @media (max-width: 540px) { grid-template-columns: max-content; }
`;

const OptionGroups = styled.div`
  display: grid;
  gap: 9px;
`;

const OptionLine = styled.div`
  display: grid;
  gap: 3px;
  width: fit-content;
  max-width: 100%;
  padding: 7px 9px;
  border: 1px dashed #cfd5da;
  border-radius: 8px;
  background: #fafbfc;
`;

const OptionPrice = styled.p`
  color: #23282f;
  font-family: F_BOLD;
  font-size: 1.25rem;
`;

const OptionSummary = styled.p`
  color: #59636e;
  font-size: 1.18rem;
  line-height: 1.4;
`;

const StatusToggle = styled.button<{ $active: boolean; $compact?: boolean }>`
  position: relative;
  width: ${(props) => (props.$compact ? "34px" : "42px")};
  height: ${(props) => (props.$compact ? "19px" : "24px")};
  padding: 0;
  border: 0;
  border-radius: 100px;
  background: ${(props) => (props.$active ? "#22a36a" : "#b9c0c8")};
  cursor: pointer;

  &::after {
    position: absolute;
    top: ${(props) => (props.$compact ? "2px" : "3px")};
    left: ${(props) => (props.$active ? (props.$compact ? "17px" : "21px") : (props.$compact ? "2px" : "3px"))};
    width: ${(props) => (props.$compact ? "15px" : "18px")};
    height: ${(props) => (props.$compact ? "15px" : "18px")};
    border-radius: 50%;
    background: #fff;
    content: "";
    transition: left .18s ease;
  }
`;

const RowActions = styled.div`
  position: relative;
  display: inline-block;
  justify-self: end;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border: 1px solid ${(props) => (props.$danger ? "#f2d2d2" : "#dfe3e7")};
  border-radius: 7px;
  background: #fff;
  color: ${(props) => (props.$danger ? "#c43939" : "#4c5560")};
  cursor: pointer;
`;

const ActionPopover = styled.div`
  position: absolute;
  top: 37px;
  right: 0;
  z-index: 5;
  min-width: 125px;
  overflow: hidden;
  padding: 5px;
  border: 1px solid #dfe3e7;
  border-radius: 9px;
  background: #fff;
  box-shadow: 0 9px 22px rgba(30, 36, 43, .14);
`;

const ActionItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: ${(props) => (props.$danger ? "#c43939" : "#414a55")};
  cursor: pointer;
  font-family: F_MEDIUM;
  font-size: 1.2rem;
  text-align: left;
  &:hover { background: ${(props) => (props.$danger ? "#fff4f4" : "#f3f5f7")}; }
`;

const Empty = styled.div`
  padding: 54px 25px;
  color: #7b8490;
  font-size: 1.35rem;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(18, 21, 25, .52);
  backdrop-filter: blur(4px);
`;

const Modal = styled.section`
  width: min(100%, 575px);
  max-height: min(830px, calc(100dvh - 48px));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(0,0,0,.28);

  form {
    min-height: 0;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex: 0 0 auto;
  padding: 22px 28px 20px;
  border-bottom: 1px solid #edf0f2;
  h2 { margin-top: 3px; font-family: F_BOLD; font-size: 2.25rem; letter-spacing: -.04em; }
  @media (max-width: 540px) { padding: 19px 20px 17px; }
`;

const ModalEyebrow = styled.p`
  color: #7b8490;
  font-family: F_SEMIBOLD;
  font-size: 1.05rem;
  letter-spacing: .08em;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 7px;
  background: #f3f5f7;
  color: #4a535e;
  cursor: pointer;
  &:hover { background: #e9edf0; }
`;

const ModalContent = styled.div`
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 22px 28px 26px;
  @media (max-width: 540px) { padding: 18px 20px 22px; }
`;

const FormSection = styled.section`
  & + & { margin-top: 26px; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 13px;
`;

const SectionTitle = styled.h3`
  color: #272c33;
  font-family: F_BOLD;
  font-size: 1.45rem;
  letter-spacing: -.015em;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Field = styled.label<{ $wide?: boolean }>`
  display: block;
  grid-column: ${(props) => (props.$wide ? "1 / -1" : "auto")};
  color: #4e5762;
  font-family: F_SEMIBOLD;
  font-size: 1.15rem;

  input, select, textarea {
    width: 100%;
    margin-top: 7px;
    min-height: 42px;
    padding: 10px 11px;
    border: 1px solid #dce1e6;
    border-radius: 8px;
    background: #fff;
    color: #20242a;
    font: inherit;
    font-family: F_REGULAR;
    outline: none;
  }
  textarea { min-height: 80px; resize: vertical; line-height: 1.45; }
  input:focus, select:focus, textarea:focus { border-color: #17191c; box-shadow: 0 0 0 3px rgba(23,25,28,.1); }
`;

const CheckList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const CheckOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 11px;
  border: 1px solid #dfe4e8;
  border-radius: 9px;
  background: #fff;
  color: #4e5864;
  cursor: pointer;
  font-family: F_MEDIUM;
  font-size: 1.2rem;

  input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #17191c;
  }

  &:has(input:checked) { border-color: #17191c; background: #f4f6f7; color: #17191c; }
`;

const AvailabilityToggle = styled.button<{ $active: boolean }>`
  min-width: 94px;
  height: 31px;
  padding: 0 11px;
  border: 0;
  border-radius: 999px;
  background: ${(props) => (props.$active ? "#239765" : "#7c858e")};
  color: #fff;
  cursor: pointer;
  font-family: F_SEMIBOLD;
  font-size: 1.08rem;
`;

const RowsList = styled.div`
  display: grid;
  gap: 10px;
`;

const EmptySection = styled.p`
  padding: 15px;
  border: 1px dashed #d7dde2;
  border-radius: 10px;
  background: #fafbfc;
  color: #7a838e;
  font-size: 1.16rem;
  text-align: center;
`;

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 32px;
  align-items: end;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #f8f9fa;

  > label:nth-child(3) { grid-column: 1; }
  > label:nth-child(4) { grid-column: 2; }
  > button { grid-column: 3; grid-row: 1 / 3; align-self: center; }
`;

const ColorRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) 32px;
  align-items: end;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #f8f9fa;

  > label:nth-child(3) { grid-column: 1 / 3; }
  > button { grid-column: 3; grid-row: 1 / 3; align-self: center; }
`;

const ColorSwatch = styled.span<{ $color: string }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border: 1px solid #cbd1d7;
  border-radius: 50%;
  background: ${(props) => props.$color};
  vertical-align: -1px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  flex: 0 0 auto;
  padding: 17px 28px;
  border-top: 1px solid #edf0f2;
  background: #fff;
  @media (max-width: 540px) { padding: 14px 20px; }
`;

const DeleteMessage = styled.p`
  color: #636d78;
  font-size: 1.35rem;
  line-height: 1.55;
`;

const formatOptionPrice = (price: number): string => `${new Intl.NumberFormat("vi-VN").format(price * 1000)}đ`;

const imageDirectories: Record<ProductCategory, string> = {
  mouse: "/assets/images/mouses",
  keyboard: "/assets/images/keyboards",
  headphone: "/assets/images/headphones",
  accessories: "/assets/images/accessories",
};

const getImageFilename = (image: string): string => image.split("/").filter(Boolean).pop() ?? "";

const getImagePath = (category: ProductCategory, filename: string): string => {
  const safeFilename = getImageFilename(filename);
  return safeFilename ? `${imageDirectories[category]}/${safeFilename}` : "";
};

const getWarrantyLabel = (warranty: ProductWarranty): string =>
  WARRANTY_OPTIONS.find((item) => item.key === warranty)?.label ?? "";

const getShortWarrantyLabel = (warranty: ProductWarranty): string =>
  getWarrantyLabel(warranty).replace("Bảo Hành", "BH");

const groupOptionsByColor = (options: AdminProductOption[]): Array<{ colorKey: string; options: AdminProductOption[] }> => {
  const groups = new Map<string, AdminProductOption[]>();
  options.forEach((option) => {
    const colorKey = option.colors?.[0] ?? "";
    groups.set(colorKey, [...(groups.get(colorKey) ?? []), option]);
  });
  return Array.from(groups, ([colorKey, groupedOptions]) => ({ colorKey, options: groupedOptions }));
};

const formatOptionColors = (option: AdminProductOption, productColors: AdminProduct["colors"]): string => {
  const colorKeys = option.colors?.length ? option.colors : productColors.map((color) => color.key);
  return colorKeys
    .map((colorKey) => PRODUCT_COLORS[colorKey as keyof typeof PRODUCT_COLORS]?.label ?? colorKey)
    .join("/");
};

const formatConnection = (connection: string): string => {
  if (connection === "wired") return "Có Dây";
  if (connection === "wireless" || connection === "2.4g") return "Không Dây";
  if (connection === "bluetooth") return "Bluetooth";
  return connection ? `${connection.charAt(0).toUpperCase()}${connection.slice(1)}` : connection;
};

const isConnectionSelected = (connections: string[], connection: string): boolean =>
  connection === "wireless" ? connections.includes("wireless") || connections.includes("2.4g") : connections.includes(connection);

const updateConnections = (connections: string[], connection: string, checked: boolean): string[] => {
  const currentConnections = connection === "wireless" ? connections.filter((item) => item !== "wireless" && item !== "2.4g") : connections.filter((item) => item !== connection);
  return checked ? [...currentConnections, connection] : currentConnections;
};

const getAllowedWarranties = (category: ProductCategory, group: string): ProductWarranty[] => {
  const usualChoices: ProductWarranty[] = category === "mouse"
    ? ["three-months", "manufacturer"]
    : ["one-month", "manufacturer", "none"];
  return group === "liquidation" ? ["seven-days", ...usualChoices] : usualChoices;
};

const ProductsPage = () => {
  const router = useRouter();
  const categoryQuery = typeof router.query.category === "string" ? router.query.category : "mouse";
  const groupQuery = typeof router.query.cate === "string" ? router.query.cate : "logig";
  const category = productCategories.some((item) => item.id === categoryQuery) ? categoryQuery as ProductCategory : "mouse";
  const categoryConfig = productCategories.find((item) => item.id === category)!;
  const group = categoryConfig.groups.some((item) => item.id === groupQuery) ? groupQuery : categoryConfig.groups[0]?.id ?? "";
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === category && product.group === group),
    [category, group, products],
  );

  useEffect(() => {
    if (!isProductsApiConfigured()) return;
    setIsLoading(true);
    const loadProducts = async () => {
      try {
        const sheet = await fetchSheetProducts();
        if (sheet.products.length || sheet.initialized) {
          setProducts(sheet.products);
          return;
        }

        await replaceSheetProducts(initialAdminProducts);
        setProducts(initialAdminProducts);
        setNotice(`Đã khởi tạo ${initialAdminProducts.length} sản phẩm vào tab Products.`);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Không thể tải sản phẩm.");
      } finally { setIsLoading(false); }
    };
    void loadProducts();
  }, []);

  const updateDraft = (field: keyof AdminProduct, value: AdminProduct[keyof AdminProduct]) => {
    setEditingProduct((current) => current ? { ...current, [field]: value } : current);
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    setError("");
    try {
      if (isProductsApiConfigured()) await upsertSheetProduct(editingProduct);
      setProducts((current) => {
        const index = current.findIndex((product) => product.id === editingProduct.id);
        return index === -1 ? [...current, editingProduct] : current.map((product) => product.id === editingProduct.id ? editingProduct : product);
      });
      setEditingProduct(null);
      setNotice(isProductsApiConfigured() ? "Đã lưu thay đổi và đồng bộ với Google Sheets." : "Đã lưu tạm trên trang. Cấu hình API để đồng bộ Google Sheets.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu sản phẩm.");
    } finally { setIsSaving(false); }
  };

  const deleteProduct = async () => {
    if (!deletingProduct) return;
    setIsSaving(true);
    setError("");
    try {
      if (isProductsApiConfigured()) await deleteSheetProduct(deletingProduct.id);
      setProducts((current) => current.filter((product) => product.id !== deletingProduct.id));
      setDeletingProduct(null);
      setNotice(isProductsApiConfigured() ? "Đã xóa sản phẩm khỏi Google Sheets." : "Đã xóa tạm trên trang. Cấu hình API để đồng bộ Google Sheets.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa sản phẩm.");
    } finally { setIsSaving(false); }
  };

  const createProduct = () => {
    const id = `${category}-${group}-${Date.now()}`;
    setEditingProduct({ id, category, group, brand: group, name: "", visible: true, connect: [], colors: [], options: [{ name: "", price: 0, warranty: getDefaultWarranty(category, group) }] });
  };

  const updateOption = (index: number, nextOption: AdminProductOption) => {
    if (!editingProduct) return;
    updateDraft("options", editingProduct.options.map((option, optionIndex) => optionIndex === index ? nextOption : option));
  };

  const addOption = () => {
    if (!editingProduct) return;
    updateDraft("options", [...editingProduct.options, { name: "", price: 0, warranty: getDefaultWarranty(editingProduct.category, editingProduct.group) }]);
  };

  const removeOption = (index: number) => {
    if (!editingProduct) return;
    updateDraft("options", editingProduct.options.filter((_, optionIndex) => optionIndex !== index));
  };

  const updateColor = (index: number, nextColor: AdminProductColor) => {
    if (!editingProduct) return;
    updateDraft("colors", editingProduct.colors.map((color, colorIndex) => colorIndex === index ? nextColor : color));
  };

  const addColor = () => {
    if (!editingProduct) return;
    updateDraft("colors", [...editingProduct.colors, { key: "black", image: "" }]);
  };

  const removeColor = (index: number) => {
    if (!editingProduct) return;
    updateDraft("colors", editingProduct.colors.filter((_, colorIndex) => colorIndex !== index));
  };

  const changeVisibility = async (product: AdminProduct, visible: boolean) => {
    const updatedProduct = { ...product, visible };
    setProducts((current) => current.map((item) => item.id === product.id ? updatedProduct : item));
    if (!isProductsApiConfigured()) return;
    try { await upsertSheetProduct(updatedProduct); }
    catch (visibilityError) { setError(visibilityError instanceof Error ? visibilityError.message : "Không thể cập nhật trạng thái."); }
  };

  return (
    <AdminLayout>
      <Head><title>Sản phẩm | TVGEAR Admin</title></Head>
      <Header>
        <div>
          <Title>{getGroupLabel(category, group)}</Title>
          <Subtitle>{visibleProducts.length} sản phẩm</Subtitle>
        </div>
        <HeaderActions>
          <Button type="button" onClick={createProduct}><Plus size={16} />Thêm sản phẩm</Button>
        </HeaderActions>
      </Header>
      {notice && <Notice>{notice}</Notice>}
      {error && <Notice $error>{error}</Notice>}
      <GroupTabs aria-label={`Phân loại ${categoryConfig.label}`}>
        {categoryConfig.groups.map((item) => <GroupTab key={item.id} href={`/admin/products/${category}?cate=${item.id}`} $active={group === item.id}>{item.label}</GroupTab>)}
      </GroupTabs>
      <ProductList>
        {visibleProducts.map((product) => <ProductCard key={product.id}>
          <ProductInfo><ProductImage>{product.colors[0]?.image ? <img src={product.colors[0].image} alt="" /> : product.name.slice(0, 1)}</ProductImage><div><ProductName>{product.name}</ProductName><ProductConnection>{product.connect.map(formatConnection).join(" · ") || "Chưa có kết nối"}</ProductConnection><ProductAvailability><StatusToggle type="button" $compact $active={product.visible} aria-label={`Đổi trạng thái ${product.name}`} title={product.visible ? "Còn Hàng" : "Hết Hàng"} onClick={() => void changeVisibility(product, !product.visible)} /></ProductAvailability></div></ProductInfo>
          <ProductOptions>{product.options.length ? <OptionGroups>{groupOptionsByColor(product.options).map((group) => <OptionList key={group.colorKey || "all-colors"}>{group.options.map((option, optionIndex) => <OptionLine key={`${option.name}-${optionIndex}`}><OptionPrice>{formatOptionPrice(option.price)}</OptionPrice><OptionSummary>{formatOptionColors(option, product.colors)} · {option.name || "Tuỳ chọn"} · {getShortWarrantyLabel(option.warranty ?? getDefaultWarranty(product.category, product.group))}</OptionSummary></OptionLine>)}</OptionList>)}</OptionGroups> : "—"}</ProductOptions>
          <RowActions><IconButton type="button" aria-label={`Mở thao tác ${product.name}`} onClick={() => setOpenActionId((current) => current === product.id ? null : product.id)}><MoreHorizontal size={17} /></IconButton>{openActionId === product.id && <ActionPopover><ActionItem type="button" onClick={() => { setOpenActionId(null); setEditingProduct(product); }}><Pencil size={15} />Sửa</ActionItem><ActionItem type="button" $danger onClick={() => { setOpenActionId(null); setDeletingProduct(product); }}><Trash2 size={15} />Xóa</ActionItem></ActionPopover>}</RowActions>
        </ProductCard>)}
        {!visibleProducts.length && <Empty>{isLoading ? <><RefreshCw size={16} /> Đang tải sản phẩm...</> : "Chưa có sản phẩm trong phân loại này."}</Empty>}
      </ProductList>

      {editingProduct && <Overlay role="presentation"><Modal><ModalHeader><h2>{products.some((product) => product.id === editingProduct.id) ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}</h2><CloseButton type="button" aria-label="Đóng" onClick={() => setEditingProduct(null)}><X size={18} /></CloseButton></ModalHeader>
        <form key={editingProduct.id} onSubmit={saveProduct}><ModalContent>
          <FormSection>
            <SectionHeader><SectionTitle>Thông Tin</SectionTitle><AvailabilityToggle type="button" $active={editingProduct.visible} onClick={() => updateDraft("visible", !editingProduct.visible)}>{editingProduct.visible ? "Còn Hàng" : "Hết Hàng"}</AvailabilityToggle></SectionHeader>
            <FieldGrid>
              <Field $wide><span>Tên sản phẩm</span><input value={editingProduct.name} placeholder="Ví dụ: Logitech G Pro X Superlight" onChange={(event) => updateDraft("name", event.target.value)} required /></Field>
              <Field $wide><span>Kết nối</span><CheckList>{CONNECTION_OPTIONS.map((connection) => <CheckOption key={connection.key}><input type="checkbox" checked={isConnectionSelected(editingProduct.connect, connection.key)} onChange={(event) => updateDraft("connect", updateConnections(editingProduct.connect, connection.key, event.target.checked))} />{connection.label}</CheckOption>)}</CheckList></Field>
            </FieldGrid>
          </FormSection>
          <FormSection>
            <SectionHeader><SectionTitle>Màu & Ảnh</SectionTitle><Button type="button" $secondary onClick={addColor}><Plus size={14} />Thêm</Button></SectionHeader>
            {editingProduct.colors.length ? <RowsList>{editingProduct.colors.map((color, colorIndex) => <ColorRow key={`${color.key}-${colorIndex}`}>
              <Field><span>Màu</span><select value={color.key} onChange={(event) => updateColor(colorIndex, { ...color, key: event.target.value })}>{Object.entries(PRODUCT_COLORS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></Field>
              <Field><span>Tên file ảnh</span><input value={getImageFilename(color.image)} placeholder="orochi-v2-white.webp" onChange={(event) => updateColor(colorIndex, { ...color, image: getImagePath(editingProduct.category, event.target.value) })} required /></Field>
              <Field><span>Xem màu</span><div style={{ height: 42, display: "flex", alignItems: "center" }}><ColorSwatch $color={PRODUCT_COLORS[color.key as keyof typeof PRODUCT_COLORS]?.hex ?? "#e5e7eb"} />{PRODUCT_COLORS[color.key as keyof typeof PRODUCT_COLORS]?.label ?? color.key}</div></Field>
              <IconButton type="button" $danger aria-label="Xóa màu" onClick={() => removeColor(colorIndex)}><Trash2 size={15} /></IconButton>
            </ColorRow>)}</RowsList> : <EmptySection>Chưa có màu nào. Thêm màu đầu tiên để gắn ảnh sản phẩm.</EmptySection>}
          </FormSection>
          <FormSection>
            <SectionHeader><SectionTitle>Phân Loại</SectionTitle><Button type="button" $secondary onClick={addOption}><Plus size={14} />Thêm</Button></SectionHeader>
            <RowsList>{editingProduct.options.map((option, optionIndex) => <OptionRow key={optionIndex}>
              <Field><span>Key màu</span><select value={option.colors?.[0] ?? ""} onChange={(event) => updateOption(optionIndex, { ...option, colors: event.target.value ? [event.target.value] : undefined })}><option value="">Tất cả màu</option>{editingProduct.colors.map((color) => <option key={color.key} value={color.key}>{color.key}</option>)}</select></Field>
              <Field><span>Tình trạng</span><input value={option.name} placeholder="Mới 99%" onChange={(event) => updateOption(optionIndex, { ...option, name: event.target.value })} required /></Field>
              <Field><span>Bảo hành</span><select value={option.warranty ?? getDefaultWarranty(editingProduct.category, editingProduct.group)} onChange={(event) => updateOption(optionIndex, { ...option, warranty: event.target.value as ProductWarranty })}>{getAllowedWarranties(editingProduct.category, editingProduct.group).map((warranty) => <option key={warranty} value={warranty}>{getWarrantyLabel(warranty)}</option>)}</select></Field>
              <Field><span>Giá (nghìn đồng)</span><input type="number" min="0" value={option.price} onChange={(event) => updateOption(optionIndex, { ...option, price: Number(event.target.value) })} required /></Field>
              <IconButton type="button" $danger aria-label="Xóa tuỳ chọn" onClick={() => removeOption(optionIndex)}><Trash2 size={15} /></IconButton>
            </OptionRow>)}</RowsList>
          </FormSection>
        </ModalContent>
        <ModalActions><Button type="button" $secondary onClick={() => setEditingProduct(null)}>Hủy</Button><Button type="submit" disabled={isSaving}>Lưu thay đổi</Button></ModalActions></form>
      </Modal></Overlay>}

      {deletingProduct && <Overlay role="presentation"><Modal><ModalHeader><div><ModalEyebrow>Xóa dữ liệu</ModalEyebrow><h2>Xóa sản phẩm?</h2></div><CloseButton type="button" aria-label="Đóng" onClick={() => setDeletingProduct(null)}><X size={18} /></CloseButton></ModalHeader><ModalContent><DeleteMessage>Bạn có chắc muốn xóa <strong>{deletingProduct.name}</strong>? Thao tác này sẽ xóa cả dòng sản phẩm trên Google Sheets sau khi đã kết nối.</DeleteMessage></ModalContent><ModalActions><Button type="button" $secondary onClick={() => setDeletingProduct(null)}>Hủy</Button><Button type="button" disabled={isSaving} onClick={() => void deleteProduct()}>Xóa sản phẩm</Button></ModalActions></Modal></Overlay>}
    </AdminLayout>
  );
};

export default ProductsPage;
