import React, { useMemo,useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import SortingButton from '../../DynamicSortButton';
import { useEbuxContext } from '../../../../Context/EbuxProvider';
import Excel from "exceljs";

const TableTabComponent = ({
    dataHeader = "Category",
    setLoading,
    reportTableData,
    openDrawer,sortConfig, setSortConfig,
    selectedTableRows, setSelectedTableRows,setCombinedState, handleColumnClick,
    downloadkey,setDownloadkey,openMultipleInDrawer,selectedTabName
}) => {
    const {
        percentageIcon,filters
    } = useEbuxContext();
    // const pfkey = ["avg", "Amazon", "Zepto"];
    let pf=filters?.platform?.length ? filters?.platform?.map((i) => i?.label ?? "") : [];  
    const pfkey = ["avg", ...[...new Set(pf?? [])]];
    const headerkey = { "output": "Average OR"};
    const dataKey = dataHeader.toLowerCase();
    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            return [...reportTableData].sort((a, b) => {
                const _sortkey = sortConfig?.key.split(".");
                a = sortConfig.key == 'item' ? (a?.[sortConfig.key]?.lable) : (a?.[_sortkey[0]]?.[_sortkey[1]]);
                b = sortConfig.key == 'item' ? (b?.[sortConfig.key]?.lable) : (b?.[_sortkey[0]]?.[_sortkey[1]]);
                
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
        return reportTableData;
    }, [reportTableData, sortConfig]);
    const handleDownload = () => {        
        setDownloadkey('');
        const headers = [];
        if(dataHeader=="Keyword"){            
          headers.push({ header: 'Category', key: 'brand_category_name', width: 25 })
        }
        headers.push({ header: dataHeader, key: 'item', width: 25 });   
        pfkey.map((pf) => (
          Object.keys(headerkey).map((hk) => (
            headers.push({ header: `${pf == "avg" ? "" : pf} ${headerkey[hk]}`, key: `${pf}_${headerkey[hk]}`, width: 25 })
          ))
        ))
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Sheet 1");
    
        const title = `${dataHeader} OR Report`;
    
    
        worksheet.columns = headers;
        sortedData?.forEach((data) => {
          let _data = {};
          if(dataHeader=="Keyword"){
            _data["brand_category_name"]=data?.item?.brand_category_name;
          }
          _data["item"]=data?.item?.lable || "-";
          pfkey.map((pf) => (
            Object.keys(headerkey).map((hk) => {
    
              _data[`${pf}_${headerkey[hk]}`] = data?.[pf]?.[hk] === undefined ? "-" : `${data?.[pf]?.[hk]} ${percentageIcon}`;
            })
          ))
    
          worksheet.addRow(_data);
        });
    
    
        worksheet.addRow([]);
        worksheet.addRow([title]);
        worksheet.mergeCells(`A${sortedData.length + 3}:D${sortedData.length + 3}`);
        const titleRow = worksheet.getRow((sortedData.length + 3));
        titleRow.font = { size: 16, bold: true };
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
    
    
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${selectedTabName}_performance_${Date.now()}.xlsx`;
          link.click();
        });
    };
    useEffect(()=>{
        if(downloadkey==selectedTabName){
            handleDownload();
        }            
    },[downloadkey])

    const handleRowSelect = (index) => {
        setSelectedTableRows((prevData) => {
            const currentSelections = prevData?.[dataKey] || [];
            const isSelected = currentSelections?.length && currentSelections.some((item) => item?.value === index?.value);
            if (isSelected) {
                return {
                    ...prevData,
                    [dataKey]: currentSelections.filter((item) => item?.value !== index?.value),
                };
            } else {
                return {
                    ...prevData,
                    [dataKey]: [...currentSelections, index],
                };
            }
        });
    };

    
    const isSelectAllChecked = reportTableData.length > 0 && selectedTableRows?.[dataKey]?.length > 0 && selectedTableRows?.[dataKey]?.length === reportTableData.length;

    const handleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedTableRows((data) => ({ ...data, [dataKey]: [] }));
        } else {
            // const allRowIds = sortedData.map((item) => item[key]);
            const allRowIds = sortedData.map((data) => data?.item);
            setSelectedTableRows((data) => ({ ...data, [dataKey]: allRowIds }));

            // setSelectedTableRows([...new Set(allkeydata)]);
        }
    };
    const requestSort = key => {
        setLoading(true);
        let direction = 'ASC';
        if (sortConfig.key === key && sortConfig.direction === 'ASC') {
            direction = 'DSC';
        }
        setSortConfig({ key, direction });
        setTimeout(() => setLoading(false), 500);
    };

    const getDataAVG = (key) => {

        const _key = key.split(".");
        let total = 0;
        const setToFixed=2;
        const data = sortedData?.map(item => {
            if (item?.[_key[0]]?.[_key[1]] != undefined) {
                total++;
            }
            if (item?.[_key[0]]?.[_key[1]]) {
                return parseFloat(item?.[_key[0]]?.[_key[1]]);
            }
            return 0;
        });
        const result = data?.length ? ((data?.reduce((sum, avg) => sum + avg, 0)) / (total ?? 1)) : 0;
        return isNaN(result) ? '-' : `${result?.toFixed(setToFixed)} ${percentageIcon}`;

    };
    const renderTableRows = () => {
        return sortedData?.map((data,index) => (
            <tr key={`${data?.item?.value}-${index}`} className={`breakdownRow ${isSelectAllChecked || selectedTableRows?.[dataKey]?.some((item) => item?.value === data?.item?.value) ? "selectedRow" : ""}`}>
                <td className="firstCol" key={`${data?.item?.value}-id`}>
                    <input
                        type="checkbox"
                        checked={isSelectAllChecked || selectedTableRows?.[dataKey]?.some((item) => item?.value === data?.item?.value)}
                        onChange={() => handleRowSelect(data?.item)}
                    />
                </td>
                <td>
                    <div className='flex flex-row gap-2 justify-between'>
                        {data?.item?.lable || "-"}
                        <button className='breakdownChartIcon' type="button" onClick={() => openDrawer(dataKey, data?.item?.value, data?.item?.lable)}><img src="/assets/images/graphIcon.svg" width={18} height={18} /></button>
                    </div>
                </td>
                {
                    pfkey.map((pf, i) => (
                        Object.keys(headerkey).map((hk, index) =>
                        (<td key={i + index}>
                            {data?.[pf]?.[hk] === undefined ? "-" : `${data?.[pf]?.[hk]} ${percentageIcon}`}
                        </td>)
                        )
                    ))
                }

            </tr>
        )
        );
    };
    const renderTabletfootRows = () => {

        return (
            <tr>
                <td></td>
                <td>
                    <div>
                        Total {dataHeader}
                    </div>
                    <strong>{sortedData?.length}</strong>
                </td>

                {
                    pfkey.map((pf, i) => (
                        Object.keys(headerkey).map((hk, index) => (
                            <td key={i + index}>
                                <div>
                                    {pf == "avg" ? "" : pf} {headerkey[hk]}
                                </div>
                                <strong>{getDataAVG(`${pf}.${hk}`)}</strong>
                            </td>
                        ))
                    ))
                }
            </tr>
        );
    };
    const clearAll=(column)=>{
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: [],
            };
            
            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
    
            return updatedFilters;
        });
    }
    
    const removeItem=(column,item)=>{
        setSelectedTableRows((prevFilters) => {
            const updatedFilters = {
                ...prevFilters,
                [column]: prevFilters?.[column]?.filter((rowIndex) => rowIndex.value !== item.value)
            };
            
            setCombinedState((prevFilters) => ({
                ...prevFilters,
                _selectedTableRows: {
                    ...prevFilters?._selectedTableRows,
                    ...updatedFilters
                }
            }));
    
            return updatedFilters;
        });
    }

    return (
        <>
            <div className="tblHeadCatWrap">
                <div className="tblHeadCatBoxWrap">

                    <div className="tblHeadCatBox">
                        {Object.keys(selectedTableRows)?.map((filterKey, i) => (
                            <div className='tblHeadCatBoxCol' key={i}>
                                <h4 className={dataKey == filterKey.toLowerCase() ? `catTxtBlue` : `catTxtBlack cursor-pointer`}
                                    onClick={() => {
                                        if (dataKey != filterKey.toLowerCase()) {
                                            handleColumnClick(filterKey);
                                        }
                                    }} key={i}>{(selectedTableRows?.[filterKey] ?? []).length} Selected {filterKey}:</h4>

                                {(selectedTableRows?.[filterKey] ?? []).length > 0 ? (
                                    <div className="tblHeadCatTagWrap" key={`${i}-TagWrap`}>
                                        {selectedTableRows?.[filterKey]?.length > 1 &&
                                            <button type="button" className="clearClose" onClick={() => clearAll(filterKey)}>Clear all {filterKey}</button>
                                        }


                                        {selectedTableRows?.[filterKey]?.map((item, i) => (
                                            <div className="tblHeadCatTag" key={i}>
                                                {item?.lable} <img className="cursor-pointer mr-[5px]" src="/assets/images/crossIcon.svg" width={14} height={14} onClick={() => removeItem(filterKey,item)} />
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                    </div>

                </div>
                
                <div className="tblHeadCatBoxIcon">
                    <button type="button" onClick={()=>openMultipleInDrawer(dataKey)}><img src="/assets/images/graphIcon.svg" width={18} height={18} /></button>
                </div>
            </div>
            <div className="tblWrap">
                <table className="tblOuter">
                    <thead>
                        <tr>
                            <th className="firstCol">
                                <input
                                    type="checkbox"
                                    checked={isSelectAllChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th onClick={() => requestSort('item')}><div className="sortingCol w-full py-2" >{dataHeader}
                                <SortingButton sortType={sortConfig.key === 'item' ? sortConfig.direction : ''} />
                            </div></th>
                            {
                                pfkey.map((pf, i) => (
                                    Object.keys(headerkey).map((hk, index) => (
                                        <th key={i + index}>
                                            <div className="sortingCol w-full py-2" onClick={() => requestSort(`${pf}.${hk}`)}>{pf == "avg" ? "" : pf} {headerkey[hk]}
                                                <SortingButton sortType={sortConfig.key === `${pf}.${hk}` ? sortConfig.direction : ''} />
                                            </div>
                                        </th>
                                    ))
                                ))
                            }

                        </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                    <tfoot className="dataTableFoot">{renderTabletfootRows()}</tfoot>
                </table>
            </div>
            {/* <DataTableComponent setLoading={setLoading} tableHeader={[tableHeader]} filteredTableData={filteredTableData} /> */}
        </>
    );
};

export default TableTabComponent;