import * as React from "react";
import { BlockKeyboard } from "@/views/Keyboard/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import logigProducts from "./_keyboard-logig.json";
import logioProducts from "./_keyboard-logio.json";
import logiocbProducts from "./_keyboard-logiocb.json";
import liquidationProducts from "./_keyboard-liquidation.json";
import razerProducts from "./_keyboard-razer.json";

type KeyboardBrand = "logig" | "logio" | "logiocb" | "razer" | "liquidation";

const brands = [
  { key: "logig", label: "Logitech Gaming"},
  { key: "logio", label: "Logi Văn Phòng"},
  { key: "logiocb", label: "Combo Logi"},
  { key: "razer", label: "Razer Gaming"},
  { key: "liquidation", label: "Thanh Lý"},
] as const satisfies ReadonlyArray<BrandT<KeyboardBrand>>;

const productsJson = [
  ...logigProducts,
  ...logioProducts,
  ...logiocbProducts,
  ...liquidationProducts,
  ...razerProducts,
];

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
