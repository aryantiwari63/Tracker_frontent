import React from 'react';

import { PROBreakdownFilters,PROTabList,PROTabColumnList, PROBreakdownCustomFilters,PROPerformance, PROColumnTitle } from './kpiTabColumnList';
import BreakdownComponent from '../../Breakdown';



const ComprehensiveBreakdownComponent = ({ listeners, attributes, platformSubCat }) => {

    return (
        <BreakdownComponent 
        listeners={listeners}
        attributes={attributes}
        
        breakdownCustomizeColumnTitle={PROColumnTitle}
        breakdownTabList={PROTabList}
        breakdownTabColumnList={PROTabColumnList}
        initbreakdownFilters={PROBreakdownFilters}
        breakdownCustomFilters={PROBreakdownCustomFilters}        
        breakdownPerformance={PROPerformance}
        platformSubCat={platformSubCat}
        />
    );
};

export default ComprehensiveBreakdownComponent;
