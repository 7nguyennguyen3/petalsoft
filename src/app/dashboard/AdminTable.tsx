"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { motion, AnimatePresence } from "framer-motion";
import { useFetchOrders, useFetchProduct } from "@/lib/hook";
import { OrderStatus, PRODUCTS } from "@prisma/client";
import { ChevronsUpDown, CircleX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AdminTable = () => {
  const { data: products, error } = useFetchProduct();
  const { data: orders } = useFetchOrders();
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);
  const [openUpdateScreen, setOpenUpdateScreen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PRODUCTS | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateProduct } = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: async () => {
      await axios.patch("/api/products", {
        id: selectedProduct?.id,
        title: selectedProduct?.title,
        stock: selectedProduct?.stock,
        price: selectedProduct?.price,
      });
    },
    onSuccess: () => queryClient.invalidateQueries(),
    onError: (error) => console.log(error),
  });

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

  if (error) return <div>Error fetching products: {error.message}</div>;

  const sortedProducts = products?.sort((a, b) => a.id - b.id);

  return (
    <div className="min-h-screen pt-40">
      <div
        className="text-3xl cursor-pointer hover:text-custom-purple
        flex items-center gap-2 max-w-[200px]"
        onClick={() => setProductsVisible(!productsVisible)}
      >
        <p>Products</p>
        <ChevronsUpDown />
      </div>

      <AnimatePresence>
        {productsVisible && (
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
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts &&
                  sortedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpenUpdateScreen(true);
                      }}
                    >
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>${product.price.toFixed(2)} </TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.reviews ?? "No reviews"}</TableCell>
                      <TableCell>{product.category ?? "No category"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedProduct !== null && openUpdateScreen && (
        <div className="flex items-center justify-center fixed inset-0 bg-zinc-500/50 z-10 p-5">
          <div
            className="w-full max-w-[600px] h-full max-h-[400px] bg-zinc-500 rounded-lg 
          flex flex-col items-center p-5 gap-2"
          >
            <Button
              variant={"ghost"}
              className="self-end text-white mb-10"
              onClick={() => setOpenUpdateScreen(false)}
            >
              <CircleX />
            </Button>
            <input
              type="text"
              placeholder="Title"
              value={selectedProduct?.title}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  title: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={selectedProduct.price.toString()}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Stock"
              value={selectedProduct.stock.toString()}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: parseInt(e.target.value, 10),
                })
              }
              className="w-full p-2 border rounded"
            />
            <Button
              onClick={async () => {
                try {
                  updateProduct();
                  setOpenUpdateScreen(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Update Product
            </Button>
          </div>
        </div>
      )}

      <div
        className="text-3xl cursor-pointer hover:text-custom-purple
        flex items-center gap-2 max-w-[200px] mt-20"
        onClick={() => setOrdersVisible(true)}
      >
        <p>Orders</p>
        <ChevronsUpDown />
      </div>

      {ordersVisible && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
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
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.email ?? "N/A"}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.isPaid ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {OrderStatus[order.status]}
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
      )}
    </div>
  );
};

export default AdminTable;
