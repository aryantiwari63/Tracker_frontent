"use client"

import { MdOutlineDragIndicator } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { getEbuxSentimentDistribution } from "../../services/ratingreview";
import DonutChart from "./DonutChart";
import { isEqual } from "lodash";
import { useEbuxContext } from "../../Context/EbuxProvider";

// Color mapping for sentiment types
const sentimentColors = {
  "positive": "#4CAF50",
  "neutral": "#FFA000",
  "negative": "#FF5252"
};

export default function ReviewDistribution({listeners, attributes}) {
  const [reviewData, setReviewData] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
   const previousSelectedFilters = useRef({});
  
  
        const {
            filtersLoading,
            // selectedPlatform,
            filters,
            selectedFilters
        } = useEbuxContext();
  



  const fetchSentimentData = async () => {
    try {
      setLoading(true);
      const response = await getEbuxSentimentDistribution(filters,selectedFilters, selectedFilters?.selectedPlatform,false);
      
      if (response && response.distribution && response.distribution.length > 0) {
        // Transform API data to include color
        const formattedData = response.distribution.map(item => ({
          sentiment: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
          count: item.count,
          percentage: item.percentage,
          color: sentimentColors[item.sentiment.toLowerCase()] || "#808080"
        }));
        
        setReviewData(formattedData);
        setTotalReviews(response.total_reviews || 0);
      } else {
           // Clear data when no reviews available
        setReviewData([]);
        setTotalReviews(0);
        // Fallback to dummy data if API returns empty
        // setReviewData([
        //   { sentiment: "Positive", count: 86878, percentage: 67, color: "#4CAF50" },
        //   { sentiment: "Neutral", count: 18368, percentage: 13, color: "#FFA000" },
         
        // ]);
       // setTotalReviews(106125);
      }
    } catch (error) {
       setReviewData([]);
      setTotalReviews(0);
     // console.error('Error fetching sentiment distribution:', error);
      // Set dummy data as fallback
      // setReviewData([
      //   { sentiment: "Positive", count: 86878, percentage: 67, color: "#4CAF50" },
      //   { sentiment: "Neutral", count: 18368, percentage: 13, color: "#FFA000" },
      
      // ]);
      //setTotalReviews(106125);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!filtersLoading && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
    previousSelectedFilters.current = selectedFilters;
    fetchSentimentData();
  }
  }, [filtersLoading,selectedFilters]);

  return (
    <div className="w-full bg-white border-2">
      <div className="sectionIconHead mb-2">
        <div className='flex gap-2 items-center'>
          <MdOutlineDragIndicator
            {...listeners}
            {...attributes}
          />
          <div className="sectionIcon">
            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} />
          </div>
          <h4 className='flex gap-2 flex-row'>
            ReviewDistribution
          </h4>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
      ) : 
       totalReviews === 0 ? (
        // Show "No reviews found" message when there are no reviews
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-24 h-24 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Reviews Found
          </h3>
          <p className="text-gray-500 max-w-md">
            There are no reviews to display based on the current filters.
          </p>
        </div>
      ) 
      
      
      :(
        <div className="relative mb-8 group">
          {/* Donut Chart */}
          <DonutChart analyticData={reviewData} noOfIssue={totalReviews}/>
         

          {/* Table */}
          <div className="mt-8 overflow-x-auto p-2">
            <table className="w-full bg-white border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Sentiment</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Reviews</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Distribution %</th>
                </tr>
              </thead>
              <tbody>
                {reviewData.map((data, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                        {data.sentiment}
                      </div>
                    </td>
                    <td className="py-2 px-3">{data.count.toLocaleString()}</td>
                    <td className="py-2 px-3">{data.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

