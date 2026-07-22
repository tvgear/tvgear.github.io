export const PRODUCT_COLORS = {
  black: { hex: "#000000", label: "Đen" },
  white: { hex: "#FFFFFF", label: "Trắng" },
  pink: { hex: "#FF637E", label: "Hồng" },
  "light-pink": { hex: "#f8ddd8ff", label: "Hồng Nhạt" },
  blue: { hex: "#B0C4DE", label: "Xanh Dương" },
  red: { hex: "#FF0000", label: "Đỏ" },
} as const;

export type ProductColorKey = keyof typeof PRODUCT_COLORS;

const LEGACY_COLOR_KEYS: Record<string, ProductColorKey> = {
  black: "black",
  white: "white",
  pink: "pink",
  "#ff637e": "pink",
  "rgba(204,61,99)": "pink",
  "rgba(240,224,221)": "light-pink",
  lightsteelblue: "blue",
  red: "red",
};

export function getProductColor(key: string | undefined) {
  return key ? PRODUCT_COLORS[key as ProductColorKey] : undefined;
}

export function resolveProductColorKey(color: string | undefined) {
  if (!color) return undefined;
  return PRODUCT_COLORS[color as ProductColorKey]
    ? (color as ProductColorKey)
    : LEGACY_COLOR_KEYS[color.toLowerCase()];
}
