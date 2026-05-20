import React, { createContext, useContext, useEffect,  useMemo,  useState } from 'react';
// import { useEbuxContext } from './EbuxProvider';
// import { BASE_URL } from '../../../utils/url';

const EbuxTableContext = createContext();

const { Provider } = EbuxTableContext;


export const EbuxTableProvider = (props) => {

    // const { kpi, kpiMap, setError, selectedPlatform,selectedFilters,filters } = useEbuxContext();
  
    
    const [selectedTableRows,setSelectedTableRows] = useState("");
    const [reportTableData, ] = useState([]);
    // const [reportTableData, setReportTableData] = useState([]);
    const [tableHeader, setTableHeader] = useState([]);
    const [firstRow, setFirstRow] = useState([]);
    const [filterable, setFilterable] = useState([]);
    const [tableFilters, setTableFilters] = useState({});
    const [popupInfo, setPopupInfo] = useState({ isOpen: false, column: null });
    const [loading, setLoading] = useState(false);
    
    // const fetchReportTableData = async () => {
        
    //     setLoading(true);
    //     try {
    //             const response = await fetch(`${BASE_URL}ebux/report_data`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     "vKPI": (kpiMap[kpi]['vTableKPI'] ?? 'PDP'),
    //                     "vChart": (kpiMap[kpi]['vChart'] ?? 'OSA'),
    //                     "vDuration": "DAY",
    //                     "vLastDuration": selectedFilters?.selectedDate?.length ? selectedFilters?.selectedDate[0]?.value ?? 7 : 7,
    //                     "vStartYear": "",
    //                     "vEndYear": "",
    //                     "vPlatform": selectedPlatform?.length ? selectedPlatform.map((i) => i?.value ?? '') : filters?.platform?.length ? filters?.platform?.map((i)=>i?.value??'') : '',                        
    //                     "vBrandId": selectedFilters?.selectedBrand?.length ? selectedFilters?.selectedBrand.map((i) => i?.value ?? '') : '',
    //                     "vCategory": selectedFilters?.selectedCategory?.length ? selectedFilters?.selectedCategory.map((i) => i?.value ?? '') : '',
    //                     "vLocation": selectedFilters?.selectedLocation?.length ? selectedFilters?.selectedLocation.map((i) => i?.value ?? '') : '',
    //                     "vSKUId": selectedFilters?.selectedProductId?.length ? selectedFilters?.selectedProductId.map((i) => i?.value ?? '') : '',
    //                     "vKeyword": selectedFilters?.selectedKeyword?.length ? selectedFilters?.selectedKeyword.map((i) => i?.value ?? '') : '',
    //                     "vGrade": ""
    //                 }),
    //             });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const result = await response.json();
    //             const resultData = result.data;
    //             setReportTableData(resultData?.data ?? []);

    //     } catch (error) {
    //         setError(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // useEffect(() => {
    //   if(kpi&&filters?.platform?.length){
    //     // fetchReportTableData();
    //   }
    // }, [kpi,filters]);

    useEffect(() => {
      if (reportTableData.length) {
          const data = Object.keys(reportTableData[0]);
          setFirstRow(reportTableData[0]);            
          setFilterable(data);
          setTableHeader(data);
      }
    }, [reportTableData]);


    useEffect(() => {
        const updatedFilters = filterable.reduce((acc, column) => {
            acc[column] = tableFilters[column] || [];  // Keep existing filters for unchanged columns
            return acc;
        }, {});
        setTableFilters(updatedFilters);
    }, [filterable]);

    const handleColumnClick = (column) => {
        if (column) {
            setPopupInfo({ isOpen: true, column });
        }
    };
    const closePopup = () => {
        setPopupInfo({ isOpen: false, column: null });
    };
    const handleFilterChange = (key, value) => {
        setLoading(true);
        setTableFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (newFilters[key].includes(value)) {
                newFilters[key] = newFilters[key].filter(v => v !== value);
            } else {
                newFilters[key].push(value);
            }
            return newFilters;
        });
        setTimeout(() => setLoading(false), 500);
    };
    const applyFilterValues = (column, values) => {
        setLoading(true);
        setTableFilters(prevFilters => ({
            ...prevFilters,
            [column]: values,
        }));
        setTimeout(() => setLoading(false), 500);
    };
    const filteredTableData = useMemo(() => {
        const result = reportTableData.filter(item => {
            return Object.keys(tableFilters).every(key => {
                if (tableFilters[key]?.length === 0) return true; 
                return tableFilters[key]?.includes(item[key]?.toString());
            });
        });
        return result;
    }, [reportTableData, tableFilters]);

    useEffect(() => {
        setLoading(false);  
    }, [filteredTableData]);

    const uniqueValues = (key) => [...new Set(filteredTableData.map(item => item[`${key}`]?.toString()))];
    const uniqueValuesAll = (key) => [...new Set(reportTableData.map(item => item[`${key}`]?.toString()))];

    const getFilterUniqueCount = (column) => {
        if (column) {
            const unique = uniqueValues(column);
            return unique.length;
        } else {
            return 0;
        }
    }

    return (
        <Provider value={{
            firstRow,
            selectedTableRows,
            setSelectedTableRows,            
            loading,
            setLoading,handleColumnClick,
            popupInfo,closePopup,applyFilterValues,handleFilterChange,
            tableHeader,filterable,tableFilters,
            filteredTableData,
            uniqueValues,
            uniqueValuesAll,
            getFilterUniqueCount
        }}
      {...props}
    />
    );
};

export const useEbuxTableContext = () => {
    return useContext(EbuxTableContext);
};