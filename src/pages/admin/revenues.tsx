import Head from "next/head";
import styled from "styled-components";
import { BarChart3 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const Breadcrumb = styled.p`color: #858d98; font-size: 1.2rem;`;
const Title = styled.h1`margin-top: 9px; font-family: F_BOLD; font-size: clamp(2.7rem, 4vw, 3.5rem); letter-spacing: -0.045em;`;
const Card = styled.section`
  display: grid;
  min-height: 280px;
  place-items: center;
  margin-top: 28px;
  padding: 35px;
  border: 1px dashed #cbd0d7;
  border-radius: 16px;
  background: #fff;
  color: #737c88;
  text-align: center;
  h2 { margin-top: 15px; color: #252a30; font-family: F_BOLD; font-size: 1.9rem; }
  p { margin-top: 8px; font-size: 1.35rem; }
`;
const Icon = styled.div`display: grid; width: 54px; height: 54px; place-items: center; border-radius: 16px; background: #eff1f3; color: #505862; margin: 0 auto;`;

const RevenuesPage = () => <AdminLayout><Head><title>Doanh thu | TVGEAR Admin</title></Head><Breadcrumb>Quản trị / Doanh thu</Breadcrumb><Title>Doanh Thu</Title><Card><div><Icon><BarChart3 size={24} /></Icon><h2>Nội dung tạm thời</h2><p>Báo cáo doanh thu sẽ được triển khai ở giai đoạn tiếp theo.</p></div></Card></AdminLayout>;

export default RevenuesPage;
