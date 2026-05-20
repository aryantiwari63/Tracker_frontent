import React from "react";
import moment from "moment";

const CampaignDuration = ({ setCampaignData, campaignData, handleChange }) => {
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     no_end_date: "1",
  //   });
  // }, []);
  const noEndDateFunc = (check) => {
    if (check) {
      setCampaignData({
        ...campaignData,
        no_end_date: "1",
        have_end_date: "0",
        end_duration: "",
      });
    } else {
      setCampaignData({
        ...campaignData,
        no_end_date: "0",
        have_end_date: "1",
      });
    }
  };
  const haveEndDateFunc = (check) => {
    if (check) {
      setCampaignData({
        ...campaignData,
        have_end_date: "1",
        no_end_date: "0",
        end_duration: moment().add(30, "days").format("YYYY-MM-DD"),
      });
    } else {
      setCampaignData({
        ...campaignData,
        no_end_date: "1",
        have_end_date: "0",
        end_duration: "",
      });
    }
  };
  return (
    <>
      <div className="row  py-4 ">
        <div className="w-full py-2 border-t  text-xs font-semibold">
          Select Campaign Duration
        </div>
      </div>
      <div className="row">
        <div className="col_2 text-xs">Start Date</div>
        <div className="col_2">
          <input
            type="date"
            className="border px-0.5"
            id="start_duration"
            name="start_duration"
            onChange={handleChange}
            value={
              campaignData.start_duration
                ? campaignData.start_duration
                : new Date().toISOString().slice(0, -14)
            }
            disabled
          />
        </div>
      </div>
      <div className="row py-4">
        <div className="col_2 text-xs">End Date</div>
        <div className="col_2">
          <input
            // type="radio"
            placeholder="No End Date"
            className=""
            type="checkbox"
            id="no_end_date"
            name="no_end_date"
            // disabled={!disableinput}
            checked={campaignData.no_end_date == "1"}
            value={campaignData.no_end_date}
            onChange={(e) => {
              noEndDateFunc(e.target.checked);
            }}
          />
          <label className="pl-2 text-xs">No End Time</label>
        </div>
      </div>
      <div className="row ">
        <div className="col_2 "></div>
        <div className="col_2">
          <input
            // type="radio"
            placeholder="Have End Date"
            className="pr-3"
            type="checkbox"
            id="have_end_date"
            name="have_end_date"
            // disabled={!disableinput}
            checked={campaignData.have_end_date == "1"}
            value={campaignData.have_end_date}
            onChange={(e) => {
              haveEndDateFunc(e.target.checked);
            }}
          />
          <input
            type="date"
            className="border px-0.5 text-xs "
            id="end_duration"
            name="end_duration"
            disabled={campaignData.have_end_date != "1"}
            onChange={handleChange}
            value={campaignData.end_duration}
            min={
              campaignData.start_duration
                ? campaignData.start_duration
                : new Date().toISOString().slice(0, -14)
            }
          />
          {campaignData?.end_duration == "onwards" ? "onwards" : null}
        </div>
      </div>
    </>
  );
};

export default CampaignDuration;
