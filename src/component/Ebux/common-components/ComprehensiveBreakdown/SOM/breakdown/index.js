import React from 'react';

import { SOMBreakdownFilters,SOMTabList,SOMTabColumnList, SOMBreakdownCustomFilters,SOMPerformance, SOMColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={SOMColumnTitle}
        breakdownTabList={SOMTabList}
        breakdownTabColumnList={SOMTabColumnList}
        initbreakdownFilters={SOMBreakdownFilters}
        breakdownCustomFilters={SOMBreakdownCustomFilters}
        breakdownPerformance={SOMPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
