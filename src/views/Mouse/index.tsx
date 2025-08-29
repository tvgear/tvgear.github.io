import * as React from "react";
import { BlockMouse } from "@/views/Mouse/style";
import { Catalog, BaseProduct, Brand as BrandT } from "@/components/Catalog";
import productsJson from "./_mouse.json";

type MouseBrand = "logi" | "razer" | "steel" | "pulsar" | "lamzu";

const brands = [
  { key: "logi", label: "Logitech", image: "/assets/images/brands/logitech.svg" },
  { key: "razer", label: "Razer", image: "/assets/images/brands/razer.svg" },
  { key: "steel", label: "SteelSeries", image: "/assets/images/brands/steelseries.svg" },
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
