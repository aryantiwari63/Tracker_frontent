import React, { useRef, useEffect } from "react";
import CustomizeDropDown from "../flipkart/CustomizeDropDown";
import DownloadIcon from "@mui/icons-material/Download";
import { Headerbtn } from "../../common-components/headerButton/headerButton";

const TableTitle = ({
  title,
  setOption,
  option,
  setShowCsvPopup,
  showCsvPopup,
  loading,
  setShowHeader,
  showHeader,
  applyFilter,
  cancelFilter,
  setShowFilter,
  showFilter,
  downloadHeader,
  downloadApi
}) => {
  // const headersData = [
  //   { label: "First Name", key: "firstname" },
  //   { label: "Last Name", key: "lastname" },
  //   { label: "Email", key: "email" },
  // ];

  // const data = [
  //   { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  //   { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  //   { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
  // ];

  const [error, setError] = React.useState(false);
  const handleChange = (event) => {
    setOption(event.target.value);
  };
  React.useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);
  // const csvHeader=(headers)=>{
  //   let headersKey=[];
  //   headers.map((row)=>{
  //     headersKey.push({label:row.title,key:row.value});
  //   });
  //   console.log(headersKey);
  //   return headersKey;
  // }

  // console.log("campaignReportDatacampaignReportData", campaignReportData);
  // eslint-disable-next-line no-unused-vars
  const [csvHeaders, setCsvHeaders] = React.useState([
    { label: "Date", key: "created_on" },
  ]);

  React.useEffect(() => {
    downloadHeader.map((row) => {
      if (row.checked == true && csvHeaders.length <= downloadHeader.length) {
        csvHeaders.push({
          label: row.title,
          key: row.value,
        });
      }
    });
  }, []);
  React.useEffect(() => {
    downloadHeader.map((row) => {
      if (row.checked == true && csvHeaders.length <= downloadHeader.length) {
        csvHeaders.push({
          label: row.title,
          key: row.value,
        });
      }
    });
  }, [downloadHeader, showCsvPopup]);

  const dropDownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      // showCsvPopup &&
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target)
    ) {
      setShowCsvPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="campaignreport__heading row">
        <h2 className="campaignreport__title">{title}</h2>
        <div className="col leading-none">
          <div className=" justify-end row ">
            <div className="relative">
              <CustomizeDropDown
                title="Customise Column "
                setShowHeader={setShowHeader}
                showHeader={showHeader}
                applyFilter={applyFilter}
                cancelFilter={cancelFilter}
                setShowFilter={setShowFilter}
                showFilter={showFilter}
                platform={"ams"}
              />
            </div>

            <div className="pl-2 relative " ref={dropDownRef}>
              <button
                className="border text-sm bg-whitetext-black py-1 px-1 rounded "
                onClick={() => {
                  setShowCsvPopup(!showCsvPopup);
                }}
              // disabled={true}
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
                  <h6 className="text-base font-semibold py-2 ">
                    Export CSV file only
                  </h6>

                  <label className="text-sm pb-2">
                    <input
                      type="radio"
                      value="Monthly"
                      checked={option === "Monthly"}
                      onChange={handleChange}
                      className=""
                    />
                    Monthly
                  </label>
                  <label className="text-sm pb-2">
                    <input
                      type="radio"
                      value="Weekly"
                      checked={option === "Weekly"}
                      onChange={handleChange}
                    />
                    Weekly
                  </label>
                  <label className="text-sm pb-2">
                    <input
                      type="radio"
                      value="Daily"
                      checked={option === "Daily"}
                      onChange={handleChange}
                    />
                    Daily
                  </label>
                  <label className="text-sm pb-2">
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
                        className="exporttncancel rounded"
                        onClick={() => {
                          setShowCsvPopup(false);
                          setOption(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                    <Headerbtn
                          imgsrc="/assets/images/hard-disk.png"
                          hoverImgSrc="/assets/images/hard-disk-white.svg"
                          title={loading ? "Downloading..." : "Export"}
                          btnStyle={{margin: 0}}
                          disabled={loading}
                          style={{ width: "14px", padding: 0, margin: 0 }}
                          onClick={() => {
                            if(loading) 
                           { return true}
                           else {
                            downloadApi() }
                          }} />
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
