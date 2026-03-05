export type ProductColor = {
  color: string;
  labelColor?: string;
  image: string;
  priceAdd: number;
};

export type ProductOption = {
  name: string;
  price: number;
  colors?: string[];
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
  tags: string[];
};

export type CartItem = {
  productName: string;
  color: ProductColor;
  option: ProductOption;
  quantity: number;
  image: string;
};
