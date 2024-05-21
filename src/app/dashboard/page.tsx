import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useFetchProduct } from "@/lib/hook";
import { useQuery } from "@tanstack/react-query";
import AdminTable from "./AdminTable";

const AdminDashboardPage = () => {
  return (
    <div className="grainy-light">
      <MaxWidthWrapper>
        <AdminTable />
      </MaxWidthWrapper>
    </div>
  );
};

export default AdminDashboardPage;
