import React, { useState, useEffect } from 'react'
import { FILTERACTION } from '../../../common-components/MultiFilter/FilterConstant';
import MultiFilter from '../../../common-components/MultiFilter/MultiFilter';
import { useEbuxContext } from '../../../Context/EbuxProvider';

const ComprehenisiveFilterPlatform = ({
    // arr = [],
    additionalFilter = [],
    defaultValue = false,
    savedSearch = {},
    handleSaveFilters = false,
    applySearchFilter = false,
    platform = "ams",
    text = ""
}) => {
    console.log('additionalFilterarr', additionalFilter)
    const {
        filters,
        kpi,
        // activeClientProject
        // , tagList
    } = useEbuxContext();
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        console.log({ additionalFilter });

        const comman = [];
        if (kpi == 'SOS' || kpi == 'OR') {
            const market = {
                key: "market",
                label: "Market",
                selectable: false,
                children: filters?.marketDataKw?.map(item => ({
                    label: item?.label,
                    key: `market-${item?.value}-${item?.label}`,
                    // data: `market-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(market);
        } else {
            const market = {
                key: "market",
                label: "Market",
                selectable: false,
                children: filters?.marketData?.map(item => ({
                    label: item?.label,
                    key: `market-${item?.value}-${item?.label}`,
                    // data: `market-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(market);

            const status = {
                key: "status",
                label: "Status",
                selectable: false,
                children: filters?.statusData?.map(item => ({
                    label: item?.label,
                    key: `status-${item?.value}-${item?.label}`,
                    // data: `market-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(status);
        }
        setFilterData(comman);
    }, []);

    return (
        <MultiFilter filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} isSearchable={false} isChipVIsible={false} buttonName={text} />
    );
}

export default ComprehenisiveFilterPlatform;
