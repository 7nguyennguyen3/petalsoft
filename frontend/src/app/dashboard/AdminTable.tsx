import FinanceTable from "./FinanceTable";
import NewOrdersTable from "./NewOrdersTable";
import ProductsTable from "./ProductsTable";

const AdminTable = async () => {
  return (
    <div className="py-40 min-h-screen">
      <FinanceTable />
      <NewOrdersTable />
      <ProductsTable />
    </div>
  );
};

export default AdminTable;
