import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { ShoppingBag, X, Mouse as MouseIcon, Keyboard as KeyboardIcon, Headphones, LayoutGrid } from "lucide-react";
import { getCart, getCartTotal, updateQty as updateCartQuantity, removeFromCart } from "@/utils/carts";
import { CartItem } from "@/types/product";


/* ─── Styled Components ─── */

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
  background: #f0f0f0;
  padding: 5px 15px 5px 12.5px;
  border-radius: 100px;
  transition: 0.2s;
  &:hover {
    background: #e8e8e8;
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

const CartOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99999;
`;

const CartDrawer = styled.div`
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
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const CartHeader = styled.div`
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 {
    font-family: F_BOLD;
    font-size: 2rem;
  }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const CartImg = styled.img`
  width: 64px;
  height: 64px;
  background: #f6f6f6;
  border-radius: 12px;
  object-fit: contain;
  padding: 4px;
`;

const CartInfo = styled.div`
  flex: 1;
  .name {
    font-family: F_BOLD;
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
  .opt {
    font-family: F_MEDIUM;
    font-size: 1.2rem;
    color: #777;
    margin-bottom: 8px;
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span {
    font-family: F_BOLD;
    font-size: 1.4rem;
  }
  button {
    width: 24px;
    height: 24px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
  }
`;

const CartFooter = styled.div`
  padding: 32px;
  border-top: 1px solid #f0f0f0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  .label {
    font-family: F_MEDIUM;
    color: #777;
    font-size: 1.4rem;
  }
  .value {
    font-family: F_BOLD;
    font-size: 2rem;
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  height: 56px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 100px;
  font-family: F_BOLD;
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
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
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

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

  return (
    <>
      <BlockHeader>
        <InnerHeader>
          <LeftHeader>
            <LogoArea onClick={() => { scrollToTop(); }}>
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
          <CartOverlay onClick={() => setShowCart(false)} />
          <CartDrawer>
            <CartHeader>
              <h2>Giỏ hàng của bạn</h2>
              <X onClick={() => setShowCart(false)} style={{ cursor: 'pointer' }} />
            </CartHeader>
            <CartList>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#bbb', marginTop: '40px' }}>
                  Trống rỗng...
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <CartItemRow key={`${item.productName}-${idx}`}>
                    <CartImg src={item.image} />
                    <CartInfo>
                      <div className="name">{item.productName}</div>
                      <div className="opt">
                        {item.option.name} / {item.color.labelColor}
                      </div>
                      <QtyControl>
                        <button onClick={() => handleQty(idx, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQty(idx, 1)}>+</button>
                        <IconBtn onClick={() => handleRemove(idx)} style={{ marginLeft: 'auto', padding: '4px' }}>
                          <X size={14} />
                        </IconBtn>
                      </QtyControl>
                    </CartInfo>
                  </CartItemRow>
                ))
              )}
            </CartList>
            {cartItems.length > 0 && (
              <CartFooter>
                <TotalRow>
                  <div className="label">Tổng cộng</div>
                  <div className="value">{getCartTotal(cartItems).toLocaleString("vi-VN")}.000đ</div>
                </TotalRow>
                <CheckoutBtn onClick={() => { setShowCart(false); router.push("/checkout"); }}>
                  Thanh Toán Ngay
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
