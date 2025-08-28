import React, { useState } from "react";
import { BlockMouse, TitleProduct } from "@/views/Mouse/style";
import { ColorItem, ColorProduct, ImgItem, ImgTab, ItemColorSelect, ItemOptionSelect, ItemProduct, ItemTab, ListProduct, ListTab, NameItem, OptionItem, PriceItem, TagItem, TextTab, TextTag, ViewTag } from "@/pages";

interface ProductOption {
  name: string;
  price: number;
}

interface ProductColor {
  color: string;
  image: string;
  priceAdd : number;
}

interface Product {
  id: number;
  brand: "logi" | "razer" | "steel" | "pulsar" | "lamzu";
  name: string;
  options: ProductOption[];
  tags: string[];
  colors: ProductColor[];
}

interface Brand {
  key: "logi" | "razer" | "steel"  | "pulsar" | "lamzu";
  label: string;
  image: string;
}

const brands: Brand[] = [
  { key: "logi", label: "Logitech", image: "/assets/images/brands/logitech.svg" },
  { key: "razer", label: "Razer", image: "/assets/images/brands/razer.svg" },
  { key: "steel", label: "SteelSeries", image: "/assets/images/brands/steelseries.svg" },
  { key: "pulsar", label: "Pulsar", image: "/assets/images/brands/pulsar.svg" },
  { key: "lamzu", label: "Lamzu", image: "/assets/images/brands/lamzu.png" },
];

const products: Product[] = [
  {
    id: 1,
    brand: "logi",
    tags: ["wired", "gaming"],
    name: "G102 LightSync",
    colors: [
      { color: "black", image: "/assets/images/mouses/g102-black.webp", priceAdd : 0 },
      { color: "white", image: "/assets/images/mouses/g102-white.webp", priceAdd : 0 },
    ],
    options: [
      { name: "90%", price: 220 },
      { name: "95%", price: 250 },
      { name: "Mod Slient", price: 330 },
    ],
  },
  {
    id: 2,
    brand: "logi",
    name: "G203 LightSync",
    tags: ["wired", "gaming"],
    colors: [
      // { color: "dodgerblue", image: "/assets/images/mouses/g203-blue.webp", priceAdd : 0 },
      { color: "lavender", image: "/assets/images/mouses/g203-lilac.webp", priceAdd : 0 },
    ],
    options: [
      { name: "95%", price: 250 },
      { name: "Mod Slient", price: 330 },
    ],
  },
  {
    id: 3,
    brand: "logi",
    name: "G402 Hyperion Fury",
    tags: ["wired", "gaming"],
    colors: [
      { color: "black", image: "/assets/images/mouses/g402.webp", priceAdd : 0 },
    ],
    options: [
      { name: "97%", price: 400 },
    ],
  },
  {
    id: 3,
    brand: "logi",
    name: "G403 Hero",
    tags: ["wired", "gaming"],
    colors: [
      { color: "black", image: "/assets/images/mouses/g403-hero.png", priceAdd : 0 },
    ],
    options: [
      { name: "90%", price: 400 },
    ],
  },
];

const Mouse: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<Brand["key"]>("logi");
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [selectedColors, setSelectedColors] = useState<Record<number, number>>({});
  const filteredProducts = products.filter((p) => p.brand === activeBrand);
  const activeBrandLabel =
    brands.find((b) => b.key === activeBrand)?.label ?? activeBrand;

  return (
    <BlockMouse>
      <ListTab>
        {brands.map((brand) => (
          <ItemTab
            key={brand.key}
            className={activeBrand === brand.key ? "active" : ""}
            onClick={() => {
              setActiveBrand(brand.key);
              setSelectedOptions({});
              setSelectedColors({});
            }}
          >
            <ImgTab
              src={brand.image}
            />
            <TextTab>{brand.label}</TextTab>
          </ItemTab>
        ))}
      </ListTab>
      <ListProduct>
        <TitleProduct>{activeBrandLabel}</TitleProduct>
        {filteredProducts.map((product) => {
          const selectedOptionIndex = selectedOptions[product.id] ?? 0;
          const selectedColorIndex = selectedColors[product.id] ?? 0;
          const selectedOption = product.options[selectedOptionIndex] || product.options[0];
          const selectedColor = product.colors?.[selectedColorIndex] ?? product.colors?.[0];
          return (
            <ItemProduct key={product.id}>
              <ImgItem
                src={selectedColor?.image || ""}
              />
              {product.colors.length > 1 && (
                <ColorItem>
                  {product.colors.map((item, i) => (
                    <ItemColorSelect
                      key={item.color}
                      className={`${i === selectedColorIndex ? "active" : ""}`}
                      onClick={() =>
                        setSelectedColors((prev) => ({ ...prev, [product.id]: i }))
                      }
                    >
                      <ColorProduct style={{ background: item.color }} />
                    </ItemColorSelect>
                  ))}
                </ColorItem>
              )}
              <TagItem>
                {product.tags.map((tag) => (
                  <ViewTag
                    key={tag}
                  >
                    <TextTag>{tag}</TextTag>
                  </ViewTag>
                ))}
              </TagItem>
              <NameItem>{product.name}</NameItem>
              <OptionItem style={{ marginBottom: 8 }}>
                {product.options.map((opt, i) => (
                  <ItemOptionSelect
                    key={opt.name}
                    className={`${i === selectedOptionIndex ? "active" : ""}`}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [product.id]: i }))
                    }
                  >
                    {opt.name}
                  </ItemOptionSelect>
                ))}
              </OptionItem>
              {selectedOption && selectedColor && (
                <PriceItem>
                  <span>đ</span> {selectedOption.price + selectedColor.priceAdd}.000
                </PriceItem>
              )}
            </ItemProduct>
          );
        })}
      </ListProduct>
    </BlockMouse>
  );
};

export default Mouse;
