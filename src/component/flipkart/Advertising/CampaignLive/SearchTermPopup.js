import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdgroupList,
  getCampaignList,
} from "../../../../redux/action-creator/campaignAction";
const SearchTermPopup = ({
  selectedAdGroup,
  setSelectedAdGroup,
  setSearchTermTypeData,
  searchTermTypeData,
  setCampaignTermTypeData,
  campaignTermTypeData,
}) => {
  useEffect(() => {
    // console.log(
    //   "weferfr1234",
    //   searchTermTypeData,
    //   campaignTermTypeData,
    //   selectedAdGroup
    // );
  }, [selectedAdGroup, searchTermTypeData, campaignTermTypeData]);
  const [showFilter, setShowFilter] = useState(false);
  const handleTypeChange = (e) => {
    setSearchTermTypeData(e);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCampaignList());
  }, []);
  const { campaignList } = useSelector((state) => state.CampaignReducer);
  const { adGroupList } = useSelector((state) => state.CampaignReducer);
  const [error, setError] = useState(false);

  const handleCampaignChange = (e) => {
    setCampaignTermTypeData(e);
    dispatch(getAdgroupList(e));
    setError(false);
  };
  const handleAdgroupChange = (e, val) => {
    if (e == true) {
      setSelectedAdGroup(val);
    }
  };
  return (
    <>
      <div className="px-4">
        <h4>Keyword Match Type</h4>
        <div className="py-1 pb-3">
          <select
            name="Type"
            id="Type"
            className="w-full py-2 text-gray-600 outline-none px-2 border-2 rounded text-sm"
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option selected disabled>
              Select
            </option>
            <option  value="exact">EXACT</option>
            <option value="broad">BROAD</option>
          </select>
        </div>
        <h4>Add search term keyword to campaign</h4>
        <div className="py-1 pb-3">
          <select
            name="Campaign"
            id="Campaign"
            className="w-full py-2 px-2 border-2 text-gray-600 outline-none rounded text-sm"
            onChange={(e) => handleCampaignChange(e.target.value)}
          >
            {" "}
            <option selected disabled>
              Select
            </option>
            {campaignList.length > 0 &&
              campaignList.map((item) => {
                return (
                  <>
                    <option value={item?.campaign_id}>
                      {item?.campaign_name}
                    </option>
                  </>
                );
              })}
            <option value="campaign">Campaign</option>
          </select>
        </div>
        <h4>Add search term keyword to adgroup</h4>
        <div className="relative">
          <button
            className="w-full text-left py-2 px-2 border-2 text-gray-600 outline-none rounded text-sm"
            onClick={() => {
              if (!campaignTermTypeData) {
                setError(true);
              } else {
                setError(false);

                setShowFilter(!showFilter);
              }
            }}
          >
            Select
          </button>
          {error ? (
            <p className="errorText">Please select at least one campaign</p>
          ) : null}

          {showFilter && (
            <div className="absolute top-full bg-white w-max left-0 selectfield">
              {/* <div className=" font-thin text-sm py-4 px-2 pl-5">
                <label>
                  <input type="checkbox" />
                  Select All
                </label>
              </div> */}
              {adGroupList &&
                adGroupList?.length > 0 &&
                adGroupList?.map((item, i) => {
                  return (
                    <div key={i} className="dropdownfields">
                      <label className="cursor-pointer pl-5">
                        <input
                          type="checkbox"
                          // checked={selectedAdGroup[item.title]}
                          // onChange={() => {
                          //   // setShowFilter(!showFilter)
                          //   setSelectedAdGroup((prev) => {
                          //     return {
                          //       ...prev,
                          //       [item.title]: !selectedAdGroup[item.title],
                          //     };
                          //   });
                          // }}
                          onChange={(e) =>
                            handleAdgroupChange(
                              e.target.checked,
                              item.ad_group_id
                            )
                          }
                        />
                        {item.ad_group_name}
                      </label>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchTermPopup;
