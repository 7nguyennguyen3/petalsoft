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
  const { data: orders, isLoading: isLoadingOrder } = useQuery<Order[]>({
    queryKey: ["customer-order"],
    queryFn: async () => {
      const { data } = await axios.get(`api/customer-order?userId=${userId}`);
      return data;
    },
    staleTime: 100 * 60 * 30, // 30
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
    staleTime: 100 * 60 * 30, // 30
    retry: 2,
    enabled: !!expandedOrderId,
  });

  // const { data: customerShippingAddress } = useQuery<ShippingAddress[]>({
  //   queryKey: ["shippingAddress", shippingAddressId],
  //   queryFn: async () => {
  //     if (shippingAddressId) {
  //       const { data } = await axios.patch("/api/customer-order", {
  //         id: shippingAddressId,
  //       });
  //       return data;
  //     }
  //     return null;
  //   },
  //   staleTime: 100 * 60 * 30, // 30
  //   retry: 2,
  //   enabled: !!shippingAddressId,
  // });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // const toggleShippingAddress = (addressId: string | null) => {
  //   setShippingAddressId(shippingAddressId === addressId ? null : addressId);
  // };

  return isLoadingOrder ? (
    <Loading />
  ) : (
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
          orders.map((order) => (
            <>
              <TableRow
                key={order.id}
                className="hover:cursor-pointer"
                onClick={() => {
                  toggleExpand(order.id);
                  // toggleShippingAddress(order.shippingAddressId);
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
              {expandedOrderId === order.id && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="grid sm:grid-cols-2 xs:grid-cols-1">
                      <div>
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
                      <div>
                        {/* {customerShippingAddress &&
                          customerShippingAddress.map((address) => (
                            <div key={address.id}>
                              <p>{address.name}</p>
                              <p>{address.street}</p>
                              <p>{address.city}</p>
                              <p>{address.state}</p>
                              <p>{address.postalCode}</p>
                            </div>
                          ))} */}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
      </TableBody>
    </Table>
  );
};

export default CustomerOrderTable;
