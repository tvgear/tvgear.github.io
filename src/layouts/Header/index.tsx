import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { ShoppingBag, X, Mouse as MouseIcon, Keyboard as KeyboardIcon, Headphones, LayoutGrid, Trash2, Plus, Minus } from "lucide-react";
import { getCart, getCartTotal, updateQty as updateCartQuantity, removeFromCart } from "@/utils/carts";
import { CartItem } from "@/types/product";


/* ─── Styled Components ─── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideLeft = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

const BlockHeader = styled.header`
  position: relative;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  width: 100%;
`;

const InnerHeader = styled.div`
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  @media screen and (max-width: 991px) {
    height: 56px;
    padding: 0 16px;
  }
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 42.5px;
  cursor: pointer;
  background: #f6f6f6;
  padding: 5px 15px 5px 12.5px;
  border-radius: 100px;
  transition: 0.2s;
  &:hover {
    background: #f0f0f0;
  }
  @media screen and (max-width: 991px) {
    height: 38px;
    padding: 4px 12px 4px 10px;
  }
`;

const WrapLogo = styled.div`
  width: 30px;
  height: 30px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 22px;
    height: 22px;
    filter: invert(1);
    object-fit: contain;
  }
  @media screen and (max-width: 991px) {
    width: 30px;
    height: 30px;
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const LogoText = styled.div`
  font-family: F_BOLD;
  font-size: 2rem;
  color: #000;
  line-height: 1;
  margin-top: -1px;
  @media screen and (max-width: 991px) {
    font-size: 1.7rem;
  }
`;

const NavLeft = styled.nav`
  display: flex;
  gap: 32px;
  @media screen and (max-width: 991px) {
    display: none;
  }
`;

const NavLink = styled.div<{ $active?: boolean }>`
  font-family: F_BOLD;
  font-size: 1.3rem;
  color: ${(p) => (p.$active ? "#000" : "#777")};
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  &:hover {
    color: #000;
  }
`;

const RightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff3b30;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1rem;
  min-width: 18px;
  height: 18px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

const MobileBottomNav = styled.div`
  display: none;
  @media screen and (max-width: 991px) {
    display: flex;
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    height: 64px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 100px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 99990;
    justify-content: space-around;
    align-items: center;
    padding: 0 8px;
  }
`;

const BottomNavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  color: ${(p) => (p.$active ? "#000" : "#999")};
  font-family: ${(p) => (p.$active ? "F_BOLD" : "F_MEDIUM")};
  cursor: pointer;
  transition: 0.2s;
  span {
    font-size: 1rem;
  }
`;

/* ─── Cart Drawer Styles ─── */

const CartOverlay = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99999;
  animation: ${(p) => (p.$isClosing ? fadeOut : fadeIn)} 0.25s ease forwards;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background: #f6f6f6;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: #ececec;
  }
`;

const CartDrawer = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: #fff;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
  animation: ${(p) => (p.$isClosing ? slideOut : slideLeft)} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const CartHeader = styled.div`
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 {
    font-family: F_BOLD;
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const CartImg = styled.img`
  width: 76px;
  height: 76px;
  background: #f6f6f6;
  border-radius: 12px;
  object-fit: contain;
  padding: 6px;
`;

const CartInfo = styled.div`
  flex: 1;
  .name {
    font-family: F_BOLD;
    font-size: 1.35rem;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .opt {
    font-family: F_MEDIUM;
    font-size: 1.15rem;
    color: #777;
    margin-bottom: 6px;
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  input {
    width: 32px;
    text-align: center;
    font-family: F_BOLD;
    font-size: 1.4rem;
    border: none;
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  button {
    width: 22px;
    height: 22px;
    border: 1px solid #eee;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    &:hover {
      border-color: #000;
      color: #000;
    }
  }
`;

const CartActionBtn = styled.button`
  background: #fff1f0;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  cursor: pointer;
  color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    background: #ffccc7;
    color: #cf1322;
  }
`;

const CartItemBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const CartFooter = styled.div`
  padding: 16px 24px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .label {
    font-family: F_MEDIUM;
    color: #000;
    font-size: 1.4rem;
  }
  .value {
    font-family: F_BOLD;
    font-size: 1.8rem;
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  height: 52px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #bbb;
  gap: 16px;
  svg {
    opacity: 0.3;
  }
  span {
    font-family: F_REGULAR;
    font-size: 1.4rem;
  }
`;

/* ─── Cart Drawer Portal ─── */
function CartDrawerPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return ReactDOM.createPortal(children, document.body);
}

