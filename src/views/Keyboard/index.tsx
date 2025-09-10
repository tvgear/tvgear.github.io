import * as React from "react";
import { BlockKeyboard } from "@/views/Keyboard/style";
// import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
// import productsJson from "./_keyboard.json";

// type KeyboardBrand = "logig" | "razer";

// const brands = [
//   { key: "logig", label: "Logitech G", image: "/assets/images/brands/logitech-g.svg" },
//   { key: "razer",   label: "Razer",  image: "/assets/images/brands/razer.svg" },
// ] as const satisfies ReadonlyArray<BrandT<KeyboardBrand>>;

// const products = productsJson as ReadonlyArray<BaseProduct<KeyboardBrand>>;


export default function KeyboardPage() {
  return (
    <BlockKeyboard>
      {/* <Catalog<KeyboardBrand> title="Keyboard" brands={brands} products={products} /> */}
      <p>Trang Web Đang Bảo Trì Để Cập Nhật Sản Phẩm ...
        <br />
        <br />
        Xem List Hàng Trực Tiếp Tại Bài Ghim {`=>>`} <a href="fb.com/tvgear" target="_blank">https://fb.com/tvgear</a>
        <br />
        <br />
        Mua Hàng IB Trực Tiếp {`=>>`} <a href="m.me/tvgear" target="_blank">https://m.me/tvgear</a>
      </p>
    </BlockKeyboard>
  );
}
