"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import { getEbuxCategorySentiment } from "../../services/ratingreview";
import LoaderSpinner from "../../../common-components/loader-spinner";
import { isEqual } from "lodash";
import { useEbuxContext } from "../../Context/EbuxProvider";

// Fallback data in case API fails
// const fallbackData = {
//   "Product Quality": {
//     positive: [
//       {
//         text: "Amazing quality and sturdiness",
//         reviews: 130,
//         products: 100,
//       },
//     ],
//     neutral: [
//       {
//         text: "The product works as advertised, but nothing exceptional",
//         reviews: 130,
//         products: 100,
//       },
//     ],
//     negative: [
//       {
//         text: "The quality is far below what was advertised",
//         reviews: 50,
//         products: 100,
//       },
//     ],
//   },
//   "Packaging & Delivery": {
//     positive: [
//       {
//         text: "Outstanding customer service!",
//         reviews: 250,
//         products: 100,
//       },
//     ],
//     neutral: [
//       {
//         text: "Quality is decent for the price",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//     negative: [
//       {
//         text: "Customer support was unhelpful",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//   },
//   "Customer Service": {
//     positive: [
//       {
//         text: "I couldn't be happier with my choice – 5 stars!",
//         reviews: 250,
//         products: 100,
//       },
//     ],
//     neutral: [
//       {
//         text: "It meets the basic requirements I was looking for",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//     negative: [
//       {
//         text: "Definitely not worth the money",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//   },
//   "Value For Money": {
//     positive: [
//       {
//         text: "The best purchase I've made this year",
//         reviews: 250,
//         products: 100,
//       },
//     ],
//     neutral: [
//       {
//         text: "The design is fine but there's room for improvement",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//     negative: [
//       {
//         text: "The product feels overpriced for what it offers..........",
//         reviews: 100,
//         products: 100,
//       },
//     ],
//   },
// };


// Category mapping from API keys to display names
const categoryMapping = {
  "product_quality": "Product Quality",
  "delivery_packaging": "Packaging & Delivery",
  "customer_service": "Customer Service",
  "value_for_money": "Value For Money"
};

