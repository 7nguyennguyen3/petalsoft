"use client"; // Mark this component as a Client Component

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CustomerOrderTable from "./CustomerOrderTable";
import { useAuthStore } from "../_store/useAuthStore";

const CustomerOrderPage = () => {
  const { authenticated, userId } = useAuthStore();

  return (
    <div className="grainy-light">
      <MaxWidthWrapper>
        {authenticated && userId ? (
          <div className="min-h-screen flex flex-col gap-5 pt-40 mx-auto">
            <h1 className="text-3xl gra-p-b font-semibold">My Orders</h1>
            <CustomerOrderTable userId={userId} />
          </div>
        ) : (
          <div className="min-h-screen flex flex-col gap-5 pt-40 mx-auto">
            <h1 className="text-3xl gra-p-b font-semibold">
              Please login to see your orders.
            </h1>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default CustomerOrderPage;
