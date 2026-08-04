import accessoriesReceiver from "@/views/Accessories/_accessories-receiver.json";
import accessoriesSpeaker from "@/views/Accessories/_accessories-speaker.json";
import accessoriesWebcam from "@/views/Accessories/_accessories-webcam.json";
import headphoneHyperx from "@/views/Headphone/_headphone-hyperx.json";
import headphoneLiquidation from "@/views/Headphone/_headphone-liquidation.json";
import headphoneLogig from "@/views/Headphone/_headphone-logig.json";
import headphoneLogio from "@/views/Headphone/_headphone-logio.json";
import keyboardLiquidation from "@/views/Keyboard/_keyboard-liquidation.json";
import keyboardLogig from "@/views/Keyboard/_keyboard-logig.json";
import keyboardLogio from "@/views/Keyboard/_keyboard-logio.json";
import keyboardLogiocb from "@/views/Keyboard/_keyboard-logiocb.json";
import keyboardRazer from "@/views/Keyboard/_keyboard-razer.json";
import mouseLiquidation from "@/views/Mouse/_mouse-liquidation.json";
import mouseLogig from "@/views/Mouse/_mouse-logig.json";
import mouseLogio from "@/views/Mouse/_mouse-logio.json";
import mouseRazer from "@/views/Mouse/_mouse-razer.json";

export type ProductCategory = "mouse" | "keyboard" | "headphone" | "accessories";

export type ProductWarranty = "none" | "seven-days" | "one-month" | "three-months" | "manufacturer";

export const WARRANTY_OPTIONS: Array<{ key: ProductWarranty; label: string }> = [
  { key: "none", label: "Không Bảo Hành" },
  { key: "seven-days", label: "Bảo Hành 7 Ngày" },
  { key: "one-month", label: "Bảo Hành 1 Tháng" },
  { key: "three-months", label: "Bảo Hành 3 Tháng" },
  { key: "manufacturer", label: "Bảo Hành Hãng" },
];

export const CONNECTION_OPTIONS = [
  { key: "wired", label: "Có Dây" },
  { key: "wireless", label: "Không Dây" },
  { key: "bluetooth", label: "Bluetooth" },
] as const;

export type AdminProductOption = {
  name: string;
  price: number;
  colors?: string[];
  warranty: ProductWarranty;
};

export type AdminProductColor = {
  key: string;
  image: string;
};

export type AdminProduct = {
  id: string;
  category: ProductCategory;
  group: string;
  brand: string;
  name: string;
  visible: boolean;
  connect: string[];
  colors: AdminProductColor[];
  options: AdminProductOption[];
};

type SourceProductOption = Omit<AdminProductOption, "warranty"> & { warranty?: string };
type SourceProduct = Omit<AdminProduct, "id" | "category" | "group" | "options"> & {
  visible?: boolean;
  warranty?: string;
  connect?: string[];
  options?: SourceProductOption[];
};

export const productCategories: Array<{
  id: ProductCategory;
  label: string;
  groups: Array<{ id: string; label: string }>;
}> = [
  {
    id: "mouse",
    label: "Mouse",
    groups: [
      { id: "logig", label: "LogiGaming" },
      { id: "logio", label: "LogiOffice" },
      { id: "razer", label: "RazerGaming" },
      { id: "liquidation", label: "Liquidation" },
    ],
  },
  {
    id: "keyboard",
    label: "Keyboard",
    groups: [
      { id: "logig", label: "LogiGaming" },
      { id: "logio", label: "LogiOffice" },
      { id: "logiocb", label: "LogiCombo" },
      { id: "razer", label: "RazerGaming" },
      { id: "liquidation", label: "Liquidation" },
    ],
  },
  {
    id: "headphone",
    label: "Headphone",
    groups: [
      { id: "logig", label: "LogiGaming" },
      { id: "logio", label: "LogiOffice" },
      { id: "hyperx", label: "HyperX" },
      { id: "liquidation", label: "Liquidation" },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    groups: [
      { id: "webcam", label: "Webcam" },
      { id: "receiver", label: "Receiver" },
      { id: "speaker", label: "Speaker" },
    ],
  },
];

const createProducts = (category: ProductCategory, group: string, source: SourceProduct[]): AdminProduct[] =>
  source.map((product, index) => ({
    id: `${category}-${group}-${index + 1}`,
    category,
    group,
    brand: group,
    name: product.name,
    visible: product.visible !== false,
    connect: (product.connect ?? []).map((connection) => connection === "2.4g" ? "wireless" : connection),
    colors: product.colors ?? [],
    options: (product.options ?? []).map((option) => ({
      ...option,
      warranty: normalizeWarranty(option.warranty ?? product.warranty, category, group),
    })),
  }));

export const getDefaultWarranty = (category: ProductCategory, group: string): ProductWarranty => {
  if (group === "liquidation") return "seven-days";
  return category === "mouse" ? "three-months" : "one-month";
};

const normalizeWarranty = (value: string | undefined, category: ProductCategory, group: string): ProductWarranty => {
  if (group === "liquidation") return "seven-days";
  const normalized = value?.toLocaleLowerCase() ?? "";
  if (normalized.includes("hãng") || normalized.includes("hang")) return "manufacturer";
  if (category === "mouse") return "three-months";
  if (normalized.includes("không") || normalized.includes("khong") || normalized.includes("no warranty")) return "none";
  if (normalized.includes("1")) return "one-month";
  return getDefaultWarranty(category, group);
};

export const initialAdminProducts: AdminProduct[] = [
  ...createProducts("mouse", "logig", mouseLogig as SourceProduct[]),
  ...createProducts("mouse", "logio", mouseLogio as SourceProduct[]),
  ...createProducts("mouse", "razer", mouseRazer as SourceProduct[]),
  ...createProducts("mouse", "liquidation", mouseLiquidation as SourceProduct[]),
  ...createProducts("keyboard", "logig", keyboardLogig as SourceProduct[]),
  ...createProducts("keyboard", "logio", keyboardLogio as SourceProduct[]),
  ...createProducts("keyboard", "logiocb", keyboardLogiocb as SourceProduct[]),
  ...createProducts("keyboard", "razer", keyboardRazer as SourceProduct[]),
  ...createProducts("keyboard", "liquidation", keyboardLiquidation as SourceProduct[]),
  ...createProducts("headphone", "logig", headphoneLogig as SourceProduct[]),
  ...createProducts("headphone", "logio", headphoneLogio as SourceProduct[]),
  ...createProducts("headphone", "hyperx", headphoneHyperx as SourceProduct[]),
  ...createProducts("headphone", "liquidation", headphoneLiquidation as SourceProduct[]),
  ...createProducts("accessories", "webcam", accessoriesWebcam as SourceProduct[]),
  ...createProducts("accessories", "receiver", accessoriesReceiver as SourceProduct[]),
  ...createProducts("accessories", "speaker", accessoriesSpeaker as SourceProduct[]),
];

export const getGroupLabel = (category: ProductCategory, group: string): string =>
  productCategories.find((item) => item.id === category)?.groups.find((item) => item.id === group)?.label ?? group;