export default function SentimentAnalysis({listeners, attributes}) {
  const positiveRef = useRef(null);
  const neutralRef = useRef(null);
  const negativeRef = useRef(null);
  
  const [parameters, setParameters] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [activeParameter, setActiveParameter] = useState("");

  // Separate loading states for each sentiment
  const [loading, setLoading] = useState(true);
  const [isLazyLoading, setIsLazyLoading] = useState({
    positive: false,
    neutral: false,
    negative: false
  });

  // Separate pagination states for each sentiment
  const [paginationState, setPaginationState] = useState({
    positive: { startIndex: 0, hasMore: true },
    neutral: { startIndex: 0, hasMore: true },
    negative: { startIndex: 0, hasMore: true }
  });

  const previousSelectedFilters = useRef({});
  
  const {
    filtersLoading,
    filters,
    selectedFilters
  } = useEbuxContext();

  const fetchCategorySentiment = async (sentiment = null, startIndex = 0, append = false) => {
    try {
      if (!sentiment) {
        setLoading(true);
      } else {
        setIsLazyLoading(prev => ({ ...prev, [sentiment]: true }));
      }

      const data = await getEbuxCategorySentiment(
        filters,
        selectedFilters, 
        selectedFilters?.selectedPlatform,
        false,
        startIndex,
        1000  // Changed from 5000 to 1000 for consistent pagination
      );
      
      if (data && data.categories) {
        const transformedData = {};
        const parametersList = [];
        
        Object.entries(data.categories).forEach(([categoryKey, category]) => {
          const displayName = category.category || categoryMapping[categoryKey] || categoryKey;
          parametersList.push(displayName);

          const sentiments = category.sentiments || {};

          if (append && sentiment) {
            // Get existing data for the current category
            const existingData = reviewData[displayName] || {};
            const existingSentimentData = existingData[sentiment] || [];
            const currentSentiment = sentiments[sentiment];

            if (currentSentiment && currentSentiment.phrases) {
              // Create new sentiment data
              const newSentimentData = currentSentiment.phrases.map(phrase => ({
                text: phrase,
                reviews: currentSentiment.count,
                products: category.total_reviews || 0
              }));

              // Merge with existing data
              transformedData[displayName] = {
                ...existingData,
                [sentiment]: [...existingSentimentData, ...newSentimentData]
              };
            }
          } else {
            // Initialize all sentiments for new data
            transformedData[displayName] = {
              positive: (sentiments.positive?.phrases || []).map(phrase => ({
                text: phrase,
                reviews: sentiments.positive?.count || 0,
                products: category.total_reviews || 0
              })),
              neutral: (sentiments.neutral?.phrases || []).map(phrase => ({
                text: phrase,
                reviews: sentiments.neutral?.count || 0,
                products: category.total_reviews || 0
              })),
              negative: (sentiments.negative?.phrases || []).map(phrase => ({
                text: phrase,
                reviews: sentiments.negative?.count || 0,
                products: category.total_reviews || 0
              }))
            };
          }
        });

        if (append && sentiment) {
          
          // Update only the specific category and sentiment
          setReviewData(prev => {
            const updatedData = { ...prev };
            Object.keys(transformedData).forEach(category => {
              updatedData[category] = {
                ...updatedData[category],
                [sentiment]: transformedData[category][sentiment]
              };
            });
            return updatedData;
          });

          // Update pagination state based on actual data received
          const currentCategory = Object.keys(data.categories)[0];
          const currentSentimentData = data.categories[currentCategory]?.sentiments[sentiment];
          const receivedPhrases = currentSentimentData?.phrases || [];
          
          setPaginationState(prev => ({
            ...prev,
            [sentiment]: {
              startIndex: startIndex + receivedPhrases.length,
              hasMore: receivedPhrases.length === 1000 // If we got 1000 items, there might be more
            }
          }));
        } else {
          setParameters(parametersList);
          setReviewData(transformedData);
          setActiveParameter(parametersList[0] || "");
          
          // Reset pagination states for initial load
          setPaginationState({
            positive: { startIndex: 0, hasMore: true },
            neutral: { startIndex: 0, hasMore: true },
            negative: { startIndex: 0, hasMore: true }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      // if (!sentiment) {
      //   setParameters(Object.keys(fallbackData));
      //   setReviewData(fallbackData);
      //   setActiveParameter(Object.keys(fallbackData)[0] || "");
      // }
    } finally {
      if (!sentiment) {
        setLoading(false);
      } else {
        setIsLazyLoading(prev => ({ ...prev, [sentiment]: false }));
      }
    }
  }; 


   const parametersWithData = useMemo(() => {
    return parameters.filter(param => {
      const data = reviewData[param];
      return data && (
        data.positive?.length > 0 || 
        data.neutral?.length > 0 || 
        data.negative?.length > 0
      );
    });
  }, [parameters, reviewData]);

  // Update active parameter when data changes
  useEffect(() => {
    if (activeParameter) {
      const currentData = reviewData[activeParameter];
      const hasData = currentData && (
        currentData.positive?.length > 0 || 
        currentData.neutral?.length > 0 || 
        currentData.negative?.length > 0
      );
      
      if (!hasData && parametersWithData.length > 0) {
        setActiveParameter(parametersWithData[0]);
      }
    } else if (parametersWithData.length > 0) {
      setActiveParameter(parametersWithData[0]);
    }
  }, [reviewData, parametersWithData, activeParameter]);




  // const fetchCategorySentiment = async (sentiment = null, startIndex = 0, append = false) => {
  //   try {
  //     if (!sentiment) {
  //       setLoading(true);
  //     } else {
  //       setIsLazyLoading(prev => ({ ...prev, [sentiment]: true }));
  //     }

  //     const data = await getEbuxCategorySentiment(
  //       filters,
  //       selectedFilters, 
  //       selectedFilters?.selectedPlatform,
  //       false,
  //       startIndex,
  //       5000
  //     );
  //     console.log("chekingdata is",data);
      
  //     if (data && data.categories) {
  //       const transformedData = {};
  //       const parametersList = [];
        
  //       Object.entries(data.categories).forEach(([categoryKey, category]) => {
  //       const displayName = category.category || categoryMapping[categoryKey] || categoryKey;
  //       parametersList.push(displayName);

  //       // FIX 2: Handle missing sentiments
  //       const sentiments = category.sentiments || {};

  //       if (append && sentiment) {
  //         const existingData = reviewData[displayName] || {};
  //         const existingSentimentData = existingData[sentiment] || [];
  //         const currentSentiment = sentiments[sentiment];

  //         // Only append if sentiment exists
  //         if (currentSentiment) {
  //           transformedData[displayName] = {
  //             ...existingData,
  //             [sentiment]: [
  //               ...existingSentimentData,
  //               ...currentSentiment.phrases.map(phrase => ({
  //                 text: phrase,
  //                 reviews: currentSentiment.count,
  //                 products: category.total_reviews || 0 // FIX 3: Use actual data
  //               }))
  //             ]
  //           };
  //         }
  //       } else {
  //         // Safely initialize all sentiments
  //         transformedData[displayName] = {
  //           positive: (sentiments.positive?.phrases || []).map(phrase => ({
  //             text: phrase,
  //             reviews: sentiments.positive.count,
  //             products: category.total_reviews || 0 // FIX 3
  //           })),
  //           neutral: (sentiments.neutral?.phrases || []).map(phrase => ({
  //             text: phrase,
  //             reviews: sentiments.neutral.count,
  //             products: category.total_reviews || 0 // FIX 3
  //           })),
  //           negative: (sentiments.negative?.phrases || []).map(phrase => ({
  //             text: phrase,
  //             reviews: sentiments.negative.count,
  //             products: category.total_reviews || 0 // FIX 3
  //           }))
  //         };
  //       }
  //     });

        
  //       if (append && sentiment) {
  //         setReviewData(prev => ({
  //           ...prev,
  //           ...transformedData
  //         }));
  //       } else {
  //         setParameters(parametersList);
  //         setReviewData(transformedData);
  //         setActiveParameter(parametersList[0] || "");
  //       }

  //       // Update pagination state
  //       if (sentiment) {
  //         const dataLength = data.categories[Object.keys(data.categories)[0]]?.sentiments[sentiment]?.phrases?.length || 0;
  //         setPaginationState(prev => ({
  //           ...prev,
  //           [sentiment]: {
  //             startIndex: startIndex + 1000,
  //             hasMore: dataLength === 1000
  //           }
  //         }));
  //       }
  //     }
  //   } catch (error) {
  //     if (!sentiment) {
  //       setParameters(Object.keys(fallbackData));
  //       setReviewData(fallbackData);
  //       setActiveParameter(Object.keys(fallbackData)[0] || "");
  //     }
  //   } finally {
  //     if (!sentiment) {
  //       setLoading(false);
  //     } else {
  //       setIsLazyLoading(prev => ({ ...prev, [sentiment]: false }));
  //     }
  //   }
  // };

  useEffect(() => {
    if (!filtersLoading && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
      fetchCategorySentiment();
      // Reset pagination states
      setPaginationState({
        positive: { startIndex: 0, hasMore: true },
        neutral: { startIndex: 0, hasMore: true },
        negative: { startIndex: 0, hasMore: true }
      });
    }
  }, [filtersLoading, selectedFilters]);

  const handleScroll = (sentiment) => {
    if (isLazyLoading[sentiment] || !paginationState[sentiment].hasMore) return;

    const container = {
      positive: positiveRef.current,
      neutral: neutralRef.current,
      negative: negativeRef.current,
    }[sentiment];

    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight - scrollTop - clientHeight < 100) {

     
      fetchCategorySentiment(
        sentiment,
        paginationState[sentiment].startIndex,
        true
      );
    }
  };

  useEffect(() => {
    const positiveContainer = positiveRef.current;
    const neutralContainer = neutralRef.current;
    const negativeContainer = negativeRef.current;

    const handlePositiveScroll = () => handleScroll('positive');
    const handleNeutralScroll = () => handleScroll('neutral');
    const handleNegativeScroll = () => handleScroll('negative');

    if (positiveContainer) positiveContainer.addEventListener('scroll', handlePositiveScroll);
    if (neutralContainer) neutralContainer.addEventListener('scroll', handleNeutralScroll);
    if (negativeContainer) negativeContainer.addEventListener('scroll', handleNegativeScroll);

    return () => {
      if (positiveContainer) positiveContainer.removeEventListener('scroll', handlePositiveScroll);
      if (neutralContainer) neutralContainer.removeEventListener('scroll', handleNeutralScroll);
      if (negativeContainer) negativeContainer.removeEventListener('scroll', handleNegativeScroll);
    };
  }, [isLazyLoading, reviewData, activeParameter, paginationState]);

  // ... keep your exi


  const currentData = activeParameter ? reviewData[activeParameter] : null;
  const hasPositiveData = currentData?.positive?.length > 0;
  const hasNeutralData = currentData?.neutral?.length > 0;
  const hasNegativeData = currentData?.negative?.length > 0;

  if (loading) {
    return (
      <div className="border-2 bg-white p-4">
        <div className="flex gap-2 items-center mb-4">
          <MdOutlineDragIndicator
            {...listeners}
            {...attributes}
          />
          <div className="sectionIcon">
            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Comprehensive Icon" />
          </div>
          <h4>Sentiment Analysis</h4>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full max-w-md mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 bg-white">
      <div className="sectionIconHead mb-2">
        <div className='flex gap-2 items-center'>
          <MdOutlineDragIndicator
            {...listeners}
            {...attributes}
          />
          <div className="sectionIcon">
            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} alt="Comprehensive Icon" />
          </div>
          <h4 className='flex gap-2 flex-row'>
            Sentiment Analysis
          </h4>
        </div>
      </div>
      <div className="m-2">
        <div className="border-2 p-2">
          <div className="flex justify-between">
            {/* Parameters Column */}
            <div className="w-48 md:w-1/4 border overflow-hidden h-[500px]">
              <div className="p-4 bg-gray-50 border-b font-bold text-lg">Parameters</div>
              <div className="flex flex-col  ">
                {parameters.map((param) => {
  const paramData = reviewData[param];
                  const hasData = paramData && (
                    paramData.positive?.length > 0 || 
                    paramData.neutral?.length > 0 || 
                    paramData.negative?.length > 0
                  );
                  return(
                  <button
                    key={param}
                      onClick={() => hasData && setActiveParameter(param)}
                      disabled={!hasData}
                      className={`text-left px-8 py-4 mt-4 h-[90px] ${
                        activeParameter === param 
                          ? "border-l-4 border-blue-500 bg-blue-50" 
                          : ""
                      } ${
                        !hasData 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-gray-50"
                      }`}
                  >
                    {param}
                  </button>)
})}
              </div>
            </div>

            {/* Review Columns */}
            <div className="flex flex-wrap gap-4 w-3/4">
              {/* Positive Column */}
               {/* Positive Column */}

               {
                hasPositiveData ?   <div className="w-48 md:w-[30%] border-2 border-[#4CAF50] overflow-hidden h-[500px]">
          {/* ... header ... */}
          <div className="p-4 border-b flex items-center gap-2">
              <div className="w-5 h-5 border-[#4CAF50]  rounded-full bg-[#4CAF50]" />
              <span className="font-large text-lg font-bold">Positive</span>
            </div>
          <div className="p-4 overflow-y-auto h-[440px]" ref={positiveRef}>
            {activeParameter && reviewData[activeParameter]?.positive?.map((quote, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-[#4CAF50] font-medium mb-2">{quote.text}</p>
                <p className="text-sm text-gray-600">
                  (in {quote.reviews} reviews and {quote.products} products)
                </p>
              </div>
            ))}
            {isLazyLoading.positive && <LoaderSpinner />}
          </div>
        </div>
: (
                <div className="w-48 md:w-[30%] border-2 border-gray-200 overflow-hidden h-[500px] opacity-50">
                  <div className="p-4 border-b flex items-center gap-2">
                    <div className="w-5 h-5 border-gray-300 rounded-full bg-gray-300" />
                    <span className="font-large text-lg font-bold text-gray-400">Positive</span>
                  </div>
                  <div className="flex items-center justify-center h-[440px] text-gray-400">
                    No data available
                  </div>
                </div>
              )
               }
      
        {/* Neutral Column */}
        {
          hasNeutralData ? <div className="w-48 md:w-[30%] border-2 border-[#FFA000] overflow-hidden h-[500px]">
          {/* ... header ... */}
          <div className="p-4 border-b flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFA000]" />
              <span className="font-large text-lg font-bold">Neutral</span>
            </div>
          <div className="p-4 overflow-y-auto h-[440px]" ref={neutralRef}>
            {activeParameter && reviewData[activeParameter]?.neutral?.map((quote, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-[#FFA000] font-medium mb-2">{quote.text}</p>
                <p className="text-sm text-gray-600">
                  (in {quote.reviews} reviews and {quote.products} products)
                </p>
              </div>
            ))}
            {isLazyLoading.neutral && <LoaderSpinner />}
          </div>
        </div>:(
                <div className="w-48 md:w-[30%] border-2 border-gray-200 overflow-hidden h-[500px] opacity-50">
                  <div className="p-4 border-b flex items-center gap-2">
                    <div className="w-5 h-5 border-gray-300 rounded-full bg-gray-300" />
                    <span className="font-large text-lg font-bold text-gray-400">Neutral</span>
                  </div>
                  <div className="flex items-center justify-center h-[440px] text-gray-400">
                    No data available
                  </div>
                </div>
              )
        }
       

        {/* Negative Column */}
        {
          hasNegativeData ? <div className="w-48 md:w-[30%] border-2 border-[#FF5252] overflow-hidden h-[500px]">
          {/* ... header ... */}
          <div className="p-4 border-b flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5252]" />
              <span className="font-large text-lg font-bold">Negative</span>
            </div>
            
          <div className="p-4 overflow-y-auto h-[440px]" ref={negativeRef}>
            {activeParameter && reviewData[activeParameter]?.negative?.map((quote, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-[#FF5252] font-medium mb-2">{quote.text}</p>
                <p className="text-sm text-gray-600">
                  (in {quote.reviews} reviews and {quote.products} products)
                </p>
              </div>
            ))}
            {isLazyLoading.negative && <LoaderSpinner />}
          </div>
        </div>:(
                <div className="w-48 md:w-[30%] border-2 border-gray-200 overflow-hidden h-[500px] opacity-50">
                  <div className="p-4 border-b flex items-center gap-2">
                    <div className="w-5 h-5 border-gray-300 rounded-full bg-gray-300" />
                    <span className="font-large text-lg font-bold text-gray-400">Negative</span>
                  </div>
                  <div className="flex items-center justify-center h-[440px] text-gray-400">
                    No data available
                  </div>
                </div>
              )
        }
       

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
