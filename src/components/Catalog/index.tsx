import * as React from "react";
import ReactDOM from "react-dom";
import { X, AlertCircle, CircleDollarSign, SatelliteDish, GamepadDirectional, LayoutGrid, MessageCircleMore, ExternalLink } from "lucide-react";
import { addToCart, clearCart } from "@/utils/carts";
import { useRouter } from "next/router";
import { copyToClipboard } from "@/utils";
import { BaseProduct, Brand as BrandT } from "@/types/product";
export type { BaseProduct, BrandT as Brand };
import {
  CatalogWrapper,
  Sidebar,
  SidebarTitle,
  SidebarSection,
  SidebarSectionTitle,
  SidebarList,
  SidebarItem,
  CheckboxGroup,
  MainContent,
  MainHeader,
  MobileBar,
  SortSelectWrap,
  SelectSort,
  MobileTabList,
  MobileTab,
  MobileProductCount,
  MobileActionRow,
  MobileActionGroup,
  MobileSeparator,
  MobileActionBtn,
  MobileFilterOverlay,
  MobileFilterContent,
  MobileFilterFooter,
  ApplyBtn,
  ClearFilterBtn,
  ListProduct,
  ItemProduct,
  WrapImg,
  ImgItem,
  NameItem,
  PriceItem,
  CatItem,
  ItemMeta,
  DetailOverlay,
  DetailModal,
  DetailClose,
  DetailImgWrap,
  DetailMainImg,
  DetailContent,
  DetailName,
  DetailWarranty,
  DetailPrice,
  DetailSection,
  DetailLabel,
  DetailValues,
  OptionChip,
  DetailThumb,
  ModalActionRow,
  BuyNowBtn,
  AddCartGhostBtn,
  EmptyState,
  SidebarBrandList,
  ChatBtn,
  ContactOverlay,
  ContactModal,
  ContactClose,
  ContactTitle,
  PasteInstructImg,
  ContactProductSummary,
  ContactProductImg,
  ContactProductInfo,
  ContactProductName,
  ContactProductMeta,
  ContactProductPrice,
  ContactNote,
  ContactActions,
  ContactBtn,
  HighlightAction,
  HighlightName,
} from "./style";

const PRICE_RANGES = [
  { id: "r1", label: "< 500.000", min: 0, max: 500 },
  { id: "r2", label: "500.000 - 1.000.000", min: 500, max: 1000 },
  { id: "r3", label: "1.000.000 - 1.500.000", min: 1000, max: 1500 },
  { id: "r4", label: "> 1.500.000", min: 1500, max: 99999 },
];

const CONNECTIONS = [
  { id: "wired", label: "Có Dây" },
  { id: "wireless", label: "Không Dây" },
  { id: "bluetooth", label: "Bluetooth" },
];

type CatalogProps<T extends string> = {
  title?: string;
  brands: ReadonlyArray<BrandT<T>>;
  products: ReadonlyArray<BaseProduct<T>>;
};

function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return ReactDOM.createPortal(children, document.body);
}

