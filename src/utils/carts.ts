import { BaseProduct, CartItem, ProductColor, ProductOption } from "@/types/product";
import { resolveProductColorKey } from "@/utils/colors";

type LegacyCartItem = Omit<CartItem, "color"> & {
  color: {
    key?: string;
    color?: string;
    labelColor?: string;
    image: string;
  };
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("cart");
  if (!s) return [];

  const cart = JSON.parse(s) as LegacyCartItem[];
  let wasMigrated = false;
  const normalizedCart = cart.map((item) => {
    const key = item.color.key ?? resolveProductColorKey(item.color.color);
    if (!key) return item;
    if (item.color.key !== key || item.color.color || item.color.labelColor) wasMigrated = true;
    return { ...item, color: { key, image: item.color.image } };
  }) as CartItem[];

  if (wasMigrated) saveCart(normalizedCart);
  return normalizedCart;
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(
  productName: string,
  color: ProductColor,
  option: ProductOption,
  quantity: number = 1,
  product?: Pick<BaseProduct, "connect" | "warranty">
) {
  const cart = getCart();
  const idx = cart.findIndex(
    (item) =>
      item.productName === productName &&
      item.color.image === color.image &&
      item.option.name === option.name
  );

  if (idx > -1) {
    cart[idx] = {
      ...cart[idx]!,
      quantity: cart[idx]!.quantity + quantity,
      connect: product?.connect ?? cart[idx]!.connect,
      warranty: product?.warranty ?? cart[idx]!.warranty,
    };
  } else {
    cart.push({
      productName,
      color,
      option,
      quantity,
      image: color.image,
      connect: product?.connect,
      warranty: product?.warranty,
    });
  }

  saveCart(cart);
}

export function removeFromCart(index: number) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

export function updateQty(index: number, quantity: number) {
  const cart = getCart();
  if (cart[index]) {
    cart[index]!.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

export function clearCart() {
  localStorage.removeItem("cart");
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.option.price * item.quantity, 0);
}
