import React from "react";
import CustomizeDropDown from "../flipkart/CustomizeDropDown";
import { CSVLink } from "react-csv";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";

const TableTitle = ({
  title,
  setOption,
  option,
  setShowCsvPopup,
  showCsvPopup,
  apply,
  loading,
  campaignReportData,
  setShowHeader,
  showHeader,
  applyFilter,
  cancelFilter,
  setShowFilter,
  showFilter,
}) => {
  const [error, setError] = React.useState(false);
  const handleChange = (event) => {
    setOption(event.target.value);
  };
  React.useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);
  return (
    <>
      <div className="campaignreport__heading row">
        <h2 className="campaignreport__title">{title}</h2>
        <div className="col">
          <div className=" justify-end flex ">
            <div className="col_3 relative  ">
              <CustomizeDropDown
                title="Customise Column "
                setShowHeader={setShowHeader}
                showHeader={showHeader}
                applyFilter={applyFilter}
                cancelFilter={cancelFilter}
                setShowFilter={setShowFilter}
                showFilter={showFilter}
              />
            </div>

            <div className="col_3 relative ">
              <button
                className="campaignreport__btn hover:bg-transparent hover:text-black"
                onClick={() => setShowCsvPopup(!showCsvPopup)}
              >
                <DownloadIcon />
                Export
                {/* <CSVLink data={data} headers={headers} filename={`${title}_${Date.now()}.csv`}>Export</CSVLink> */}
              </button>
              {error ? (
                <p className="errorText">No data available to export</p>
              ) : null}
              {showCsvPopup && (
                <div className="exportCSVPopUp">
                  <h6>Export CSV file only</h6>

                  <label>
                    <input
                      type="radio"
                      value="Monthly"
                      checked={option === "Monthly"}
                      onChange={handleChange}
                    />
                    Monthly
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Weekly"
                      checked={option === "Weekly"}
                      onChange={handleChange}
                    />
                    Weekly
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Daily"
                      checked={option === "Daily"}
                      onChange={handleChange}
                    />
                    Daily
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Cumulative"
                      checked={option === "Cumulative"}
                      onChange={handleChange}
                    />
                    Cumulative
                  </label>
                  <div className="exportbtncontainer ">
                    <div>
                      <button
                        className="exporttncancel"
                        onClick={() => {
                          setShowCsvPopup(false);
                          setOption(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        className="exportdownloadbt "
                        onClick={apply}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress />
                        ) : (
                          <CSVLink
                            data={campaignReportData}
                            // headers={headers}
                            filename={`${title}_${Date.now()}.csv`}
                            onClick={() => {
                              if (option == null) {
                                return false;
                              }
                              if (campaignReportData.length == 0) {
                                setError(true);
                                return false;
                              }
                              return true;
                            }}
                          >
                            Download
                          </CSVLink>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TableTitle;
