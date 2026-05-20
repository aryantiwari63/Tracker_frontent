import React from 'react';

import { RRBreakdownFilters,RRTabList,RRTabColumnList, RRBreakdownCustomFilters,RRPerformance, RRColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {
   



    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={RRColumnTitle}
        breakdownTabList={RRTabList}
        breakdownTabColumnList={RRTabColumnList}
        initbreakdownFilters={RRBreakdownFilters}
        breakdownCustomFilters={RRBreakdownCustomFilters}        
        breakdownPerformance={RRPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
