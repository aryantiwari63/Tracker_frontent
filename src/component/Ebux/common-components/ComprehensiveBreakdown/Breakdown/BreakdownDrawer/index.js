
import { useEffect, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import BreakDownTable from "./BreakdownTable";
import BreakdownGraph from "./BreakdownGraph";
import { fetchDailyBasisComprehensiveBreakdownData } from "../../../../services/comprehensiveBreakdown.services";


const BreakdownDrawer = ({ onClose, drawerInfo, selectedTableRows = [], comprehensiveBreakdownTableData = [], breakdownFilters = [], breakdownPerformance = {} }) => {

    const {
        kpi,
        selectedPlatform,
        selectedFilters,
        filters
    } = useEbuxContext();


    const [graphOutputKey, setGraphOutputKey] = useState(breakdownPerformance?.GraphOutputKey);

    const [loading, setLoading] = useState(false);


    const [reportTableData, setReportTableData] = useState([]);
    const [perviousReportTableData, setPerviousReportTableData] = useState([]);

    useEffect(() => {
        //    console.log("drawerInfo?.column",drawerInfo?.column);

        async function fetchData() {
            setLoading(true);
            console.log("chekingdata is",drawerInfo?.column);
            
            let datakey;
            switch (drawerInfo?.column) {
                case 'location':
                    datakey = "location_name";
                    break;
                case 'category':
                    datakey = "brand_category_id";
                    break;

                case 'sku':
                    datakey = "sku_id";
                    break;

                case 'brand':
                    datakey = "brand_id";
                    break;

                case 'platform':
                    datakey = "pf_id";
                    break;
                case 'keyword':
                    datakey = "keyword_id";
                    break;

                case 'dark store id':
                    datakey = "dark_store_id";
                    break;
              
                case 'category node':
                    datakey = "category_link";
                    break;

                default:
                    setReportTableData([]);
                    setPerviousReportTableData([]);
                    break;
            }
            if (datakey) {
                let previousData = [];
                const currentData = await fetchDailyBasisComprehensiveBreakdownData(kpi, datakey, (drawerInfo?.multiple ? drawerInfo?.value?.map((item) => item?.value) : drawerInfo?.value), breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, false, breakdownPerformance?.ColumnList ?? []);
                if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
                    previousData = await fetchDailyBasisComprehensiveBreakdownData(kpi, datakey, (drawerInfo?.multiple ? drawerInfo?.value?.map((item) => item?.value) : drawerInfo?.value), breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, true, breakdownPerformance?.ColumnList ?? []);
                }
                setReportTableData(currentData);
                setPerviousReportTableData(previousData);
            }
            setLoading(false);
        }
        fetchData();
    }, [drawerInfo]);


    return (
        <>
            <div className="performanceDrawerBox">
                <div className="performanceDrawerHead">
                    <button type="button" className="closeButton" onClick={onClose}>
                        <img src="/assets/images/drawerClose.svg" />
                    </button>
                    <h6 className="capitalize">{drawerInfo?.column} Performance</h6>
                </div>
                <div className="performanceDrawerContent">
                    <div className="performanceDrawerContentWrap drawerChartBox mb-4">
                        <div className="performanceDrawerContentHead">
                            <div className="font-semibold text-sm flex gap-3 items-center capitalize w-full">
                                <span className="whitespace-nowrap">Selected {drawerInfo?.column}:</span>
                                <div className="inline-flex overflow-auto flex-1 gap-3">
                                    {drawerInfo?.multiple ?
                                        (drawerInfo?.value?.map((item, i) => (
                                            <div key={i + item?.value} className="flex gap-3 flex-[0_0_auto]">
                                                {/* {JSON.stringify(item)} */}
                                                <div className="performanceTag">
                                                    {(item?.pdp_image_url && drawerInfo?.column == "sku") && (<img src={item?.pdp_image_url} width={12} height={12} />)}
                                                    <span className="performanceTagLabel">{(item?.sku_name && drawerInfo?.column == "sku") && (`${item?.sku_name} - `)}</span>
                                                    <label>{item?.lable}</label>
                                                    {/* <span className="cursor-pointer">
                                                    <img src="/assets/images/drawerClose.svg" width={12} height={12} />
                                                </span> */}
                                                </div>
                                            </div>)))
                                        :
                                        (<div className="flex gap-3 flex-[0_0_auto]">
                                            <div className="performanceTag">
                                                {(drawerInfo?.image && drawerInfo?.column == "sku") && (<img src={drawerInfo?.image} width={12} height={12} />)}
                                                <span className="performanceTagLabel">{(drawerInfo?.name && drawerInfo?.column == "sku") && (`${drawerInfo?.name} - `)}</span>
                                                <label>{drawerInfo?.lable}</label>
                                                {/* <span className="cursor-pointer">
                                                <img src="/assets/images/drawerClose.svg" width={12} height={12} />
                                            </span> */}
                                            </div>
                                        </div>)}
                                </div>
                                {breakdownPerformance?.GraphOutputKeyOptionList?.length > 0 && (
                                <div className="inline-flex items-center justify-end gap-3">
                                    View:
                                    {breakdownPerformance?.GraphOutputKeyOptionList?.map((option, index) => (
                                        <div className="inline-flex items-center gap-1" key={index}>
                                        <input key={index}
                                            type="radio"
                                            name="sos_option"
                                            value={option.value}
                                            checked={graphOutputKey ===option.value}  
                                            readOnly
                                        />
                                    <label className="cursor-pointer" onClick={() => { setGraphOutputKey(option.value)}}  key={index} style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                                        
                                        <span>{option.title}</span>
                                    </label>
                                    </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>

                        <BreakdownGraph graphOutputKey={graphOutputKey} drawerInfo={drawerInfo} reportTableData={reportTableData} perviousReportTableData={perviousReportTableData} loading={loading} breakdownPerformance={breakdownPerformance} />
                    </div>
                    <div className="performanceDrawerContentWrap !px-0 !py-0">
                        {reportTableData?.length > 0 && (<BreakDownTable drawerInfo={drawerInfo} reportTableData={reportTableData} breakdownPerformance={breakdownPerformance} />)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BreakdownDrawer;
