// // Pagination.jsx
// import React from "react";

// export default function Pagination({ page, totalPages, setPage }) {
//   return (
//     <div className="flex items-center gap-2">
//       <button
//         onClick={() => setPage(p => Math.max(1, p - 1))}
//         disabled={page === 1}
//         className={`px-2 py-1 rounded ${page === 1 ? "text-gray-400" : "hover:bg-gray-100"}`}
//       >
//         &lt;
//       </button>

//       {Array.from({ length: totalPages }).map((_, i) => {
//         const p = i + 1;
//         return (
//           <button
//             key={p}
//             onClick={() => setPage(p)}
//             className={`px-2 py-1 rounded text-sm ${page === p ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
//           >
//             {p}
//           </button>
//         );
//       })}

//       <button
//         onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//         disabled={page === totalPages}
//         className={`px-2 py-1 rounded ${page === totalPages ? "text-gray-400" : "hover:bg-gray-100"}`}
//       >
//         &gt;
//       </button>
//     </div>
//   );
// }




// Pagination.jsx
import React from "react";

function buildPagination(current, total) {
  // ✅ If total pages <= 10 → show all
  if (total <= 10) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set();

  // ✅ Always include first page
  pages.add(1);

  // ✅ Always include current ± 1
  pages.add(current - 1);
  pages.add(current);
  pages.add(current + 1);

  // ✅ Always include last 3 pages
  pages.add(total);
  pages.add(total - 1);
  pages.add(total - 2);

  // ✅ Cleanup invalid pages
  const finalPages = [...pages]
    .filter(p => p > 0 && p <= total)
    .sort((a, b) => a - b);

  // ✅ Insert "..." where gaps exist
  const finalWithDots = [];
  for (let i = 0; i < finalPages.length; i++) {
    if (i > 0 && finalPages[i] - finalPages[i - 1] > 1) {
      finalWithDots.push("...");
    }
    finalWithDots.push(finalPages[i]);
  }

  return finalWithDots;
}

export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const pages = buildPagination(page, totalPages);

  return (
    <div className="flex items-center gap-2">
      {/* Prev */}
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        ‹
      </button>

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded text-sm border transition ${
              page === p
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
