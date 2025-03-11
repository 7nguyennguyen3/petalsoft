import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CustomerOrderTable from "./CustomerOrderTable";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const CustomerOrderPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="grainy-light">
      <MaxWidthWrapper>
        {user ? (
          <div className="min-h-screen flex flex-col gap-5 pt-40 mx-auto">
            <h1 className="text-3xl gra-p-b font-semibold">My Order</h1>
            <CustomerOrderTable userId={user.id} />
          </div>
        ) : (
          <div className="min-h-screen flex flex-col gap-5 pt-40 mx-auto">
            <h1 className="text-3xl gra-p-b font-semibold">
              Please login to see your order.
            </h1>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default CustomerOrderPage;
