import React, { useEffect, useMemo, useRef, useState } from 'react';
import { keywordCloudData } from '../services/keywordCloud.services';
import { useEbuxContext } from '../Context/EbuxProvider';

import ReactWordcloud from 'react-wordcloud';
import { isEqual } from 'lodash';

import { MdOutlineDragIndicator } from "react-icons/md";
import Loader from './Loader';
import SortingButton from './ComprehensiveBreakdown/DynamicSortButton';

const WordCloudComponent = React.memo(({ keywordData }) => {

    const options = {
        // colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
        enableTooltip: true,
        deterministic: false,
        // fontFamily: "impact",
        fontSizes: [15, 90],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 1,
        rotations: 3,
        rotationAngles: [0, 90],
        scale: "sqrt",
        spiral: "archimedean",
        transitionDuration: 1000,
        tooltipOptions: {
            // offsetX: 10,
            // offsetY: 10,
        },
        tooltipContent: (word) => {
            // Custom HTML content for the tooltip
            return `The word "${word.text}" appears ${word.value} times.`;
        }
    };

    return (
        <div className="keywordCloudRight">
            <ReactWordcloud words={keywordData} options={options} />
        </div>);
});

WordCloudComponent.displayName = 'WordCloudComponent';
const TableComponent = React.memo(({ keywordData, setLoading }) => {


    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            return [...keywordData].sort((a, b) => {
                a = (a?.[sortConfig?.key]);
                b = (b?.[sortConfig?.key]);

                if (a === undefined || a === null) return 1;
                if (b === undefined || b === null) return -1;

                if (!isNaN(a) && !isNaN(b)) {
                    a = parseFloat(a);
                    b = parseFloat(b);
                }
                if (a < b) {
                    return sortConfig.direction === 'ASC' ? -1 : 1;
                }
                if (a > b) {
                    return sortConfig.direction === 'ASC' ? 1 : -1;
                }
                return 0;
            });
        }
        return keywordData;
    }, [keywordData, sortConfig]);
    const requestSort = key => {
        setLoading(true);
        let direction = 'ASC';
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DSC';
        }
        setSortConfig({ key, direction });
        setTimeout(() => setLoading(false), 500);
    };
    return (<div className="keywordCloudLeft">
        <div className="keywordTblWrap">
            <table className="keywordTblOuter">
                <thead>
                    <tr>
                        <th>
                            <div className="sortingCol w-full py-2 !justify-start" onClick={() => requestSort('rank')}>
                                Rank
                                <SortingButton sortType={sortConfig.key === 'rank' ? sortConfig.direction : ''} />
                            </div>

                        </th>
                        <th>
                            <div className="sortingCol w-full py-2 !justify-start" onClick={() => requestSort('text')}>
                                Review Keywords
                                <SortingButton sortType={sortConfig.key === 'text' ? sortConfig.direction : ''} />
                            </div>
                        </th>
                        <th>
                            <div className="sortingCol w-full py-2 !justify-start" onClick={() => requestSort('value')}>
                                Frequency
                                <SortingButton sortType={sortConfig.key === 'value' ? sortConfig.direction : ''} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData?.map((data, i) => (<tr key={i}>
                        <td>
                            {data?.rank ?? (i + 1)}
                        </td>
                        <td>
                            {data?.text}
                        </td>
                        <td>
                            {data?.value}
                        </td>
                    </tr>))}

                </tbody>
            </table>
        </div>
    </div>);
});
TableComponent.displayName = 'TableComponent';

const KeywordCloud = ({ listeners, attributes }) => {
    const {
        filtersLoading,
        // selectedPlatform,
        selectedFilters
    } = useEbuxContext();

    const [loading, setLoading] = useState(false);
    const previousSelectedFilters = useRef({});
    const [keywordData, setKeywordData] = useState([]);
    async function fetchData() {
        const _data = await keywordCloudData(selectedFilters, selectedFilters.selectedPlatform);

        setKeywordData(_data ?? []);
    }
    useEffect(() => {  
        if (!filtersLoading && (!isEqual(previousSelectedFilters.current, selectedFilters))) {
            previousSelectedFilters.current = selectedFilters;
            fetchData();
        }
    }, [filtersLoading, selectedFilters]);


    return (
        <>
            <div className="keywordCloudSection">
                <div className="sectionIconHead">
                    <div className='flex gap-2 items-center'>

                        <MdOutlineDragIndicator
                            {...listeners}
                            {...attributes}
                        />
                        <div className="sectionIcon">
                            <img src="/assets/images/comprehensiveIcon.svg" width={14} height={14} />
                        </div>
                        <h4 className='flex gap-2 flex-row'>
                            Keyword Cloud
                            {loading && <Loader show={loading} fullScreen={false} />}
                        </h4>
                    </div>
                    {/* <button type="button" onClick={() => { setOpen(!open) }} className={`graphIconBtn ${open ? 'arrowRotate' : ''}`}>
                        <img src="/assets/images/toggleDown.svg" width={20} height={20} />
                    </button> */}
                </div>
                <div className="keywordCloudBox">
                    <TableComponent keywordData={keywordData} setLoading={setLoading} />
                    <WordCloudComponent keywordData={keywordData} />
                </div>
            </div >
        </>
    );
};

export default KeywordCloud;