import React from 'react';

import { ORBreakdownFilters,ORTabList,ORTabColumnList, ORBreakdownCustomFilters,ORPerformance, ORColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={ORColumnTitle}
        breakdownTabList={ORTabList}
        breakdownTabColumnList={ORTabColumnList}
        initbreakdownFilters={ORBreakdownFilters}
        breakdownCustomFilters={ORBreakdownCustomFilters}
        breakdownPerformance={ORPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
