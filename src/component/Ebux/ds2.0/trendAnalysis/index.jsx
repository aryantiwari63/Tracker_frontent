import React, { useMemo, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-modern-drawer/dist/index.css';
import TrendAnalysisSankeyChart from './TrendAnalysisSankeyChart';
import TrendAnalysisTable from './TrendAnalysisTable';
import { useEbuxContext } from '../../Context/EbuxProvider';

const getTabIconUrl = (tab_name) => {
    switch (tab_name) {
        case "category": return "/assets/images/megaphone.svg";
        case "keyword": return "/assets/images/productInActiveImage.svg";
        case "product": return "/assets/images/productInActiveImage.svg";
        case "brand": return "/assets/images/brandIcon.svg";
        case "location": return "/assets/images/locationIcon.svg";
        case "platform": return "/assets/images/platformIcon.svg";
        default: return "/assets/images/locationIcon.svg";
    }
};
const getTabIcon = (tab_name) => {
    const icon = getTabIconUrl(tab_name);
    return <img src={icon} alt={tab_name} className="filter-logo" />;
};
const TrendAnalysis = () => {
    const [tabColumnList, setTabColumnList] = useState({});


    const { kpi, clientCustomizeColumnsComprehensiveBreakdown, filters, activeClientProject } = useEbuxContext();
    const pf_images = filters?.platform?.reduce((map, i) => { map[i.label?.toLowerCase()] = i.platform_description ?? ""; return map; }, {});
    const allTabs = ["Category", ...((["SOS", "OR"].indexOf(kpi) > -1) ? ["Keyword"] : ["Product"]), ...["Brand", "Location", "Platform"]];

    const [activeTab, setActiveTab] = useState(allTabs?.[0]?.toLocaleLowerCase());
    const kpicol = (clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => ((i?.allowKPI?.indexOf(kpi) > -1) && ([...(activeClientProject?.useWeightedSOS ? ["wt_sos"] : ["sos", "or"]), "avg_osa", 'osa', 'price_variation', 'price_rp', 'price_sp']?.indexOf(i?.key) > -1) && (!i?.isDisabled)))?.map(i => ({ ...i, label: i?.value == "osa" ? "Avg OSA" : i?.title, title: i?.value == "osa" ? "Avg OSA" : i?.title, id: i?.value, checked: i?.kpi?.indexOf(kpi) > -1, disabled: i?.isDisabled })));
    const allow_nd_osa = clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => ["nd_osa", "nestle_nd_osa", "nestle_nd_osa_daily"].indexOf(i?.key) > -1)?.length > 0;
    const allow_nestle_nd_osa_darkstore_coverage = clientCustomizeColumnsComprehensiveBreakdown?.ds?.columns?.filter(i => ["nestle_nd_osa_darkstore_coverage"].indexOf(i?.key) > -1)?.length > 0;
    const metricDropdownOptions = kpicol?.map(i => ({ label: i?.label ?? i?.title, value: i?.value ?? i?.key })) ?? [
        { label: 'Avg OSA', value: 'osa' },
        // { label: 'OOS Days', value: 'oos-days' },
        { label: 'Promotions', value: 'price_variation' },
        { label: 'Selling Price', value: 'price_sp' },
        { label: 'MRP', value: 'price_rp' },
        // { label: 'Total Score', value: 'total-score' },
        // { label: 'Rating', value: 'rating' },
        // { label: 'Review Count', value: 'review-count' },
    ];
    const [selectedMetric, setSelectedMetric] = useState(kpi == "OSA" ? 'osa' : kpi == "SOS" ? "sos" : "price_variation");
    const kpiInfo = useMemo(() => { if (!selectedMetric) { return {}; } return kpicol?.filter((k) => k?.value == selectedMetric)?.[0] ?? {}; }, [kpicol, selectedMetric])
    const [selectedData, setSelectedData] = useState({ timeView: 'monthly', periods: [], rows: [] });

    const [loading, setLoading] = useState(false);
    return (
        <>
            <div className="graphicalSection">
                <div className="w-full">
                    <div className="w-full">
                        <div className='p-4 '>
                            <div className="flex gap-2 p-4 w-full border justify-between rounded-lg border-[#D9D9D9]">
                                <div className="w-full">
                                    <TrendAnalysisSankeyChart loading={loading} setLoading={setLoading} activeTab={activeTab} getTabIconUrl={getTabIconUrl} getTabIcon={getTabIcon} kpiInfo={kpiInfo} selectedMetric={selectedMetric} metricDropdownOptions={metricDropdownOptions} setSelectedMetric={setSelectedMetric} selectedData={selectedData} pf_images={pf_images} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 w-full justify-between">
                            <div className="w-full">
                                <TrendAnalysisTable tabColumnList={tabColumnList} setTabColumnList={setTabColumnList} loading={loading} setLoading={setLoading} activeTab={activeTab} setActiveTab={setActiveTab} allTabs={allTabs} getTabIcon={getTabIcon} kpiInfo={kpiInfo} selectedMetric={selectedMetric} setSelectedData={setSelectedData} pf_images={pf_images} allow_nd_osa={allow_nd_osa} allow_nestle_nd_osa_darkstore_coverage={allow_nestle_nd_osa_darkstore_coverage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* <TrendAnalysisV1 /> */}
        </>
    );
};

export default TrendAnalysis;