import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FinanceTable from "./FinanceTable";
import ProductsTable from "./ProductsTable";
import { notFound } from "next/navigation";
import NewOrdersTable from "./NewOrdersTable";

const AdminTable = async () => {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();

  // const adminEmails = process.env.ADMIN_EMAIL!.split(",");

  // if (!user || !adminEmails.includes(user.email!)) notFound();

  return (
    <div className="py-40 min-h-screen">
      <FinanceTable />
      <NewOrdersTable />
      <ProductsTable />
    </div>
  );
};

export default AdminTable;
