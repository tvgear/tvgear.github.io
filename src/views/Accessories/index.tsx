import * as React from "react";
import { BlockAccessories } from "@/views/Accessories/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_accessories.json";

type AccessoriesBrand = "receiver" | "pad" | "feet" | "webcam" | "soundcard" | "speaker" | "controller";

const brands = [
  { key: "receiver", label: "Receiver" },
  { key: "pad", label: "Pad" },
  { key: "feet",   label: "Feet" },
  { key: "webcam",   label: "Webcam" },
  { key: "soundcard", label: "SoundCard" },
  { key: "speaker",   label: "Loa" },
  { key: "controller",   label: "Tay Cầm" },
] as const satisfies ReadonlyArray<BrandT<AccessoriesBrand>>;

const products = productsJson as ReadonlyArray<BaseProduct<AccessoriesBrand>>;


export default function AccessoriesPage() {
  return (
    <BlockAccessories>
      <Catalog<AccessoriesBrand> title="Accessories" brands={brands} products={products} />
    </BlockAccessories>
  );
}
