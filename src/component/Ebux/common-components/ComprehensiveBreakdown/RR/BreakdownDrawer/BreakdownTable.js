import { useMemo, useState } from "react";
import Loader from "../../../Loader";
import SortingButton from "../../DynamicSortButton";
import Excel from "exceljs";
import { useEbuxContext } from "../../../../Context/EbuxProvider";
const BreakDownTable = ({ drawerInfo,reportTableData }) => {
  const {
    filters,kpiMap
  } = useEbuxContext();

  
    // const pfkey = ["avg", "Amazon"];
    let pf=[];
    if(filters?.platform?.length){      
      filters?.platform?.forEach((i) => {
        if(i?.value&&(kpiMap?.["RR"]?.["platformActive"]?.indexOf(i?.value??0)>-1)){
          pf.push(i?.label ?? "");
        }
      })        
    }  
    const pfkey = ["avg", ...[...new Set(pf?? [])]];
  const headerkey = { "rating_value": "Average Rating", "review_count": "Total Number of Review" };
  
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      return [...reportTableData].sort((a, b) => {
        const _sortkey = sortConfig?.key.split(".");
        a = sortConfig.key == 'date' ? (a?.[sortConfig.key]) : (a?.[_sortkey[0]]?.[_sortkey[1]]);
        b = sortConfig.key == 'date' ? (b?.[sortConfig.key]) : (b?.[_sortkey[0]]?.[_sortkey[1]]);

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
  const requestSort = key => {
    setLoading(true);
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DSC';
    }
    setSortConfig({ key, direction });
    setTimeout(() => setLoading(false), 500);
  };
  const handleDownload = () => {
    const headers = [
      { header: 'Date', key: 'date', width: 25, style: { numFmt: 'mm/dd/yyyy' } }
    ];    
    pfkey.map((pf) => (
      Object.keys(headerkey).map((hk) => (
        headers.push({ header: `${pf == "avg" ? "" : pf} ${headerkey[hk]}`, key: `${pf}_${headerkey[hk]}`, width: 25 })
      ))
    ))
    
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const title = `${drawerInfo?.column?.toUpperCase()} (${drawerInfo?.lable}) Performance Report`;


    worksheet.columns = headers;
    sortedData?.forEach((data) => {
      let _data = { date: data?.date || "-" };
      pfkey.map((pf) => (
        Object.keys(headerkey).map((hk) => {

          _data[`${pf}_${headerkey[hk]}`] = data?.[pf]?.[hk] === undefined ? "-" : `${hk == "rating_value" ? (data?.[pf]?.[hk]?.toFixed(1) ?? '0') + " / 5" : Math.round(data?.[pf]?.[hk] ?? 0)}`;
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
      link.download = `${drawerInfo?.column}_performance_${Date.now()}.xlsx`;
      link.click();
    });
  };
  
  const getDataAVG = (key) => {

    const _key = key.split(".");
    let total = 0;
    const setToFixed =  2;
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
    return isNaN(result) ? '-' : `${_key[1] == "rating_value" ? result?.toFixed(setToFixed) + " / 5" : Math.round(result)}`;
  };
  const getDataSUM = (key) => {

    const _key = key.split(".");
    const setToFixed =  2;
    const data = sortedData?.map(item => {
      if (item?.[_key[0]]?.[_key[1]]) {
        return parseFloat(item?.[_key[0]]?.[_key[1]]);
      }
      return 0;
    });
    const result = data?.length ? ((data?.reduce((sum, avg) => sum + avg, 0))) : 0;
    return isNaN(result) ? '-' : `${_key[1] == "rating_value" ? result?.toFixed(setToFixed) + " / 5" : Math.round(result)}`;
  };

  const renderTableRows = () => {
    return sortedData?.map((data,_index) => (
      <tr key={data?.item?.value??data?.date??_index} >

        <td>
          <div className='flex flex-row gap-2 justify-between'>
            {data?.date || "-"}
          </div>
        </td>
        {
          pfkey.map((pf, i) => (
            Object.keys(headerkey).map((hk, index) =>
            (<td key={i + index}>
              {data?.[pf]?.[hk] === undefined ? "-" : `${hk == "rating_value" ? (data?.[pf]?.[hk]?.toFixed(1) ?? '0') + " / 5" : Math.round(data?.[pf]?.[hk] ?? 0)}`}

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
        <td>
          <div>
            Total Days
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
                <strong>{hk=="rating_value"?getDataAVG(`${pf}.${hk}`):getDataSUM(`${pf}.${hk}`)}</strong>
              </td>
            ))
          ))
        }
      </tr>
    );
  };
  const header = "Rating Review Breakdown";
  return (
    <>
      <div className="flex flex-row gap-2 justify-between items-center p-4">
        <h1 className="text-sm font-semibold">
          {header}

          {loading && <Loader show={loading} fullScreen={false} />}

        </h1>
        <button type="button" onClick={()=>handleDownload()}>
          <img
            src="/assets/images/downloadIcon.svg"
            alt="Download"
            width={18}
            height={18}
          />
        </button>
      </div>
      <div className="bg-white max-h-[260px] overflow-y-scroll">
        <table className=" text-left w-full campaignsTable campaignsTable--strips ">
          <thead>
            <tr className="bg-[#F7F7F8]">

              <th><div className="sortingCol w-full py-2" onClick={() => requestSort('date')}>Date
                <SortingButton sortType={sortConfig.key === 'date' ? sortConfig.direction : ''} />
              </div></th>
              <>{
                pfkey.map((pf, i) => (
                  Object.keys(headerkey).map((hk, index) => (
                    <th key={i + index}>
                      <div className="sortingCol w-full py-2" onClick={() => requestSort(`${pf}.${hk}`)}>{pf == "avg" ? "" : pf} {headerkey[hk]}
                        <SortingButton sortType={sortConfig.key === `${pf}.${hk}` ? sortConfig.direction : ''} />
                      </div>
                    </th>
                  ))
                ))
              }</>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(even)]:bg-grey_light [&>*:nth-child(odd)]:bg-white">
            {renderTableRows()}
          </tbody>

          <tfoot className="dataTableFoot">{renderTabletfootRows()}</tfoot>
        </table>
      </div>
    </>
  );
};
export default BreakDownTable;
