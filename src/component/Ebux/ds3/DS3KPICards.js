
import React from 'react';
import { useEbuxContext } from '../Context/EbuxProvider';
import { Link } from 'react-router-dom';
//import { IoMdArrowDropdown,IoMdArrowDropup } from 'react-icons/io';
import Loader from '../common-components/Loader';

const decimalValueManager = (val) => {
    if (val === undefined || val === null || val === "" || isNaN(val)) return "0";
    const num = parseFloat(val);
    if (num >= 100) return Math.round(num).toLocaleString();
    if (num >= 10) return num.toFixed(1);
    return num.toFixed(2);
}

const DS3KPICards = ({ averagePercentageData: propsData }) => {
    const context = useEbuxContext();
    console.log('propsDatapropsData', propsData)
    const averagePercentageData = propsData || context.averagePercentageData;
    const { kpi, kpiMap, selectedFilters, updateSelectedSOSType, loading, activeClientProject
        // filtersDarkStore 
    } = context;
    const enabledKPIs = activeClientProject.kpi || {};
    // const isDarkStore = filtersDarkStore?.tab_type === "dark_store_analysis";
    // console.log("DEBUG DS3KPICards: isDarkStore =", isDarkStore);
    const getStatus = (metricData, cardId, metricLabel) => {
        if (!metricData || metricData.previousData === undefined) return null;

        const current = metricData?.currentData ?? 0;
        const previous = metricData?.previousData ?? 0;

        const diff = (current ?? 0) - (previous ?? 0);
        if (!diff) return null;

        // For Ranking (OR), the user wants to show % in the delta (previousData comparison)
        const isPercentage = cardId === 'OR' || !(cardId === 'RR' || (metricLabel || '').toLowerCase().indexOf('rank') !== -1);

        return diff < 0 ? (
            <span className="flex items-center gap-[1px] text-[9px] text-[#DD4242] bg-[#FFF1F0] px-1 py-[1px] rounded-full h-4">
                {/* <IoMdArrowDropdown className="text-[#DD4242] w-[14px] h-[14px]" /> */}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.55547 0.478857L5.06563 5.68511C4.93711 5.83413 4.68965 5.83413 4.55977 5.68511L0.0699225 0.478857C-0.0968743 0.284717 0.0535163 0.000341847 0.322852 0.000341847H9.30254C9.57188 0.000341847 9.72227 0.284717 9.55547 0.478857Z" fill="#DD4242"/>
</svg>

                {decimalValueManager(Math.abs(diff))}{isPercentage ? '%' : ''}
            </span>
        ) : (
            <span className="flex items-center gap-[1px] text-[9px] bg-[#E8FFEB] px-1 py-[1px] rounded-full">
                {/* <IoMdArrowDropup className="text-xs w-[14px] h-[14px] text-[#52C41A]" /> */}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.55547 5.31802L5.06563 0.111768C4.93711 -0.0372559 4.68965 -0.0372559 4.55977 0.111768L0.0699225 5.31802C-0.0968743 5.51216 0.0535163 5.79653 0.322852 5.79653H9.30254C9.57188 5.79653 9.72227 5.51216 9.55547 5.31802Z" fill="#52C41A"/>
</svg>

                <span className='text-[#329900]'>
                    {decimalValueManager(diff)}{isPercentage ? '%' : ''}
                </span>
            </span>
        );
    };

    // const cards = [
    //     { id: 'OSA', label: 'Availability', minW: 'min-w-[213px]', metrics: [{ key: 'currentData', label: 'OSA' }, { key: 'wt_osa', label: 'Wt. OSA' }] },
    //     { id: 'SOS', label: 'Share of Search', minW: 'min-w-[330px]', metrics: [{ key: 'currentData', label: 'SOS' }, { key: 'wt_sos', label: 'wt. SOS' }], hasRadio: true },
    //     { id: 'OR', label: 'Ranking', minW: 'min-w-[160px]', metrics: [{ key: 'currentData', label: 'Avg Rank' }, { key: 'org_rank', label: 'Org Rank' }, { key: 'paid_rank', label: 'Paid Rank' }] },
    //     { id: 'CS', label: 'Content Score', minW: 'min-w-[160px]', metrics: [{ key: 'currentData', label: 'Avg CS' }, { key: 'issues', label: 'Issues' }, { key: 'non_issues', label: 'Non-Issues' }] },
    //     { id: 'PRO', label: 'Promotions', minW: 'min-w-[260px]', metrics: [{ key: 'currentData', label: 'Avg Promo' }, { key: 'avg_sales_price', label: 'ASP' }] },
    //     { id: 'RR', label: 'Rating & Reviews', minW: 'min-w-[260px]', metrics: [{ key: 'total_reviews', label: 'Total Reviews' }, { key: 'currentData', label: 'Avg Rating' }, { key: 'total_ratings', label: 'Total Ratings' }] },
    // ];

  const cards = [
  { id: 'OSA', label: 'Availability', minW: 'min-w-[107px] s1280:min-w-[222.95px] s1512:min-w-[222.95px] s1728:min-w-0', metrics: [{ key: 'currentData', label: 'OSA' }, { key: 'wt_osa', label: 'Wt. OSA' }] },
  { id: 'SOS', label: 'Share of Search', minW: 'min-w-[107px] s1280:min-w-[308px] s1512:min-w-[308px] s1728:min-w-0', metrics: [{ key: 'currentData', label: 'SOS' }, { key: 'wt_sos', label: 'Wt. SOS' }], hasRadio: true },
  { id: 'OR', label: 'Ranking', minW: 'min-w-[107px] s1280:min-w-[101px] s1512:min-w-[149px] s1728:min-w-0', metrics: [{ key: 'currentData', label: 'Avg Rank' }, { key: 'org_rank', label: 'Org Rank' }, { key: 'paid_rank', label: 'Paid Rank' }] },
  { id: 'CS', label: 'Content Score', minW: 'min-w-[107px] s1280:min-w-[116px] s1512:min-w-[149px]  s1728:min-w-0', metrics: [{ key: 'currentData', label: 'Avg CS' }, { key: 'issues', label: 'Issues' }, { key: 'non_issues', label: 'Non-Issues' }] },
  { id: 'PRO', label: 'Promotions', minW: 'min-w-[107px] s1280:min-w-[211.78px] s1512:min-w-[211.78px] s1728:min-w-0', metrics: [{ key: 'currentData', label: 'Avg Promo' }, { key: 'avg_sales_price', label: 'ASP' }] },
  { id: 'RR', label: 'Rating & Reviews', minW: 'min-w-[107px] s1280:min-w-[234px] s1512:min-w-[234px] s1728:min-w-0', metrics: [{ key: 'total_reviews', label: 'Total Reviews' }, { key: 'currentData', label: 'Avg Rating' }, { key: 'total_ratings', label: 'Total Ratings' }] }
];


  const visibleCards = cards.filter(card => enabledKPIs[card.id]);
  const isThreeOrLess = visibleCards.length <= 3;
  
  
    return (
        <div className="flex  overflow-x-auto  pb-[2px] custom-scrollbar s1728:w-full">
            {cards.map((card) => {
                const isActive = kpi === card.id;
                if (!enabledKPIs[card.id]) {
                    return null;
                }

                return (
                    <Link
                        key={card.id}
                        to={kpiMap[card.id]?.link}
                        // onMouseEnter={() => {
                        //     if (card.id === 'SOS') {
                        //         console.log("DEBUG DS3KPICards: Rendering SOS card, hasRadio =", card.hasRadio);
                        //     }
                        // }}
                        className={`flex   transition-all relative 
                             ${!isThreeOrLess ? 's1728:flex-1' : ''}
                        ${isActive
                                ? 'border-[1.5px] border-[#0081F7] border-b-transparent bg-white rounded-t-xl z-30'
                                : ' bg-white rounded-xl hover:border-[#CBD5E1] z-10 '
                            }`}
                        style={isActive ? { marginBottom: '-1.5px' } : {}}
                    >
                     <div className={`h-[110px] ${`
    ${card.minW || 'min-w-[107px]'}
    ${isThreeOrLess ? 's1728:min-w-[234px]' : 's1728:min-w-0'}
`} w-full  rounded-[10px] ${isActive ? 'bg-[linear-gradient(134.29deg,_#E6F4FF_13.77%,_#FFFFFF_110.08%)]' : 'bg-white shadow-[0px_2px_4px_0px_#00000005,0px_1px_6px_-1px_#00000005,0px_1px_2px_0px_#00000008] rounded-sm'} p-[8px] m-[7px] my-4 `}>
  
                            {
                                card.id === "SOS" ?
                                    <>
                                        <div className="mb-2">



                                            <div className="flex items-start min-h-[44px]">
                                                {/* Left Side: Metrics (75% when radios exist) */}
                                                <div className={`${card.hasRadio ? 'w-[75%]' : 'w-full'}`}>
                                                    <h3 className={`text-[14px] leading-[18px] font-[400] ${isActive ? 'text-[#000000A6]' : 'text-[#000000A6]'}`}>
                                                        {card.label}
                                                    </h3>
                                                    <div className={`flex  mt-4 gap-4`}>
                                                        {card.metrics
                                                            .filter(metric => {
                                                                const metricData = (metric.key === 'currentData')
                                                                    ? (averagePercentageData?.[card.id] || {})
                                                                    : (averagePercentageData?.[metric.key] || (averagePercentageData?.[card.id]?.[metric.key] ? { currentData: averagePercentageData[card.id][metric.key] } : {}));
                                                                const val = metricData?.currentData;

                                                                const isMainMetricOfSpecificKpis = (metric.key === 'currentData' || metric.key === 'wt_sos') && ['SOS'].includes(card.id);

                                                                // Always show main metrics for specific KPIs so we can display "--"
                                                                if (isMainMetricOfSpecificKpis) return true;

                                                                // Always hide if null or undefined for other metrics
                                                                if (val === null || val === undefined) return false;

                                                                // Hide if 0 for specific metrics requested by user
                                                                const keysToHideIfZero = ['wt_osa', 'wt_sos', 'org_rank', 'paid_rank', 'avg_sales_price', 'avg_mrp', 'avg_rating', 'total_ratings'];
                                                                if (card.id === 'OR' && metric.key === 'currentData') keysToHideIfZero.push('currentData'); // Avg Ranking

                                                                if (keysToHideIfZero.includes(metric.key) && (val === 0 || val === "0")) return false;

                                                                return true;
                                                            })
                                                            .map((metric, idx) => {
                                                                const metricData = (metric.key === 'currentData')
                                                                    ? (averagePercentageData?.[card.id] || {})
                                                                    : (averagePercentageData?.[metric.key] || (averagePercentageData?.[card.id]?.[metric.key] ? { currentData: averagePercentageData[card.id][metric.key] } : {}));

                                                                const value = metricData?.currentData;

                                                                return (
                                                                    <React.Fragment key={idx}>
                                                                        {idx > 0 && (
                                                                            <div className="w-[1px] h-7 bg-[#E2E8F0] opacity-70 self-center mx-1.5" />
                                                                        )}
                                                                        <div className="flex flex-col min-w-[45px]">
                                                                            <p className="text-[8px] font-bold text-[#666666] tracking-wider mb-0.5">
                                                                                {metric.label}
                                                                            </p>

                                                                            <div className="flex  items-center gap-[1px]">
                                                                                <span className={`text-[16px] font-[600] ${isActive ? 'text-[#0081F7]' : 'text-[#333333]'}`}>
                                                                                    {loading ? <div className="h-[25px] flex items-center justify-center"><Loader show={true} fullScreen={false} isCard={true} /></div> : (
                                                                                        (value === null || value === undefined || (value === 0 && ['OSA', 'SOS', 'CS', 'PRO'].includes(card.id) && metric.key === 'currentData'))
                                                                                            ? "--"
                                                                                            : (metric.label === 'ASP' ? '₹' : '') + decimalValueManager(value)
                                                                                    )}
                                                                                    {loading ? "" : (
                                                                                        (value !== null && value !== undefined && !(value === 0 && ['OSA', 'SOS', 'CS', 'PRO'].includes(card.id) && metric.key === 'currentData')) &&
                                                                                        (metric.key === 'currentData' || metric.key === 'wt_osa' || metric.key === 'wt_sos' || metric.key === 'avg_cs' || metric.key === 'avg_promo' || card.id === 'OSA' || card.id === 'SOS' || card.id === 'CS' || card.id === 'PRO') &&
                                                                                        (card.id !== 'OR' && card.id !== 'RR' && metric.label.toLowerCase().indexOf('rank') === -1 && metric.label !== 'ASP') && '%'
                                                                                    )}
                                                                                </span>

                                                                                {/* Show status for all metrics where comparison exists */}
                                                                                {getStatus(metricData, card.id, metric.label)}
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                    </div>
                                                </div>

                                                {/* Right Side: Radio Buttons (25%) */}
                                                {card.hasRadio && (
                                                    <div className="w-[25%] flex justify-end">
                                                        <div className="flex flex-col text-[9px] gap-0.5 translate-y-[-2px]">
                                                            {['overall', 'paid', 'organic'].map(opt => (
                                                                <label key={opt} className="flex items-center gap-1 cursor-pointer group">
                                                                    <div className="relative flex items-center justify-center">
                                                                        <input
                                                                            type="radio"
                                                                            className="peer appearance-none w-[14px] h-[14px] border border-[#CBD5E1] rounded-full checked:border-[#0081F7] transition-all cursor-pointer"
                                                                            checked={selectedFilters?.selected_sos_type === opt}
                                                                            onChange={() => updateSelectedSOSType(opt)}
                                                                        />
                                                                        <div className="absolute w-[6px] h-[6px] bg-[#0081F7] rounded-full opacity-0 peer-checked:opacity-100 transition-all pointer-events-none" />
                                                                    </div>
                                                                    <span className={`${selectedFilters?.selected_sos_type === opt ? 'text-[#000000DE] font-[400]' : 'text-[#000000A6]'} capitalize`}>
                                                                        {opt}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                    :

                                    <>
                                        <div className="mb-2">
                                            <h3 className={`text-[14px] leading-[18px] font-[400] ${isActive ? 'text-[#000000A6]' : 'text-[#475569]'}`}>
                                                {card.label}
                                            </h3>
                                        </div>

                                        <div className="flex items-start min-h-[44px]">
                                            {/* Left Side: Metrics (75% when radios exist) */}
                                            <div className={`${card.hasRadio ? 'w-[75%]' : 'w-full'}`}>
                                                <div className={`flex items-center mt-2.5 justify-between`}>
                                                    {card.metrics
                                                        .filter(metric => {
                                                            const metricData = (metric.key === 'currentData')
                                                                ? (averagePercentageData?.[card.id] || {})
                                                                : (averagePercentageData?.[metric.key] || (averagePercentageData?.[card.id]?.[metric.key] ? { currentData: averagePercentageData[card.id][metric.key] } : {}));
                                                            const val = metricData?.currentData;

                                                            const isMainMetricOfSpecificKpis = (metric.key === 'currentData') && ['OSA', 'CS', 'PRO'].includes(card.id);

                                                            // Always show main metrics for specific KPIs so we can display "--"
                                                            if (isMainMetricOfSpecificKpis) return true;

                                                            if (val === null || val === undefined) return false;

                                                            const keysToHideIfZero = ['wt_osa', 'wt_sos', 'org_rank', 'paid_rank', 'avg_sales_price', 'avg_mrp', 'avg_rating', 'total_ratings'];
                                                            if (card.id === 'OR' && metric.key === 'currentData') keysToHideIfZero.push('currentData'); // Avg Ranking

                                                            if (keysToHideIfZero.includes(metric.key) && (val === 0 || val === "0")) return false;

                                                            return true;
                                                        })
                                                        .map((metric, idx) => {
                                                            const metricData = (metric.key === 'currentData')
                                                                ? (averagePercentageData?.[card.id] || {})
                                                                : (averagePercentageData?.[metric.key] || (averagePercentageData?.[card.id]?.[metric.key] ? { currentData: averagePercentageData[card.id][metric.key] } : {}));

                                                            const value = metricData?.currentData;

                                                            return (
                                                                <React.Fragment key={idx}>
                                                                    {idx > 0 && (
                                                                        <div className="w-[1px] h-7 bg-[#E2E8F0] opacity-70 self-center mx-1.5" />
                                                                    )}
                                                                    <div className="flex flex-col min-w-[45px]">
                                                                        <p className="text-[8px] font-bold text-[#666666] tracking-wider mb-0.5">
                                                                            {metric.label}
                                                                        </p>

                                                                        <div className="flex  items-center gap-[1px]">
                                                                            <span className={`text-[16px] font-[600] ${isActive ? 'text-[#0081F7]' : 'text-[#333333]'}`}>
                                                                                {loading ? <div className="h-[25px] flex items-center justify-center"><Loader show={true} fullScreen={false} isCard={true} /></div> : (
                                                                                    (value === null || value === undefined || (value === 0 && ['OSA', 'SOS', 'CS', 'PRO'].includes(card.id) && metric.key === 'currentData'))
                                                                                        ? "--"
                                                                                        : (metric.label === 'ASP' ? '₹' : '') + decimalValueManager(value)
                                                                                )}
                                                                                {loading ? "" : (
                                                                                    (value !== null && value !== undefined && !(value === 0 && ['OSA', 'SOS', 'CS', 'PRO'].includes(card.id) && metric.key === 'currentData')) &&
                                                                                    (metric.key === 'currentData' || metric.key === 'wt_osa' || metric.key === 'wt_sos' || metric.key === 'avg_cs' || metric.key === 'avg_promo' || card.id === 'OSA' || card.id === 'SOS' || card.id === 'CS' || card.id === 'PRO') &&
                                                                                    (card.id !== 'OR' && card.id !== 'RR' && metric.label.toLowerCase().indexOf('rank') === -1 && metric.label !== 'ASP') && '%'
                                                                                )}
                                                                            </span>

                                                                            {/* Show status for all metrics where comparison exists */}
                                                                            {getStatus(metricData, card.id, metric.label)}
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </div>
                                            </div>

                                        </div>
                                    </>
                            }


                        </div>
                    </Link>
                );
            })}
        </div>
    );
};


export default DS3KPICards;