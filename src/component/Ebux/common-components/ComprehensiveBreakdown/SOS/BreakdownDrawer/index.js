
import { useEffect, useState } from "react";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
import BreakDownTable from "./BreakdownTable";
import BreakdownGraph from "./BreakdownGraph";
import { fetchDailyBasisComprehensiveBreakdownData } from "../../../../services/comprehensiveBreakdownSOS.services";


const BreakdownDrawer = ({ onClose, drawerInfo, selectedTableRows = [], comprehensiveBreakdownTableData = [], breakdownFilters = [] }) => {

    const {
        kpi,
        selectedPlatform,
        selectedFilters,
        filters
    } = useEbuxContext();



    const [loading, setLoading] = useState(false);


    const [reportTableData, setReportTableData] = useState([]);
    const [perviousReportTableData, setPerviousReportTableData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
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
                case 'keyword':
                    datakey = "keyword_id";
                    break;
                case 'brand':
                    datakey = "brand_id";
                    break;

                case 'platform':
                    datakey = "pf_id";
                    break;
                default:
                    setReportTableData([]);
                    setPerviousReportTableData([]);
                    break;
            }
            if (datakey) {
                let previousData = [];
                const currentData = await fetchDailyBasisComprehensiveBreakdownData(kpi, datakey, (drawerInfo?.multiple ? drawerInfo?.value?.map((item)=>item?.value) : drawerInfo?.value), breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, false);
                if (selectedFilters?.selectedDateRange?.isCompareToPrevious) {
                    previousData = await fetchDailyBasisComprehensiveBreakdownData(kpi, datakey, (drawerInfo?.multiple ? drawerInfo?.value?.map((item)=>item?.value) : drawerInfo?.value), breakdownFilters, filters, selectedFilters, selectedPlatform, selectedTableRows, comprehensiveBreakdownTableData, true);
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
                    
                    <h6 className={`capitalize`}><span className={`${drawerInfo?.column=="sku"?"uppercase":"capitalize"}`}>{drawerInfo?.column}</span> Performance</h6>
                </div>
                <div className="performanceDrawerContent">
                    <div className="performanceDrawerContentWrap mb-4">
                        <div className="performanceDrawerContentHead">
                        <div className="font-semibold text-sm flex gap-3 items-center capitalize w-full">
                                <span className="whitespace-nowrap">Selected {drawerInfo?.column=="sku"?"SKU":drawerInfo?.column}:</span>
                                <div className="overflow-auto flex gap-3">
                                {drawerInfo?.multiple ?
                                    (drawerInfo?.value?.map((item,i) => (
                                        
                                        <div key={i+item?.value} className="flex gap-3 flex-[0_0_auto]">
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
                            </div>
                        </div>

                        <BreakdownGraph drawerInfo={drawerInfo} reportTableData={reportTableData} perviousReportTableData={perviousReportTableData} loading={loading} />
                    </div>
                    <div className="performanceDrawerContentWrap !px-0 !py-0">
                        {reportTableData?.length > 0 && (<BreakDownTable drawerInfo={drawerInfo} reportTableData={reportTableData} />)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BreakdownDrawer;
