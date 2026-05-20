import React from "react";
// import moment from "moment";

const CampaignDuration = ({
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const noEndDateFunc = (check) => {
    if (check) {
      setCampaignData({
        ...campaignData,
        no_end_date: "1",
        end_duration: "",
      });
    } else {
      setCampaignData({
        ...campaignData,
        no_end_date: "0",
        end_duration: "",
      });
    }
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      end_duration: "",
    });
  }, [campaignData?.start_duration]);

  return (
    <>
      <div className="text-md font-bold leading-6">
        {" "}
        Select campaign duration
      </div>
      <div className="text-xs mt-1">
        {" "}
        Select the schedule that best suits your audience
      </div>
      <div className="row mt-6">
        <div className="col_2 text-xs">Start Date</div>
        <div className="col_2">
          <input
            type="date"
            className="border px-0.5 blinkitRing rounded-sm"
            id="start_duration"
            name="start_duration"
            onChange={handleChange}
            value={
              campaignData.start_duration
                ? campaignData.start_duration
                : new Date().toISOString().slice(0, -14)
            }
            min={new Date().toISOString().slice(0, -14)}
          />
        </div>
      </div>
      <div className="row py-4 ">
        <div className="col_2 text-xs">End Date</div>
        <div className="col_2 flex items-center">
          <input
            // type="radio"
            placeholder="No End Date"
            className="accent-green-600"
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
          <label htmlFor="no_end_date" className="pl-2 text-xs">
            No End Date
          </label>
        </div>
      </div>
      {campaignData.no_end_date != "1" ? (
        <div className="row ">
          <div className="col_2 "></div>
          <div className="col_2">
            <input
              type="date"
              className="border px-0.5 blinkitRing rounded-sm"
              id="end_duration"
              name="end_duration"
              min={
                campaignData.start_duration
                  ? campaignData.start_duration
                  : new Date().toISOString().slice(0, -14)
              }
              onChange={handleChange}
              value={campaignData.end_duration}
            />
          </div>
        </div>
      ) : null}

      <div className="row mt-2">
        <div className="col_2 "></div>
        <div className="col_2">
          {error.end_duration && (
            <p className="errorText">{error.end_duration}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignDuration;
