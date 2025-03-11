import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CheckoutLogic from "./CheckoutLogic";

const CheckOutPage = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <div>
      <CheckoutLogic user={user} />
    </div>
  );
};

export default CheckOutPage;
