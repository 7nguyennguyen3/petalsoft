import MaxWidthWrapper from "@/components/MaxWidthWrapper";
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
