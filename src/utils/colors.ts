export const COLOR_PALETTE = [
  { color: "black", label: "Đen" },
  { color: "white", label: "Trắng" },
  { color: "#ff637e", label: "Hồng" },
  { color: "blue", label: "Xanh Dương" },
  { color: "red", label: "Đỏ" },
  { color: "gray", label: "Xám" },
  { color: "lightslategray", label: "Xám Nhạt" },
  { color: "yellow", label: "Vàng" },
  { color: "purple", label: "Tím" },
  { color: "green", label: "Xanh Lá" },
  { color: "orange", label: "Cam" },
  { color: "cyan", label: "Cyan" },
  { color: "brown", label: "Nâu" },
  { color: "silver", label: "Bạc" },
  { color: "gold", label: "Vàng Gold" },
  { color: "lightsteelblue", label: "Tím" },
  { color: "rgba(142,229,221)", label: "Xanh" },
];

export function findColorDef(colorCode: string) {
  return COLOR_PALETTE.find((c) => c.color === colorCode);
}
