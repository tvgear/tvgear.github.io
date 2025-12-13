import * as React from "react";
import {
  ListTab,
  ItemTab,
  TextTab,
  ListProduct,
  ItemProduct,
  ImgItem,
  TagItem,
  TextTag,
  ViewTag,
  WrapImg,
  BuyItem,
  PriceOptionSelect,
  ImgLogo,
  TagMod,
  ButtonLinkItem,
  NameItem,
} from "./style";
import OrderProduct, { OrderData } from "./OrderProduct";

export type ProductOption = {
  name: string;
  price: number;
  colors?: string[];
};

export type ProductColor = {
  color: string;
  labelColor?: string;
  image: string;
  priceAdd: number;
};

export type Brand<B extends string = string> = { key: B; label: string };

export type BaseProduct<B extends string = string> = {
  id: number;
  brand: B;
  name: string;
  tags: string[];
  colors: ProductColor[];
  options: ProductOption[];
};

type CatalogProps<B extends string> = {
  title?: string;
  brands: ReadonlyArray<Brand<B>>;
  products: ReadonlyArray<BaseProduct<B>>;
};

export function Catalog<B extends string>({ brands, products }: CatalogProps<B>) {
  const [activeBrand, setActiveBrand] = React.useState<B>(brands[0]?.key as B);
  const [orderOpen, setOrderOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState<OrderData | undefined>(undefined);

  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Tạo id cho sản phẩm
  const preparedProducts = React.useMemo(() => {
    return products.map((p, index) => ({ ...p, id: p.id ?? Date.now() + index }));
  }, [products]);

  const filtered = React.useMemo(
    () => preparedProducts.filter((p) => p.brand === activeBrand),
    [preparedProducts, activeBrand]
  );

  // Chuyển tab brand
  const handleSwitchBrand = (key: B) => {
    setActiveBrand(key);
    if (pageTopRef.current) {
    pageTopRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  };

  // Mở modal đặt hàng
  const openOrderFor = (product: BaseProduct<B>) => {
    setOrderData({
      productName: product.name,
      colors: product.colors,
      options: product.options,
      selectedColorIndex: 0,
      selectedOptionName: product.options[0]?.name ?? "",
      image: product.colors[0]?.image,
    });
    setOrderOpen(true);
  };

  return (
    <>
      <div ref={pageTopRef} />
     
      <ListTab>
        {brands.map((brand) => (
          <ItemTab
            key={brand.key}
            className={activeBrand === brand.key ? "active" : ""}
            onClick={() => handleSwitchBrand(brand.key)}
          >
            <TextTab>{brand.label}</TextTab>
          </ItemTab>
        ))}
      </ListTab>

      <ListProduct ref={listRef}>
        {filtered.map((product) => {
          const col = product.colors[0];
          const colorAdd = col?.priceAdd ?? 0;

        
          const prices = product.options.map((o) => o.price + colorAdd);

          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

        
          const displayPrice =
            minPrice === maxPrice
              ? `${minPrice.toLocaleString("vi-VN")}.000`
              : `${minPrice.toLocaleString("vi-VN")}.000 - ${maxPrice.toLocaleString("vi-VN")}.000`;

          return (
            <ItemProduct key={product.id}>
              <WrapImg>
                <ImgItem src={col?.image || ""} loading="lazy" />
                {product.name.includes("Mod Slient") && <TagMod>SLIENT</TagMod>}
              </WrapImg>

              <TagItem>
                {product.tags.map((tag) => (
                  <ViewTag key={`${product.id}-${tag}`}>
                    <TextTag>{tag}</TextTag>
                  </ViewTag>
                ))}
              </TagItem>

              <NameItem>{product.name}</NameItem>
            
              <BuyItem>
                <PriceOptionSelect>{displayPrice} đ</PriceOptionSelect>
                <ButtonLinkItem
                  as="button"
                  type="button"
                  onClick={() => openOrderFor(product)}
                >
                  <ImgLogo src="/logo.svg" />ĐẶT HÀNG
                </ButtonLinkItem>
              </BuyItem>
            </ItemProduct>
          );
        })}
      </ListProduct>
      <OrderProduct
        open={orderOpen}
        data={orderData}
        onClose={() => setOrderOpen(false)}
        onSuccess={() => setOrderData(undefined)}
      />
    </>
  );
}
