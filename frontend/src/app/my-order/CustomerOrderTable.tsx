"use client";
import { productIdTitle } from "@/components/data";
import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { LineItem, Order, ShippingAddress } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type ProductLookup = {
  [key: number]: string;
};

const productLookup = productIdTitle.reduce((acc, product) => {
  acc[product.id] = product.title;
  return acc;
}, {} as ProductLookup);

const CustomerOrderTable = ({ userId }: { userId: string | undefined }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 10;

  const { data: orders, isLoading: isLoadingOrder } = useQuery<Order[]>({
    queryKey: ["customer-order"],
    queryFn: async () => {
      const { data } = await axios.get(`api/customer-order?userId=${userId}`);
      return data;
    },
    staleTime: 100 * 60 * 30,
    retry: 2,
  });

  const { data: lineItems } = useQuery<LineItem[]>({
    queryKey: ["order-detail", expandedOrderId],
    queryFn: async () => {
      const { data } = await axios.put("/api/customer-order", {
        orderId: expandedOrderId,
      });
      return data;
    },
    staleTime: 100 * 60 * 30,
    retry: 2,
    enabled: !!expandedOrderId,
  });

  const { data: customerShippingAddress, error } = useQuery<ShippingAddress>({
    queryKey: ["shippingAddress", shippingAddressId],
    queryFn: async () => {
      if (shippingAddressId) {
        const { data } = await axios.patch("/api/customer-order", {
          shippingAddressId,
        });
        return data;
      }
      return null;
    },
    staleTime: 100 * 60 * 30, // 30
    retry: 2,
    enabled: !!shippingAddressId,
  });

  const nextPage = () => {
    setCurrentPage((prevPageNumber) => prevPageNumber + 1);
  };

  const previousPage = () => {
    setCurrentPage((prevPageNumber) => prevPageNumber - 1);
  };

  const startIndex = currentPage * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;

  const handleRowClick = (orderId: string, addressId: string | null) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setShippingAddressId(null);
    } else {
      setExpandedOrderId(orderId);
      setShippingAddressId(addressId);
    }
  };
  return isLoadingOrder ? (
    <Loading />
  ) : (
    <div className="flex flex-col  min-h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Order ID</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.slice(startIndex, endIndex).map((order) => (
              <>
                {order.shippingAddressId && (
                  <TableRow
                    key={order.id}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      handleRowClick(order.id, order.shippingAddressId);
                    }}
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      {order.status === "awaiting_shipment"
                        ? "Awaiting Shipment"
                        : order.status === "shipped"
                        ? "Shipped"
                        : "Delivered"}
                    </TableCell>
                    <TableCell>
                      <ChevronsUpDown />
                    </TableCell>
                  </TableRow>
                )}
                {expandedOrderId === order.id && (
                  <TableRow>
                    <TableCell colSpan={1}>
                      <div>
                        <div className="xs:inline lg:hidden">
                          {customerShippingAddress && (
                            <div className="flex flex-col gap-2 text-[14px] font-medium">
                              <p className="text-lg font-bold">
                                Shipping Address
                              </p>
                              <p className="">
                                {" "}
                                {customerShippingAddress.name}
                              </p>
                              <p> {customerShippingAddress.street}</p>
                              <p> {customerShippingAddress.city}</p>
                              <div className="flex items-center gap-2 mb-14">
                                <p> {customerShippingAddress.state}</p>
                                <p> {customerShippingAddress.postalCode}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          {lineItems?.map((lineItem) => (
                            <div
                              key={lineItem.productId}
                              className="grid grid-cols-[5fr_2fr_3fr] max-w-[340px]"
                            >
                              <p className="my-1 font-semibold">
                                {productLookup[lineItem.productId]}
                              </p>
                              <p className="text-right my-1">
                                x{lineItem.quantity}
                              </p>
                              <p className="text-right my-1">
                                ${lineItem.price * lineItem.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                        {lineItems && (
                          <>
                            <div className="w-full max-w-[340px]  h-[0.25px] bg-zinc-600 my-2" />
                            <div className="flex items-center justify-between w-[150px] ml-[190px]">
                              <p>Subtotal</p>
                              <p>
                                {lineItems
                                  .reduce(
                                    (total, item) =>
                                      total + item.price * item.quantity,
                                    0
                                  )
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between w-[150px] ml-[190px]">
                              <p>Tax</p>
                              <p>
                                {lineItems
                                  .reduce(
                                    (total, item) =>
                                      total +
                                      item.price * item.quantity * 0.0975,
                                    0
                                  )
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div className="w-full max-w-[150px] ml-[190px] h-[0.25px] bg-zinc-600 my-1" />
                            <div
                              className="flex items-center justify-between w-[150px] ml-[190px] 
                        text-lg font-semibold"
                            >
                              <p>Total</p>
                              <p>
                                {lineItems
                                  .reduce(
                                    (total, item) =>
                                      total +
                                      item.price * item.quantity * 1.0975,
                                    0
                                  )
                                  .toFixed(2)}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      className="xs:hidden lg:inline col-span-3"
                    >
                      {customerShippingAddress && (
                        <div className="flex flex-col gap-2 text-[14px] font-medium w-[200px]">
                          <p className="text-lg font-bold">Shipping Address</p>
                          <p className=""> {customerShippingAddress.name}</p>
                          <p> {customerShippingAddress.street}</p>
                          <p> {customerShippingAddress.city}</p>
                          <div className="flex items-center gap-2">
                            <p> {customerShippingAddress.state}</p>
                            <p> {customerShippingAddress.postalCode}</p>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
        </TableBody>
      </Table>
      <div className="mt-auto flex justify-end">
        {orders && orders.length > ordersPerPage && (
          <div className="flex justify-end mt-4">
            <button
              onClick={previousPage}
              disabled={currentPage === 0}
              className={cn("px-2 py-1 mr-2 bg-gray-200 rounded", {
                "opacity-50 cursor-not-allowed": currentPage === 0,
              })}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={(currentPage + 1) * ordersPerPage >= orders.length}
              className={cn("px-2 py-1 bg-gray-200 rounded", {
                "opacity-50 cursor-not-allowed":
                  (currentPage + 1) * ordersPerPage >= orders.length,
              })}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderTable;
