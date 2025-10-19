import React from "react";
import { useState, useEffect } from "react";
import { Item } from "../types";
import { ItemCard } from "./ItemCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { motion } from "motion/react";

interface ItemsListViewProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 3;

export function ItemsListView({ items, onEdit, onDelete }: ItemsListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  // Reset to page 1 when items change and current page is empty
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {currentItems.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No items found in this category
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentItems.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                index={index}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    size="default"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                        size="icon"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    size="default"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </motion.div>
  );
}
