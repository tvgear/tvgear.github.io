import * as React from "react";
import { BlockAccessories } from "@/views/Accessories/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_accessories.json";

type AccessoriesBrand = "receiver" | "pad" | "feet" | "webcam" | "soundcard" | "speaker" | "controller" | "pen" | "extender" | "cable";

const brands = [
  { key: "receiver", label: "Đầu Thu" },
  { key: "pad", label: "Pad" },
  { key: "feet",   label: "Feet" },
  { key: "webcam",   label: "Webcam" },
  { key: "speaker",   label: "Loa" },
  { key: "soundcard", label: "SoundCard" },
  // { key: "controller",   label: "Tay Cầm" },
  // { key: "pen", label : "Bút Trình Chiếu"  },
  { key: "extender", label : "Đầu Chuyển" },
  { key: "cable", label : "Dây Sạc"  },
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
