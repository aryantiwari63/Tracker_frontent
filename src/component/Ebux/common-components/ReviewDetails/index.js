"use client"

import { useEffect, useRef, useState } from "react"
import { MdOutlineDragIndicator } from "react-icons/md"
import { getEbuxReviewDetails } from "../../services/ratingreview"
import LoaderSpinner from "../../../common-components/loader-spinner"
import { useEbuxContext } from "../../Context/EbuxProvider"
//import { isEqual } from "lodash"

const Star = ({ filled }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "#FFB800" : "none"}
      stroke={filled ? "#FFB800" : "#D1D5DB"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// Fallback dummy data in case API fails
// const dummyReviews = [
//   {
//     id: "1",
//     reviewer_name: "Prafulla kumar Panda",
//     rating: "5",
//     review_title: "Best quality at the least price.",
//     review_content: "I've been a loyal Tata Tea customer for years, and it never fails to impress. The rich aroma and robust flavor are exactly what I need to kickstart my mornings. The leaves brew quickly, and you can taste the authenticity in every sip. Whether I'm making a strong cup for myself or chai for the family, Tata Tea delivers consistency every time.",
//     review_date: "11 October 2024",
//     product_details: {
//       platform: { name: "amazon", logo: "" },
//       image: "",
//       id: "TT12345",
//       name: "Tata Tea Gold Premium",
//     },
//     sentiment: { 
//       type: "Positive", 
//       topics: ["Customer Service", "Product Quality", "Product Quantity and Delivery"]
//     },
//   },
//   {
//     id: "2",
//     reviewer_name: "Prafulla kumar Panda",
//     rating: "3",
//     review_title: "Average taste, good packaging",
//     review_content: "The tea is okay, nothing exceptional. Packaging is good and keeps the tea fresh. Delivery was on time but the price could be better. It's a decent everyday tea but don't expect anything extraordinary.",
//     review_date: "11 October 2024",
//     product_details: {
//       platform: { name: "amazon", logo: "" },
//       image: "",
//       id: "TT12345",
//       name: "Tata Tea Gold Premium",
//     },
//     sentiment: { 
//       type: "Neutral", 
//       topics: ["Product Quality", "Product Quantity and Delivery", "Price"]
//     },
//   },
//   {
//     id: "3",
//     reviewer_name: "Prafulla kumar Panda",
//     rating: "1",
//     review_title: "Not worth the premium price",
//     review_content: "Very disappointed with the quality. The tea lacks the promised aroma and strength. Had to use more quantity than usual to get a decent cup. The price is too high for this quality. Will not purchase again.",
//     review_date: "11 October 2024",
//     product_details: {
//       platform: { name: "amazon", logo: "" },
//       image: "",
//       id: "TT12345",
//       name: "Tata Tea Gold Premium",
//     },
//     sentiment: { 
//       type: "Negative", 
//       topics: ["Product Quality", "Value for Money"]
//     },
//   },
// ]

export default function ReviewDetails({ listeners, attributes }) {
    const revieweRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [sortOrder, setSortOrder] = useState("");
    const [counts, setCounts] = useState({ all: 0, positive: 0, neutral: 0, negative: 0 });
    const [hasMore, setHasMore] = useState(true);
    const [isLazyLoading, setIsLazyLoading] = useState(false);

    const {
        filtersLoading,
        filters,
        selectedFilters
    } = useEbuxContext();

    const fetchReviewDetails = async (startIndex = 0, append = false) => {
        try {
            if (startIndex === 0) {
                setLoading(true);
            } else {
                setIsLazyLoading(true);
            }

            const data = await getEbuxReviewDetails(
                filters,
                selectedFilters,
                selectedFilters?.selectedPlatform,
                false,
                startIndex,
                1000
            );

            if (data && data.length > 0) {
                if (append) {
                    setReviews(prev => [...prev, ...data]);
                } else {
                    setReviews(data);
                }

                // Calculate counts for each sentiment type
                const sentimentCounts = data.reduce((acc, review) => {
                    const sentiment = review.sentiment?.type?.toLowerCase() || 'unknown';
                    acc[sentiment] = (acc[sentiment] || 0) + 1;
                    acc.all = (acc.all || 0) + 1;
                    return acc;
                }, { all: 0, positive: 0, negative: 0, neutral: 0 });

                setCounts(sentimentCounts);
                setHasMore(data.length === 1000);
            } 
            
            else {
                if (startIndex === 0) {
                    setReviews([]);
                    setCounts({
                        all: 0,
                        positive:0,
                        neutral:0,
                        negative:0
                    });
                }
                setHasMore(false);
            }
        } catch (error) {
           console.error("Error fetching reviews:", error);
            if (startIndex === 0) {
                    setReviews([]);
                    setCounts({
                        all: 0,
                        positive:0,
                        neutral:0,
                        negative:0
                    });
                }
            setHasMore(false);
        } finally {
            setLoading(false);
            setIsLazyLoading(false);
        }
    };


    useEffect(() => {
        fetchReviewDetails(0, false);
    }, [filtersLoading, selectedFilters]);

    const handleScroll = () => {
        if (!revieweRef.current || isLazyLoading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = revieweRef.current;
        if (scrollHeight - scrollTop - clientHeight < 50) {
            const nextStartIndex = reviews.length+1000;
            fetchReviewDetails(nextStartIndex, true);
        }
    };

    useEffect(() => {
        const container = revieweRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isLazyLoading, hasMore, reviews]);


    const filteredReviews = reviews?.filter((review) => {
        if (activeTab === "all") return true;
        return review.sentiment?.type?.toLowerCase() === activeTab.toLowerCase();
    });

    // Corrected order: Sort first, then slice
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        const dateA = new Date(a.review_date);
        const dateB = new Date(b.review_date);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    }).slice(0, 1000);

    const getTabStyle = (tab) => {
        const isActive = activeTab === tab;
        const baseStyle = "py-2 relative flex items-center gap-2";
        const activeStyle = isActive ? "text-blue-600" : "text-gray-600";
        return `${baseStyle} ${activeStyle}`;
    };

    const getBorderStyle = (tab) => {
        if (activeTab !== tab) return "opacity-0";
        switch (tab) {
            case "positive":
                return "bg-green-500";
            case "neutral":
                return "bg-orange-500";
            case "negative":
                return "bg-red-500";
            default:
                return "bg-blue-600";
        }
    };

    const getSentimentStyle = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case "positive":
                return "bg-[#52C41A] text-white";
            case "neutral":
                return "bg-orange-100 text-orange-800";
            case "negative":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="p-2 sm:p-4 bg-white mt-4">
                <div className="flex items-center gap-2 mb-4">
                    <MdOutlineDragIndicator {...listeners} {...attributes} />
                    <div className="sectionIcon">
                        <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Comprehensive Icon" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-semibold">Review Details</h1>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-full max-w-md"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                    <div className="h-64 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className=" ">
         {
            reviews && reviews?.length>0 && (
                <div className="p-2 sm:p-4 bg-white mt-4">

   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                    <MdOutlineDragIndicator {...listeners} {...attributes} />
                    <div className="sectionIcon">
                        <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Comprehensive Icon" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-semibold">Review Details</h1>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-auto">
                    <select 
                        className="px-2 py-1 border text-sm" 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                    >    
                       <option value="" disabled hidden>Sort By</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            <div className="border-b mb-4 sm:mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    <div className="relative">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`border-t-2 border-b-0 border-l-2 border-r-2 px-2 py-2 bg-[#fff] ${getTabStyle("all")}`}
                        >
                            All <span className="border-2 rounded-full px-2 bg-[#F0F0F0] text-sm text-gray-500">{counts.all}</span>
                        </button>
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity ${getBorderStyle("all")}`} />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setActiveTab("positive")}
                            className={`border-2 px-2 py-2 bg-[#FAFAFA] ${getTabStyle("positive")} `}
                        >
                            <div className="w-2 h-2 px-2 py-2 rounded-full bg-green-500" />
                            Positive <span className="border-2 rounded-full px-2 bg-[#F0F0F0] text-sm text-gray-500">{counts.positive}</span>
                        </button>
                        <div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity ${getBorderStyle("positive")}`}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setActiveTab("neutral")}
                            className={`px-2 py-2 border-2 bg-[#FAFAFA] ${getTabStyle("neutral")}`}
                        >
                            <div className="w-2 h-2 px-2 py-2 rounded-full bg-orange-500" />
                            Neutral <span className="border-2 rounded-full px-2 bg-[#F0F0F0] text-sm text-gray-500">{counts.neutral}</span>
                        </button>
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity ${getBorderStyle("neutral")}`} />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setActiveTab("negative")}
                            className={`px-2 py-2 border-2 bg-[#FAFAFA] ${getTabStyle("negative")}`}
                        >
                            <div className="w-2 h-2 px-2 py-2 rounded-full bg-red-500" />
                            Negative <span className="border-2 rounded-full px-2 bg-[#F0F0F0] text-sm text-gray-500">{counts.negative}</span>
                        </button>
                        <div
                            className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity ${getBorderStyle("negative")}`}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 h-[613px] overflow-y-auto" ref={revieweRef}>
                {sortedReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No reviews found for this filter.</div>
                ) : (
                    sortedReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-2 sm:p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr,300px,300px] gap-4 md:gap-6">
                                {/* Review Content */}
                                <div className="space-y-2 sm:space-y-4 border rounded-lg p-2 sm:p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="/assets/images/rating-review/profileimage.png"
                                            alt={review.reviewer_name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-medium text-sm sm:text-base">{review.reviewer_name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} filled={i < parseInt(review.rating)} />
                                        ))}
                                        <span className="ml-2 font-medium text-sm sm:text-base">
                                            {review.review_title || `${review.sentiment?.type} Review`}
                                        </span>
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600">Reviewed on {review.review_date}</div>
                                    <p className="text-xs sm:text-sm text-gray-700">{review.review_content}</p>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-2 sm:space-y-4 border rounded-lg p-2 sm:p-4">
                                    <h4 className="font-medium">Product Details</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Platform:</span>
                                            {review.product_details?.platform?.logo ? (
                                                <img 
                                                    src={review.product_details.platform.logo || "/assets/images/rating-review/noimage.png"} 
                                                    alt={review.product_details.platform.name} 
                                                    className="w-5 h-5"
                                                />
                                            ) : (
                                                <span>{review.product_details?.platform?.name || "Unknown"}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Image:</span>
                                            <img src={review.product_details?.image || "/assets/images/rating-review/Noimage.svg"} alt="Product" className="w-4 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Product ID:</span>
                                            <span className="ml-2">{review.product_details?.id || "Unknown"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Product Name:</span>
                                            <span className="ml-2">{review.product_details?.name || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sentiment & Topics */}
                                <div className="space-y-2 sm:space-y-4 border rounded-lg p-2 sm:p-4">
                                    <div>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 border rounded-sm text-sm font-medium ${getSentimentStyle(review.sentiment?.type)}`}
                                        >
                                            Sentiment: {review.sentiment?.type || "Unknown"}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Topics</h4>
                                        <div className="space-y-1">
                                            {review.sentiment?.topics?.length > 0 ? (
                                                review.sentiment.topics.map((topic) => (
                                                    <div key={topic} className="text-sm text-gray-700">
                                                        {topic}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-500">No topics available</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isLazyLoading && (
                    <LoaderSpinner />
                )}
            </div>
                </div>
            )
         }
        </div>
    )
}