import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { BarChart3, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Package } from "lucide-react";
import { productCategories } from "@/data/admin-products";
import { ADMIN_SESSION_KEY, hasAdminSession } from "@/utils/admin-auth";

type AdminLayoutProps = {
  children: ReactNode;
};

const Shell = styled.main`
  height: 100dvh;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: #f5f6f8;
  color: #181b20;
`;

const Sidebar = styled.aside`
  width: 270px;
  height: 100dvh;
  min-height: 0;
  flex: 0 0 270px;
  overflow-y: auto;
  padding: 25px 14px 18px;
  background: #17191c;
  color: #fff;

  @media (max-width: 820px) {
    width: 78px;
    flex-basis: 78px;
    padding: 20px 10px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px 28px;
  color: #fff;
  font-family: F_BOLD;
  font-size: 1.7rem;

  span {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 9px;
    background: #fff;
    color: #17191c;
  }

  @media (max-width: 820px) {
    padding: 0 0 28px;
    justify-content: center;
    font-size: 0;
  }
`;

const NavLabel = styled.p`
  padding: 0 12px 10px;
  color: #8e959f;
  font-family: F_SEMIBOLD;
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: 820px) { display: none; }
`;

const Nav = styled.nav`
  display: grid;
  gap: 4px;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 12px;
  border-radius: 9px;
  background: ${(props) => (props.$active ? "#fff" : "transparent")};
  color: ${(props) => (props.$active ? "#17191c" : "#b8bdc5")};
  font-family: F_SEMIBOLD;
  font-size: 1.35rem;
  transition: background 0.2s, color 0.2s;

  &:hover { background: ${(props) => (props.$active ? "#fff" : "#292d32")}; color: ${(props) => (props.$active ? "#17191c" : "#fff")}; }

  @media (max-width: 820px) {
    justify-content: center;
    padding: 13px 0;
    font-size: 0;
  }
`;

const NavText = styled.span`
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  svg { transition: transform .2s ease; }

  @media (max-width: 820px) { display: none; }
`;

const ProductGroups = styled.div`
  position: relative;
  display: grid;
  gap: 3px;
  margin: 2px 0 10px 25px;
  padding: 5px 0 5px 16px;

  &::before {
    position: absolute;
    top: 5px;
    bottom: 5px;
    left: 0;
    width: 1px;
    background: #3b4149;
    content: "";
  }

  @media (max-width: 820px) { display: none; }
`;

const GroupLink = styled(Link)<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 31px;
  padding: 7px 10px;
  border-radius: 8px;
  color: ${(props) => (props.$active ? "#fff" : "#9ca3ad")};
  background: ${(props) => (props.$active ? "#343a42" : "transparent")};
  font-family: F_MEDIUM;
  font-size: 1.18rem;

  &::before {
    position: absolute;
    left: -21px;
    width: 9px;
    height: 9px;
    border: 2px solid ${(props) => (props.$active ? "#fff" : "#707985")};
    border-radius: 50%;
    background: ${(props) => (props.$active ? "#17191c" : "#17191c")};
    content: "";
  }

  &:hover { color: #fff; background: #292d32; }
`;

const Logout = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
  padding: 13px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #b8bdc5;
  cursor: pointer;
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
  text-align: left;

  &:hover { background: #292d32; color: #fff; }
  @media (max-width: 820px) { justify-content: center; padding: 13px 0; font-size: 0; }
`;

const Content = styled.section`
  height: 100dvh;
  min-width: 0;
  flex: 1;
  padding: 34px 42px 60px;
  overflow-y: auto;
  @media (max-width: 820px) { padding: 26px 22px 40px; }
`;

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isProducts = router.pathname === "/admin/products" || router.pathname === "/admin/products/[category]";
  const category = typeof router.query.category === "string" ? router.query.category : "mouse";

  useEffect(() => {
    if (!hasAdminSession()) {
      void router.replace("/auth");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const logout = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    void router.replace("/auth");
  };

  if (!isAuthenticated) return null;

  return (
    <Shell>
      <Sidebar>
        <Brand href="/admin/orders"><span><LayoutDashboard size={17} /></span>TVGEAR Admin</Brand>
        <NavLabel>Quản trị</NavLabel>
        <Nav>
          <NavLink href="/admin/products/mouse" $active={isProducts}><Package size={18} /><NavText>Sản Phẩm {isProducts && <ChevronDown size={15} />}</NavText></NavLink>
          {isProducts && <ProductGroups>
            {productCategories.map((item) => (
              <GroupLink key={item.id} href={`/admin/products/${item.id}`} $active={category === item.id}>
                {item.label}
              </GroupLink>
            ))}
          </ProductGroups>}
          <NavLink href="/admin/orders" $active={router.pathname === "/admin/orders"}><ClipboardList size={18} />Đơn Hàng</NavLink>
          <NavLink href="/admin/revenues" $active={router.pathname === "/admin/revenues"}><BarChart3 size={18} />Doanh Thu</NavLink>
        </Nav>
        <Logout type="button" onClick={logout}><LogOut size={18} />Đăng xuất</Logout>
      </Sidebar>
      <Content>{children}</Content>
    </Shell>
  );
};

export default AdminLayout;
