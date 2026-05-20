import React from 'react';

import { SOSBreakdownFilters,SOSTabList,SOSTabColumnList, SOSBreakdownCustomFilters,SOSPerformance, SOSColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={SOSColumnTitle}
        breakdownTabList={SOSTabList}
        breakdownTabColumnList={SOSTabColumnList}
        initbreakdownFilters={SOSBreakdownFilters}
        breakdownCustomFilters={SOSBreakdownCustomFilters}
        breakdownPerformance={SOSPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
