import React from 'react';

import { CSBreakdownFilters,CSTabList,CSTabColumnList, CSBreakdownCustomFilters,CSPerformance, CSColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        breakdownCustomizeColumnTitle={CSColumnTitle}
        breakdownTabList={CSTabList}
        breakdownTabColumnList={CSTabColumnList}
        initbreakdownFilters={CSBreakdownFilters}
        breakdownCustomFilters={CSBreakdownCustomFilters}
        breakdownPerformance={CSPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
