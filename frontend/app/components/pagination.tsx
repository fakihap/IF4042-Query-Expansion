"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5;

interface PageButtonsProps<T> {
  data: T[];
  setCurrentItems: Dispatch<SetStateAction<number[]>>;
}

export default function PageButtons<T>({
  data,
  setCurrentItems,
}: PageButtonsProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setCurrentItems(Array.from({ length: end - start }, (_, i) => i + start));
  }, [currentPage, data, setCurrentItems]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (totalPages <= MAX_PAGE_BUTTONS) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - 2, 1);
    let end = start + MAX_PAGE_BUTTONS - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - MAX_PAGE_BUTTONS + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* First page and ellipsis if needed */}
        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === 1}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {pageNumbers[0] > 2 && <PaginationEllipsis />}
          </>
        )}

        {/* Current range of pages */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last page and ellipsis if needed */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <PaginationEllipsis />
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentPage === totalPages}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
