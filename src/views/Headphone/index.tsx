import * as React from "react";
import { BlockHeadphone } from "@/views/Headphone/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_headphone.json";

type HeadphoneBrand = "logig" | "logio" | "razer" | "hyperx" | "steelseries";

const brands = [
  { key: "logig", label: "Logitech G"},
  { key: "logio", label: "Logi Văn Phòng"},
  { key: "razer",   label: "Razer" },
  { key: "hyperx",   label: "Hyper X" },
  { key: "steelseries",   label: "Steel Series" },
] as const satisfies ReadonlyArray<BrandT<HeadphoneBrand>>;

const products = productsJson as ReadonlyArray<BaseProduct<HeadphoneBrand>>;


export default function HeadphonePage() {
  return (
    <BlockHeadphone>
      <Catalog<HeadphoneBrand> title="Headphone" brands={brands} products={products} />
    </BlockHeadphone>
  );
}
