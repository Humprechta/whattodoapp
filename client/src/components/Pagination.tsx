interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
  }
  
  export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
    if (totalPages <= 1) return null; // hide paggination if pages are less than 2
  
    return (
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-sm mx-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Previous
        </button>
        <span className="text-lg font-semibold">
          Page {page} / {totalPages}
        </span>
        <button
          className="btn btn-sm mx-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>
    );
  }
  