import React, { useState } from "react";
import GraphHeader from "./GraphHeader";
import CampaignGraph from "./CampaignGraph";
import Popup from "../../common-components/Popups/Popup";
import GraphTable from "../table/GraphTable";
import campaignTableData from "../table/campaignTableData.json";

const CampaignGraphType = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const graphOption = [
    { id: 1, val: "CPC" },
    { id: 2, val: "Impressions" },
    { id: 3, val: "Clicks" },
    { id: 4, val: "Spend" },
    { id: 5, val: "Spend %" },
    { id: 6, val: "Sale %" },
    { id: 7, val: "Sales" },
    { id: 8, val: "ROAS" },
    { id: 9, val: "CPA" },
    { id: 10, val: "CTR" },
  ];

  return (
    <>
      <GraphHeader
        title="Campaign Type Perf."
        dropdownsortable
        listable
        showGraph={showGraph}
        setShowGraph={setShowGraph}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        options={graphOption?.map((item, index) => (
          <option key={index} value={item.id} className="header__graph">{item.val}</option>
        ))}
      >
        {showGraph ? (
          <CampaignGraph />
        ) : (
          <GraphTable
            header={campaignTableData.header}
            body={campaignTableData.body}
          />
        )}
        {showPopup && (
          <Popup
            title="Campaign Type Perf."
            setShowPopup={setShowPopup}
            mediumsize
            footerless
          >
            <GraphTable
              header={campaignTableData.header}
              body={campaignTableData.body}
            />
          </Popup>
        )}
      </GraphHeader>
    </>
  );
};
export default CampaignGraphType;
