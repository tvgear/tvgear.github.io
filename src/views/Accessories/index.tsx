import * as React from "react";
import { BlockAccessories } from "@/views/Accessories/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_accessories.json";

type AccessoriesBrand = "receiver" | "webcam" | "speaker" | "controller" | "cable" | "adapter";

const brands = [
  { key: "receiver", label: "Đầu Thu" },
  { key: "webcam",   label: "Webcam" },
  { key: "speaker",   label: "Loa" },
  { key: "controller", label: "Tay Cầm" },
  { key: "cable", label: "Cáp Sạc" },
  { key: "adapter", label: "Đầu Chuyển" },
] as const satisfies ReadonlyArray<BrandT<AccessoriesBrand>>;

const products = (productsJson as any[])
  .filter((p) => p.brand && p.visible !== false)
  .map((p, index) => ({
    ...p,
    id: typeof p.id === "number" ? p.id : Date.now() + index,
  })) as ReadonlyArray<BaseProduct<AccessoriesBrand>>;

export default function AccessoriesPage() {
  return (
    <BlockAccessories>
      <Catalog<AccessoriesBrand> title="Accessories" brands={brands} products={products} />
    </BlockAccessories>
  );
}