export function Catalog<T extends string = string>({ brands, products }: CatalogProps<T>) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = React.useState<string>(brands[0]?.key || "all");
  const [selectedPrices, setSelectedPrices] = React.useState<string[]>([]);
  const [selectedConns, setSelectedConns] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState("price-asc");
  const [detailProduct, setDetailProduct] = React.useState<BaseProduct | null>(null);
  const [showMobileFilter, setShowMobileFilter] = React.useState(false);
  const tabListRef = React.useRef<HTMLDivElement>(null);

  const pageName = React.useMemo(() => {
    const route = router.pathname;
    if (route === "/mouse") return "Chuột";
    if (route === "/keyboard") return "Bàn Phím";
    if (route === "/headphone") return "Tai Nghe";
    if (route === "/accessories") return "Phụ Kiện";
    return "Sản Phẩm";
  }, [router.pathname]);

  const filtered = React.useMemo(() => {
    let result = [...products];
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    if (selectedConns.length > 0) {
      result = result.filter((p) => {
        if (!p.connect) return false;
        return selectedConns.some(id => p.connect!.includes(id));
      });
    }
    if (selectedPrices.length > 0) {
      result = result.filter((p) => {
        return p.options.some(opt => {
          return selectedPrices.some(rangeId => {
            const range = PRICE_RANGES.find(r => r.id === rangeId);
            if (!range) return false;
            return opt.price >= range.min && opt.price < range.max;
          });
        });
      });
    }
    if (sortBy === "price-asc") {
      result.sort((a, b) => Math.min(...a.options.map(o => o.price)) - Math.min(...b.options.map(o => o.price)));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Math.max(...b.options.map(o => o.price)) - Math.max(...a.options.map(o => o.price)));
    }
    return result;
  }, [products, selectedBrand, selectedPrices, selectedConns, sortBy]);

  const { availablePrices, availableConns } = React.useMemo(() => {
    let baseFiltered = [...products];
    if (selectedBrand !== "all") {
      baseFiltered = baseFiltered.filter((p) => p.brand === selectedBrand);
    }

    let forPrice = baseFiltered;
    if (selectedConns.length > 0) {
      forPrice = forPrice.filter((p) => {
        if (!p.connect) return false;
        return selectedConns.some(id => p.connect!.includes(id));
      });
    }

    let forConn = baseFiltered;
    if (selectedPrices.length > 0) {
      forConn = forConn.filter((p) => {
        return p.options.some(opt => {
          return selectedPrices.some(rangeId => {
            const range = PRICE_RANGES.find(r => r.id === rangeId);
            if (!range) return false;
            return opt.price >= range.min && opt.price < range.max;
          });
        });
      });
    }

    const priceIds = new Set<string>();
    forPrice.forEach((p) => {
      p.options.forEach(opt => {
        PRICE_RANGES.forEach(r => {
          if (opt.price >= r.min && opt.price < r.max) priceIds.add(r.id);
        });
      });
    });

    const connIds = new Set<string>();
    forConn.forEach((p) => {
      if (p.connect) {
        p.connect.forEach(c => connIds.add(c));
      }
    });

    return {
      availablePrices: Array.from(priceIds),
      availableConns: Array.from(connIds),
    };
  }, [products, selectedBrand, selectedPrices, selectedConns]);

  // Smart Filter side effects
  React.useEffect(() => {
    if (selectedBrand !== "all") {
      const firstPrice = availablePrices[0];
      if (availablePrices.length === 1 && firstPrice && !selectedPrices.includes(firstPrice)) {
        setSelectedPrices([firstPrice]);
      }
      const firstConn = availableConns[0];
      if (availableConns.length === 1 && firstConn && !selectedConns.includes(firstConn)) {
        setSelectedConns([firstConn]);
      }
    }
  }, [selectedBrand, availablePrices, availableConns, selectedPrices, selectedConns]);

  const togglePrice = (id: string) => {
    setSelectedPrices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleConn = (id: string) => {
    setSelectedConns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };



  const handleBrandChange = (key: string) => {
    if (selectedBrand !== key) {
      setSelectedBrand(key);
      setSelectedPrices([]);
      setSelectedConns([]);
      setSortBy("price-asc");
      
      // Scroll to top when brand changes
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const isPriceLocked = (id: string) => {
    return selectedBrand !== "all" && availablePrices.length === 1 && availablePrices[0] === id;
  };

  const isConnLocked = (id: string) => {
    return selectedBrand !== "all" && availableConns.length === 1 && availableConns[0] === id;
  };

  const handleBuyNowFromDetail = (product: BaseProduct, currentColor: any, currentOption: any) => {
    clearCart();
    addToCart(product.name, currentColor, currentOption, 1);
    window.dispatchEvent(new Event("cart-updated"));
    handleCloseDetail();
    router.push("/checkout");
  };

  const [isClosingDetail, setIsClosingDetail] = React.useState(false);

  const handleCloseDetail = () => {
    setIsClosingDetail(true);
    setTimeout(() => {
      setDetailProduct(null);
      setIsClosingDetail(false);
    }, 300);
  };

  const handleAddToCartFromDetail = (product: BaseProduct, currentColor: any, currentOption: any, imgRef: React.RefObject<HTMLImageElement>) => {
    const imgElement = imgRef.current;
    const cartIcon = document.getElementById("cart-icon-btn");
    if (imgElement && cartIcon) {
      const rect = imgElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const clone = imgElement.cloneNode(true) as HTMLImageElement;
      Object.assign(clone.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: "10000",
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "none"
      });
      document.body.appendChild(clone);
      clone.getBoundingClientRect();
      Object.assign(clone.style, {
        top: `${cartRect.top + 10}px`,
        left: `${cartRect.left + 10}px`,
        width: "20px",
        height: "20px",
        opacity: "0.2"
      });
      setTimeout(() => document.body.removeChild(clone), 700);
    }
    addToCart(product.name, currentColor, currentOption, 1);
    window.dispatchEvent(new Event("cart-updated"));
    handleCloseDetail();
  };

  return (
    <>
    <CatalogWrapper>
      <Sidebar>
        <SidebarTitle>{pageName}</SidebarTitle>
        <SidebarSection>
          <SidebarSectionTitle>
            {router.pathname === "/accessories" ? <LayoutGrid size={11} strokeWidth={2.5}/> : <GamepadDirectional size={12} strokeWidth={2.5}/>}
            {router.pathname === "/accessories" ? "Phân Loại" : "Thương Hiệu"}
          </SidebarSectionTitle>
          <SidebarBrandList>
            {brands.map(b => (
              <SidebarItem key={b.key} $active={selectedBrand === b.key} onClick={() => handleBrandChange(b.key)}>
                {b.label}
              </SidebarItem>
            ))}
          </SidebarBrandList>
        </SidebarSection>
        <SidebarSection>
          <SidebarSectionTitle><CircleDollarSign size={12} strokeWidth={2.5}/> Giá</SidebarSectionTitle>
          <SidebarList>
            {PRICE_RANGES.map(r => {
              const active = selectedPrices.includes(r.id);
              const available = availablePrices.includes(r.id);
              const locked = isPriceLocked(r.id);
              return (
                <CheckboxGroup key={r.id} className={(!available && !active) ? 'disabled' : ''}>
                  <input 
                    type="checkbox" 
                    checked={active} 
                    disabled={(!available && !active) || locked} 
                    onChange={() => togglePrice(r.id)} 
                  />
                  <span className="custom-checkbox" />
                  {r.label}
                </CheckboxGroup>
              );
            })}
          </SidebarList>
        </SidebarSection>
        {router.pathname !== "/accessories" && (
          <SidebarSection>
            <SidebarSectionTitle><SatelliteDish size={12} strokeWidth={2.5}/> Kết Nối</SidebarSectionTitle>
            <SidebarList>
              {CONNECTIONS.map(c => {
                const active = selectedConns.includes(c.id);
                const available = availableConns.includes(c.id);
                const locked = isConnLocked(c.id);
                return (
                  <CheckboxGroup key={c.id} className={(!available && !active) ? 'disabled' : ''}>
                    <input 
                      type="checkbox" 
                      checked={active} 
                      disabled={(!available && !active) || locked} 
                      onChange={() => toggleConn(c.id)} 
                    />
                    <span className="custom-checkbox" />
                    {c.label}
                  </CheckboxGroup>
                );
              })}
            </SidebarList>
          </SidebarSection>
        )}
      </Sidebar>

      <MainContent>
        <MainHeader>
          <MobileBar>
            <MobileTabList ref={tabListRef}>
              {brands.map(b => (
                <MobileTab
                  key={b.key}
                  $active={selectedBrand === b.key}
                  onClick={(e) => {
                    handleBrandChange(b.key);
                    const el = e.currentTarget;
                    const container = tabListRef.current;
                    if (container) {
                      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
                      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                    }
                  }}
                >
                  {b.label}
                </MobileTab>
              ))}
            </MobileTabList>
            <MobileActionRow>
              <MobileProductCount>{filtered.length} Sản Phẩm</MobileProductCount>
              <MobileActionGroup>
                <MobileActionBtn onClick={() => setShowMobileFilter(true)}>
                  Bộ Lọc {selectedPrices.length + selectedConns.length > 0 && `(${selectedPrices.length + selectedConns.length})`}
                </MobileActionBtn>
                <MobileSeparator />
                <SortSelectWrap style={{ width: 'fit-content' }}>
                  <SelectSort value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="price-asc">Giá Thấp → Cao</option>
                    <option value="price-desc">Giá Cao → Thấp</option>
                  </SelectSort>
                </SortSelectWrap>
              </MobileActionGroup>
            </MobileActionRow>
          </MobileBar>
          <div className="desktop-sort" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <MobileProductCount>{filtered.length} Sản Phẩm</MobileProductCount>
            <SortSelectWrap style={{ width: '145px' }}>
              <SelectSort value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="price-asc">Giá Thấp → Cao</option>
                <option value="price-desc">Giá Cao → Thấp</option>
              </SelectSort>
            </SortSelectWrap>
          </div>
        </MainHeader>

        {filtered.length === 0 ? (
          <EmptyState>
            <AlertCircle size={48} strokeWidth={1} />
            <p>Không tìm thấy sản phẩm phù hợp</p>
            <button onClick={() => { setSelectedBrand("all"); setSelectedPrices([]); setSelectedConns([]); }}>Xóa tất cả bộ lọc</button>
          </EmptyState>
        ) : (
          <ListProduct>
            {filtered.map(p => {
              const minPrice = Math.min(...p.options.map(o => o.price));
              const maxPrice = Math.max(...p.options.map(o => o.price));
              const priceText = minPrice === maxPrice
                ? `${minPrice.toLocaleString("vi-VN")}.000đ`
                : `${minPrice.toLocaleString("vi-VN")}.000đ - ${maxPrice.toLocaleString("vi-VN")}.000đ`;
              return (
                <ItemProduct key={p.id} onClick={() => setDetailProduct(p)}>
                  <WrapImg>
                    <ImgItem src={p.colors[0]?.image} />
                  </WrapImg>
                  <ItemMeta>
                    <NameItem>{p.name}</NameItem>
                    {p.connect && p.connect.length > 0 && (
                      <CatItem>
                        {p.connect.map(c => CONNECTIONS.find(x => x.id === c)?.label || c).join(" & ")}
                      </CatItem>
                    )}
                    <PriceItem>{priceText}</PriceItem>
                  </ItemMeta>
                </ItemProduct>
              );
            })}
          </ListProduct>
        )}
      </MainContent>
    </CatalogWrapper>

    {/* Detail Modal - rendered via portal */}
    {detailProduct && (
      <ModalPortal>
        <ProductDetailModal
          product={detailProduct}
          onClose={handleCloseDetail}
          isClosing={isClosingDetail}
          onAddToCart={handleAddToCartFromDetail}
          onBuyNow={handleBuyNowFromDetail}
        />
      </ModalPortal>
    )}

    {/* Mobile Filter Overlay - rendered via portal */}
    {showMobileFilter && (
      <ModalPortal>
        <MobileFilterOverlay>
          <MobileFilterContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontFamily: 'F_BOLD', fontSize: '2rem' }}>Bộ Lọc</h2>
              <X onClick={() => setShowMobileFilter(false)} />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontFamily: 'F_BOLD', fontSize: '1.4rem', marginBottom: '15px' }}>Giá</h3>
              <SidebarList>
                {PRICE_RANGES.map(r => {
                  const active = selectedPrices.includes(r.id);
                  const available = availablePrices.includes(r.id);
                  return (
                    <CheckboxGroup key={r.id} className={!available && !active ? 'disabled' : ''}>
                      <input type="checkbox" checked={active} disabled={!available && !active} onChange={() => togglePrice(r.id)} />
                      <span className="custom-checkbox" />
                      {r.label}
                    </CheckboxGroup>
                  );
                })}
              </SidebarList>
            </div>

            {router.pathname !== "/accessories" && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontFamily: 'F_BOLD', fontSize: '1.4rem', marginBottom: '15px' }}>Kết nối</h3>
                <SidebarList>
                  {CONNECTIONS.map(c => {
                    const active = selectedConns.includes(c.id);
                    const available = availableConns.includes(c.id);
                    return (
                      <CheckboxGroup key={c.id} className={!available && !active ? 'disabled' : ''}>
                        <input type="checkbox" checked={active} disabled={!available && !active} onChange={() => toggleConn(c.id)} />
                        <span className="custom-checkbox" />
                        {c.label}
                      </CheckboxGroup>
                    );
                  })}
                </SidebarList>
              </div>
            )}
          </MobileFilterContent>
          <MobileFilterFooter>
            <ClearFilterBtn onClick={() => { setSelectedPrices([]); setSelectedConns([]); }}>Huỷ</ClearFilterBtn>
            <ApplyBtn onClick={() => setShowMobileFilter(false)}>Áp Dụng</ApplyBtn>
          </MobileFilterFooter>
        </MobileFilterOverlay>
      </ModalPortal>
    )}
    </>
  );
}

