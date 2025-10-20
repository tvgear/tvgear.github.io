import * as React from "react";
import { BlockKeyboard } from "@/views/Keyboard/style";
// import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
// import productsJson from "./_keyboard.json";

// type KeyboardBrand = "logig" | "razer";

// const brands = [
//   { key: "logig", label: "Logitech G"},
//   { key: "razer",   label: "Razer" },
// ] as const satisfies ReadonlyArray<BrandT<KeyboardBrand>>;

// const products = productsJson as ReadonlyArray<BaseProduct<KeyboardBrand>>;


export default function KeyboardPage() {
  return (
    <BlockKeyboard>
      {/* <Catalog<KeyboardBrand> title="Keyboard" brands={brands} products={products} /> */}
    </BlockKeyboard>
  );
}
