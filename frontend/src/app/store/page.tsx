"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useFetchProduct } from "@/lib/hook";
import { useCartStore } from "@/store";
import {
  ArrowUpDown,
  Eye,
  LayoutGrid, // For "Supplements"
  Package, // For "Fragrance"
  Pill,
  ShoppingCart, // For "All" category
  Sparkles, // For "Skincare"
  SprayCan,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// --- Define Product Type ---
interface Product {
  id: number;
  title: string;
  imgSrc: string;
  category: string | null;
  price?: number;
  createdAt?: Date;
}

// --- Constants ---
const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "date-desc", label: "Newest" },
];

// --- Icon Mapping ---
const categoryIcons: { [key: string]: React.ReactNode } = {
  All: <LayoutGrid className="h-4 w-4" />,
  Skincare: <Sparkles className="h-4 w-4" />, // Assuming 'Skincare' is the key used internally
  Fragrance: <SprayCan className="h-4 w-4" />,
  Supplements: <Pill className="h-4 w-4" />,
  Default: <Package className="h-4 w-4" />,
};

const getCategoryIcon = (categoryName: string): React.ReactNode => {
  return categoryIcons[categoryName] || categoryIcons.Default;
};

// --- Product Card Component (No changes needed here from previous version) ---
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCartStore();
  const isNew = useMemo(() => {
    if (!product.createdAt) return false;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const createdAtDate =
      typeof product.createdAt === "string"
        ? new Date(product.createdAt)
        : product.createdAt;
    return createdAtDate instanceof Date && createdAtDate > sevenDaysAgo;
  }, [product.createdAt]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added.`,
      duration: 2000,
    });
  };

  return (
    <Card
      className="group/card relative overflow-hidden h-full flex flex-col
     border border-border/50 hover:border-border transition-all duration-300
     ease-in-out hover:shadow-lg bg-card"
    >
      {isNew && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full z-10 shadow">
          New
        </div>
      )}
      <CardHeader className="p-2 border-b border-border/50 relative overflow-hidden">
        <Link
          href={`/store/${product.id}`}
          className="block aspect-square relative overflow-hidden group/image rounded-sm border border-muted"
        >
          <Image
            src={product.imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover/image:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-10 w-10"
              aria-label="View Details"
              asChild
            >
              <Link
                href={`/store/${product.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={handleAddToCart}
              aria-label="Add to Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link href={`/store/${product.id}`} className="flex-grow">
          <CardTitle className="text-sm sm:text-base font-medium leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.title}
          </CardTitle>
        </Link>
        {typeof product.price === "number" ? (
          <p className="text-base sm:text-lg font-semibold text-foreground mt-auto pt-2">
            ${product.price.toFixed(2)}
          </p>
        ) : (
          <div className="mt-auto pt-2 h-[28px]"></div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Loading Skeleton Component (Adjusted for icons) ---
const StoreLoadingSkeleton = () => (
  <>
    {/* Skeleton for Title Area */}
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
      <Skeleton className="h-10 w-3/5 sm:w-2/5" /> {/* Title skeleton */}
      <Skeleton className="h-5 w-1/3 sm:w-1/5" /> {/* Count skeleton */}
    </div>
    {/* Skeleton for Filters */}
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Skeleton className="h-10 w-full sm:w-2/3" />
      <Skeleton className="h-10 w-full sm:w-1/3" />
    </div>
    {/* Skeleton for Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border border-border">
          <div className="p-2 border-b border-border">
            <Skeleton className="aspect-square w-full block rounded-sm" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-4/5 mb-2" />
            <Skeleton className="h-6 w-1/3 mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

// --- Main Store Page Component ---
const StorePage = () => {
  const { data: products = [], isLoading } = useFetchProduct() as {
    data: Product[] | undefined;
    isLoading: boolean;
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>(SORT_OPTIONS[0].value);

  const categories = useMemo(() => {
    // Map internal category names to display names if needed
    const displayCategoryMap: Record<string, string> = {
      Skincare: "Skin Care",
      Fragrance: "Perfume",
      Supplements: "Supplements",
    };
    const uniqueCategories = new Set(
      products.map((p) => p.category).filter(Boolean) as string[]
    );
    // Return objects with key (internal name) and displayName
    return [
      { key: "All", displayName: "All" },
      ...Array.from(uniqueCategories)
        .sort()
        .map((cat) => ({
          key: cat,
          displayName: displayCategoryMap[cat] || cat, // Use display name or fallback to key
        })),
    ];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = products.filter((p) => p.category === selectedCategory);
    }
    const sorted = [...filtered].sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : Infinity;
      const priceB = typeof b.price === "number" ? b.price : Infinity;
      const negPriceA = typeof a.price === "number" ? a.price : -Infinity;
      const negPriceB = typeof b.price === "number" ? b.price : -Infinity;
      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : 0;
      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : 0;

      switch (sortOrder) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return negPriceB - negPriceA;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-desc":
          return (dateB || 0) - (dateA || 0);
        default:
          return 0;
      }
    });
    return sorted;
  }, [products, selectedCategory, sortOrder]);

  // Find the display name of the currently selected category
  const selectedCategoryDisplayName =
    categories.find((c) => c.key === selectedCategory)?.displayName ||
    "Products";

  return (
    <MaxWidthWrapper className="px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* Updated Title Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 border-b pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          {/* Use a relevant icon for the overall shop or selected category */}
          {getCategoryIcon(selectedCategory)}
          <span className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
            {selectedCategoryDisplayName} {/* Dynamic Title */}
          </span>
        </h1>
        {/* Show count only when not loading */}
        {!isLoading && (
          <span className="text-sm font-medium text-muted-foreground sm:text-right shrink-0">
            Showing {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading ? (
        <StoreLoadingSkeleton />
      ) : (
        <>
          {/* Filters & Sorting Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 bg-background/90 backdrop-blur-sm py-4 z-20 border-b -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {/* Category Tabs with Icons */}
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory} // Use the category *key* for value
              className="w-full md:w-auto overflow-x-auto"
            >
              <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground flex-nowrap w-max">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.key}
                    value={category.key} // Value should be the category key
                    className="whitespace-nowrap px-3 sm:px-4 flex items-center gap-2" // Added flex, gap
                  >
                    {getCategoryIcon(category.key)}{" "}
                    {/* Get icon based on key */}
                    {category.displayName} {/* Display Name */}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Sorting Dropdown with Icon */}
            <div className="flex-shrink-0 w-full md:w-auto md:min-w-[220px] md:ml-auto">
              {" "}
              {/* Align right on larger screens */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-10 w-full">
                  <div className="flex items-center gap-2">
                    {" "}
                    {/* Flex container for icon+text */}
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl font-medium text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}
    </MaxWidthWrapper>
  );
};

export default StorePage;
