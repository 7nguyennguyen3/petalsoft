"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchProduct } from "@/lib/hook";
import { PRODUCTS } from "@prisma/client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, CircleX } from "lucide-react";
import React, { useState } from "react";

const ProductsTable = () => {
  const { data: products, error } = useFetchProduct();

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

  if (error) return <div>Error fetching products: {error.message}</div>;

  const sortedProducts = products?.sort((a, b) => a.id - b.id);

  return (
    <>
      <div
        className=" cursor-pointer
        flex items-center gap-2 max-w-[200px]"
        onClick={() => setProductsVisible(!productsVisible)}
      >
        <p className="text-3xl font-bold gra-p-b">Products</p>
        <ChevronsUpDown className="text-blue-500" />
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
            className="w-full max-w-[600px] h-full max-h-[400px] bg-zinc-500/90 rounded-lg 
          flex flex-col items-center p-5 gap-2"
          >
            <Button
              variant={"ghost"}
              className="self-end text-white"
              onClick={() => setOpenUpdateScreen(false)}
            >
              <CircleX />
            </Button>
            <label
              htmlFor="title"
              className="self-start font-medium text-white"
            >
              Title
            </label>
            <Input
              type="text"
              placeholder="Title"
              value={selectedProduct?.title}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  title: e.target.value,
                })
              }
              className="w-full p-2 border rounded bg-transparent text-white"
            />
            <label
              htmlFor="price"
              className="self-start font-medium text-white"
            >
              Price
            </label>
            <Input
              type="number"
              placeholder="Price"
              value={selectedProduct.price.toString()}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full p-2 border rounded bg-transparent text-white"
            />
            <label
              htmlFor="stock"
              className="self-start font-medium text-white"
            >
              Stock
            </label>
            <Input
              type="number"
              placeholder="Stock"
              value={selectedProduct.stock.toString()}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: parseInt(e.target.value, 10),
                })
              }
              className="w-full p-2 border rounded bg-transparent text-white"
            />
            <Button
              className="mt-5"
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
    </>
  );
};

export default ProductsTable;
