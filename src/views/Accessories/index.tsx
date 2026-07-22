import * as React from "react";
import { BlockAccessories } from "@/views/Accessories/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import receiverProducts from "./_accessories-receiver.json";
import speakerProducts from "./_accessories-speaker.json";
import webcamProducts from "./_accessories-webcam.json";

type AccessoriesBrand = "receiver" | "webcam" | "speaker";

const brands = [
  { key: "receiver", label: "Đầu Thu" },
  { key: "speaker",   label: "Loa" },
  { key: "webcam", label: "Webcam" },
] as const satisfies ReadonlyArray<BrandT<AccessoriesBrand>>;

const productsJson = [
  ...receiverProducts,
  ...speakerProducts,
  ...webcamProducts,
];

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
