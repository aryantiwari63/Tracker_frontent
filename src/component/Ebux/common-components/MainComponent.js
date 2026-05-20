import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Link } from "react-router-dom";

//import RatingReviews from '../RatingReviews';
import Promotions from '../Promotions';
import ContentScore from '../ContentScore';
import ShareDisplay from "../ShareDisplay";
import SOS from '../SOS';
import OSA from '../OSA';
import Loader from "./Loader";
import SOM from "../SOM";

import HeaderFiltersComponent from "./HeaderFiltersComponent";
import { useEbuxContext } from "../Context/EbuxProvider";
import { EbuxTableProvider } from "../Context/EbuxTableProvider";
import OrganicRanking from "../OrganicRanking";
import { fetchKPIOverallData } from "../services/platformTab.services";
import { isEqual } from "lodash";
import RatingReviewsnew from "../RatingReviewsnew";
import RatingReviews from "../RatingReviews";
import { trackDashboardClick } from "../../../analytics/EventController";


const MainComponent = ({ mainKpi }) => {

    const { kpi, kpiMap, percentageIcon,
        filters, selectedFilters,
        updateSelectedSOSType,

        // selectedPlatform,
        filtersLoading,
        activeClientProject,
        // setFiltersLoading,
        initKpiSet, error } = useEbuxContext();
    const enabledKPIs = activeClientProject.kpi || {};

    const previousSelectedFilters = useRef({});
    const [loading, setLoading] = useState(false);


    // const filteredKpiMap = Object.keys(kpiMap)
    // .filter((key) => enabledKPIs[key]) // Keep only KPIs that are set to true
    // .reduce((obj, key) => {
    //   obj[key] = kpiMap[key];
    //   return obj;
    // }, {});
    const filteredKpiMap = Object.keys(kpiMap).reduce((obj, key) => {
        obj[key] = { ...kpiMap[key], status: !!enabledKPIs[key] };
        return obj;
    }, {});
    console.log('checkkkk----', filteredKpiMap)
    const [averagePercentageData, setAveragePercentageData] = useState({});
    useEffect(() => {
        initKpiSet(mainKpi);
    }, [mainKpi]);

    const handleSelectTab = () => {
        // event.preventDefault();
        // setActiveTabIndex(index); 
    };
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const getStatus = (data) => {
        const diff = (data?.currentData ?? 0) - (data?.previousData ?? 0);

        if (data?.currentData && (selectedFilters?.[selectedFilters?.calendarType == "week"?"selectedWeeks":"selectedDateRange"]?.isCompareToPrevious) && (!isNaN(diff))) {
            if (diff < 0) {
                return <span className="ml-2 statsStatus downStatus">
                    <img src="/assets/images/downArrow.svg" width={8} alt="Down Arrow" />{Math.abs(diff)?.toFixed(2)} {percentageIcon}
                </span>;

            } else {
                return <span className="ml-2 statsStatus upStatus">
                    <img src="/assets/images/upArrow.svg" width={8} alt="Up Arrow" />{diff.toFixed(2)} {percentageIcon}
                </span>;

            }
        } else {
            return <></>;
        }


    }




    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const currentData = await fetchKPIOverallData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, false);

            let previousData = {};
            if (selectedFilters?.[selectedFilters?.calendarType == "week"?"selectedWeeks":"selectedDateRange"]?.isCompareToPrevious) {
                previousData = await fetchKPIOverallData(kpi, filters, selectedFilters, selectedFilters.selectedPlatform, true);
            }
            const avg = {};
            Object.keys(currentData)?.forEach(k => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]['currentData'] = currentData[k];
            });

            Object.keys(previousData)?.forEach(k => {
                if (!avg[k]) {
                    avg[k] = {};
                }
                avg[k]['previousData'] = previousData[k];
            })
            // eslint-disable-next-line no-console
            //   console.log({avg});
            setAveragePercentageData(avg);
            setLoading(false);
        }
        if (!filtersLoading && filters?.platform?.length && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
            previousSelectedFilters.current = selectedFilters;
            fetchData();
        }
    }, [filtersLoading, selectedFilters]);


    const KPI_COMPONENTS = {
        OSA: <OSA />,
        SOS: <SOS />,
        OR: <OrganicRanking />,
        CS: <ContentScore />,
        PRO: <Promotions />,
        RR:
            ([2, 101, 103, 102].includes(activeClientProject?.client_project_id) ||
                activeClientProject?.useNewRRView)
                ? <RatingReviewsnew />
                : <RatingReviews />,
        SOM: <SOM />,
        SOD: <ShareDisplay />,
    };

    return (
        <>
            <HeaderFiltersComponent />
            {(kpi == mainKpi && !filtersLoading && filters?.platform?.length > 0) ?
                <EbuxTableProvider>
                    <div className="ebuxStatsSection ">
                        <Tabs selectedIndex={filteredKpiMap[kpi]['index']} onSelect={handleSelectTab}>
                            <div className="tabsWrap">
                                <TabList>
                                    {Object.keys(filteredKpiMap).map((item, i) => {
                                        if (filteredKpiMap[item]['status']) {
                                            return (
                                                <Link to={filteredKpiMap[item]['link']} key={i}>
                                                    <Tab disabled={(kpi != item)}>
                                                        <div className={kpi == item ? 'statsBox activeStatsBox' : 'statsBox cursor-pointer'} onClick={(e) => {
                                                            // console.log('hihihihi',e.type,filteredKpiMap[item])
                                                            trackDashboardClick({
                                                                section: 'Dashboard sections', eventaction: e.type, eventlabel: filteredKpiMap[item]["lable"] === "Keyword" ? "Keyword" :
                                                                    filteredKpiMap[item]["lable"] === "Promotions"
                                                                        ? "promotion"
                                                                        :
                                                                        filteredKpiMap[item]["lable"].toLowerCase()
                                                            })

                                                        }}>
                                                            {item=="SOS" && [4,2,11]?.indexOf(activeClientProject?.client_project_id)>-1
                                                            ?
                                                            <div className="inline-flex align-items-center justify-content-between gap-2">
                                                                <h6 className="flex-1">{filteredKpiMap[item]['lable']}</h6>
                                                                <div>
                                                                <select disabled={kpi!=item} value={selectedFilters?.selected_sos_type} onChange={(e)=>updateSelectedSOSType(e?.target?.value)} className="form-select form-select-sm text-sm rounded border border-black !bg-white "> 
                                                                    <option value="overall">Overall</option>
                                                                    <option value="organic">Organic</option>
                                                                    <option value="paid">Paid</option>
                                                                </select>
                                                                </div>
                                                            </div>
                                                            // : (item=="OR" && activeClientProject?.client_project_id==4)
                                                            : (item=="OR")
                                                            ? <h6>Ranking</h6>
                                                            : <h6>{filteredKpiMap[item]['lable']}</h6>}

                                                            <div className="statsBoxData">
                                                                <span className="statsPercent">

                                                                    <>
                                                                        {loading && (<Loader show={loading} fullScreen={false} />)}
                                                                        {!loading && (<>{averagePercentageData?.[item]?.currentData ? (`${averagePercentageData?.[item]?.currentData?.toFixed(2)} ${filteredKpiMap[item]['percentageIcon']} `) : '...'}</>)}
                                                                    </>

                                                                </span>
                                                                {(!loading && kpi == item) && <>{getStatus(averagePercentageData?.[item])}</>}
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Link>
                                            );
                                        }
                                        return (
                                            <Tab key={i} disabled={(kpi != item)} style={{ display: 'none' }}></Tab>
                                        );
                                    }
                                    )}
                                    {/* <Tab disabled>
                                        <div className={kpi == "MS" ? 'statsBox activeStatsBox' : 'statsBox cursor-not-allowed'}>
                                            <h6>Market Share</h6>
                                            <div className="statsBoxData">
                                                <span className="statsPercent">{(kpi == "MS") ? `${averagePercentageData?.avg?.currentData}% ` : "..."} </span>
                                                {(kpi == "MS") && <span className="statsStatus downStatus"><img src="/assets/images/downArrow.svg" width={8} /> 0%</span>}
                                            </div>
                                        </div>
                                    </Tab> */}
                                </TabList>
                            </div>
                            {Object.keys(filteredKpiMap).map((item, i) => {
                                const isActive = filteredKpiMap[item]?.status && kpi === item;

                                return (
                                    <TabPanel key={i} style={!isActive ? { display: "none" } : {}}>
                                        {isActive && KPI_COMPONENTS[item]}
                                    </TabPanel>
                                );
                            })}
                            {/* {filteredKpiMap["OSA"]['status'] &&
                            <TabPanel>
                                <OSA />
                            </TabPanel>}

                            {filteredKpiMap["SOS"]['status'] &&
                            <TabPanel>
                                <SOS />
                            </TabPanel>}

                            {filteredKpiMap["OR"]['status'] &&
                            <TabPanel>
                                <OrganicRanking />
                            </TabPanel>}

                            {filteredKpiMap["CS"]['status'] &&
                            <TabPanel>
                                <ContentScore />
                            </TabPanel>}

                            {filteredKpiMap["PRO"]['status'] &&
                            <TabPanel>
                                <Promotions />
                            </TabPanel>} */}

                            {/* <TabPanel>                        
                                <OrganicRanking
                                loadingReport={loadingReport}
                                loadingReportData={loadingReportData}
                                
                                filters={filters}
                                filterData={filterData}
                                averagePercentageData={averagePercentageData} handlePlatformClick={handlePlatformClick}  />
                            </TabPanel> */}

                            {/* {filteredKpiMap["RR"]['status'] &&
                            <TabPanel>

                            {( [2,101,103].indexOf(activeClientProject?.client_project_id)>-1||activeClientProject?.useNewRRView) ? <RatingReviewsnew /> : <RatingReviews /> }




                            </TabPanel>} */}
                            {/* {filteredKpiMap["SOM"]['status'] &&
                            <TabPanel>
                                <SOM />
                            </TabPanel>} */}
                            {/* <TabPanel>
                                <ShareDisplay />
                            </TabPanel> */}
                            {/* {filteredKpiMap["SOD"]['status'] &&
                                <TabPanel>
                                    <ShareDisplay />
                                </TabPanel>
                            } */}

                            {/* <TabPanel>
                                <h6>Market Share</h6>
                            </TabPanel> */}
                        </Tabs>
                    </div>
                </EbuxTableProvider>

                :
                <Loader show={filtersLoading} fullScreen={false} />
            }
        </>
    );
};

export default MainComponent;
