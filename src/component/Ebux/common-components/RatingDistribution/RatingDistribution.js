import React, { useMemo, useState } from 'react';
import SortingButton from '../ComprehensiveBreakdown/DynamicSortButton';
import { MdOutlineDragIndicator } from "react-icons/md";
import { IoMdCopy } from 'react-icons/io';
import { copyToClipboard, getTextFromReactNode } from '../../../../utils/helpers';

const RatingDistribution = React.memo(({is_brand,is_competition_data, ratingData, listeners, attributes, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const sortedData = useMemo(() => {
   
    if (sortConfig.key) {
      return [...ratingData].sort((a, b) => {
        a = a?.[sortConfig?.key];
        b = b?.[sortConfig?.key];

        if (a === undefined || a === null) return 1;
        if (b === undefined || b === null) return -1;

        if (!isNaN(a) && !isNaN(b)) {
          a = parseFloat(a);
          b = parseFloat(b);
        }
        if (a < b) {
          return sortConfig.direction === 'ASC' ? -1 : 1;
        }
        if (a > b) {
          return sortConfig.direction === 'ASC' ? 1 : -1;
        }
        return 0;
      });
    }
    return ratingData;
  }, [ratingData, sortConfig]);

  const requestSort = (key) => {
  
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DSC';
    }
    setSortConfig({ key, direction });
    
  };

  const renderStars = (count) => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`text-lg ${index < count ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
  
  const renderLoadingState = () => (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-t hover:bg-gray-50">
          <td className="py-4 px-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-20"></div>
          </td>
          <td className="py-4 px-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-16"></div>
          </td>
          <td className="py-4 px-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-12"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderNoRatings = () => (
    <tbody>
      <tr>
        <td colSpan={is_brand&&is_competition_data?"5":"3"} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No Ratings Found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no ratings to display based on current filters
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <div className=" w-[100%]">
        <div className="bg-white sectionIconHead">
            <div className='flex gap-2 items-center'>
                <MdOutlineDragIndicator
                    {...listeners}
                    {...attributes}
                />
                <div className="sectionIcon">
                    <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} />
                </div>
                <h4 className='flex gap-2 flex-row'>
                  Rating  Distribution
                </h4>
            </div>
        </div>
        <div className=" mb-5 overflow-x-auto">
      <table className="text-left border border-gray-300 w-[100%] h-[100%] ">
        <thead className=''>
          <tr className="bg-gray-100 text-gray-700">
           
            <th className="py-2 px-4 cursor-pointer">
              <div className="sortingCol py-1 !justify-start" onClick={() => requestSort('stars')}>
                Star Ratings
                <SortingButton sortType={sortConfig.key === 'stars' ? sortConfig.direction : ''} />
              </div>
            </th>
            {is_brand && (
            <th className="py-2 px-2 cursor-pointer">
              <div className="sortingCol py-1 !justify-start" onClick={() => requestSort('count')}>
                Rating <br/>Count
                <SortingButton sortType={sortConfig.key === 'count' ? sortConfig.direction : ''} />
              </div>
            </th>
            )}
            {is_brand&& (
            <th className="py-2  cursor-pointer">
              <div className="sortingCol py-1 !justify-start" onClick={() => requestSort('percentage')}>
                Rating <br/>Distribution %
                <SortingButton sortType={sortConfig.key === 'percentage' ? sortConfig.direction : ''} />
              </div>
            </th>
            )}
            {is_competition_data && (
              <th className="py-2 px-2 cursor-pointer">
              <div className="sortingCol py-1 !justify-start" onClick={() => requestSort('comp_count')}>
                Competition <br/>Rating <br/>Count
                <SortingButton sortType={sortConfig.key === 'comp_count' ? sortConfig.direction : ''} />
              </div>
            </th>
            )}
            {is_competition_data && (
            <th className="py-2  cursor-pointer">
              <div className="sortingCol py-1 !justify-start" onClick={() => requestSort('comp_percentage')}>
                Competition <br/>Rating <br/>Distribution %
                <SortingButton sortType={sortConfig.key === 'comp_percentage' ? sortConfig.direction : ''} />
              </div>
            </th>
            )}
          </tr>
        </thead>
        {loading ? (
          renderLoadingState()
        ) : ratingData.length === 0 ? (
            renderNoRatings()
          ) : (
          <tbody >
            {sortedData?.map((data, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

            
                <td className="py-4 px-4">{renderStars(data?.stars)}</td>
            

            {is_brand&& (
                  <td className="py-4 px-4 group">

                    <div className="flex justify-start">
                      {data?.count??"-"}
                      {(data?.count) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(data?.count ?? "-")) }}><IoMdCopy /></span> : ""}

                    </div>
                  </td>
            )}

            {is_brand&& (
                <td className="py-4 px-4 group">
                  <div className="flex justify-start">
                      {data?.percentage??"-"}
                      {(data?.percentage) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(data?.percentage ?? "-")) }}><IoMdCopy /></span> : ""}

                    </div>
                  </td>
            )}
                {is_competition_data && (
                  <td className="py-4 px-4 group">
                    <div className="flex justify-start">
                      {data?.comp_count??"-"}
                      {(data?.comp_count) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(data?.comp_count ?? "-")) }}><IoMdCopy /></span> : ""}

                    </div>
                    </td>
                )}
                {is_competition_data && (
                  <td className="py-4 px-4 group">
                    <div className="flex justify-start">
                      {data?.comp_percent??"-"}
                      {(data?.comp_percent) ? <span className="cursor-pointer pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 self-center" onClick={(e) => { copyToClipboard(e, getTextFromReactNode(data?.comp_percent ?? "-")) }}><IoMdCopy /></span> : ""}

                    </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      </div>
    </div>
  );
});

// Add display name
RatingDistribution.displayName = 'RatingDistribution';

export default RatingDistribution;