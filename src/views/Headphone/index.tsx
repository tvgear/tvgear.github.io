import * as React from "react";
import { BlockHeadphone } from "@/views/Headphone/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import logigProducts from "./_headphone-logig.json";
import logioProducts from "./_headphone-logio.json";
import liquidationProducts from "./_headphone-liquidation.json";
import hyperxProducts from "./_headphone-hyperx.json";

type HeadphoneBrand = "logig" | "logio" | "liquidation";

const brands = [
  { key: "logig", label: "Logitech Gaming"},
  { key: "logio", label: "Logi Văn Phòng"},
] as const satisfies ReadonlyArray<BrandT<HeadphoneBrand>>;

const productsJson = [
  ...logigProducts,
  ...logioProducts,
  ...liquidationProducts,
  ...hyperxProducts,
];

const products = (productsJson as any[])
  .filter((p) => p.brand && p.visible !== false)
  .map((p, index) => ({
    ...p,
    id: typeof p.id === "number" ? p.id : Date.now() + index,
  })) as ReadonlyArray<BaseProduct<HeadphoneBrand>>;


export default function HeadphonePage() {
  return (
    <BlockHeadphone>
      <Catalog<HeadphoneBrand> title="Headphone" brands={brands} products={products} />
    </BlockHeadphone>
  );
}
