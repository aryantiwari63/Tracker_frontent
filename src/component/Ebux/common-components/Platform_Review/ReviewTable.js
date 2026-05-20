import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Excel from "exceljs";
import StarRating from "./StarRating"
import SortingButton from './DynamicSort'
// import ReviewSummary from "./ReviewsSummary"
import { getEbuxPlatformStats } from "../../services/ratingreview"
import LoaderSpinner from "../../../common-components/loader-spinner"
import { useEbuxContext } from "../../Context/EbuxProvider"
import { IoMdCopy } from "react-icons/io"
import { copyToClipboard, getTextFromReactNode } from "../../../../utils/helpers"



export default function ReviewTable({ selectedTabName = "Reviews", breakDownfilter, selectedRows, setSelectedRows, isFilterApplied, setIsFilterApplied, setselectedCount, setselectedTotal, downloadkey }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ASC",
  })
  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [summary, setSummary] = useState({
    total_reviews: 0,
    avg_rating: 0,
    total_platforms: 0,
    total_products: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isLazyLoading, setIsLazyLoading] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const limit = 1000
  const [tableWidth, setTableWidth] = useState(0);
  const tableRef = useRef(null);

  const { selectedFilters } = useEbuxContext()
  const scrollRef = useRef(null)

  // Reset reviews when filter changes
  useEffect(() => {
    setReviews([])
    setStartIndex(0)
    setTotalReviews(0)
    setSummary({
      total_reviews: 0,
      avg_rating: 0,
      total_platforms: 0,
      total_products: 0,
    });
  }, [breakDownfilter, selectedTabName])

  useEffect(() => {
    if (!downloadkey) return;

    const downloadExcel = async () => {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(`${selectedTabName} Report`);

      // Define columns
      worksheet.columns = [
        { header: "Review Title", key: "ReviewTitle", width: 40 },
        { header: "Review", key: "Review", width: 60 },
        { header: "Reviewer Name", key: "ReviewerName", width: 25 },
        { header: "Review Date", key: "ReviewDate", width: 15 },
        { header: "Review Time", key: "ReviewTime", width: 15 },
        { header: "Rating", key: "Rating", width: 10 },
        { header: "Platform", key: "Platform", width: 20 },
        { header: "Product Name", key: "ProductName", width: 40 },
      ];

      // Use displayedReviews if filter applied else sortedReviews
      const dataToExport = isFilterApplied
        ? displayedReviews.map(r => r.review)
        : sortedReviews;

      // Add rows
      dataToExport.forEach((item) => {
        const review = item.review || item;

        worksheet.addRow({
          ReviewTitle: review?.ReviewTitle || "",
          Review: review?.Review || "",
          ReviewerName: review?.ReviewerName || "",
          ReviewDate: review?.ReviewDate || "",
          ReviewTime: review?.ReviewTime || "",
          Rating: review?.Rating || "",
          Platform: review?.Platform || "",
          ProductName: review?.ProductName || "",
        });
      });

      // Download file
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedTabName}_reviews_${Date.now()}.xlsx`;
      link.click();
    };

    downloadExcel();

  }, [downloadkey]);


  // Fetch reviews
  const fetchReviews = async (start = 0, append = false) => {
    try {
      if (start === 0) setLoading(true)
      else setIsLazyLoading(true)
      const data = await getEbuxPlatformStats(selectedTabName == "Competition Reviews", breakDownfilter, selectedFilters, false, start, limit)
      if (data && data.data && data.data.data && data.data.data.length > 0) {
        setReviews(prev => append ? [...prev, ...data.data.data] : data.data.data)
        setTotalReviews(data.data.total || 0)
        setSummary(data.data.summary || {
          total_reviews: 0,
          avg_rating: 0,
          total_platforms: 0,
          total_products: 0,
        })
      } else if (!append) {
        setReviews([]);
        setTotalReviews(0);
        setSummary({
          total_reviews: 0,
          avg_rating: 0,
          total_platforms: 0,
          total_products: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      if (!append) {
        setReviews([]);
        setTotalReviews(0);
        setSummary({
          total_reviews: 0,
          avg_rating: 0,
          total_platforms: 0,
          total_products: 0,
        });
      }
    } finally {
      setLoading(false)
      setIsLazyLoading(false)
    }
  }





  const updateTableWidth = useCallback(() => {
    if (tableRef.current) {
      setTableWidth(tableRef.current.scrollWidth);
    }
  }, []);

  // Update table width when data changes
  useEffect(() => {
    updateTableWidth();
    window.addEventListener('resize', updateTableWidth);
    return () => window.removeEventListener('resize', updateTableWidth);
  }, [reviews, isFilterApplied, selectedRows, updateTableWidth]);
  // Initial fetch and on filter change
  useEffect(() => {
    fetchReviews(0, false)
  }, [breakDownfilter, selectedFilters, selectedTabName])
  useEffect(() => {
    setselectedCount(selectedRows.length)
    setselectedTotal((perv) => ({ ...perv, [selectedTabName]: summary?.total_reviews ?? 0 }))
  }, [selectedRows, reviews, selectedFilters])

  // Sorting
  const sortedReviews = useMemo(() => {
    if (!sortConfig.key || !reviews.length) return reviews
    return [...reviews].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]
      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortConfig.direction === "ASC") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      }
      if (aValue < bValue) {
        return sortConfig.direction === "ASC" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ASC" ? 1 : -1
      }
      return 0
    })
  }, [sortConfig, reviews])

  const requestSort = (key) => {
    let direction = "ASC"
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DSC"
    }
    setSortConfig({ key, direction })
  }

  // Group selected reviews by product name and category
  const selectedProductGroups = useMemo(() => {
    const productGroups = {}
    const categoryGroups = {}
    selectedRows.forEach((index) => {
      const review = sortedReviews[index]
      if (!review) return
      if (!productGroups[review.ProductName]) {
        productGroups[review.ProductName] = 1
      } else {
        productGroups[review.ProductName]++
      }
      if (!categoryGroups[review.BrandCategoryName]) {
        categoryGroups[review.BrandCategoryName] = 1
      } else {
        categoryGroups[review.BrandCategoryName]++
      }
    })
    return {
      products: Object.entries(productGroups),
      categories: Object.entries(categoryGroups)
    }
  }, [selectedRows, sortedReviews])

  // Displayed reviews (filtered or all)
  const displayedReviews = useMemo(() => {
    if (isFilterApplied && selectedRows.length > 0) {
      return selectedRows.map(index => ({
        review: sortedReviews[index],
        originalIndex: index
      }));
    }
    return sortedReviews.map((review, index) => ({
      review,
      originalIndex: index
    }));
  }, [sortedReviews, isFilterApplied, selectedRows])

  const allCurrentDisplayedSelected = useMemo(() => {
    if (displayedReviews.length === 0) return false;
    return displayedReviews.every(row => selectedRows.includes(row.originalIndex));
  }, [displayedReviews, selectedRows]);

  // Handle select all rows in current view
  const handleSelectAll = () => {
    const currentIndices = displayedReviews.map(row => row.originalIndex);

    if (allCurrentDisplayedSelected) {
      // Remove all current displayed indices from selectedRows
      setSelectedRows(prev => prev.filter(index => !currentIndices.includes(index)));
    } else {
      // Add all current displayed indices to selectedRows
      const newSelected = [...new Set([...selectedRows, ...currentIndices])];
      setSelectedRows(newSelected);
    }
  };


  // Scroll handler for lazy loading
  const handleScroll = () => {
    if (!scrollRef.current || isLazyLoading || loading) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollHeight - scrollTop - clientHeight < 50 && reviews.length < totalReviews) {
      // Fetch next batch
      const nextStart = startIndex + limit
      setStartIndex(nextStart)
      fetchReviews(nextStart, true)
    }
  }

  // Attach scroll listener
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
    // eslint-disable-next-line
  }, [isLazyLoading, reviews.length, totalReviews, startIndex, loading])

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Handle individual row selection
  const handleSelectRow = (originalIndex) => {
    setSelectedRows((prev) => {
      if (prev.includes(originalIndex)) {
        return prev.filter((i) => i !== originalIndex)
      } else {
        return [...prev, originalIndex]
      }
    })
  }

  // Handle select all rows
  // const handleSelectAll = () => {
  //   if (selectedRows.length === sortedReviews.length) {
  //     setSelectedRows([])
  //   } else {
  //     setSelectedRows(sortedReviews.map((_, index) => index))
  //   }
  // }
  const clearAllSelections = () => {
    setIsFilterApplied(false)
    setSelectedRows([])
  }

  return (
    <div>
      {/* Selection controls and filters */}
      {selectedRows.length > 0 && (
        <div className="bg-gray-50 p-3 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedRows.length} Selected Reviews:</span>
              <button
                onClick={clearAllSelections}
                className="text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded px-2 py-0.5"
              >
                Clear all
              </button>
            </div>
            {isFilterApplied && (
              <button
                onClick={() => {

                  setIsFilterApplied(false)
                  setSelectedRows([])
                }}
                className="text-sm text-gray-600 border border-gray-400 rounded px-2 py-0.5 ml-2"
              >
                Show All
              </button>
            )}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {/* Products */}
              {selectedProductGroups.products.map(([productName, count]) => (
                <div
                  key={`product-${productName}`}
                  className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 text-sm flex-shrink-0"
                >
                  <span>
                    Product: ({count}) {productName}
                  </span>
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => {

                      const indicesToRemove = selectedRows.filter(index => {
                        const review = sortedReviews[index];
                        return review?.ProductName === productName;
                      });
                      setSelectedRows((prev) => prev.filter((index) => !indicesToRemove.includes(index)))
                      setIsFilterApplied(true)

                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Categories */}
              {selectedProductGroups.categories.map(([categoryName, count]) => (
                <div
                  key={`category-${categoryName}`}
                  className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 text-sm flex-shrink-0"
                >
                  <span>
                    Category: ({count}) {categoryName}
                  </span>
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const indicesToRemove = selectedRows.filter(index => {
                        const review = sortedReviews[index];
                        return review?.BrandCategoryName === categoryName;
                      });
                      setSelectedRows((prev) => prev.filter((index) => !indicesToRemove.includes(index)))
                      setIsFilterApplied(true)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto  w-full h-[500px] overflow-y-auto relative "
        ref={scrollRef}>
        <div className="h-[200px]">
          <table className=" border-collapse"

            ref={tableRef}
            style={{ minWidth: '100%' }}
          >
            <thead className="sticky top-[-1px] left-0 z-[5] table-fixed capitalize">
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={allCurrentDisplayedSelected}
                    onChange={handleSelectAll}
                    disabled={displayedReviews.length === 0}
                  />
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("ReviewTitle")}>
                    <span className="font-medium text-gray-600 text-sm">Review Title</span>
                    <SortingButton sortType={sortConfig.key === "ReviewTitle" ? sortConfig.direction : ""} />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("Review")}>
                    <span className="font-medium text-gray-600 text-sm">Review</span>
                    <SortingButton sortType={sortConfig.key === "Review" ? sortConfig.direction : ""} />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("ReviewerName")}>
                    <span className="font-medium text-gray-600 text-sm">Reviewer Name</span>
                    <SortingButton sortType={sortConfig.key === "ReviewerName" ? sortConfig.direction : ""} />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("Rating")}>
                    <span className="font-medium text-gray-600 text-sm">Rating</span>
                    <SortingButton sortType={sortConfig.key === "Rating" ? sortConfig.direction : ""} />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("Platform")}>
                    <span className="font-medium text-gray-600 text-sm">Platform</span>
                    <SortingButton sortType={sortConfig.key === "Platform" ? sortConfig.direction : ""} />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap">
                  <div className="flex items-center cursor-pointer" onClick={() => requestSort("ProductName")}>
                    <span className="font-medium text-gray-600 text-sm">Product Name</span>
                    <SortingButton sortType={sortConfig.key === "ProductName" ? sortConfig.direction : ""} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedReviews && displayedReviews.length > 0 ? (
                displayedReviews.map((review) => (
                  <tr key={review?.originalIndex} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                        checked={selectedRows.includes(review?.originalIndex)}
                        onChange={() => handleSelectRow(review?.originalIndex)}
                      />
                    </td>
                    {/* <td className="p-3 text-sm w-[100px] group">
                      <div className="line-clamp-3 w-[250px] !break-all  break-words overflow-x-auto flex"> 
                        {review?.review.ReviewTitle || "—"}
                        {(review?.review.ReviewTitle) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.ReviewTitle ?? "-")) }}><IoMdCopy /></span> : ""}
                        </div>
                    </td> */}
                    <td className="p-3 text-sm w-[100px] group">
                      <div
                        className="line-clamp-3 w-[250px] break-words overflow-hidden flex items-center"
                        title={review?.review.ReviewTitle || ""}
                      >
                        <span className="truncate">
                          {review?.review.ReviewTitle || "—"}
                        </span>

                        {review?.review.ReviewTitle && (
                          <span
                            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            onClick={(e) =>
                              copyToClipboard(
                                e,
                                getTextFromReactNode(review?.review.ReviewTitle)
                              )
                            }
                          >
                            <IoMdCopy />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* <td className="p-3 text-sm max-w-xs group">
                      <div className="line-clamp-3 w-[250px] !break-all  break-words flex">{review?.review.Review}
                        {(review?.review.Review) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.Review ?? "-")) }}><IoMdCopy /></span> : ""}
                      </div>
                    </td> */}
                    <td className="p-3 text-sm max-w-xs group">
                      <div
                        className="line-clamp-3 w-[250px] break-words overflow-hidden flex items-center"
                        title={review?.review.Review || ""}
                      >
                        <span className="truncate">
                          {review?.review.Review || "—"}
                        </span>

                        {review?.review.Review && (
                          <span
                            className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            onClick={(e) =>
                              copyToClipboard(
                                e,
                                getTextFromReactNode(review?.review.Review)
                              )
                            }
                          >
                            <IoMdCopy />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-sm w-[100px] whitespace-normal break-all group">
                      <div className="w-[100px] whitespace-normal break-all">
                        <div className="font-medium whitespace-normal break-all flex">
                          {review?.review.ReviewerName}
                          {(review?.review.ReviewerName) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.ReviewerName ?? "-")) }}><IoMdCopy /></span> : ""}

                        </div>
                        <div className="text-xs text-gray-500 w-[100px] whitespace-normal break-all flex">
                          {/* {review?.review.ReviewDate} {review?.review.ReviewTime} */}
                          <div>
                            <p>
                              {review?.review.ReviewDate || "—"}
                            </p>

                            <p>
                              {review?.review.ReviewTime || ""}
                            </p>
                          </div>
                          {(review?.review.ReviewDate || review?.review.ReviewTime) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.ReviewDate + "," + review?.review.ReviewTime)) }}><IoMdCopy /></span> : ""}

                        </div>
                      </div>
                    </td>
                    {/* <td className="p-3 text-sm w-[100px] !break-all  break-words">
                    <div className="w-[100px] !break-all  break-words">
                      <div className="font-medium !break-all  break-words" ></div>
                      <div className="text-xs text-gray-500 w-[100px] !break-all  break-words">
                        
                      </div>
                    </div>
                  </td> */}
                    <td className="p-3 w-[100px]">
                      <StarRating rating={Number.parseInt(review?.review.Rating)} />
                    </td>
                    <td className="p-3 w-[100px] whitespace-normal break-all group">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6">
                          <img
                            src={review?.review.PlatformLogo || "/placeholder.svg"}
                            alt={review?.review.Platform}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="text-sm w-[100px] whitespace-normal break-all   break-words flex">
                          {review?.review.Platform}
                          {(review?.review.Platform) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.Platform ?? "-")) }}><IoMdCopy /></span> : ""}

                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm w-[400px]  max-w-[400px] whitespace-normal  break-all  break-words flex group">

                      {review?.review.ProductName}
                      {(review?.review.ProductName) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(review?.review.ProductName ?? "-")) }}><IoMdCopy /></span> : ""}

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">


              {isLazyLoading ? (
                <tr className="sticky bottom-0 bg-white border-t border-gray-300 z-10">
                  <td colSpan="7" className="p-4 text-sm text-gray-600">
                    <div className="flex justify-center p-4">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : (
                <tr
                  className="sticky bottom-0 bg-white border-t border-gray-300 z-10"
                >
                  <td colSpan="4" className="p-4 text-sm text-gray-600 group">
                    <div className="flex-1 text-center">

                      <div className="text-center w-30 pl-100px">
                        <div className="text-sm text-gray-500">Total Reviews</div>
                        <div className="font-bold text-xl flex justify-center items-center ">
                          {summary.total_reviews.toLocaleString()}
                          {(summary.total_reviews) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(summary.total_reviews ?? "-")) }}><IoMdCopy /></span> : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="text-center w-[150px] max-w-[150px]">
                      <div className="text-sm text-gray-500">Average Rating</div>
                      <div className="flex justify-center items-center ">
                        <StarRating rating={Math.round(summary.avg_rating)} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 group">
                    <div className="text-center w-[120px] max-w-[120px]">
                      <div className="text-sm text-gray-500">Total Platforms</div>
                      <div className="font-bold text-xl flex justify-center items-center ">{summary.total_platforms}
                        {(summary.total_platforms) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(summary.total_platforms ?? "-")) }}><IoMdCopy /></span> : ""}</div>

                    </div>
                  </td>
                  <td colSpan="4" className="p-4 text-sm text-gray-600 group">
                    <div className="text-center w-[120px] max-w-[120px]">
                      <div className="text-sm text-gray-500">Total Products</div>
                      <div className="font-bold text-xl flex justify-center items-center ">{summary.total_products.toLocaleString()}
                        {(summary.total_products) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(summary.total_products ?? "-")) }}><IoMdCopy /></span> : ""}
                      </div>


                    </div>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>

        </div>

        <div
          // className=" bg-white p-4 shadow-md sticky top-[25rem]"
          style={{ width: tableWidth > 0 ? `${tableWidth}px` : '100%' }}
        >

          {/* <ReviewSummary summary={summary} /> */}
        </div>
        {/* Loading spinner */}
        {isLazyLoading && (
          <div className="flex justify-center p-4">
            <LoaderSpinner />
          </div>
        )}
      </div>

    </div>
  )
}