import React from 'react';

import { OSABreakdownFilters,OSATabList,OSATabColumnList, OSABreakdownCustomFilters,OSAPerformance, OSAColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {
// console.log('555',platformSubCat)
    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={OSAColumnTitle}
        breakdownTabList={OSATabList}
        breakdownTabColumnList={OSATabColumnList}
        initbreakdownFilters={OSABreakdownFilters}
        breakdownCustomFilters={OSABreakdownCustomFilters}
        breakdownPerformance={OSAPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
