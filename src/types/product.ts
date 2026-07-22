import type { ProductColorKey } from "@/data/product-colors";

export type ProductColor = {
  key: ProductColorKey;
  image: string;
};

export type ProductOption = {
  name: string;
  price: number;
  colors?: ProductColorKey[];
};

export type Brand<B extends string = string> = {
  key: B;
  label: string;
};

export type BaseProduct<B extends string = string> = {
  id: number;
  brand: B;
  name: string;
  collection?: string;
  description?: string;
  guarantee?: string;
  colors: ProductColor[];
  options: ProductOption[];
  images?: string[];
  visible?: boolean;
  connect?: string[];
  warranty?: string;
};

export type CartItem = {
  productName: string;
  color: ProductColor;
  option: ProductOption;
  quantity: number;
  image: string;
  connect?: string[];
  warranty?: string;
};
