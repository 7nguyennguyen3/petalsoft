import { Order, PRODUCTS } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchProduct = () => {
  return useQuery<PRODUCTS[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data } = await axios.get("/api/products");
      return data;
    },
    staleTime: 100 * 60 * 30,
    retry: 2,
  });
};

export const useFetchOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      return data;
    },
    staleTime: 100 * 60 * 30,
    retry: 2,
  });
};
