import { CartItem, ProductColor, ProductOption } from "@/types/product";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("cart");
  return s ? JSON.parse(s) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(
  productName: string,
  color: ProductColor,
  option: ProductOption,
  quantity: number = 1
) {
  const cart = getCart();
  const idx = cart.findIndex(
    (item) =>
      item.productName === productName &&
      item.color.image === color.image &&
      item.option.name === option.name
  );

  if (idx > -1) {
    cart[idx]!.quantity += quantity;
  } else {
    cart.push({ productName, color, option, quantity, image: color.image });
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
  return items.reduce((sum, item) => sum + (item.option.price + (item.color.priceAdd || 0)) * item.quantity, 0);
}
