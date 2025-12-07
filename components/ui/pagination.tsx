"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/components/studio-context";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => {
  const { currentPage, photos, setCurrentPage } = useStudio();
  const totalPage = photos.length > 0 ? photos.length : 1;
  const [jumpToPage, setJumpToPage] = React.useState("");

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPage) {
      setCurrentPage(pageNum);
      setJumpToPage("");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = <PaginationEllipsis key="ellipsis" />;

    if (totalPage <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(
          <PaginationLink key={i} isActive={currentPage === i} page={i}>
            {i}
          </PaginationLink>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationLink key={1} isActive={currentPage === 1} page={1}>
          1
        </PaginationLink>
      );

      if (currentPage > maxPagesToShow - 2) {
        pageNumbers.push(ellipsis);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPage - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationLink key={i} isActive={currentPage === i} page={i}>
            {i}
          </PaginationLink>
        );
      }

      if (currentPage < totalPage - (maxPagesToShow - 2)) {
        pageNumbers.push(ellipsis);
      }

      pageNumbers.push(
        <PaginationLink key={totalPage} isActive={currentPage === totalPage} page={totalPage}>
          {totalPage}
        </PaginationLink>
      );
    }

    return pageNumbers;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <PaginationPrevious />
        {renderPageNumbers()}
        <PaginationNext />
      </div>
      <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max={totalPage}
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          className="h-9 w-16"
          placeholder="跳转"
        />
        <Button type="submit" variant="outline" size="sm">
          Go
        </Button>
      </form>
    </nav>
  );
};
Pagination.displayName = "Pagination";

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  page,
  ...props
}: { page: number; isActive: boolean } & Omit<ButtonProps, "page">) => {
  const { setCurrentPage } = useStudio();

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "default" : "outline"}
      size={size}
      className={cn("h-9 w-9", className)}
      onClick={() => setCurrentPage(page)}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { currentPage, setCurrentPage } = useStudio();
  return (
    <Button
      aria-label="Go to previous page"
      size="icon"
      variant="outline"
      className={cn("h-9 w-9", className)}
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage <= 1}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { currentPage, photos, setCurrentPage } = useStudio();
  const totalPage = photos.length > 0 ? photos.length : 1;
  return (
    <Button
      aria-label="Go to next page"
      size="icon"
      variant="outline"
      className={cn("h-9 w-9", className)}
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage >= totalPage}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export { Pagination };