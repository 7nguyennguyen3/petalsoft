"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { OrderStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useFetchOrders } from "@/lib/hook";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const OrdersTable = () => {
  const { data: orders } = useFetchOrders();
  const [ordersVisible, setOrdersVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateOrderStatus } = useMutation({
    mutationKey: ["updateOrder"],
    mutationFn: async ({
      status,
      orderId,
    }: {
      status: OrderStatus;
      orderId: string;
    }) => {
      await axios.patch(`/api/orders`, { status, id: orderId });
    },
    onSuccess: () => queryClient.invalidateQueries(),
    onError: (error) => console.log(error),
  });

  return (
    <div className="my-20">
      <div
        className="cursor-pointer flex items-center gap-2 max-w-[200px]"
        onClick={() => setOrdersVisible(!ordersVisible)}
      >
        <p className="text-3xl font-bold gra-p-b">Orders</p>
        <ChevronsUpDown className="text-blue-500" />
      </div>

      <AnimatePresence>
        {ordersVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.5 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  {/* <TableHead>User ID</TableHead> */}
                  <TableHead>Email</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Is Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    {/* <TableCell>{order.userId}</TableCell> */}
                    <TableCell>{order.email ?? "N/A"}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.isPaid ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          {OrderStatus[order.status].charAt(0).toUpperCase() +
                            OrderStatus[order.status].slice(1)}
                          <ChevronsUpDown size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus({
                                status: "awaiting_shipment",
                                orderId: order.id,
                              })
                            }
                          >
                            Awaiting Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus({
                                status: "shipped",
                                orderId: order.id,
                              })
                            }
                          >
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus({
                                status: "fulfilled",
                                orderId: order.id,
                              })
                            }
                          >
                            Fulfilled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersTable;
