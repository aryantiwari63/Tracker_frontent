import React from "react";
import "./styles.css";
import ReportList from "./ReportList";

const LeftPanel = ({
  showHeader,
  setCheckedHeader,
  setDataLIMIT,
  dataLIMIT,
  reportData,
  platform,
}) => {
  return (
    <>
      <div>
        <div className="rounded-md w-full border pt-[5px]  bg-white">
          <ReportList
            showHeader={showHeader}
            setCheckedHeader={setCheckedHeader}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            reportData={reportData}
            platform={platform}
          />
        </div>
      </div>
    </>
  );
};
export default LeftPanel;
