"use client";
import { useFetchOrders } from "@/lib/hook";
import { OrderStatus } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Minus,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  // userId: string;
  email: string | null;
  total: number;
  isPaid: boolean;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  // shippingAddressId: string | null;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    createdAt: false,
    updatedAt: false,
    userId: false,
    email: false,
    shippingAddressId: false,
    isPaid: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col justify-between rounded-md">
      <div className="flex items-center p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 flex items-center gap-2">
              <Minus size={14} />
              Columns
              <Plus size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table.getAllColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 flex xs:flex-col sm:flex-row self-start gap-3">
        <input
          type="text"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          placeholder="Filter by email"
          className="border p-1 rounded"
        />
        <input
          type="text"
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("id")?.setFilterValue(e.target.value)
          }
          placeholder="Filter by order id"
          className="border p-1 rounded"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          variant="ghost"
        >
          <ChevronLeft />
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          variant="ghost"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

// Define the columns for the Order table

const NewOrdersTable = () => {
  const { data: orders } = useFetchOrders();
  const [ordersVisible, setOrdersVisible] = useState(true);
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

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue("email") ?? "N/A",
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer hover:text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const total = row.getValue("total") as number;
        // Format the total as USD currency
        return (
          <p className="text-green-700">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}
          </p>
        );
      },
    },

    {
      accessorKey: "isPaid",
      header: "Is Paid",
      cell: ({ row }) => (row.getValue("isPaid") ? "Yes" : "No"),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer hover:text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer hover:text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ordered At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) =>
        new Date(row.getValue("updatedAt")).toLocaleDateString(),
    },
    {
      accessorKey: "shippingAddressId",
      header: "Shipping Address ID",
    },
  ];

  if (!orders) return null;

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DataTable columns={columns} data={orders} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewOrdersTable;
