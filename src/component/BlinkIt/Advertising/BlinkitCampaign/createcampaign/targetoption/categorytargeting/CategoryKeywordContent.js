import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitCategoryList } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";

const CategoryKeywordContent = ({
  setCampaignData,
  campaignData,
  inputError,
  setInputError,
}) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      getBlinkitCategoryList({
        productids: campaignData?.products?.map((data) => data.id),
      })
    );
  }, []);
  const { categoryList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );
  const [selectedCheckBox, setSelectedCheckBox] = React.useState([]);
  // const [inputError, setInputError] = React.useState([]);
  const handleCheckBox = (check, data) => {
    let updatedIds;
    if (check) {
      updatedIds = [...selectedCheckBox, data];
      if (campaignData?.categoryData && campaignData?.categoryData?.length) {
        let campaignIds = new Set(
          campaignData?.categoryData?.map((obj) => obj.id)
        );
        let newAddedKeyword = updatedIds.filter(
          (obj) => !campaignIds.has(obj.id)
        );

        setSelectedCheckBox([...campaignData.categoryData, ...newAddedKeyword]);
      } else {
        setSelectedCheckBox(updatedIds);
      }
    } else {
      updatedIds = campaignData?.categoryData.filter(
        (item) => item.id !== data.id
      );
      setSelectedCheckBox(updatedIds);
    }
  };

  const handleCPM = (data, id, min, max) => {
    if (
      (Number(data) < Number(min) || Number(data) > Number(max)) &&
      min &&
      max
    ) {
      setInputError([...inputError, id]);
    } else {
      let updatedIds = inputError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputError(updatedIds);
    }
    let tempData = campaignData?.categoryData;
    let result = tempData?.map(function (item) {
      var o = Object.assign({}, item);
      if (item.id == id) {
        o.cpm = data;
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      categoryData: result,
    });
  };
  React.useEffect(() => {
    // console.log("campaignData check", selectedCheckBox);
    // eslint-disable-next-line no-console
    // console.log("campaignData selectedCheckBox", selectedCheckBox);
    setCampaignData({
      ...campaignData,
      categoryData: selectedCheckBox,
    });
  }, [selectedCheckBox]);
  const [initialSet, setInitialSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.categoryData &&
      campaignData?.categoryData?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setSelectedCheckBox(campaignData?.categoryData);
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
            <th>Category</th>
            <th>Number of category visits</th>
            <th>CPM Bid</th>
            <th>Suggested top bid range</th>
          </tr>
        </thead>
        <tbody className="targetKeyword__table ">
          {categoryList && categoryList.length
            ? categoryList.map((data) => {
                return (
                  <>
                    <tr className="text-center border-b h-[75px]">
                      <td className="w-5">
                        <input
                          type="checkbox"
                          checked={selectedCheckBox
                            .map((id) => id.id)
                            .includes(data.id)}
                          onChange={(e) =>
                            handleCheckBox(e.target.checked, data)
                          }
                          className="accent-green-600"
                        />
                      </td>
                      <td className="w-[24%] font-semibold">{data.keyword}</td>
                      <td className="w-[24%]">{data.no_of_page_visit}</td>

                      <td className="w-[24%] ">
                        <div className="relative w-[90%]">
                          <span className="absolute left-2 top-1">₹</span>
                          <input
                            type="number"
                            placeholder="Enter CPM Bid Value"
                            className="text-[10px] pl-6 pr-2 rounded py-2 outline-none border w-full"
                            min={Number(data?.min_bid)}
                            max={Number(data?.max_bid)}
                            value={
                              campaignData?.categoryData?.filter(
                                (items) => items.id == data?.id
                              )[0]?.cpm
                                ? campaignData?.categoryData?.filter(
                                    (items) => items.id == data?.id
                                  )[0]?.cpm
                                : ""
                            }
                            disabled={
                              !selectedCheckBox
                                .map((id) => id.id)
                                .includes(data.id)
                            }
                            onChange={(e) =>
                              handleCPM(
                                e.target.value,
                                data?.id,
                                data?.min_bid,
                                data?.max_bid
                              )
                            }
                          />
                        </div>
                        {inputError.includes(data?.id) && (
                          <p className="errorText text-xs text-left mt-1">{` please enter value between ${data?.min_bid} and ${data?.max_bid}`}</p>
                        )}
                      </td>
                      <td className="w-[24%] ">
                        <div className="bg-[#DBE8FF] rounded-md text-[#1974F1] font-semibold py-1">
                          ₹{data.min_suggested_bid} - ₹{data.max_suggested_bid}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            : null}
        </tbody>
      </table>
    </>
  );
};
export default CategoryKeywordContent;
