import * as React from "react";
import { BlockMouse } from "@/views/Mouse/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_mouse.json";

type MouseBrand = "logig" | "logio" | "razer" | "steel" | "pulsar" | "lamzu";

const brands = [
  { key: "logig", label: "Logi G", image: "/assets/images/brands/logitech-g.svg" },
  { key: "logio", label: "Logi Office", image: "/assets/images/brands/logi-office.png" },
  { key: "razer", label: "Razer", image: "/assets/images/brands/razer.svg" },
  { key: "pulsar", label: "Pulsar", image: "/assets/images/brands/pulsar.svg" },
  { key: "lamzu", label: "Lamzu", image: "/assets/images/brands/lamzu.png" },
] as const satisfies ReadonlyArray<BrandT<MouseBrand>>;



const products = productsJson as ReadonlyArray<BaseProduct<MouseBrand>>;


export default function MousePage() {
  return (
    <BlockMouse>
      <Catalog<MouseBrand> title="Mouse" brands={brands} products={products} />
    </BlockMouse>
  );
}
