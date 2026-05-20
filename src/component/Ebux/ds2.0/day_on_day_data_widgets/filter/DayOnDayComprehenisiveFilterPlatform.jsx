import React, { useState, useEffect } from 'react'
import { FILTERACTION } from '../../../common-components/MultiFilter/FilterConstant';
import MultiFilter from '../../../common-components/MultiFilter/MultiFilter';
import { useEbuxContext } from '../../../Context/EbuxProvider';

const DayOnDayComprehenisiveFilterPlatform = ({
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
        }
        else {


            const nameIdFilter = {
                key: "name_id",
                label: "Name/ID",
                selectable: false,
                children: [
                    {
                        key: "name_id-reseller_name_crawl",
                        label: "Seller Name",
                        data: "Seller Name - ",
                        mapKey: "reseller_name_crawl",
                        action: FILTERACTION.SEARCH,
                    },
                ],
            }
            comman.push(nameIdFilter);

            const issue_non_issue = {
                key: "issue_non_issue",
                label: "Issue/Non-Issue",
                selectable: false,
                children: filters?.issueNonIssueData?.map(item => ({
                    label: item?.label,
                    key: `issue_non_issue-${item?.value?.replace('-', ':|@|:')}-${item?.label}`,
                    // data: `issue_non_issue-${item?.value?.replace('-',':|:')}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(issue_non_issue);


            const pdp_grade = {
                key: "grade",
                label: "Grade",
                selectable: false,
                children: filters?.pdpGradeData?.map(item => ({
                    label: item?.label,
                    key: `grade-${item?.value}-${item?.label}`,
                    // data: `grade-${item?.value}-${item?.label}`,
                    action: FILTERACTION.APPLY,
                }))
            };
            comman.push(pdp_grade);

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
        }
        setFilterData(comman);
    }, []);



    return (
        <MultiFilter filterData={filterData} applySearchFilter={applySearchFilter} handleSaveFilters={handleSaveFilters} savedSearch={savedSearch} defaultValue={defaultValue} platform={platform} isSearchable={false} isChipVIsible={false} buttonName={text} />
    );
}

export default DayOnDayComprehenisiveFilterPlatform;
