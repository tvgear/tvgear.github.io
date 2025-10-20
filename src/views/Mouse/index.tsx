import * as React from "react";
import { BlockMouse } from "@/views/Mouse/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_mouse.json";

type MouseBrand = "logig" | "logio" | "razer" | "steel" | "pulsar" | "lamzu" | "liquidation";

const brands = [
  { key: "logig", label: "Logitech G"  },
  { key: "logio", label: "Logi Văn Phòng"},
  { key: "razer", label: "Razer"  },
  { key: "pulsar", label: "Pulsar"  },
  { key: "lamzu", label: "Lamzu" },
  { key: "liquidation", label: "Hàng Thanh Lý" },
] as const satisfies ReadonlyArray<BrandT<MouseBrand>>;



const products = productsJson as ReadonlyArray<BaseProduct<MouseBrand>>;


export default function MousePage() {
  return (
    <BlockMouse>
      <Catalog<MouseBrand> title="Mouse" brands={brands} products={products} />
    </BlockMouse>
  );
}
