import * as React from "react";
import {
  ListTab, ItemTab, TextTab, ListProduct, ItemProduct, ImgItem, ColorItem,
  ItemColorSelect, ColorProduct, NameItem, OptionItem, ItemOptionSelect,
  ButtonLinkItem, TagItem, TextTag, ViewTag, WrapImg, BuyItem, PriceOptionSelect, ImgLogo
} from "./style";

export type ProductOption = { name: string; price: number };
export type ProductColor = { color: string; image: string; priceAdd: number };
export type Brand<B extends string = string> = { key: B; label: string; };
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
  const [selectedOptions, setSelectedOptions] = React.useState<Record<number, number>>({});
  const [selectedColors, setSelectedColors] = React.useState<Record<number, number>>({});

  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(
    () => products.filter((p) => p.brand === activeBrand),
    [products, activeBrand]
  );

  const isScrollable = (el: HTMLElement | null) => {
    if (!el) return false;
    const style = getComputedStyle(el);
    const oy = style.overflowY;
    return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
  };

  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (isScrollable(listRef.current)) {
        listRef.current!.scrollTop = 0;
      } else {
        pageTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [activeBrand]);

  const handleSwitchBrand = (key: B) => {
    setActiveBrand(key);
    setSelectedOptions({});
    setSelectedColors({});
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
          const selectedOptionIndex = selectedOptions[product.id] ?? 0;
          const selectedColorIndex = selectedColors[product.id] ?? 0;
          const selectedOption = product.options[selectedOptionIndex] || product.options[0];
          const selectedColor = product.colors?.[selectedColorIndex] ?? product.colors?.[0];
          return (
            <ItemProduct key={product.id} className={`${product.id === -1 ? "sold" : ""}`}>
              <WrapImg>
                <ImgItem src={selectedColor?.image || ""} loading="lazy" />
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
                    className={i === selectedColorIndex ? "active" : ""}
                    onClick={() =>
                      setSelectedColors((prev) => ({ ...prev, [product.id]: i }))
                    }
                  >
                    <ColorProduct style={{ background: c.color }} />
                  </ItemColorSelect>
                ))}
              </ColorItem>

              <OptionItem style={{ marginBottom: 8 }}>
                {product.options.map((opt, i) => (
                  <ItemOptionSelect
                    key={`${product.id}-${opt.name}`}
                    className={i === selectedOptionIndex ? "active" : ""}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [product.id]: i }))
                    }
                  >
                    {opt.name}
                  </ItemOptionSelect>
                ))}
              </OptionItem>

              <BuyItem>
                <PriceOptionSelect>
                  {selectedOption && selectedColor && (
                    <>
                      {(selectedOption.price + selectedColor.priceAdd).toLocaleString("vi-VN")}.000 <span>đ</span>
                    </>
                  )}
                </PriceOptionSelect>
                <ButtonLinkItem href="https://m.me/tvgear" target="_blank" rel="noreferrer">
                  <ImgLogo src="/logo.svg" />
                  MUA
                </ButtonLinkItem>
              </BuyItem>
            </ItemProduct>
          );
        })}
      </ListProduct>
    </>
  );
}
