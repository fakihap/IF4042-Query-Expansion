"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CardDocument from "./card-document";
// import data from "./cisi.json";

import type { CardDocumentProps } from "./card-document";

const ITEMS_PER_PAGE = 5;
const MAX_PAGE_BUTTONS = 5;

export default function DocumentList({data}: {
  data: CardDocumentProps[]
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate which page numbers to show in pagination
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
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-4">
        {currentItems.map((doc, index) => (
          <CardDocument
            key={index}
            title={doc.title}
            abstract={doc.abstract}
            similarity={98.76} // fallback similarity
          />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToPage(currentPage - 1);
              }}
            />
          </PaginationItem>

          {/* Always show first page button */}
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

              {/* Show ellipsis if gap */}
              {pageNumbers[0] > 2 && <PaginationEllipsis />}
            </>
          )}

          {/* Show page buttons around current page */}
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

          {/* Always show last page button */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {/* Show ellipsis if gap */}
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
    </div>
  );
}
