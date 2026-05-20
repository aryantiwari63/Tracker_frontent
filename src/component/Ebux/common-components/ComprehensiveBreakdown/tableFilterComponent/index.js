import React, { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import MultiSearch from './MultiSearch/MultiSearch';
import { useEbuxTableContext } from '../../../Context/EbuxTableProvider';
import { useEbuxContext } from '../../../Context/EbuxProvider';

const TableFilterComponent = ({filtersKeys=undefined,onChange}) => {
  const {
    filters:_filters,kpi }=useEbuxContext();
  const { firstRow } = useEbuxTableContext();
  const [saveSearchModal,] = useState(false);
  const myFilterData=(filtersKeys)?filtersKeys:firstRow;
  // const [saveSearchModal, setSaveSearchModal] = useState(false);
  // const [showError, setShowError] = React.useState(true);

  const [filters, setFilters] = useState({
    saved_search: [],
    custom: [],
    platform:[],
    brand:[],
    category:[],
    location:[]
  });
  const [ShowTab, setShowTab] = useState("portfolio");
  const [clearSearch, setClearSearch] = useState(false);
  const [savedSearch, setSavedSearch] = useState({
    key: "saved_search",
    label: "Saved Search",
    selectable: false,
  });
  const [customSearchFilter, setCustomSearchFilter] = useState([]);

  useEffect(() => {
    if (myFilterData && typeof myFilterData === "object") {
      const data = Object.keys(myFilterData);
      if (Array.isArray(data) && data.length) {

        let searchFilter = data.map((header) => {
          let obj = {
            key: `custom-${header}`,
            label: `${header}`,
            data: `${header} - `
          }
          if (isNaN(parseFloat(myFilterData[header]))) {
            obj.mapKey = `${header}`;
          }
          return obj;
        });
        setCustomSearchFilter(searchFilter);
      }
    }
  }, [myFilterData]);

  function applySearchFilter(sFilters, current) {
    onChange(sFilters, current);
    // eslint-disable-next-line no-console
    console.log("current:::::::::::>>>>>>>>>>>>>>", current);

    // eslint-disable-next-line no-console
    console.log("sFilters:::::::::::>>>>>>>>>>>>>>", sFilters);
    
    if (saveSearchModal) {
      setSavedSearch({ ...savedSearch });
      setFilters({ ...filters });
      setShowTab({ ...ShowTab });
    }

  }
  return (
    <>
      {customSearchFilter.length > 0 &&
        <div className='searchLeft'>
          <div
            className="campaign__search outline-none "
            style={{ display: "flex" }}
          >
            <MultiSearch
            kpi={kpi}
            filters={_filters}
              customSearchFilter={customSearchFilter}
              saveSearch={savedSearch}
              applySearchFilter={applySearchFilter}
              clearSearch={clearSearch}
              setClearSearch={() => {
                setClearSearch(false);
              }}
              name={ShowTab}
              className="flex-1"
            />
            {/* <button
                  type="submit"
                  onClick={() => {
                    if (!hasFilter(filters)) {
                      setShowError(true);
                    } else {
                      setShowError(false);
                      setSaveSearchModal(true);
                    }
                  }}
                  className="px-4 rounded-md  py-2 border bg-white campiagnbtn--ams"
                  style={{
                    marginLeft: "10px",
                    cursor: showError ? "not-allowed" : "pointer",
                  }}
                  disabled={showError}
                >
                  <img src="assets/images/save-icon.svg" alt="" /> Save
                </button>
                */}
            <button
              type="submit"
              className="campiagnbtn--ams rounded-md py-2 border justify-center bg-white"
              onClick={() => {
                setClearSearch(true);
              }}
            >
              <img src="../../assets/images/clear-icon.svg" width={14} height={15} alt="" />
              <span>Clear</span>
            </button>
            
          </div>
        </div>

      }
    </>);
};

export default TableFilterComponent;