import * as React from "react";
import { BlockKeyboard } from "@/views/Keyboard/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_keyboard.json";

type KeyboardBrand = "logig" | "razer";

const brands = [
  { key: "logig", label: "Logitech G", image: "/assets/images/brands/logitech-g.svg" },
  { key: "razer",   label: "Razer",  image: "/assets/images/brands/razer.svg" },
] as const satisfies ReadonlyArray<BrandT<KeyboardBrand>>;

const products = productsJson as ReadonlyArray<BaseProduct<KeyboardBrand>>;


export default function KeyboardPage() {
  return (
    <BlockKeyboard>
      {/* <Catalog<KeyboardBrand> title="Keyboard" brands={brands} products={products} /> */}
      <p>Sản Phẩm Đang Cập Nhật ...
        <br />
        <br />
        Xem List Hàng Trực Tiếp Tại Bài Ghim {`=>>`} <a href="https:/fb.com/tvgear" target="_blank">https://fb.com/tvgear</a>
      </p>
    </BlockKeyboard>
  );
}
