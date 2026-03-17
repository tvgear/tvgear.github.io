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
  LastUpdated,
  CurvedArrowWrap,
} from "./style";
import metadata from "@/metadata.json";

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

  const baseFiltered = React.useMemo(() => {
    let result = [...products];
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    return result;
  }, [products, selectedBrand]);

  const filtered = React.useMemo(() => {
    let result = baseFiltered;
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

    if (sortBy === "price-asc" || sortBy === "price-desc") {
      // Pre-calculate min/max prices for efficient sorting
      const productPrices = new Map<string, { min: number; max: number }>();
      result.forEach(p => {
        const prices = p.options.map(o => o.price);
        productPrices.set(p.name, {
          min: Math.min(...prices),
          max: Math.max(...prices)
        });
      });

      if (sortBy === "price-asc") {
        result.sort((a, b) => productPrices.get(a.name)!.min - productPrices.get(b.name)!.min);
      } else {
        result.sort((a, b) => productPrices.get(b.name)!.max - productPrices.get(a.name)!.max);
      }
    }

    return result;
  }, [baseFiltered, selectedPrices, selectedConns, sortBy]);

  const { availablePrices, availableConns, brandAvailablePrices, brandAvailableConns } = React.useMemo(() => {
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

    const brandPriceIds = new Set<string>();
    const brandConnIds = new Set<string>();
    baseFiltered.forEach((p) => {
      p.options.forEach(opt => {
        PRICE_RANGES.forEach(r => {
          if (opt.price >= r.min && opt.price < r.max) brandPriceIds.add(r.id);
        });
      });
      if (p.connect) {
        p.connect.forEach(c => brandConnIds.add(c));
      }
    });

    return {
      availablePrices: Array.from(priceIds),
      availableConns: Array.from(connIds),
      brandAvailablePrices: Array.from(brandPriceIds),
      brandAvailableConns: Array.from(brandConnIds),
    };
  }, [baseFiltered, selectedPrices, selectedConns]);

  // Smart Filter side effects
  React.useEffect(() => {
    if (selectedBrand !== "all") {
      let allHaveSameBrandPrices = brandAvailablePrices.length > 0;
      if (allHaveSameBrandPrices) {
        for (const p of baseFiltered) {
          const pPrices = new Set<string>();
          p.options.forEach(opt => {
            PRICE_RANGES.forEach(r => {
              if (opt.price >= r.min && opt.price < r.max) pPrices.add(r.id);
            });
          });
          if (pPrices.size !== brandAvailablePrices.length) {
            allHaveSameBrandPrices = false;
            break;
          }
        }
      }
      
      if (allHaveSameBrandPrices) {
        setSelectedPrices(prev => {
          const missing = brandAvailablePrices.filter(c => !prev.includes(c));
          if (missing.length > 0) return [...prev, ...missing];
          return prev;
        });
      }

      let allHaveSameBrandConns = brandAvailableConns.length > 0;
      if (allHaveSameBrandConns) {
        for (const p of baseFiltered) {
          if (!p.connect || p.connect.length !== brandAvailableConns.length) {
            allHaveSameBrandConns = false; break;
          }
        }
      }

      if (allHaveSameBrandConns) {
        setSelectedConns(prev => {
          const missing = brandAvailableConns.filter(c => !prev.includes(c));
          if (missing.length > 0) return [...prev, ...missing];
          return prev;
        });
      }
    }
  }, [selectedBrand, brandAvailablePrices, brandAvailableConns, baseFiltered]);

  const togglePrice = (id: string) => {
    const isAdding = !selectedPrices.includes(id);
    const newPrices = isAdding ? [...selectedPrices, id] : selectedPrices.filter(x => x !== id);
    
    setSelectedPrices(newPrices);
    
    if (newPrices.length > 0) {
      const forConn = baseFiltered.filter((p) => {
        return p.options.some(opt => {
          return newPrices.some(rangeId => {
            const range = PRICE_RANGES.find(r => r.id === rangeId);
            if (!range) return false;
            return opt.price >= range.min && opt.price < range.max;
          });
        });
      });
      const conns = new Set<string>();
      forConn.forEach((p) => {
        if (p.connect) p.connect.forEach(c => conns.add(c));
      });
      
      let allHaveSameConns = conns.size > 0;
      if (allHaveSameConns) {
        for (const p of forConn) {
          if (!p.connect || p.connect.length !== conns.size) {
            allHaveSameConns = false;
            break;
          }
        }
      }
      
      if (allHaveSameConns) {
        const onlyConns = Array.from(conns);
        setSelectedConns(prevConns => {
          const missing = onlyConns.filter(c => !prevConns.includes(c));
          if (missing.length > 0) return [...prevConns, ...missing];
          return prevConns;
        });
      }
    }
  };

  const toggleConn = (id: string) => {
    const isAdding = !selectedConns.includes(id);
    const newConns = isAdding ? [...selectedConns, id] : selectedConns.filter(x => x !== id);
    
    setSelectedConns(newConns);
    
    if (newConns.length > 0) {
      const forPrice = baseFiltered.filter((p) => {
        if (!p.connect) return false;
        return newConns.some(cid => p.connect!.includes(cid));
      });
      const prices = new Set<string>();
      forPrice.forEach((p) => {
        p.options.forEach(opt => {
          PRICE_RANGES.forEach(r => {
            if (opt.price >= r.min && opt.price < r.max) prices.add(r.id);
          });
        });
      });
      
      let allHaveSamePrices = prices.size > 0;
      if (allHaveSamePrices) {
        for (const p of forPrice) {
          const pPrices = new Set<string>();
          p.options.forEach(opt => {
            PRICE_RANGES.forEach(r => {
              if (opt.price >= r.min && opt.price < r.max) pPrices.add(r.id);
            });
          });
          if (pPrices.size !== prices.size) {
            allHaveSamePrices = false;
            break;
          }
        }
      }
      
      if (allHaveSamePrices) {
        const onlyPrices = Array.from(prices);
        setSelectedPrices(prevPrices => {
          const missing = onlyPrices.filter(c => !prevPrices.includes(c));
          if (missing.length > 0) return [...prevPrices, ...missing];
          return prevPrices;
        });
      }
    }
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
    return selectedBrand !== "all" && brandAvailablePrices.length === 1 && brandAvailablePrices[0] === id;
  };

  const isConnLocked = (id: string) => {
    return selectedBrand !== "all" && brandAvailableConns.length === 1 && brandAvailableConns[0] === id;
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
                    <ImgItem 
                      src={p.colors[0]?.image} 
                      loading="lazy" 
                      decoding="async"
                    />
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
        <LastUpdated>Cập Nhật Lần Cuối - {metadata.lastUpdated}</LastUpdated>
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
                  const locked = isPriceLocked(r.id);
                  return (
                    <CheckboxGroup key={r.id} className={!available && !active ? 'disabled' : ''}>
                      <input type="checkbox" checked={active} disabled={(!available && !active) || locked} onChange={() => togglePrice(r.id)} />
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
                    const locked = isConnLocked(c.id);
                    return (
                      <CheckboxGroup key={c.id} className={!available && !active ? 'disabled' : ''}>
                        <input type="checkbox" checked={active} disabled={(!available && !active) || locked} onChange={() => toggleConn(c.id)} />
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
  const price = currentOption?.price || 0;
  const colorLabel = currentColor?.labelColor || currentColor?.color;

  const handleChatClick = () => {
    const text = `${product.name}, ${colorLabel}, ${currentOption?.name}
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
                <CurvedArrowWrap>
                  <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 40 2 C 55 20, 10 30, 30 15 C 50 0, 55 45, 25 52" />
                    <path d="M 33 44 L 25 52 L 32 55" />
                  </svg>
                </CurvedArrowWrap>
              </ContactProductSummary>

              <ContactNote>
                <div>Thông tin sản phẩm đã được <HighlightAction $type="copy">Sao Chép</HighlightAction></div>
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