/* ─── Component ─── */
const Header: React.FC<{ contentRef: any }> = ({ contentRef }) => {
  const router = useRouter();
  const [showCart, setShowCart] = React.useState(false);
  const [isClosingCart, setIsClosingCart] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

  const handleCloseCart = () => {
    setIsClosingCart(true);
    setTimeout(() => {
      setShowCart(false);
      setIsClosingCart(false);
    }, 240);
  };

  const categories = React.useMemo(() => [
    { name: "Chuột", link: "/mouse", icon: MouseIcon },
    { name: "Bàn Phím", link: "/keyboard", icon: KeyboardIcon },
    { name: "Tai Nghe", link: "/headphone", icon: Headphones },
    { name: "Phụ Kiện", link: "/accessories", icon: LayoutGrid },
  ], []);

  const scrollToTop = () => {
    contentRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const sync = () => setCartItems(getCart());
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const handleQty = (idx: number, delta: number) => {
    const item = cartItems[idx];
    if (!item) return;
    updateCartQuantity(idx, item.quantity + delta);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleRemove = (idx: number) => {
    removeFromCart(idx);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleQtyChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    const item = cartItems[idx];
    if (!item) return;
    updateCartQuantity(idx, val);
    setCartItems(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <>
      <BlockHeader>
        <InnerHeader>
          <LeftHeader>
            <LogoArea onClick={() => router.push("/mouse")}>
              <WrapLogo>
                <img src="/logo.svg" />
              </WrapLogo>
              <LogoText>tvgear</LogoText>
            </LogoArea>
            <NavLeft>
              {categories.map((cat) => (
                <Link key={cat.link} href={cat.link} passHref legacyBehavior>
                  <NavLink $active={router.pathname === cat.link} onClick={scrollToTop}>
                    {cat.name}
                  </NavLink>
                </Link>
              ))}
            </NavLeft>
          </LeftHeader>

          <RightHeader>
            <IconBtn id="cart-icon-btn" onClick={() => setShowCart(true)}>
              <ShoppingBag size={23} />
              {cartItems.length > 0 && (
                <Badge>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Badge>
              )}
            </IconBtn>
          </RightHeader>
        </InnerHeader>
      </BlockHeader>

      {/* Cart Drawer - rendered via portal to body */}
      {showCart && (
        <CartDrawerPortal>
          <CartOverlay $isClosing={isClosingCart} onClick={handleCloseCart} />
          <CartDrawer $isClosing={isClosingCart}>
            <CartHeader>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Giỏ Hàng <Badge style={{ position: 'relative', top: 0, right: 0, transform: 'none' }}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Badge>
              </h2>
              <CloseBtn onClick={handleCloseCart}>
                <X size={20} />
              </CloseBtn>
            </CartHeader>
            <CartList>
              {cartItems.length === 0 ? (
                <EmptyCart>
                  <ShoppingBag size={48} strokeWidth={1.5} />
                  <span>Giỏ hàng đang trống ...</span>
                </EmptyCart>
              ) : (
                cartItems.map((item, idx) => (
                  <CartItemRow key={`${item.productName}-${idx}`}>
                    <CartImg src={item.image} />
                    <CartInfo>
                      <div className="name">{item.productName}</div>
                      <div className="opt">
                        {item.color.labelColor} <span style={{fontSize: '0.6em', opacity: 0.6, position: 'relative', top: '-1.5px', margin: '0 4px'}}>&#8226;</span> {item.option.name}
                      </div>
                      <CartItemBottom>
                        <QtyControl>
                          <button onClick={() => handleQty(idx, -1)}><Minus size={18} /></button>
                          <input type="number" value={item.quantity} min={1} max={99} onChange={(e) => handleQtyChange(idx, e)} />
                          <button onClick={() => handleQty(idx, 1)}><Plus size={18} /></button>
                        </QtyControl>
                        <CartActionBtn onClick={() => handleRemove(idx)}>
                          <Trash2 size={15} />
                        </CartActionBtn>
                      </CartItemBottom>
                    </CartInfo>
                  </CartItemRow>
                ))
              )}
            </CartList>
            {cartItems.length > 0 && (
              <CartFooter>
                <TotalRow>
                  <div className="label">Tổng Cộng</div>
                  <div className="value">{getCartTotal(cartItems).toLocaleString("vi-VN")}.000đ</div>
                </TotalRow>
                <CheckoutBtn onClick={() => { handleCloseCart(); setTimeout(() => router.push("/checkout"), 250); }}>
                  Đặt Hàng
                </CheckoutBtn>
              </CartFooter>
            )}
          </CartDrawer>
        </CartDrawerPortal>
      )}

      <MobileBottomNav>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = router.pathname === cat.link;
          return (
            <Link key={cat.link} href={cat.link} passHref legacyBehavior>
              <BottomNavItem $active={isActive} onClick={scrollToTop}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{cat.name}</span>
              </BottomNavItem>
            </Link>
          );
        })}
      </MobileBottomNav>
    </>
  );
};

export default Header;
