import React, { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-modern-drawer/dist/index.css';
import TrendAnalysisSankeyChart from './TrendAnalysisSankeyChart';
import TrendAnalysisTable from './TrendAnalysisTable';

const TrendAnalysisV1 = () => {
    const [selectedData, setSelectedData] = useState({ timeView: 'monthly', periods: [], rows: [] });
    return (
        <>
            <div className="graphicalSection">

                <div className="w-full">
                    <div className="w-full">
                        <div className='p-4 '>
                            <div className="flex gap-2 p-4 w-full border justify-between rounded-lg border-[#D9D9D9]">
                                <div className="w-full">
                                    <TrendAnalysisSankeyChart selectedData={selectedData} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 w-full justify-between">
                            <div className="w-full">
                                <TrendAnalysisTable setSelectedData={setSelectedData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrendAnalysisV1;