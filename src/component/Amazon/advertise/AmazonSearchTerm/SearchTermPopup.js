import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdgroupListAmazon,
  getCampaignListForAddKeywordAmazon,
} from "../../../../redux/action-creator/amazon/campaignAction";
const SearchTermPopup = ({
  // selectedAdGroup,
  setSelectedAdGroup,
  setSearchTermTypeData,
  // searchTermTypeData,
  setCampaignTermTypeData,
  // campaignTermTypeData,
  editSearch,
}) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("debugerrrrr", editSearch);
  }, [editSearch[0]]);
  useEffect(() => {
    if (editSearch && editSearch?.length == 1) {
      setCampaignTermTypeData(editSearch[0]?.campaign_id);
      setSelectedAdGroup(editSearch[0]?.ad_group_id);
    }
  }, []);
  // const [showFilter, setShowFilter] = useState(false);
  const handleTypeChange = (e) => {
    setSearchTermTypeData(e);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCampaignListForAddKeywordAmazon(editSearch[0]?.profile_id));
  }, []);
  const { campaignListAmazon } = useSelector((state) => state.CampaignReducer);
  const { adGroupListAmazon } = useSelector((state) => state.CampaignReducer);
  const [campaignChanges, setCampaignChanges] = useState(false);

  const handleCampaignChange = (e) => {
    setCampaignTermTypeData(e);
    dispatch(getAdgroupListAmazon(e));
    setCampaignChanges(true);
    setSelectedAdGroup();
    // setError(false);
  };
  const handleAdgroupChange = (e) => {
    // if (e == true) {
    //   setSelectedAdGroup(val);
    // }
    setSelectedAdGroup(e);
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
            <option value="exact">EXACT</option>
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
              {editSearch?.length == 1
                ? editSearch[0]?.campaign_name
                : "select"}
            </option>
            {campaignListAmazon.length > 0 &&
              campaignListAmazon.map((item) => {
                return (
                  <>
                    <option value={item?.campaign_id}>
                      {item?.campaign_name}
                    </option>
                  </>
                );
              })}
          </select>
        </div>
        <h4>Add search term keyword to adgroup</h4>

        <div className="py-1 pb-3">
          <select
            name="adgroup"
            id="adgroup"
            className="w-full py-2 px-2 border-2 text-gray-600 outline-none rounded text-sm"
            onChange={(e) => handleAdgroupChange(e.target.value)}
            disabled={editSearch?.length > 1 && !campaignChanges}
          >
            {" "}
            <option selected disabled>
              {campaignChanges
                ? "select "
                : editSearch?.length == 1
                ? editSearch[0]?.ad_group_name
                : "select"}
            </option>
            {adGroupListAmazon.length > 0 &&
              adGroupListAmazon.map((item) => {
                return (
                  <>
                    <option value={item?.ad_group_id}>
                      {item?.ad_group_name}
                    </option>
                  </>
                );
              })}
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchTermPopup;
