import React, { useEffect, useRef, useState } from 'react';
import RatingDistribution from './RatingDistribution';
import { getEbuxGraphicalRatingDistribution } from '../../services/ratingreview';
import { useEbuxContext } from '../../Context/EbuxProvider';
import { isEqual } from 'lodash';

const RatingDistributionExample = ({is_brand,listeners, attributes}) => {
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
   const previousSelectedFilters = useRef({});


      const {
          filtersLoading,activeClientProject,
          // selectedPlatform,
          filters,
          selectedFilters
      } = useEbuxContext();

      const fetchRatingDistribution = async () => {
        try {
          setLoading(true);
          const is_competition_data = ([2,101,103,104].indexOf(activeClientProject?.client_project_id)>-1||activeClientProject?.useNewRRView);
          const data = await getEbuxGraphicalRatingDistribution(is_competition_data,filters, selectedFilters, selectedFilters?.selectedPlatform,false);
          
          if (data && data.length > 0) {
            // Transform API data to match component format
            const formattedData = data.map(item => ({
              stars: parseInt(item?.rating),
              count: item?.count?? 0,
              percentage: item?.percent?? '0%',
              comp_count: item?.comp_count ?? 0,
              comp_percent: item?.comp_percent ?? '0%'
            }));
            
            // Sort by star rating (5 to 1)
            formattedData.sort((a, b) => b.stars - a.stars);
            setRatingData(formattedData);
          } else {
            // Fallback to dummy data if API returns empty
          // No data case
        setRatingData([]);
          }
        } catch (error) {
       //   console.error('Error fetching rating distribution:', error);
          // Set dummy data as fallback
       // No data case
        setRatingData([]);
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
   
    if (!filtersLoading && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
   
      
      previousSelectedFilters.current = selectedFilters;
    fetchRatingDistribution();

    }
  }, [filtersLoading,selectedFilters]);

  return (
    <RatingDistribution 
      ratingData={ratingData} 
      listeners={listeners} 
      attributes={{attributes}} 
      loading={loading} 
      is_competition_data={([2,101,103,104].indexOf(activeClientProject?.client_project_id)>-1||activeClientProject?.useNewRRView)}
      is_brand={is_brand}
    />
  );
};

export default RatingDistributionExample;
