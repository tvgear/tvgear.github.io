import * as React from "react";
import { BlockKeyboard } from "@/views/Keyboard/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_keyboard.json";

type KeyboardBrand = "logig" | "logio" | "logiocb" | "liquidation";

const brands = [
  { key: "logig", label: "Logitech Gaming"},
  { key: "logio", label: "Logi Văn Phòng"},
  { key: "logiocb", label: "Combo Logi"},
  { key: "liquidation", label: "Hàng Thanh Lý"},
] as const satisfies ReadonlyArray<BrandT<KeyboardBrand>>;

const products = (productsJson as any[])
  .filter((p) => p.brand && p.visible !== false)
  .map((p, index) => ({
    ...p,
    id: typeof p.id === "number" ? p.id : Date.now() + index,
  })) as ReadonlyArray<BaseProduct<KeyboardBrand>>;


export default function KeyboardPage() {
  return (
    <BlockKeyboard>
      <Catalog<KeyboardBrand> title="Keyboard" brands={brands} products={products} />
    </BlockKeyboard>
  );
}
