import React from 'react';

import { SODBreakdownFilters,SODTabList,SODTabColumnList, SODBreakdownCustomFilters,SODPerformance, SODColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {
// console.log('555',platformSubCat)
    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={SODColumnTitle}
        breakdownTabList={SODTabList}
        breakdownTabColumnList={SODTabColumnList}
        initbreakdownFilters={SODBreakdownFilters}
        breakdownCustomFilters={SODBreakdownCustomFilters}
        breakdownPerformance={SODPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;