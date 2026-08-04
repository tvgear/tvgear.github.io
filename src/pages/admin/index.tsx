import { useEffect } from "react";
import { useRouter } from "next/router";
import { hasAdminSession } from "@/utils/admin-auth";

const AdminIndex = () => {
  const router = useRouter();
  useEffect(() => {
    void router.replace(hasAdminSession() ? "/admin/orders" : "/auth");
  }, [router]);
  return null;
};

export default AdminIndex;
