import * as React from "react";
import {
  ListTab,
  ItemTab,
  TextTab,
  ListProduct,
  ItemProduct,
  ImgItem,
  ColorItem,
  ItemColorSelect,
  ColorProduct,
  NameItem,
  OptionItem,
  ItemOptionSelect,
  ButtonLinkItem,
  TagItem,
  TextTag,
  ViewTag,
  WrapImg,
  BuyItem,
  PriceOptionSelect,
  ImgLogo,
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

  // --- lưu tên option thay vì index ---
  const [selectedOptions, setSelectedOptions] = React.useState<Record<number, string>>({});
  const [selectedColors, setSelectedColors] = React.useState<Record<number, number>>({});

  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const [orderOpen, setOrderOpen] = React.useState(false);
  const [orderData, setOrderData] = React.useState<OrderData | undefined>(undefined);

  const preparedProducts = React.useMemo(() => {
    return products.map((p, index) => ({
      ...p,
      id: p.id ?? Date.now() + index,
    }));
  }, [products]);

  const filtered = React.useMemo(
    () => preparedProducts.filter((p) => p.brand === activeBrand),
    [preparedProducts, activeBrand]
  );

  const isScrollable = (el: HTMLElement | null) => {
    if (!el) return false;
    const style = getComputedStyle(el);
    const oy = style.overflowY;
    return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
  };

  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (isScrollable(listRef.current)) listRef.current!.scrollTop = 0;
      else pageTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [activeBrand]);

  const handleSwitchBrand = (key: B) => {
    setActiveBrand(key);
    setSelectedOptions({});
    setSelectedColors({});
  };

  const openOrderFor = (product: BaseProduct<B>) => {
    const colorIndex = selectedColors[product.id] ?? 0;
    const col = product.colors[colorIndex] ?? product.colors[0];

    const filteredOpts = product.options.filter(
      (opt) => !opt.colors || opt.colors.includes(col?.color ?? "")
    );
    const visibleOptions = filteredOpts.length > 0 ? filteredOpts : product.options;

    const selectedOptionName = selectedOptions[product.id] ?? visibleOptions[0]?.name ?? "";
    const opt = visibleOptions.find((o) => o.name === selectedOptionName) ?? visibleOptions[0];

    const optPrice = opt?.price ?? 0;
    const colorAdd = col?.priceAdd ?? 0;
    const priceVND = (optPrice + colorAdd) * 1000;

    const colorName = col?.labelColor ?? col?.color ?? "";

    setOrderData({
      productName: product.name,
      productColor: colorName,
      productOption: opt?.name ?? "",
      productPriceOption: priceVND,
      image: col?.image,
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
          const colorIndex = selectedColors[product.id] ?? 0;
          const col = product.colors[colorIndex] ?? product.colors[0];
          const disabled = product.id === -1;

         const filteredOpts = product.options.filter(
            (opt) => !opt.colors || opt.colors.includes(col?.color ?? "")
          );
          const visibleOptions = filteredOpts.length > 0 ? filteredOpts : product.options;

          const selectedOptionName = selectedOptions[product.id] ?? visibleOptions[0]?.name ?? "";
          const currentOptIndex = visibleOptions.findIndex((o) => o.name === selectedOptionName);
          const validOptIndex = currentOptIndex >= 0 ? currentOptIndex : 0;

          const optPrice = visibleOptions[validOptIndex]?.price ?? visibleOptions[0]?.price ?? 0;
          const colorAdd = col?.priceAdd ?? 0;
          const displayPrice = (optPrice + colorAdd).toLocaleString("vi-VN");

          return (
            <ItemProduct key={product.id} className={disabled ? "sold" : ""}>
              <WrapImg>
                <ImgItem src={col?.image || ""} loading="lazy" />
              </WrapImg>

              <TagItem>
                {product.tags.map((tag) => (
                  <ViewTag key={`${product.id}-${tag}`}>
                    <TextTag>{tag}</TextTag>
                  </ViewTag>
                ))}
              </TagItem>

              <NameItem>{product.name}</NameItem>

              <ColorItem>
                {product.colors.map((c, i) => (
                  <ItemColorSelect
                    key={`${product.id}-${c.color}`}
                    className={i === colorIndex ? "active" : ""}
                    onClick={() => {
                      setSelectedColors((prev) => ({
                        ...prev,
                        [product.id]: i,
                      }));

                      // reset option nếu option hiện tại không hợp lệ với màu mới
                      const allowedOpts = product.options.filter(
                        (opt) => !opt.colors || opt.colors.includes(c.color)
                      );
                      const currentSelectedName = selectedOptions[product.id];
                      const stillAllowed = allowedOpts.some((ao) => ao.name === currentSelectedName);
                      if (!stillAllowed) {
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [product.id]: allowedOpts[0]?.name ?? product.options[0]?.name ?? "",
                        }));
                      }
                    }}
                  >
                    <ColorProduct style={{ background: c.color }} />
                  </ItemColorSelect>
                ))}
              </ColorItem>

              <OptionItem style={{ marginBottom: 8 }}>
                {visibleOptions.map((o) => (
                  <ItemOptionSelect
                    key={`${product.id}-${o.name}`}
                    className={o.name === selectedOptionName ? "active" : ""}
                    onClick={() =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [product.id]: o.name,
                      }))
                    }
                  >
                    {o.name}
                  </ItemOptionSelect>
                ))}
              </OptionItem>

              <BuyItem>
                <PriceOptionSelect>
                  {displayPrice}.000 <span>đ</span>
                </PriceOptionSelect>
                <ButtonLinkItem as="button" type="button" onClick={() => openOrderFor(product)}>
                  <ImgLogo src="/logo.svg" /> ĐẶT HÀNG
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
