import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitAssetList } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";
import LoaderSpinnerBlinkit from "../../../../../../common-components/loader-spinner-blinkit";

const CategoryKeywordContentRecommendation = ({
  setCampaignData,
  campaignData,
  inputError,
  setInputError,
}) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      getBlinkitAssetList({
        productids: campaignData?.products?.map((data) => Number(data.id)),
        cityids: campaignData?.cities?.map((data) => data.value),
      })
    );
  }, []);
  const { assetList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  // const [inputError, setInputError] = React.useState([]);
  const handleCheckBox = (check, data) => {
    let updatedIds;
    if (check) {
      updatedIds = [...selectedCheckBox, data];
      if (campaignData?.assetData && campaignData?.assetData?.length) {
        let campaignIds = new Set(
          campaignData?.assetData?.map((obj) => obj.asset)
        );
        let newAddedKeyword = updatedIds.filter(
          (obj) => !campaignIds.has(obj.asset)
        );

        setSelectedCheckBox([...campaignData.assetData, ...newAddedKeyword]);
      } else {
        setSelectedCheckBox(updatedIds);
      }
    } else {
      updatedIds = campaignData?.assetData.filter(
        (item) => item.asset !== data.asset
      );
      setSelectedCheckBox(updatedIds);
    }
  };
  const handleCPM = (data, asset, min, max) => {
    if (
      (Number(data) < Number(min) || Number(data) > Number(max)) &&
      min &&
      max
    ) {
      setInputError([...inputError, asset]);
    } else {
      let updatedIds = inputError.filter((item) => item !== asset);

      setInputError(updatedIds);
    }
    let tempData = campaignData?.assetData;
    let result = tempData?.map(function (item) {
      var o = Object.assign({}, item);
      if (item.asset == asset) {
        o.cpm = data;
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      assetData: result,
    });
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      assetData: selectedCheckBox,
    });
  }, [selectedCheckBox]);
  const [initialSet, setInitialSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.assetData &&
      campaignData?.assetData?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setSelectedCheckBox(campaignData?.assetData);
      }, [1000]);
      setInitialSet(false);
    }
  }, [campaignData]);

  return (
    <>
      <table className="w-full">
        <thead className="h-[40px] bg-gray-200 text-center text-gray-500 pl-4">
          <tr className="">
            <th> </th>
            <th>Asset</th>
            <th>CPM Bid</th>
            <th>Number of asset impressions</th>
          </tr>
        </thead>
        <tbody className="targetKeyword__table ">
          {assetList && assetList.length ? (
            assetList.map((data) => {
              return (
                <>
                  <tr className="text-center border-b h-[90px]">
                    <td className="w-5">
                      <input
                        className="accent-green-600"
                        type="checkbox"
                        checked={selectedCheckBox
                          .map((id) => id.asset)
                          .includes(data.asset)}
                        onChange={(e) => handleCheckBox(e.target.checked, data)}
                      />
                    </td>
                    <td className="w-[33%] font-semibold">{data.asset}</td>

                    <td className="w-[33%]">
                      <input
                        type="number"
                        placeholder="Enter CPM Bid Value"
                        className="text-[10px] px-2 rounded py-2 outline-none border w-[33%]"
                        min={Number(data?.min_bid)}
                        max={Number(data?.max_bid)}
                        value={
                          campaignData?.assetData?.filter(
                            (items) => items.asset == data?.asset
                          )[0]?.cpm
                            ? campaignData?.assetData?.filter(
                                (items) => items.asset == data?.asset
                              )[0]?.cpm
                            : ""
                        }
                        disabled={
                          !selectedCheckBox
                            .map((id) => id.asset)
                            .includes(data.asset)
                        }
                        onChange={(e) =>
                          handleCPM(
                            e.target.value,
                            data?.asset,
                            data?.min_bid,
                            data?.max_bid
                          )
                        }
                      />
                      {data.suggested_min_bid ? (
                        <div className="w-fit text-xs px-2 my-1 mb-2 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                          Suggested top bid range{" "}
                          {`${data.suggested_min_bid}-${data.suggested_max_bid}`}
                        </div>
                      ) : null}

                      {inputError.includes(data?.asset) && (
                        <p className="errorText text-xs">{` please enter value between ${data?.min_bid} and ${data?.max_bid}`}</p>
                      )}
                    </td>
                    {/* <td className="w-[24%] ">
                        <div className="bg-[#DBE8FF] rounded-md text-[#1974F1] font-semibold py-1">
                          ₹{data.min_suggested_bid} - ₹{data.max_suggested_bid}
                        </div>
                      </td> */}
                    <td className="w-[33%]">
                      {data.Number_of_asset_impressions}
                    </td>
                  </tr>
                </>
              );
            })
          ) : (
            <tr className="text-center border-b h-[65px]">
              <LoaderSpinnerBlinkit />
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
export default CategoryKeywordContentRecommendation;