function ProductDetailModal({ product, onClose, isClosing, onAddToCart, onBuyNow }: {
  product: BaseProduct;
  onClose: () => void;
  isClosing: boolean;
  onAddToCart: (p: BaseProduct, c: any, o: any, r: any) => void;
  onBuyNow: (p: BaseProduct, c: any, o: any) => void;
}) {
  const [selectedColorIdx, setSelectedColorIdx] = React.useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = React.useState(0);
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [isClosingContact, setIsClosingContact] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleCloseContact = () => {
    setIsClosingContact(true);
    setTimeout(() => {
      setShowContactModal(false);
      setIsClosingContact(false);
    }, 300);
  };

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];

  // Filter options that have the selected color
  const filteredOptions = React.useMemo(() => {
    if (!currentColor) return product.options;
    return product.options.filter(opt =>
      !opt.colors || opt.colors.length === 0 || opt.colors.includes(currentColor.color)
    );
  }, [currentColor, product.options]);

  // Auto-select first available option when color changes
  React.useEffect(() => {
    if (filteredOptions.length > 0) {
      const currentOpt = product.options[selectedOptIdx];
      if (currentOpt && !filteredOptions.includes(currentOpt)) {
        const first = filteredOptions[0];
        if (first) setSelectedOptIdx(product.options.indexOf(first));
      }
    }
  }, [filteredOptions, selectedOptIdx, product.options]);

  const currentOption = product.options[selectedOptIdx] || product.options[0];
  const price = (currentOption?.price || 0) + (currentColor?.priceAdd || 0);
  const colorLabel = currentColor?.labelColor || currentColor?.color;

  const handleChatClick = () => {
    const text = `${product.name}
${colorLabel}
${currentOption?.name}
${price.toLocaleString("vi-VN")}.000đ

Mình cần tư vấn sản phẩm này.`;
    copyToClipboard(text);
    setShowContactModal(true);
  };

  return (
    <DetailOverlay $isClosing={isClosing} onClick={onClose}>
      <DetailModal $isClosing={isClosing} onClick={e => e.stopPropagation()}>
        <DetailClose onClick={onClose}><X size={20}/></DetailClose>
        <DetailImgWrap>
          <DetailMainImg ref={imgRef} src={currentColor?.image} />
        </DetailImgWrap>
        <DetailContent>
          <DetailName>{product.name}</DetailName>
          {(product.warranty || (product.connect && product.connect.length > 0)) && (
            <DetailWarranty>
              {[
                product.connect && product.connect.length > 0
                  ? product.connect.map(c => CONNECTIONS.find(x => x.id === c)?.label || c).join(" & ")
                  : null,
                product.warranty
              ].filter(Boolean).join(" · ")}
            </DetailWarranty>
          )}
          <DetailPrice>{price.toLocaleString("vi-VN")}.000đ</DetailPrice>
          
          <DetailSection>
            <DetailLabel>Màu</DetailLabel>
            <DetailValues>
              {product.colors.map((c, i) => (
                <DetailThumb key={c.image} $active={selectedColorIdx === i} $color={c.color} onClick={() => setSelectedColorIdx(i)} />
              ))}
            </DetailValues>
          </DetailSection>

          <DetailSection>
            <DetailLabel>Phân loại</DetailLabel>
            <DetailValues>
              {filteredOptions.map((opt) => {
                const realIdx = product.options.indexOf(opt);
                return (
                  <OptionChip key={opt.name} $active={selectedOptIdx === realIdx} onClick={() => setSelectedOptIdx(realIdx)}>
                    {opt.name}
                  </OptionChip>
                );
              })}
            </DetailValues>
          </DetailSection>

          <ModalActionRow>
            <ChatBtn onClick={handleChatClick}>
              <MessageCircleMore size={20} strokeWidth={1.5} />
            </ChatBtn>
            <AddCartGhostBtn onClick={() => onAddToCart(product, currentColor, currentOption, imgRef)}>Thêm Giỏ</AddCartGhostBtn>
            <BuyNowBtn onClick={() => onBuyNow(product, currentColor, currentOption)}>Đặt Mua</BuyNowBtn>
          </ModalActionRow>
        </DetailContent>
      </DetailModal>

      {showContactModal && (
        <ModalPortal>
          <ContactOverlay $isClosing={isClosingContact} onClick={handleCloseContact}>
            <ContactModal $isClosing={isClosingContact} onClick={e => e.stopPropagation()}>
              <ContactClose onClick={handleCloseContact}>
                <X size={18} />
              </ContactClose>
              <ContactTitle>Tư Vấn Sản Phẩm</ContactTitle>
              
              <ContactProductSummary>
                <ContactProductImg src={currentColor?.image} />
                <ContactProductInfo>
                  <ContactProductName>{product.name}</ContactProductName>
                  <ContactProductMeta>{colorLabel} · {currentOption?.name}</ContactProductMeta>
                  <ContactProductPrice>{price.toLocaleString("vi-VN")}.000đ</ContactProductPrice>
                </ContactProductInfo>
              </ContactProductSummary>

              <ContactNote>
                <div>Thông tin sản phẩm này đã được <HighlightAction $type="copy">Sao Chép</HighlightAction></div>
                <PasteInstructImg src="/assets/images/intructs/paste-content.png" />
                <div>Chọn <HighlightAction $type="paste">Dán</HighlightAction> thông tin sản phẩm vào khung chat của ứng dụng và nhấn gửi để <HighlightName>TVGEAR</HighlightName> có thể hỗ trợ tư vấn sản phẩm cho bạn.</div>
              </ContactNote>

              <ContactActions>
                <ContactBtn $type="zalo" href="https://zalo.me/0398637036" target="_blank" rel="noopener noreferrer">
                  <span>Đến Zalo</span>
                  <ExternalLink size={14} style={{ opacity: 0.6 }} />
                </ContactBtn>
                <ContactBtn $type="fb" href="https://m.me/tvgear" target="_blank" rel="noopener noreferrer">
                  <span>Đến Messenger</span>
                  <ExternalLink size={14} style={{ opacity: 0.6 }} />
                </ContactBtn>
              </ContactActions>
            </ContactModal>
          </ContactOverlay>
        </ModalPortal>
      )}
    </DetailOverlay>
  );
}
